import { TrackedLink } from "@/components/shared/trackedLinks";
import { TemplateProps } from "@/lib/templates/template-types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function DarkFitnessTemplate({
  data,
  config,
  isPreview = false,
}: TemplateProps) {
  const layout = config?.layout ?? {
    profileAlignment: "center",
    linksLayout: "stack",
    maxWidth: "md",
    spacing: "relaxed",
    heroImageStyle: "fullWidth",
  };

  const styling = config?.styling ?? {
    borderRadius: "lg",
    backgroundColor: "#000000",
    profileImageSize: "full",
    animation: "fade",
    typography: {
      nameSize: "3xl",
      titleSize: "lg",
    },
  };

  return (
    <div
      className={cn(
        "min-h-screen w-full bg-black text-white",
        isPreview && "max-w-2xl mx-auto my-8 rounded-lg shadow-lg"
      )}
    >
      {/* Hero Image Section */}
      <div className="relative w-full aspect-[4/3] md:aspect-[2/1]">
        <Image
          src={data.profile.image}
          alt={data.profile.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
      </div>

      <div
        className={cn(
          "container mx-auto px-4 -mt-20 relative z-10",
          layout.maxWidth === "sm" && "max-w-lg",
          layout.maxWidth === "md" && "max-w-2xl",
          layout.maxWidth === "lg" && "max-w-4xl"
        )}
      >
        {/* Profile Section */}
        <div className="text-center mb-12">
          <h1
            className={cn(
              "font-bold tracking-tight",
              styling.typography.nameSize === "3xl" && "text-4xl md:text-5xl"
            )}
          >
            {data.profile.name}
          </h1>
          <p
            className={cn(
              "mt-3 text-gray-400",
              styling.typography.titleSize === "lg" && "text-lg"
            )}
          >
            {data.profile.bio}
          </p>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-6 my-8">
          {data.socials
            .sort((a, b) => a.order - b.order)
            .map((social) => (
              <Link
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="sr-only">{social.platform}</span>
                <i
                  className={`icon-${social.icon} text-2xl`}
                  aria-hidden="true"
                />
              </Link>
            ))}
        </div>

        {/* Links Section */}
        <div className="py-8 space-y-4">
          {data.links
            .sort((a, b) => a.order - b.order)
            .map((link) => (
              <TrackedLink
                key={link.id}
                href={link.url}
                linkId={link.id}
                className={cn(
                  "block w-full p-4 transition-all duration-200",
                  "bg-[#1A1A1A] hover:bg-[#333333]",
                  "text-white text-center font-medium",
                  styling.borderRadius === "lg" && "rounded-xl"
                )}
              >
                <div className="flex items-center justify-center gap-2">
                  <i className={`icon-${link.icon}`} aria-hidden="true" />
                  <span>{link.title}</span>
                </div>
              </TrackedLink>
            ))}
        </div>
      </div>
    </div>
  );
}
