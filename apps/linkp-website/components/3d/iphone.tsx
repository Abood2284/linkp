"use client";

import React from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";

useGLTF.preload("/assets/models/gold-shine-template-v2.glb");

// Define all available template textures
const templateTextures = {
  "gold-shine": "/assets/templates-screenshots/gold-shine-iphone12.png",
  minima: "/assets/templates-screenshots/minima-iphone12.png",
  "seaside-retreat": "/assets/templates-screenshots/seaside-iphone12.png",
  batcave: "/assets/templates-screenshots/batcave-iphone12.png",
};

export type IphoneProps = {
  template?: keyof typeof templateTextures;
  scale?: number;
} & React.ComponentProps<"group">;

export function Iphone({
  template = "seaside-retreat",
  scale = 1,
  ...props
}: IphoneProps) {
  const { nodes, materials } = useGLTF(
    "/assets/models/gold-shine-template-v2.glb"
  );

  // Load all template textures
  const templates = useTexture(templateTextures);

  // Fix upside down templates - similar to soda can labels
  templates["gold-shine"].flipY = false;
  templates.minima.flipY = false;
  templates["seaside-retreat"].flipY = false;
  templates.batcave.flipY = false;

  // Get the current template texture
  const currentTemplate = templates[template];

  return (
    <group
      {...props}
      dispose={null}
      scale={scale}
      rotation={[0.3, (-3 * Math.PI) / 4, 0]}
    >
      <group position={[0, 0, 0]} rotation={[-0.671, -1.002, -0.97]}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <group
            rotation={[-Math.PI, 1.222, Math.PI / 3]}
            scale={[0.815, 0.041, 0.388]}
          >
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_10 as THREE.Mesh)?.geometry}
              material={materials.flas}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_11 as THREE.Mesh)?.geometry}
              material={materials.kamera2}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_12 as THREE.Mesh)?.geometry}
              material={materials.kamera1}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_13 as THREE.Mesh)?.geometry}
              material={materials.lens}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_14 as THREE.Mesh)?.geometry}
              material={materials.glass}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_15 as THREE.Mesh)?.geometry}
              material={materials.screw}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_4 as THREE.Mesh)?.geometry}
              material={materials.ana_renk}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_5 as THREE.Mesh)?.geometry}
              material={materials.logo}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_6 as THREE.Mesh)?.geometry}
              material={materials.cam_materyal}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_7 as THREE.Mesh)?.geometry}
              material={materials.ereve}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_8 as THREE.Mesh)?.geometry}
              material={materials.kamera}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_9 as THREE.Mesh)?.geometry}
            >
              <meshStandardMaterial
                map={currentTemplate}
                roughness={0.1}
                metalness={0.0}
                transparent={false}
              />
            </mesh>
          </group>
        </group>
      </group>
      {/* <pointLight
        intensity={54351.413}
        decay={2}
        position={[4.076, 5.904, -1.005]}
        rotation={[-1.839, 0.602, 1.932]}
      />
      <PerspectiveCamera
        makeDefault={false}
        far={100}
        near={0.1}
        fov={22.895}
        position={[2.603, 5.671, -1.602]}
        rotation={[-1.849, 0.465, 2.138]}
      /> */}
    </group>
  );
}
