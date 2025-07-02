export const defaultConfig = {
  // Core Colors from the image
  colors: {
    primary: "#ffffff", // Pure white for contrast
    secondary: "#E9C46A", // Warm gold
    accent: "#264653", // Deep blue
    background: "rgba(40, 40, 40, 0.25)", // Darker background for better visibility
    text: "#ffffff", // White text for contrast
    heading: "#ffffff", // White heading for contrast
  },

  // Typography
  typography: {
    heading: {
      fontFamily: "var(--new-Kansas-font)",
      weight: "500",
    },
    body: {
      fontFamily: "var(--nunSans-font)",
      weight: "400",
    },
  },

  // Effects
  effects: {
    cardBlur: "16px",
    cardBorderRadius: "12px",
    cardBorder: "1px solid rgba(255, 255, 255, 0.3)",
    cardShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
    cardHoverShadow: "0 12px 40px rgba(0, 0, 0, 0.2)",
    backgroundOverlay:
      "linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.5) 100%)",
    glassBackground: "rgba(40, 40, 40, 0.25)",
    glassHoverBackground: "rgba(60, 60, 60, 0.35)",
    glassBorder: "1px solid rgba(255, 255, 255, 0.18)",
  },

  // Layout
  layout: {
    maxWidth: "600px",
    desktopMaxWidth: "350px", // Even narrower width for better desktop display
    spacing: {
      xs: "0.5rem",
      sm: "1rem",
      md: "1.5rem",
      lg: "2rem",
      xl: "3rem",
    },
  },

  // Animation
  animation: {
    transition: "all 0.3s ease-in-out",
    hover: {
      scale: "1.02",
      shadow: "0 6px 8px rgba(0, 0, 0, 0.15)",
    },
  },
};
