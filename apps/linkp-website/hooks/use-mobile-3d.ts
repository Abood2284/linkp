"use client";

import { useState, useEffect } from "react";

interface Mobile3DConfig {
  isMobile: boolean;
  isTouch: boolean;
  devicePixelRatio: number;
  maxDPR: number;
  supportsWebGL2: boolean;
  memoryInfo?: any;
  recommendedSettings: {
    shadows: boolean;
    antialias: boolean;
    dpr: number[];
    frameloop: "always" | "demand";
    powerPreference: "default" | "high-performance" | "low-power";
  };
}

export function useMobile3D(): Mobile3DConfig {
  const [config, setConfig] = useState<Mobile3DConfig>({
    isMobile: false,
    isTouch: false,
    devicePixelRatio: 1,
    maxDPR: 2,
    supportsWebGL2: false,
    recommendedSettings: {
      shadows: true,
      antialias: true,
      dpr: [1, 2],
      frameloop: "always",
      powerPreference: "default",
    },
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Device detection
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    const devicePixelRatio = window.devicePixelRatio || 1;

    // WebGL capability detection
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    const supportsWebGL2 = !!canvas.getContext("webgl2");

    // Memory detection (if available)
    let memoryInfo;
    if (gl) {
      const ext = gl.getExtension("WEBGL_debug_renderer_info");
      if (ext) {
        const renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
        memoryInfo = { renderer };
      }
    }

    // Performance-based recommendations
    const isLowEndDevice =
      isMobile &&
      (devicePixelRatio < 2 ||
        navigator.hardwareConcurrency < 4 ||
        !supportsWebGL2);

    const isHighEndDevice =
      !isMobile ||
      (devicePixelRatio >= 2 &&
        navigator.hardwareConcurrency >= 4 &&
        supportsWebGL2);

    // 🔥 Optimized settings based on device capabilities
    const recommendedSettings = {
      // Shadows: expensive on mobile
      shadows: isHighEndDevice,

      // Antialias: good balance for most devices
      antialias: !isLowEndDevice,

      // DPR: cap based on device capabilities
      dpr: isLowEndDevice
        ? [1, 1.5]
        : isMobile
          ? [1, 2]
          : [1, Math.min(devicePixelRatio, 3)],

      // Frame loop: demand for better battery life on mobile
      frameloop: (isMobile ? "demand" : "always") as "always" | "demand",

      // Power preference: balanced for mobile, performance for desktop
      powerPreference: (isMobile ? "default" : "high-performance") as
        | "default"
        | "high-performance"
        | "low-power",
    };

    setConfig({
      isMobile,
      isTouch,
      devicePixelRatio,
      maxDPR: Math.min(devicePixelRatio, 3),
      supportsWebGL2,
      memoryInfo,
      recommendedSettings,
    });

    // Cleanup
    canvas.remove();
  }, []);

  return config;
}

// 📱 Mobile-specific touch handling utilities
export const touchHelpers = {
  // Prevent default touch behaviors during 3D interaction
  preventScroll: (e: TouchEvent) => {
    e.preventDefault();
  },

  // Smart gesture detection
  isHorizontalGesture: (
    startX: number,
    startY: number,
    currentX: number,
    currentY: number,
    threshold = 8
  ) => {
    const deltaX = Math.abs(currentX - startX);
    const deltaY = Math.abs(currentY - startY);
    return deltaX > threshold && deltaX > deltaY;
  },

  // Calculate pinch distance
  getPinchDistance: (touches: TouchList) => {
    if (touches.length < 2) return 0;
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.hypot(
      touch1.clientX - touch2.clientX,
      touch1.clientY - touch2.clientY
    );
  },
};

// 🚀 Performance monitoring for 3D scenes
export function use3DPerformanceMonitor() {
  const [fps, setFps] = useState(60);
  const [isThrottling, setIsThrottling] = useState(false);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime - lastTime >= 1000) {
        const currentFPS = Math.round(
          (frameCount * 1000) / (currentTime - lastTime)
        );
        setFps(currentFPS);

        // Detect if we should throttle for performance
        setIsThrottling(currentFPS < 30);

        frameCount = 0;
        lastTime = currentTime;
      }

      animationId = requestAnimationFrame(measureFPS);
    };

    animationId = requestAnimationFrame(measureFPS);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return { fps, isThrottling };
}
