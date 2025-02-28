import { TrackedLink } from "@/components/shared/trackedLinks";
import { TemplateProps } from "@/lib/templates/template-types";
import Image from "next/image";
import Link from "next/link";
import { defaultTheme } from "./theme";
import ProfileSection from "@/components/templates-shared/profileSection";

export const runtime = "edge";

// A simple Section component for now
function Section({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

const ModernYellowTemplate: React.FC<TemplateProps> = ({
  data,
  isPreview = false,
}) => {
  const theme = defaultTheme;

  return (
    <div
      className="min-h-screen w-full px-4 py-12"
      style={{ backgroundColor: theme.colors.background }}
    >
      {/* Profile Section */}
      <ProfileSection data={data} theme={theme} />

      {/* Social Links */}
      {data.socials.length > 0 && (
        <Section className="flex justify-center gap-6 my-10">
          {data.socials
            .sort((a, b) => a.order - b.order)
            .map((social) => (
              <Link
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl"
                style={{ color: theme.colors.accent }}
              >
                <span className="sr-only">{social.platform}</span>
                <i className={`icon-${social.icon}`} aria-hidden="true" />
              </Link>
            ))}
        </Section>
      )}

      {/* Links Section */}
      {data.links.length > 0 && (
        <Section className="space-y-4">
          {data.links
            .sort((a, b) => a.order - b.order)
            .map((link) => (
              <TrackedLink
                key={link.id}
                href={link.url}
                linkId={link.id}
                className="block w-full p-12 rounded-xl shadow-md transition-transform hover:-translate-y-1"
                style={{
                  backgroundColor: link.backgroundColor || theme.colors.primary,
                  color: link.textColor || theme.colors.text,
                }}
              >
                <div className="flex items-center justify-between ">
                  <span
                    className="text-lg font-medium"
                    style={{ fontSize: theme.typography.body.fontSize }}
                  >
                    {link.title}
                  </span>
                  <i
                    className={`icon-${link.icon} text-xl`}
                    aria-hidden="true"
                  />
                </div>
              </TrackedLink>
            ))}
        </Section>
      )}
    </div>
  );
};

export default ModernYellowTemplate;
