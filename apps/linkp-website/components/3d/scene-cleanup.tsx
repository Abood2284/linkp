"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

export default function SceneCleanup() {
  const { scene, gl } = useThree();

  useEffect(() => {
    return () => {
      console.log("🧼 Cleaning up old scene...");
      scene.clear(); // remove all children
      gl.dispose(); // free up memory
    };
  }, [scene, gl]);

  return null;
}
