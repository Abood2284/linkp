// src/components/templates/components/social-icons.tsx
import { Twitter, Instagram, Youtube, Music2 } from "lucide-react";
import { SocialPlatform } from "@/lib/templates/template-types";
import { cn } from "@/lib/utils";

interface SocialIconsProps {
  socials: SocialPlatform[];
  layout?: "horizontal" | "vertical";
  iconColor?: string;
  className?: string;
}

const PLATFORM_ICONS = {
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  tiktok: Music2,
  spotify: Music2,
};

export function SocialIcons({
  socials,
  layout = "horizontal",
  iconColor = "#000000",
  className,
}: SocialIconsProps) {
  return (
    <div
      className={cn(
        "flex gap-4",
        layout === "vertical" && "flex-col",
        className
      )}
    >
      {socials.map((social) => {
        const Icon = PLATFORM_ICONS[social.platform];
        return (
          <a
            key={social.platform}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <Icon style={{ color: iconColor }} className="w-6 h-6" />
          </a>
        );
      })}
    </div>
  );
}
