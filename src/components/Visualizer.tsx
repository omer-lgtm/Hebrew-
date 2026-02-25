import React, { Suspense } from 'react';
import { useStore } from '../store';
import type { WorkspaceItem } from '../store';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Image as DreiImage, Text } from '@react-three/drei';
import { Model } from './Model';

const RenderItem = ({ item }: { item: WorkspaceItem }) => {
  if (item.type === 'model3d') {
    return <Model item={item} />;
  }
  if (item.type === 'image') {
    return (
      <DreiImage url={item.value} transparent>
        <planeGeometry args={[2, 2]} />
      </DreiImage>
    );
  }
  if (item.type === 'url') {
    return (
       <Text color="white" fontSize={0.5} textAlign="center">
          URL Loaded:&#10;{item.value}
       </Text>
    );
  }
  return null;
};

export const Visualizer: React.FC = () => {
  const items = useStore((state) => state.items);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10, color: '#e6edf3', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3 style={{ margin: 0 }}>מרחב תצוגה</h3>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#7d8590' }}>
          מזהים פעילים: {items.map(i => i.name).join(', ') || 'אין'}
        </p>
      </div>

      <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <Environment preset="city" />
        <OrbitControls makeDefault />

        <Suspense fallback={(
          <Text color="yellow" fontSize={0.5}>Loading assets...</Text>
        )}>
          {items.map((item, idx) => (
             <group key={item.id} position={[idx * 3 - (items.length * 1.5), 0, 0]}>
               <RenderItem item={item} />
             </group>
          ))}
        </Suspense>
      </Canvas>
    </div>
  );
};
