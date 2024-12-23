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
    primary: "#FF9B9B", // Red/Pink (Buy Me A Coffee)
    secondary: "#9BDFFF", // Blue (Newsletter)
    accent: "#E8A1FF", // Purple (Learn Figma)
    background: "#FFE135", // Yellow background
    text: "#000000",
  },
  typography: {
    h1: { fontSize: "2.5rem", fontWeight: "bold" },
    h2: { fontSize: "2rem", fontWeight: "semibold" },
    body: { fontSize: "1rem", fontWeight: "normal" },
  },
  spacing: {
    sm: "0.5rem",
    md: "1rem",
    lg: "2rem",
  },
};
