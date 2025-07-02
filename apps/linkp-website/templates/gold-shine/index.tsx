import type { TemplateProps } from "@/lib/templates/template-types";
import { defaultConfig } from "./styles";
import {
  rebeqa,
  harmonSemiBoldCondensedFont,
  maghfirea,
  cremeEspana,
  absans,
  neueHaasDisplay,
} from "@/public/assets/fonts/fonts";
import { goldShineTemplateConfig } from "./template-config";

interface LinkItemProps {
  title: string;
  url: string;
  description?: string;
  index: number;
  textColor: string;
  backgroundColor: string;
}

// LinkItem Component - Preserved from original
const LinkItem = ({
  title,
  url,
  description,
  index,
  textColor,
  backgroundColor,
}: LinkItemProps) => {
  // Slightly darker than #F8F5F0 (backgroundColor): #e6dfd2
  const linkBg = "#e6dfd2";
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`link-frame block rounded-sm p-5 px-4 mb-4 animate-exhibit-appear transition-all duration-300 transform border ${maghfirea.variable}`}
      style={{
        animationDelay: `${0.1 * (index + 1)}s`,
        backgroundColor: linkBg,
        color: "#000",
        borderColor: defaultConfig.accentColor,
        fontFamily: "var(--maghfirea-font)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(212,175,55,0.15)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
      }}
    >
      <div className="flex flex-col">
        <h3 className="text-lg font-medium mb-1" style={{ color: "#000" }}>
          {title}
        </h3>
        {description && (
          <p className="text-sm leading-relaxed" style={{ color: "#000" }}>
            {description}
          </p>
        )}
      </div>
    </a>
  );
};

// CuratorNote Component - Preserved from original
const CuratorNote = ({ bio }: { bio: string }) => {
  return (
    <section
      className="mb-8 max-w-lg mx-auto text-center animate-fade-in"
      style={{ animationDelay: "0.2s" }}
    >
      <div
        className="text-sm uppercase tracking-widest mb-2 font-bold"
        style={{
          color: defaultConfig.secondaryTextColor,
          fontFamily: "var(--harmon-semi-bold-condensed-font), serif",
        }}
      >
        Curator's Note
      </div>
      <div
        className="leading-relaxed whitespace-normal break-words"
        style={{
          color: defaultConfig.textColor,
          fontFamily: "var(--absans-font)",
        }}
      >
        "{bio}"
      </div>
    </section>
  );
};

// Main Template Component
export function GoldShineTemplate({
  data,
  isPreview = false,
  variationId,
}: TemplateProps & { variationId?: string }) {
  if (!data?.profile) return null;

  const { profile, links = [] } = data;

  // Find the variation config or use the default (first variation)
  const variation =
    goldShineTemplateConfig.variations?.find((v) => v.id === variationId) ||
    goldShineTemplateConfig.variations?.[0];

  // Use variation styles if provided, otherwise fallback to default
  const bgColor =
    variation?.styleConfig.colorScheme === "dark"
      ? "#121212"
      : defaultConfig.backgroundColor;

  const textColor =
    variation?.styleConfig.colorScheme === "dark"
      ? "#f0f0f0"
      : defaultConfig.textColor;

  return (
    <div
      className={`min-h-screen flex flex-col items-center py-10 px-4 ${rebeqa.variable} ${harmonSemiBoldCondensedFont.variable} ${maghfirea.variable} ${cremeEspana.variable} ${absans.variable} ${neueHaasDisplay.variable}`}
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      <div className="w-full max-w-2xl mx-auto">
        {/* ProfileHeader - Preserved from original */}
        <header className="flex flex-col items-center mb-8 animate-fade-in">
          <div className="relative mb-4">
            <div
              className="absolute inset-0 -m-1 rounded-full"
              style={{ border: `1px solid ${defaultConfig.accentColor}` }}
            ></div>
            <div
              className="w-24 h-24 rounded-full overflow-hidden border-2"
              style={{ borderColor: bgColor }}
            >
              <img
                src={profile.image}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="text-center">
            <h1
              className="text-2xl md:text-3xl font-bold tracking-wide"
              style={{
                color: textColor,
                fontFamily: "var(--harmon-semi-bold-condensed-font), serif",
              }}
            >
              {profile.name}
            </h1>
            <div
              className="h-px w-12 mx-auto my-2"
              style={{ backgroundColor: defaultConfig.accentColor }}
            ></div>
          </div>
        </header>

        {/* CuratorNote Component */}
        <CuratorNote bio={profile.bio} />

        {/* LinkGallery Component */}
        <section className="max-w-md mx-auto mb-10">
          <div
            className="text-sm uppercase tracking-widest mb-4 text-center font-bold"
            style={{
              color: defaultConfig.secondaryTextColor,
              fontFamily: "var(--harmon-semi-bold-condensed-font), serif",
            }}
          >
            Exhibition
          </div>
          <div className="space-y-4">
            {links
              .sort((a, b) => a.order - b.order)
              .map((link, index) => (
                <LinkItem
                  key={link.id}
                  title={link.title}
                  url={link.url}
                  description={link.title} // Using title as description if not provided
                  index={index}
                  textColor={link.textColor}
                  backgroundColor={link.backgroundColor}
                />
              ))}
          </div>
        </section>

        {/* Footer - Preserved from original */}
        <footer
          className="text-center text-sm mt-12 mb-6 animate-fade-in"
          style={{
            animationDelay: "0.8s",
            color: defaultConfig.secondaryTextColor,
            fontFamily: "var(--harmon-semi-bold-condensed-font), serif",
          }}
        >
          <div
            className="h-px w-12 mx-auto mb-4"
            style={{ backgroundColor: defaultConfig.accentColor }}
          ></div>
          <p>© {new Date().getFullYear()} · Digital Exhibition</p>
        </footer>
      </div>
    </div>
  );
}

// Add keyframes for animations
const animationStyles = `
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes exhibit-appear {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
  opacity: 0;
}

.animate-exhibit-appear {
  animation: exhibit-appear 0.5s ease-out forwards;
  opacity: 0;
}
`;

// Add style tag to head for animations
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = animationStyles;
  document.head.appendChild(style);
}

export default GoldShineTemplate;
