import { useStore } from './store';
import type { WorkspaceItem } from './store';

export const evaluateHebrewCode = (code: string) => {
  const lines = code.split('\n');
  const newItems: WorkspaceItem[] = [];

  lines.forEach((line, index) => {
    line = line.trim();
    if (!line) return;

    // Variable assignment: [משתנה] שווה ל [ביטוי] or [משתנה] = [ביטוי]
    const assignmentMatch = line.match(/(.+?)\s*(?:=|שווה ל-?|שווה ל)\s*(.+)/);
    
    if (assignmentMatch) {
      const varName = assignmentMatch[1].trim();
      const expression = assignmentMatch[2].trim();

      // Parsing 'סרוק("תמונה")' or 'סרוק(קישור)'
      const scanMatch = expression.match(/סרוק\s*(?:\(\s*)?["']?([^"'\)]+)["']?(?:\s*\))?/);
      if (scanMatch) {
        const urlOrType = scanMatch[1];
        
        // Infer Type
        let type: WorkspaceItem['type'] = 'url';
        if (urlOrType.match(/\.(gltf|glb|obj)$/i) || urlOrType === 'מודל') {
          type = 'model3d';
        } else if (urlOrType.match(/\.(jpeg|jpg|gif|png)$/i) || urlOrType.includes('תמונה')) {
          type = 'image';
        } else if (urlOrType.includes('ברקוד')) {
          type = 'barcode';
        }

        newItems.push({
          id: `var_${index}_${varName}`,
          name: varName,
          type,
          value: urlOrType, // Store URL
          position: [0, 0, 0], // default 3D pos
          isCut: false,
        });
      }
    }
    
    // Commands applying to variables: חתוך(מודל) or חתוך מודל
    const cutMatch = line.match(/חתוך\s*(?:\(\s*)?(.+?)(?:\s*\))?$/);
    if (cutMatch) {
      const targetVar = cutMatch[1].trim();
      const targetItem = newItems.find(item => item.name === targetVar);
      if (targetItem) {
        targetItem.isCut = true;
      }
    }
  });

  // Re-sync all state cleanly corresponding to the text code declarations
  // Delay slightly outside React render cycle if called during render
  setTimeout(() => {
    useStore.setState({ items: newItems });
  }, 0);
};
