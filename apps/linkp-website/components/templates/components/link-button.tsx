// src/components/templates/components/link-button.tsx
import { cn } from "@/lib/utils";
import { AvatarImage } from "@radix-ui/react-avatar";

interface LinkButtonProps {
  title: string;
  url: string;
  icon?: string;
  backgroundColor?: string;
  textColor?: string;
  style?: "3d-shadow" | "flat" | "gradient";
  className?: string;
}

export function LinkButton({
  title,
  url,
  icon,
  backgroundColor = "#ffffff",
  textColor = "#000000",
  style = "flat",
  className,
}: LinkButtonProps) {
  const buttonStyles = {
    "3d-shadow":
      "transform hover:-translate-y-0.5 shadow-lg active:translate-y-0",
    flat: "hover:opacity-90",
    gradient: "bg-gradient-to-r hover:opacity-90",
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "w-full px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2",
        buttonStyles[style],
        className
      )}
      style={{
        backgroundColor,
        color: textColor,
      }}
    >
      {icon && <span>{icon}</span>}
      <span className="font-medium">{title}</span>
    </a>
  );
}
