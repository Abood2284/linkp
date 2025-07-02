"use client";

import { Canvas, invalidate } from "@react-three/fiber";
import { Environment, View } from "@react-three/drei";
import FloatingIphone from "../3d/floating-iphone";
import dynamic from "next/dynamic";
import { Suspense, useEffect } from "react";
import SceneCleanup from "../3d/scene-cleanup";

const Loader = dynamic(
  () => import("@react-three/drei").then((mod) => mod.Loader),
  { ssr: false }
);

type Props = {};

export function ViewCanvas({}: Props) {
  return (
    <>
      <Canvas
        style={{
          position: "fixed",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          overflow: "hidden",
          zIndex: 30,
          pointerEvents: "none", // Disable pointer events on the canvas, so it doesn't interfere with the rest of the page, like buttons clicks etc.
        }}
        camera={{
          fov: 30, // Field of view, how much of the scene is visible. Its like the zoom level of the camera. the higher the fov, the more of the camera moves back, giving that 0.5x zoom effect. Just like on a phone.
        }}
        shadows // it will play nicely with shadows, if they are in the mesh
        dpr={[1, 1.5]} // Device Pixel Ratio, it will make the canvas look better on high DPI screens.
        gl={{ antialias: true }} // web-gl, antialiasing, it prevent any jagged edges.
      >
        {/* 
          The mesh is the object that is rendered on the canvas. Basically a 3D object.
          The rotation works like this: [x, y, z], where the values are math.pi/2, 0, 0. it is very complex so don't get into the details of it.
          The position works like this: [x, y, z], where the values are the position of the object. and each value will move the object in that direction. 
          */}
        {/* <mesh rotation={[0.5, 0.5, 0]} position={[1, 0, 0]}>
        <boxGeometry />
        <meshStandardMaterial color={"hotpink"} />
      </mesh> */}

        {/* 
       Leanr More about View: https://drei.docs.pmnd.rs/portals/view
       
       But basically,
       <View> lets you render multiple 3D scenes (or multiple views of the same scene) inside a single <Canvas>, using different HTML containers.
       
       Think of a Canvas as your camera control room, and each View as a different monitor showing a different angle or scene — but all controlled from the same place.
       */}
        <SceneCleanup />
        <Suspense fallback={null}>
          <View.Port />
        </Suspense>
        {/* <FloatingIphone />

<Environment files="/assets/hdr/lobby.hdr" environmentIntensity={1.2} /> */}
        {/* 
          The ambient light, lights the whole scene.
          The spot light just lights up a specific area of the scene. that specific area is defined by the position of the spot light. It gives that shadow depth to the scene, making it look more realistic.
          */}
        {/* <ambientLight intensity={2} /> */}
        {/* <spotLight position={[1, 1, 1]} intensity={3} /> */}
      </Canvas>
      <Loader />
    </>
  );
}
