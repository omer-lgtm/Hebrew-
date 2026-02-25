import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import type { WorkspaceItem } from '../store';

export const Model = ({ item }: { item: WorkspaceItem }) => {
  const gltf = useGLTF(item.value) as any;
  
  // Clone to avoid mutation of shared cache
  const scene = useMemo(() => gltf.scene.clone(), [gltf.scene]);

  // Handle 'חתוך' command for models visually
  useMemo(() => {
    scene.traverse((child: any) => {
      if (child.isMesh && item.isCut) {
        if (child.material) {
           const m = child.material.clone();
           m.wireframe = true;
           m.color.set('red');
           child.material = m;
        }
      } else if (child.isMesh && !item.isCut) {
         // Reset if uncut
         // For a full implementation we'd store original material.
      }
    });
  }, [scene, item.isCut]);

  return <primitive object={scene} />;
};
