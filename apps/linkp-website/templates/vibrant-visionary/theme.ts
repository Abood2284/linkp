// components/templates/vibrant-visionary/theme.ts
import { TemplateId } from "@/lib/templates/template-types";

type Theme = {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  typography: {
    h1: { fontSize: string; fontWeight: string };
    h2: { fontSize: string; fontWeight: string };
    body: { fontSize: string; fontWeight: string };
  };
  spacing: {
    sm: string;
    md: string;
    lg: string;
  };
};

export const defaultTheme: Theme = {
  colors: {
    primary: "#F038FF", // Vibrant Magenta
    secondary: "#29D9D9", // Bright Cyan
    accent: "#FFD700", // Golden Yellow
    background: "#0F0F0F", // Dark background
    text: "#FFFFFF", // White text
  },
  typography: {
    h1: { fontSize: "3rem", fontWeight: "bold" },
    h2: { fontSize: "2rem", fontWeight: "semibold" },
    body: { fontSize: "1.1rem", fontWeight: "normal" },
  },
  spacing: {
    sm: "0.5rem",
    md: "1rem",
    lg: "2rem",
  },
};
