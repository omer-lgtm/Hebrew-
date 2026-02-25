import React, { useEffect, useState } from 'react';
import { useStore } from '../store';
import { evaluateHebrewCode } from '../nlp';

let fileCount = 0;

export const Editor: React.FC = () => {
  const { code, setCode } = useStore();
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    try {
      evaluateHebrewCode(code);
    } catch (e) {
      console.warn('NLP Evaluation error:', e);
    }
  }, [code]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const objectUrl = URL.createObjectURL(file);
      fileCount++;
      
      const varName = `קובץ_${fileCount}`;
      const extension = file.name.split('.').pop() || '';
      
      // Preserve extension via hash for the NLP regex matcher
      const pseudoUrl = `${objectUrl}#.${extension}`;
      
      // Basic sentence structure based on our parser 
      const newLine = `\n${varName} = סרוק("${pseudoUrl}")\n`;
      setCode(code + newLine);
    }
  };

  return (
    <div
      style={{ width: '100%', height: '100%', position: 'relative' }}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <textarea
        className="editor-textarea"
        placeholder="התחל לכתוב קוד בעברית... (לדוגמה: 'מודל שווה ל סרוק(http://.../model.glb)')&#10;או גרור לכאן קבצים מהמחשב"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
        dir="rtl"
        style={{ opacity: isDragging ? 0.5 : 1, transition: '0.2s' }}
      />
      {isDragging && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(47, 129, 247, 0.2)',
          border: '2px dashed var(--accent)',
          borderRadius: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
          color: 'white', fontSize: '1.5rem', fontWeight: 'bold'
        }}>
          שחרר את הקובץ כאן
        </div>
      )}
    </div>
  );
};
