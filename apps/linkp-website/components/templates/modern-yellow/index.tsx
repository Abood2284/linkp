// src/components/templates/modern-yellow/index.tsx
import { TemplateProps } from "@/lib/templates/types";
import { ProfileSection } from "../components/profile-section";
import { SocialIcons } from "../components/social-icons";
import { LinkButton } from "../components/link-button";
import styles from "./styles.module.css";

export default function ModernYellowTemplate({ data, isEditing }: TemplateProps) {
  const { config } = data;

  return (
    <div 
      className={styles.container}
      style={{ backgroundColor: config.backgroundColor }}
    >
      <div className={styles.content}>
        <ProfileSection
          image={config.profile.image}
          name={config.profile.name}
          bio={config.profile.bio}
          className="mb-8"
        />

        {config.socials.length > 0 && (
          <SocialIcons
            socials={config.socials}
            className="mb-8"
          />
        )}

        <div className="space-y-4 w-full max-w-md">
          {config.links.map((link) => (
            <LinkButton
              key={link.id}
              title={link.title}
              url={link.url}
              icon={link.icon}
              backgroundColor={link.backgroundColor}
              textColor={link.textColor}
              style="3d-shadow"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

