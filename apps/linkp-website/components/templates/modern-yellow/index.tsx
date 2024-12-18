// apps/linkp-website/components/templates/modern-minimal/index.tsx
import { TrackedLink } from "@/components/shared/trackedLinks";
import { TemplateProps } from "@/lib/templates/template-types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function ModernMinimalTemplate({
  data,
  config,
  isPreview = false,
}: TemplateProps) {
  const layout = config?.layout ?? {
    profileAlignment: "center",
    linksLayout: "stack",
    maxWidth: "md",
    spacing: "normal",
  };

  const styling = config?.styling ?? {
    borderRadius: "md",
    backgroundColor: "#ffffff",
    profileImageSize: "lg",
    animation: "fade",
  };

  return (
    <div
      className={cn(
        "min-h-screen w-full",
        isPreview && "max-w-2xl mx-auto my-8 rounded-lg shadow-lg"
      )}
      style={{ backgroundColor: styling.backgroundColor }}
    >
      <div
        className={cn(
          "container mx-auto px-4",
          layout.maxWidth === "sm" && "max-w-lg",
          layout.maxWidth === "md" && "max-w-2xl",
          layout.maxWidth === "lg" && "max-w-4xl"
        )}
      >
        {/* Profile Section */}
        <div
          className={cn(
            "py-8",
            layout.profileAlignment === "center" && "text-center",
            layout.profileAlignment === "left" && "text-left",
            layout.profileAlignment === "right" && "text-right"
          )}
        >
          <div
            className={cn(
              "relative mx-auto overflow-hidden rounded-full",
              styling.profileImageSize === "sm" && "w-24 h-24",
              styling.profileImageSize === "md" && "w-32 h-32",
              styling.profileImageSize === "lg" && "w-40 h-40",
              layout.profileAlignment === "left" && "ml-0",
              layout.profileAlignment === "right" && "mr-0"
            )}
          >
            <Image
              src={data.profile.image}
              alt={data.profile.name}
              className="object-cover w-full h-full"
            />
          </div>

          <h1 className="mt-4 text-2xl font-bold">{data.profile.name}</h1>

          <p className="mt-2 text-gray-600">{data.profile.bio}</p>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-4 my-6">
          {data.socials
            .sort((a, b) => a.order - b.order)
            .map((social) => (
              <Link
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <span className="sr-only">{social.platform}</span>
                <i className={`icon-${social.icon}`} aria-hidden="true" />
              </Link>
            ))}
        </div>

        {/* Links Section */}
        <div
          className={cn(
            "py-8 space-y-4",
            layout.spacing === "compact" && "space-y-2",
            layout.spacing === "relaxed" && "space-y-6",
            layout.linksLayout === "grid" && "grid grid-cols-2 gap-4 space-y-0"
          )}
        >
          {data.links
            .sort((a, b) => a.order - b.order)
            .map((link) => (
              <TrackedLink
                key={link.id}
                href={link.url}
                linkId={link.id}
                className={cn(
                  "block w-full p-4 transition-transform hover:-translate-y-1",
                  styling.borderRadius === "sm" && "rounded",
                  styling.borderRadius === "md" && "rounded-lg",
                  styling.borderRadius === "lg" && "rounded-xl"
                )}
                style={{
                  backgroundColor: link.backgroundColor,
                  color: link.textColor,
                }}
              >
                <div className="flex items-center justify-between">
                  <span>{link.title}</span>
                  <i className={`icon-${link.icon}`} aria-hidden="true" />
                </div>
              </TrackedLink>
            ))}
        </div>
      </div>
    </div>
  );
}
