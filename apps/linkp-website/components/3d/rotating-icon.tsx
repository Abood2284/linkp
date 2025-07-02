import React from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface RotatingIconProps {
  position?: [number, number, number];
  color?: string;
  icon?: string;
  rotationSpeed?: number;
  floatSpeed?: number;
  scale?: number;
}

export function RotatingIcon({
  position = [0, 0, 0],
  color = 'white',
  icon = '✨',
  rotationSpeed = 0.01,
  floatSpeed = 1,
  scale = 1,
}: RotatingIconProps) {
  const ref = React.useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += rotationSpeed;
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * floatSpeed) * 0.2;
    }
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      <Text
        font="/fonts/Inter-Bold.woff"
        fontSize={0.5}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {icon}
      </Text>
    </group>
  );
}
