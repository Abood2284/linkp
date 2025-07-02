"use client";

import { Environment } from "@react-three/drei";
import FloatingIphone from "../floating-iphone";

type Props = {};

const Scene = (props: Props) => {
  return (
    <group>
      <FloatingIphone />

      {/* Learn more about where they come from:https://github.com/pmndrs/drei
      // 
      //  Essentially environemnt helps your ThreeJs or canvas understand the lighting of the scene.
      //  It helps the scene look more realistic.
      //  For example, i have /assets/hdr folders, i got these environment from online, it helps the scene image that the MOdel is in that environment. Lobby and the Lobby.hdr that i have is so clear high ligting image, that it makes the model look like it is in that environment.
      // 
      //  */}
      <Environment files="/assets/hdr/lobby.hdr" environmentIntensity={1.2} />
    </group>
  );
};

export default Scene;
