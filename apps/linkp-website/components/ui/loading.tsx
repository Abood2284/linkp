import React from "react";

interface LoadingProps {
  // Size in pixels - if not provided, defaults to 40px
  size?: number;
  // Optional className for additional styling
  className?: string;
  // Optional text to display below the loading animation
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = 40,
  className = "",
  text,
}) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* SVG loading animation */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-spin"
      >
        <defs>
          <linearGradient
            id="linkpGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              style={{ stopColor: "#2563eb", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#7c3aed", stopOpacity: 1 }}
            />
          </linearGradient>
        </defs>

        <path
          id="linkpPath"
          fill="none"
          stroke="url(#linkpGradient)"
          strokeWidth="40"
          strokeLinecap="round"
        >
          <animate
            attributeName="d"
            dur="2.5s"
            repeatCount="indefinite"
            values="
              M 256 128 C 256 256, 256 256, 256 384;
              M 256 128 C 320 256, 256 256, 256 384;
              M 256 128 C 384 256, 256 256, 256 384;
              M 256 128 C 384 192, 384 320, 256 384;
              M 256 128 C 384 192, 384 320, 320 384;
              M 256 128 C 384 192, 384 320, 256 384;
              M 256 128 C 384 256, 256 256, 256 384;
              M 256 128 C 320 256, 256 256, 256 384;
              M 256 128 C 256 256, 256 256, 256 384"
            keyTimes="0;0.125;0.25;0.375;0.5;0.625;0.75;0.875;1"
          />
        </path>
      </svg>

      {/* Optional loading text */}
      {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
    </div>
  );
};

export default Loading;
