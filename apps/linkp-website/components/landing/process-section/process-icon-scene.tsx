'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box } from '@react-three/drei';
import { Group } from 'three';

interface ProcessIconSceneProps {
  iconType: 'connect' | 'template' | 'monetize';
}

export interface ProcessIconSceneRef {
  groupRef: Group | null;
}

export const ProcessIconScene = forwardRef<ProcessIconSceneRef, ProcessIconSceneProps>(
  ({ iconType }, ref) => {
    const groupRef = useRef<Group>(null);

    useImperativeHandle(ref, () => ({
      groupRef: groupRef.current,
    }));

    useFrame((state) => {
      if (groupRef.current) {
        groupRef.current.rotation.y += 0.01;
      }
    });

    return (
      <group ref={groupRef}>
        {iconType === 'connect' && (
          <Box args={[1, 1, 1]}>
            <meshStandardMaterial color="#D5DF35" />
          </Box>
        )}
        {iconType === 'template' && (
          <Box args={[1, 1, 1]}>
            <meshStandardMaterial color="#EB5F28" />
          </Box>
        )}
        {iconType === 'monetize' && (
          <Box args={[1, 1, 1]}>
            <meshStandardMaterial color="#A77AB4" />
          </Box>
        )}
      </group>
    );
  }
);

ProcessIconScene.displayName = 'ProcessIconScene';
