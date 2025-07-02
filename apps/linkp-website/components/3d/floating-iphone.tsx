"use client";

import { forwardRef } from "react";
import { Iphone16, Iphone16Props } from "./iphone-16";
import { Float } from "@react-three/drei";
import { Group } from "three";
import { Iphone } from "./iphone";

//  Reason why we are using a arrow function is because we are going to accept a ref

type FloatingIphoneProps = {
  template?: Iphone16Props["template"];
  floatSpeed?: number;
  floatIntensity?: number;
  rotationIntensity?: number;
  floatRange?: [number, number];
  children?: React.ReactNode;
};

const FloatingIphone = forwardRef<Group, FloatingIphoneProps>(
  (
    {
      template = "batcave",
      floatSpeed = 1.5,
      floatIntensity = 1,
      rotationIntensity = 1,
      floatRange = [-0.1, -0.1],
      children,
      ...props
    },
    ref
  ) => {
    return (
      <group ref={ref} {...props}>
        <Float
          speed={floatSpeed} // Animation speed, defaults to 1
          rotationIntensity={rotationIntensity} // XYZ rotation intensity, defaults to 1
          floatIntensity={floatIntensity} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
          floatingRange={floatRange} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
        >
          {children}
          <Iphone16 template={template} />
        </Float>
      </group>
    );
  }
);

FloatingIphone.displayName = "FloatingIphone";

export default FloatingIphone;
