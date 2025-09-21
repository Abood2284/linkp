import React from "react";
import type { TemplateProps } from "@/lib/templates/template-types";
import { defaultConfig } from "./styles";
import {
  ArrowRight,
  Mail,
  Linkedin,
  Twitter,
  Youtube,
  Instagram,
  Briefcase,
  FolderOpen,
} from "lucide-react";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { nunSans, recursiveSans } from "@/public/assets/fonts/fonts";
import { minimaTemplateConfig } from "./template-config";

// Social icon mapping function
const getSocialIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case "email":
      return <Mail size={20} />;
    case "linkedin":
      return <Linkedin size={20} />;
    case "twitter":
    case "x":
      return <Twitter size={20} />;
    case "youtube":
      return <Youtube size={20} />;
    case "instagram":
      return <Instagram size={20} />;
    default:
      return <Mail size={20} />;
  }
};

// Special link card component
const LinkCard = ({
  title,
  icon,
}: {
  title: string;
  icon: React.ReactNode;
}) => {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm flex items-center justify-between backdrop-blur-sm">
      <div className="flex items-center">
        <div className="p-2 mr-2">{icon}</div>
        <div>
          <div className="font-medium">{title}</div>
        </div>
      </div>
      <div>
        <ArrowRight size={20} />
      </div>
    </div>
  );
};

function MinimaClassicLayout({
  profile,
  socials,
  links,
}: {
  profile: any;
  socials: any[];
  links: any[];
}) {
  const sortedLinks = [...links].sort((a, b) => a.order - b.order);
  const sortedSocials = [...socials].sort((a, b) => a.order - b.order);
  return (
    <div className="w-full max-w-md mx-auto overflow-hidden flex flex-col items-center p-6 relative z-10">
      {/* Profile Section */}
      <div className="flex flex-col items-center mb-6 z-10 relative">
        {/* Profile Avatar */}
        <div
          className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-white shadow-md z-10"
          style={{ borderRadius: defaultConfig.borderRadius.profile }}
        >
          <img
            src={profile?.image || "/placeholder.svg?height=96&width=96"}
            alt={profile?.name || "Profile"}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile Name */}
        <h1 className={`text-2xl font-bold mb-2 ${recursiveSans.className}`}>
          {profile?.name || "Your Name"}
        </h1>

        {/* Profile Bio */}
        <p className="text-center text-gray-600 mb-4">
          {profile?.bio || "Your bio goes here"}
        </p>

        {/* Social Icons */}
        <div className="flex space-x-4 mb-6">
          {sortedSocials.map((social) => (
            <a
              key={social.platform}
              href={social.url}
              data-link-id={`social-${social.platform}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-800 hover:text-gray-600 transition-all duration-200 hover:scale-125"
            >
              {getSocialIcon(social.platform)}
            </a>
          ))}
        </div>
      </div>

      {/* Link Cards Section */}
      <div className="w-full space-y-4 z-10 relative">
        {sortedLinks.map((link) => {
          // Handle special link types based on title keywords
          if (link.title.toLowerCase().includes("personal website")) {
            return (
              <a
                key={link.id}
                href={link.url}
                data-link-id={link.id}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <LinkCard
                  title="My Personal Website"
                  icon={<Briefcase size={20} />}
                />
              </a>
            );
          }

          if (link.title.toLowerCase().includes("portfolio")) {
            return (
              <a
                key={link.id}
                href={link.url}
                data-link-id={link.id}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <LinkCard
                  title="My Portfolio"
                  icon={<FolderOpen size={20} />}
                />
              </a>
            );
          }

          if (
            link.title.toLowerCase().includes("e-book") ||
            link.title.toLowerCase().includes("get them")
          ) {
            return (
              <a
                key={link.id}
                href={link.url}
                data-link-id={link.id}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="rounded-xl bg-white border border-gray-200 p-4 backdrop-blur-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold">Get Them</div>
                      <div className="text-sm text-gray-500">
                        New e-book out!
                      </div>
                    </div>
                    <button className="bg-black text-white rounded-full px-4 py-2 text-sm">
                      Buy Now
                    </button>
                  </div>
                </div>
              </a>
            );
          }

          if (
            link.title.toLowerCase().includes("newsletter") ||
            link.title.toLowerCase().includes("sign-up")
          ) {
            return (
              <a
                key={link.id}
                href={link.url}
                data-link-id={link.id}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="rounded-xl bg-white border border-gray-200 p-4 flex items-center justify-between backdrop-blur-sm">
                  <div className="font-medium">Sign-up for my newsletter</div>
                  <div>👋</div>
                </div>
              </a>
            );
          }

          if (link.title.toLowerCase().includes("support")) {
            return (
              <div key={link.id} className="text-center font-bold my-4">
                SUPPORT
              </div>
            );
          }

          if (
            link.title.toLowerCase().includes("coffee") ||
            link.title.toLowerCase().includes("buy me")
          ) {
            return (
              <a
                key={link.id}
                href={link.url}
                data-link-id={link.id}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="rounded-xl bg-black text-white p-4 text-center backdrop-blur-sm">
                  Buy me a coffee ☕
                </div>
              </a>
            );
          }

          // Default link card
          return (
            <a
              key={link.id}
              href={link.url}
              data-link-id={link.id}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div
                className="rounded-xl p-4 flex items-center justify-between"
                style={{
                  backgroundColor: link.backgroundColor || "#000000",
                  color: link.textColor || "#ffffff",
                  transition: defaultConfig.transition,
                }}
              >
                <div className="font-medium">{link.title}</div>
                <div>
                  <ArrowRight size={20} />
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-sm text-gray-500 z-10 relative">
        <p>© {new Date().getFullYear()} · Made with Linkp</p>
      </footer>
    </div>
  );
}

export function MinimaTemplate({ data, isPreview = false }: TemplateProps) {
  const { profile, socials = [], links = [] } = data;
  // Use a single background (e.g., grid-pattern)
  const Background: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => (
    <div
      className={`min-h-screen flex flex-col items-center py-8 px-4 relative ${nunSans.className}`}
      style={{ color: defaultConfig.textColor }}
    >
      <AnimatedGridPattern
        className="absolute inset-0 z-0"
        width={40}
        height={40}
        strokeDasharray={0}
        numSquares={120}
        maxOpacity={0.18}
      />
      {children}
    </div>
  );
  return (
    <Background>
      <MinimaClassicLayout profile={profile} socials={socials} links={links} />
    </Background>
  );
}

export default MinimaTemplate;
