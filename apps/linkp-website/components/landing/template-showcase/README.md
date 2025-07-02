# Template Showcase Section

This is a self-contained section for the landing page that handles the interactive template showcase with 3D iPhone display using the View system for optimal performance.

## Structure

```
template-showcase/
├── index.ts                           # Clean exports
├── template-showcase-section.tsx      # Main section component with GSAP animations
├── template-showcase.tsx              # 3D iPhone showcase component with View system
├── template-showcase-scene.tsx        # 3D scene for iPhone display with ref management
├── template-info-display.tsx          # Template information panel
└── README.md                          # This documentation
```

## Components

### TemplateShowcaseSection

- Main section component that orchestrates the entire template showcase
- Handles GSAP scroll animations
- Manages template state and router navigation
- Uses proper CSS classes for background transitions

### TemplateShowcase

- Interactive 3D iPhone display component using **View system** (not Canvas)
- Navigation controls (prev/next buttons) with **scene ready state management**
- Template indicator dots with hover tooltips
- Implements **isReady pattern** like landing-layout.tsx for reliable ref access
- Exposes refs for GSAP animations via forwardRef

### TemplateShowcaseScene

- Optimized 3D scene for template display using **View component**
- Uses **callback system** to notify parent when iPhone ref becomes available
- Professional lighting setup for iPhone showcase
- **Manual floating animation** using useFrame (replaces Float component to avoid conflicts)
- Studio environment for high-quality rendering

### TemplateInfoDisplay

- Clean template information display with character-by-character animations
- Category badges with icons and dynamic colors
- Action buttons (Preview/Use Template)
- Professional status indicators

## Key Implementation Details

### 🎯 **Scene Ready State Management**

The component implements a robust **isReady pattern** borrowed from `landing-layout.tsx`:

```tsx
// TemplateShowcase.tsx
const [isSceneReady, setIsSceneReady] = useState(false);

const markSceneReady = () => {
  if (sceneRef.current?.iphoneRef) {
    setIsSceneReady(true);
  }
};

// Only animate when scene is confirmed ready
if (!isSceneReady || !sceneRef.current?.iphoneRef) {
  setTimeout(() => changeTemplate(direction), 100);
  return;
}
```

### 🔄 **Callback System for Ref Management**

```tsx
// TemplateShowcaseScene.tsx - Notifies parent when iPhone ref becomes available
useEffect(() => {
  const checkRef = () => {
    if (iphoneRef.current) {
      onIphoneReady?.(); // Notify parent
      return true;
    }
    return false;
  };

  if (checkRef()) return;

  const interval = setInterval(() => {
    if (checkRef()) clearInterval(interval);
  }, 100);

  return () => clearInterval(interval);
}, [templateId, onIphoneReady]);

// TemplateShowcase.tsx - Receives callback
<TemplateShowcaseScene onIphoneReady={markSceneReady} />;
```

### 🚀 **Performance Optimization**

- **Uses View system instead of multiple Canvas elements** to avoid performance issues
- **Single global Canvas** via ViewCanvas component handles all 3D rendering
- **Manual floating animation** using useFrame instead of Float component
- **Proper cleanup** of GSAP animations and intervals

### 🎮 **Animation System**

```tsx
// iPhone rotation animation with proper guards
const changeTemplate = (direction: "next" | "prev") => {
  if (!isSceneReady || !sceneRef.current?.iphoneRef) {
    setTimeout(() => changeTemplate(direction), 100);
    return;
  }

  const iphoneObject = sceneRef.current.iphoneRef;

  gsap.to(iphoneObject.rotation, {
    y: isNext ? `-=${Math.PI * 2 * 4}` : `+=${Math.PI * 2 * 4}`,
    duration: 1.2,
    ease: "power2.inOut",
  });
};
```

## Architecture Decisions

### ✅ **What Works**

1. **View System**: Uses `@react-three/drei` View component connected to global Canvas
2. **Scene Ready Pattern**: Ensures iPhone ref is available before animations
3. **Callback Communication**: Parent-child communication via onIphoneReady callback
4. **Manual Floating**: Custom useFrame animation instead of Float component
5. **Proper Cleanup**: GSAP timeline cleanup and interval management

### ❌ **What Was Problematic**

1. **Multiple Canvas**: Created performance issues and was abandoned
2. **Float Component**: Interfered with GSAP animations on the iPhone
3. **Direct Ref Access**: Refs weren't ready immediately, needed timing management
4. **No Ready State**: Animations failed when iPhone ref was null

## Debugging Approach

### 🔍 **Console Logging Strategy**

```tsx
// Comprehensive logging for debugging
console.log("🎬 TemplateShowcaseScene rendering");
console.log("✅ iPhone ref is now available:", iphoneRef.current);
console.log("🔄 changeTemplate called with direction:", direction);
console.log("🔄 isSceneReady:", isSceneReady);
```

### 🧪 **Testing Checklist**

- [ ] iPhone model loads and renders
- [ ] Navigation buttons respond to clicks
- [ ] iPhone rotates smoothly during template changes
- [ ] Template information updates correctly
- [ ] Keyboard controls work (Arrow keys, Space)
- [ ] Floating animation continues during interactions
- [ ] No console errors about null refs

## Usage

```tsx
import { TemplateShowcaseSection } from "@/components/landing/template-showcase";

// Use in landing page
<TemplateShowcaseSection />;
```

## Key Features

- ✅ **Performance Optimized**: Single Canvas architecture via View system
- ✅ **Reliable Animations**: Scene ready state management prevents null ref errors
- ✅ **Smooth Interactions**: GSAP-powered iPhone rotation and template switching
- ✅ **Responsive Design**: Mobile-optimized controls and responsive layout
- ✅ **Accessibility**: ARIA labels, keyboard navigation, focus management
- ✅ **Type Safety**: Full TypeScript support with proper interfaces
- ✅ **Debug Ready**: Comprehensive logging for troubleshooting

## Technical Notes

### 🎯 **View vs Canvas Decision**

```tsx
// ❌ Don't do this - causes performance issues
<Canvas>
  <TemplateShowcaseScene />
</Canvas>

// ✅ Do this - uses global Canvas efficiently
<View id="template-showcase">
  <TemplateShowcaseScene />
</View>
```

### 🔄 **Ref Management Best Practice**

```tsx
// ✅ Always check scene ready state before animations
if (!isSceneReady || !sceneRef.current?.iphoneRef) {
  // Retry logic instead of failing
  setTimeout(() => changeTemplate(direction), 100);
  return;
}
```

### 🎨 **Animation Conflict Resolution**

```tsx
// ❌ Float component conflicts with GSAP
<Float>
  <Iphone16 ref={iphoneRef} />
</Float>;

// ✅ Manual floating animation with useFrame
useFrame((state) => {
  if (iphoneRef.current) {
    iphoneRef.current.position.y =
      -0.69 + Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
  }
});
```

## Troubleshooting

### Common Issues

1. **"iPhone ref is null"**: Ensure scene ready state is implemented
2. **"Animation doesn't work"**: Check if isSceneReady is true before animating
3. **"Performance issues"**: Make sure you're using View, not Canvas
4. **"Float conflicts"**: Remove Float component, use manual useFrame animation

### Debug Commands

```tsx
// Check scene state
console.log("Scene ready:", isSceneReady);
console.log("iPhone ref:", sceneRef.current?.iphoneRef);

// Test animation manually
changeTemplate("next");
```

This implementation provides a robust, performant, and maintainable template showcase system that integrates seamlessly with the existing 3D architecture.
