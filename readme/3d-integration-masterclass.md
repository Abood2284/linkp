# 3D Integration Masterclass: React Three Fiber + Next.js

> **Hard-Won Lessons from 50+ Iterations** 🎯  
> A complete guide to avoid the pitfalls we encountered and build 3D experiences the right way.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Core Principles](#core-principles)
3. [Critical Mistakes to Avoid](#critical-mistakes-to-avoid)
4. [The Correct Architecture](#the-correct-architecture)
5. [Step-by-Step Implementation](#step-by-step-implementation)
6. [3D Model Best Practices](#3d-model-best-practices)
7. [Camera & Positioning Guide](#camera--positioning-guide)
8. [Debug Techniques](#debug-techniques)
9. [Performance Optimization](#performance-optimization)
10. [Troubleshooting Common Issues](#troubleshooting-common-issues)
11. [Advanced Cinematic Scrolling with GSAP](#advanced-cinematic-scrolling-with-gsap)

---

## Overview

This document captures the complete journey of integrating a 3D iPhone model into a Next.js landing page using React Three Fiber. After 50+ iterations, we discovered the correct patterns, common pitfalls, and optimal architecture.

### What We Built

- Full-screen 3D Canvas background
- HTML content floating above 3D scene
- Interactive 3D iPhone model with animations
- Proper layering with consistent branding
- Mobile-responsive 3D experience

---

## Core Principles

### 🎯 **The Golden Rules**

1. **Separation of Concerns**

   - 3D objects ONLY inside `<Canvas>`
   - HTML/JSX NEVER inside `<Canvas>`
   - Use proper z-index layering

2. **Canvas Positioning**

   - Always use `fixed` positioning for full-screen Canvas
   - Canvas should be a background layer, not competing with content

3. **Component Architecture**

   - Create separate Scene components for 3D elements
   - Keep model logic isolated and reusable
   - Use Suspense for loading states

4. **Performance First**
   - Preload models with `useGLTF.preload()`
   - Use appropriate `dpr` settings
   - Optimize lighting setup

---

## Critical Mistakes to Avoid

### ❌ **The Big Don'ts**

#### 1. **HTML Inside Canvas**

```jsx
// ❌ WRONG - This will cause R3F namespace errors
<Canvas>
  <div>This breaks everything</div>  {/* Never do this! */}
  <Model />
</Canvas>

// ✅ CORRECT - Separate concerns
<Canvas>
  <Model />  {/* Only 3D objects */}
</Canvas>
<div>HTML content outside</div>
```

#### 2. **Incorrect Z-Index Stack**

```jsx
// ❌ WRONG - Canvas gets blocked by backgrounds
<div style={{background: 'solid'}} className="z-10">
  <Canvas className="z-0">  {/* Canvas invisible! */}
</div>

// ✅ CORRECT - Proper layering
<div style={{background: 'solid'}} className="z-0">   {/* Base */}
  <Canvas className="z-20">                           {/* Middle */}
    <div className="z-30">HTML Content</div>          {/* Top */}
  </Canvas>
</div>
```

#### 3. **Constrained Canvas Size**

```jsx
// ❌ WRONG - Canvas gets clipped
<section className="h-screen">
  <Canvas className="absolute inset-0">  {/* Constrained by section */}
</section>

// ✅ CORRECT - Full viewport Canvas
<Canvas className="fixed inset-0" style={{width: '100vw', height: '100vh'}}>
```

#### 4. **Poor Model Positioning**

```jsx
// ❌ WRONG - Model out of view
<primitive position={[0, 50, 0]} />  {/* Way too high */}

// ✅ CORRECT - Visible positioning
<primitive position={[0, -2, 5]} />  {/* In viewport */}
```

---

## The Correct Architecture

### 🏗️ **Layer Stack (Bottom to Top)**

```
z-0:  Background color/gradient (base layer)
z-20: 3D Canvas (middle layer)
z-30: HTML content (top layer)
z-40: Debug/overlay elements (highest)
```

### 📁 **File Structure**

```
components/3d/
├── landing/
│   ├── scene.tsx          # Main 3D scene component
│   ├── iphone-model.tsx   # iPhone model component
│   └── lights.tsx         # Lighting setup
├── shared/
│   ├── camera-controls.tsx
│   └── loading-fallbacks.tsx
└── index.ts               # Exports
```

### 🎨 **Component Pattern**

```jsx
// Main page component
export default function LandingPage() {
  return (
    <div className="relative" style={{ backgroundColor: "#F4FFF8" }}>
      {/* Full-screen 3D Canvas */}
      <Canvas className="fixed inset-0 z-20">
        <Scene />
      </Canvas>

      {/* HTML Content Layer */}
      <div className="relative z-30">
        <section className="min-h-screen">
          {/* Transparent sections - Canvas shows through */}
        </section>
      </div>
    </div>
  );
}
```

---

## Step-by-Step Implementation

### 🚀 **Phase 1: Basic Setup**

1. **Install Dependencies**

```bash
npm install three @react-three/fiber @react-three/drei
npm install --save-dev @types/three
```

2. **Create Scene Component**

```jsx
// components/3d/landing/scene.tsx
function Scene() {
  return (
    <>
      <ambientLight color="white" intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
      <Suspense fallback={null}>
        <Model url="/path/to/model.glb" />
      </Suspense>
      <OrbitControls />
    </>
  );
}
```

3. **Setup Canvas**

```jsx
// Main component
<Canvas
  shadows
  dpr={[1, 2]}
  camera={{ position: [0, 0, 10], fov: 75 }}
  className="fixed inset-0 z-20"
  style={{ background: "transparent" }}
>
  <Scene />
</Canvas>
```

### 🚀 **Phase 2: Model Integration**

4. **Create Model Component**

```jsx
// components/3d/landing/iphone-model.tsx
const Model = ({ url }) => {
  const meshRef = useRef();
  const { scene } = useGLTF(url);

  useFrame((state) => {
    if (!meshRef.current) return;
    // Gentle animations
    meshRef.current.position.y =
      -2 + Math.sin(state.clock.elapsedTime * 0.8) * 0.3;
  });

  return (
    <primitive
      ref={meshRef}
      object={scene.clone ? scene.clone() : scene}
      scale={[6, 6, 6]}
      position={[0, -2, 5]}
      rotation={[0, Math.PI, 0]}
    />
  );
};

// Preload for performance
useGLTF.preload("/path/to/model.glb");
```

### 🚀 **Phase 3: Layering & Content**

5. **Implement Proper Layering**

```jsx
return (
  <div style={{ backgroundColor: "#F4FFF8" }}>
    {/* Base background - z-0 */}

    <Canvas className="fixed inset-0 z-20">{/* 3D scene - z-20 */}</Canvas>

    <div className="relative z-30">
      {/* HTML content - z-30 */}
      <section className="min-h-screen">{/* Transparent sections */}</section>
    </div>
  </div>
);
```

---

## 3D Model Best Practices

### 📱 **Model Positioning**

```jsx
// Position coordinates explanation:
position={[x, y, z]}
//        │  │  │
//        │  │  └── Depth (toward/away from camera)
//        │  └───── Height (up/down in viewport)
//        └────────── Horizontal (left/right)

// Good starting positions:
position={[0, -2, 5]}   // Center, slightly down, close to camera
position={[0, 2, 3]}    // Center, slightly up, very close
```

### 🔄 **Rotation Guide**

```jsx
// Rotation in radians:
rotation={[x, y, z]}
//        │  │  │
//        │  │  └── Roll (around z-axis)
//        │  └───── Yaw (around y-axis) - Most common
//        └────────── Pitch (around x-axis)

// Common rotations:
rotation={[0, 0, 0]}           // Default orientation
rotation={[0, Math.PI, 0]}     // 180° flip (front/back)
rotation={[0, Math.PI/2, 0]}   // 90° turn
```

### 📏 **Scale Guidelines**

```jsx
// Scale multipliers:
scale={[6, 6, 6]}     // Good for iPhone models
scale={[2, 2, 2]}     // Smaller, subtle presence
scale={[10, 10, 10]}  // Large, hero presentation

// Individual axis scaling:
scale={[8, 8, 6]}     // Slightly flattened depth
```

---

## Camera & Positioning Guide

### 📷 **Camera Setup**

```jsx
// Optimal camera settings:
camera={{
  position: [0, 0, 10],  // Distance from center
  fov: 75,               // Field of view (wider = more visible)
  near: 0.1,             // Near clipping plane
  far: 1000              // Far clipping plane
}}

// FOV Impact:
// fov: 30  → Narrow, telephoto effect
// fov: 50  → Normal, balanced view
// fov: 75  → Wide, more content visible
// fov: 100 → Very wide, fisheye effect
```

### 🎯 **Position Calculation**

```jsx
// If model appears cut off:
// 1. Move camera back: position: [0, 0, 15]
// 2. Increase FOV: fov: 85
// 3. Move model closer: position: [0, 0, 8]

// If model too small:
// 1. Move camera closer: position: [0, 0, 6]
// 2. Increase scale: scale: [8, 8, 8]
// 3. Move model toward camera: position: [0, 0, 7]
```

---

## Debug Techniques

### 🔧 **Essential Debug Tools**

1. **Visual Canvas Boundaries**

```jsx
<Canvas
  className="border-4 border-red-500"  // See Canvas edges
  style={{ background: 'rgba(255,0,0,0.1)' }}  // Tint Canvas
>
```

2. **Debug Info Overlay**

```jsx
<div className="fixed top-4 left-4 z-50 bg-black text-white p-4">
  Camera: [{camera.position.join(", ")}]<br />
  Model: [{modelPosition.join(", ")}]<br />
  Scale: [{scale.join(", ")}]
</div>
```

3. **Reference Objects**

```jsx
// Add visible reference cube at origin
<mesh position={[0, 0, 0]}>
  <boxGeometry args={[1, 1, 1]} />
  <meshStandardMaterial color="red" />
</mesh>
```

4. **Console Logging**

```jsx
// In model component:
console.log("Model loaded:", scene);
console.log("Model position:", meshRef.current?.position);
```

### 🔍 **Debug Checklist**

- [ ] Canvas has visible boundaries (red border)
- [ ] Model console logs show successful loading
- [ ] Reference cube visible at origin
- [ ] Camera position logged and reasonable
- [ ] No React/3D namespace errors in console
- [ ] Z-index layers working (HTML above Canvas)

---

## Performance Optimization

### ⚡ **Essential Optimizations**

1. **Model Preloading**

```jsx
// Preload before component mounts
useGLTF.preload("/assets/models/iphone.glb");
```

2. **Device Pixel Ratio**

```jsx
// Limit DPR for performance
<Canvas dpr={[1, 2]} /> // Max 2x pixel density
```

3. **Conditional Rendering**

```jsx
// Only render on larger screens if needed
const isMobile = useIsMobile();
if (isMobile) return <StaticImage />;

return <Canvas>...</Canvas>;
```

4. **Optimized Lighting**

```jsx
// Fewer lights = better performance
<ambientLight intensity={0.8} />           // Global illumination
<directionalLight position={[5, 5, 5]} />  // One main light
// Avoid multiple point lights
```

---

## Troubleshooting Common Issues

### 🚨 **Error Solutions**

#### "Div is not part of THREE namespace"

```jsx
// ❌ Cause: HTML inside Canvas
<Canvas>
  <div>Text</div>  {/* This breaks */}
</Canvas>

// ✅ Solution: Move HTML outside
<Canvas>
  <Model />
</Canvas>
<div>Text</div>
```

#### "Model not visible"

```jsx
// ✅ Debug steps:
// 1. Check model loading
console.log('Scene:', scene)

// 2. Add reference cube
<mesh position={[0, 0, 0]}>
  <boxGeometry args={[1, 1, 1]} />
  <meshStandardMaterial color="red" />
</mesh>

// 3. Adjust camera/model position
camera={{ position: [0, 0, 5] }}
position={[0, 0, 0]}
```

#### "Canvas too small/clipped"

```jsx
// ✅ Solution: Force full dimensions
<Canvas
  className="fixed inset-0"
  style={{
    width: "100vw",
    height: "100vh",
    position: "fixed",
  }}
/>
```

#### "Model appears and disappears"

```jsx
// ❌ Cause: Z-index conflicts
// ✅ Solution: Check layer stack
<div className="z-0">Background</div>
<Canvas className="z-20">Model</Canvas>
<div className="z-30">Content</div>
```

### 🔄 **Performance Issues**

#### "Slow rendering/lag"

- Reduce model poly count
- Lower DPR: `dpr={[1, 1]}`
- Simplify lighting setup
- Add `frameloop="demand"` for static scenes

#### "Model loads slowly"

- Preload: `useGLTF.preload(url)`
- Optimize GLB file size
- Use Suspense with fallback
- Consider progressive loading

---

## Brand Integration Guidelines

### 🎨 **Using Linkp Brand Colors**

```jsx
// Background (from branding.md)
style={{ backgroundColor: '#F4FFF8' }}  // Mint cream

// Text colors
style={{ color: '#004F2D' }}  // Cal Poly green

// Accent elements
style={{ color: '#E16036' }}  // Flame orange

// Don't use gradients on sections - keep Canvas visible
// ❌ <section className="bg-gradient-to-br">
// ✅ <section>  {/* Transparent, Canvas shows through */}
```

---

## Final Architecture Summary

### 🏆 **The Winning Pattern**

```jsx
export default function LandingPage() {
  return (
    <div style={{ backgroundColor: "#F4FFF8" }}>
      {/* Layer 1: Background Color (z-0) */}

      <Canvas
        className="fixed inset-0 z-20"
        style={{ background: "transparent" }}
        camera={{ position: [0, 0, 10], fov: 75 }}
      >
        {/* Layer 2: 3D Scene (z-20) */}
        <Scene />
      </Canvas>

      <div className="relative z-30">
        {/* Layer 3: HTML Content (z-30) */}
        <section className="min-h-screen">
          {/* Transparent sections - no background colors */}
        </section>
      </div>
    </div>
  );
}
```

### 📝 **Key Takeaways**

1. **Layer properly**: BG → Canvas → HTML
2. **Separate concerns**: 3D vs HTML components
3. **Debug visually**: Borders, colors, console logs
4. **Position carefully**: Camera, model, and scale matter
5. **Optimize early**: Preload, DPR, lighting
6. **Test thoroughly**: Multiple devices and browsers

---

## What NOT to Touch

### 🚫 **Danger Zones**

- **Z-index values** - Changing these breaks the layer stack
- **Canvas positioning** - Must stay `fixed inset-0`
- **Model preloading** - Required for performance
- **Scene component structure** - Keep 3D elements isolated
- **Brand colors** - Use exact hex values from branding.md

### ✅ **Safe to Modify**

- Model position, rotation, scale
- Animation timing and intensity
- Camera position and FOV
- Lighting intensity and colors
- HTML content and styling
- Debug information display

---

**Remember: This guide represents 50+ iterations of learning. Follow these patterns to avoid the pitfalls we encountered!** 🎯

---

_Document created: [Current Date]  
Last updated: [Current Date]  
Version: 1.0_

---

## 11. Advanced Cinematic Scrolling with GSAP

The previous sections cover static or self-contained 3D scenes. To achieve Awwwards-level cinematic experiences where the 3D scene and HTML content animate in perfect sync with user scrolling, we must adopt a more advanced architecture orchestrated by a powerful animation library like GSAP.

### 🏗️ **The Cinematic Scroll Architecture**

The core pattern involves separating the persistent 3D "stage" from the scrollable HTML content. This is the structure used by top-tier sites like the reference you provided.

- **Fixed 3D Canvas:** The `<Canvas>` is positioned `fixed` and takes up the full viewport (`w-screen h-screen`), acting as a background layer (`z-0` or `z-10`). It does **not** scroll with the page.
- **Scrollable HTML Wrapper:** The main HTML content (`<section>`, `<div>`, etc.) sits in a separate wrapper that is scrollable (e.g., `min-h-[300vh]`). This content is layered on top of the canvas using `z-index`.
- **Animator Component:** A root component wraps everything and houses the master animation logic (using GSAP and ScrollTrigger).

```jsx
// High-level structure for a page component
import { LandingAnimator } from "./landing-animator";
import { IntegratedScene } from "./integrated-scene";

export default function Page() {
  return (
    <LandingAnimator>
      <div className="min-h-[300vh] relative">
        {/* HTML Content Layer (z-20) */}
        <div className="relative z-20">
          <section id="hero-section" className="h-screen" />
          <section id="features-section" className="h-screen" />
        </div>

        {/* 3D Canvas Layer (z-10) */}
        <div className="fixed inset-0 z-10">
          <Canvas>
            <IntegratedScene />
          </Canvas>
        </div>
      </div>
    </LandingAnimator>
  );
}
```

### 🤝 **Bridging GSAP and React Three Fiber**

A common challenge is making GSAP (which lives in the DOM world) communicate with the R3F scene.

#### ❌ **The Wrong Way: Prop Drilling / Direct Manipulation**

Trying to pass down a GSAP timeline via props and manipulate children with `React.Children.map` is brittle, complex, and breaks React's declarative pattern. We encountered this issue, and it leads to unmaintainable code.

#### ✅ **The Right Way: React Context**

The clean, robust, and correct solution is to use React Context to share the master GSAP timeline.

**1. Create the Animator with Context:**

```jsx
// components/landing-animator.tsx
import { createContext, useContext, useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TimelineContext =
  (createContext < GSAPTimeline) | (undefined > undefined);
export const useTimeline = () => useContext(TimelineContext);

export function LandingAnimator({ children }) {
  const timeline = useRef(gsap.timeline({ paused: true }));

  useLayoutEffect(() => {
    // Animate HTML elements
    timeline.current.to("#hero-title", { opacity: 0, y: -50 });

    // Control the whole timeline with one ScrollTrigger
    ScrollTrigger.create({
      trigger: "#hero-section",
      start: "top top",
      end: "bottom top",
      scrub: 1,
      animation: timeline.current,
    });
  }, []);

  return (
    <TimelineContext.Provider value={timeline.current}>
      <div>{children}</div>
    </TimelineContext.Provider>
  );
}
```

**2. Consume the Context in the 3D Scene:**

```jsx
// components/3d/integrated-scene.tsx
import { useTimeline } from "../landing-animator";
import { useLayoutEffect, useRef } from "react";
import { Group } from "three";

export function IntegratedScene() {
  const sceneRef = useRef < Group > null;
  const timeline = useTimeline(); // Access the master timeline

  useLayoutEffect(() => {
    if (timeline && sceneRef.current) {
      // Add 3D animations to the SAME timeline
      timeline.to(sceneRef.current.position, { x: -1.5, y: 1.2 }, 0); // The '0' position parameter ensures it starts at the same time as the HTML animations
      timeline.to(sceneRef.current.scale, { x: 0.6, y: 0.6, z: 0.6 }, 0);
    }
  }, [timeline]);

  return <group ref={sceneRef}>{/* ...model... */}</group>;
}
```

### 🚨 **Troubleshooting: The "Namespace" Error**

This is one of the most common errors when integrating HTML with R3F, which we debugged together.

#### "Error: R3F: Stop is not part of the THREE namespace!"

This error occurs when you place a regular HTML component (like a `<div>` or `svg`) inside a `<Suspense>` fallback within the `<Canvas>`. R3F tries to render it as a 3D object and fails.

```jsx
// ❌ Cause: Placing a regular HTML component inside <Canvas>
<Canvas>
  <Suspense fallback={<MyHtmlSpinner />}>
    {" "}
    {/* MyHtmlSpinner renders a <div> */}
    <Model />
  </Suspense>
</Canvas>;

// ✅ Solution: Wrap the HTML component in <Html> from drei
import { Html } from "@react-three/drei";

<Canvas>
  <Suspense
    fallback={
      <Html center>
        <MyHtmlSpinner />
      </Html>
    }
  >
    <Model />
  </Suspense>
</Canvas>;
```

### 📌 **Attaching UI to 3D Objects**

To make UI elements like feature descriptions feel truly connected to the model, render them using the `<Html>` component from within your 3D scene. This ensures they will track the model's position, rotation, and scale automatically, creating a seamless and professional effect.

```jsx
// Inside your 3D Scene component
import { Html } from "@react-three/drei";

// ...
<group>
  <Model />

  {/* This HTML div will be "stuck" to a point in the 3D scene */}
  <Html position={[1.5, 0.5, 0]} center>
    <FeatureCallout title="Premium Templates" />
  </Html>
</group>;
```

This combination of a fixed canvas, a master GSAP timeline shared via Context, and judicious use of the `<Html>` component is the key to creating the seamless, cinematic web experiences seen on Awwwards-winning sites.

---
