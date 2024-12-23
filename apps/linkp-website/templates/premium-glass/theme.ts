import { TemplateId } from "@/lib/templates/template-types";

type Theme = {
  colors: {
    backgroundGradient: {
      from: string;
      to: string;
    };
    text: string;
    accent: string;
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
    backgroundGradient: {
      from: "#ffffff",
      to: "#f3f4f6",
    },
    text: "#1f2937",
    accent: "#4f46e5",
  },
  typography: {
    h1: { fontSize: "1.875rem", fontWeight: "700" },
    h2: { fontSize: "1.5rem", fontWeight: "600" },
    body: { fontSize: "1rem", fontWeight: "400" },
  },
  spacing: {
    sm: "0.5rem",
    md: "1rem",
    lg: "2rem",
  },
};
