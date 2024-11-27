// src/components/templates/components/profile-section.tsx

import { AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ProfileSectionProps {
  image: string;
  name: string;
  bio: string;
  imageShape?: "circle" | "square";
  imageSize?: "small" | "medium" | "large";
  bioAlignment?: "left" | "center" | "right";
  className?: string;
}

export function ProfileSection({
  image,
  name,
  bio,
  imageShape = "circle",
  imageSize = "large",
  bioAlignment = "center",
  className,
}: ProfileSectionProps) {
  const sizeClasses = {
    small: "w-16 h-16",
    medium: "w-24 h-24",
    large: "w-32 h-32",
  };

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <AvatarImage
        src={image}
        alt={name}
        className={cn(
          sizeClasses[imageSize],
          imageShape === "square" && "rounded-lg"
        )}
      />
      <div
        className={cn("text-center space-y-2", {
          "text-left": bioAlignment === "left",
          "text-right": bioAlignment === "right",
        })}
      >
        <h1 className="text-2xl font-bold">{name}</h1>
        <p className="text-gray-600">{bio}</p>
      </div>
    </div>
  );
}
