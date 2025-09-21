import { TemplateProps } from "@/lib/templates/template-types";
import { defaultConfig } from "./styles";

const icons = {
  linkedin: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
      <rect width="4" height="12" x="2" y="9"></rect>
      <circle cx="4" cy="4" r="2"></circle>
    </svg>
  ),
  twitter: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
    </svg>
  ),
  instagram: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
    </svg>
  ),
  facebook: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
  ),
  github: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
      <path d="M9 18c-4.51 2-5-2-7-2"></path>
    </svg>
  ),
  mail: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
    </svg>
  ),
  arrowRight: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14"></path>
      <path d="m12 5 7 7-7 7"></path>
    </svg>
  ),
};

function getSocialIcon(platform: string) {
  switch (platform.toLowerCase()) {
    case "linkedin":
      return icons.linkedin;
    case "twitter":
      return icons.twitter;
    case "instagram":
      return icons.instagram;
    case "facebook":
      return icons.facebook;
    case "github":
      return icons.github;
    case "email":
    case "mail":
      return icons.mail;
    default:
      return icons.mail;
  }
}

export default function BatcaveTemplate({ data, isPreview }: TemplateProps) {
  if (!data) return <div className="text-red-500">No data provided.</div>;

  const { profile, socials, links } = data;

  // Extract the gradient colors from the Tailwind classes
  const fromColor =
    defaultConfig.backgroundGradient.match(/from-\[(.*?)\]/)?.[1] || "#111827";
  const toColor =
    defaultConfig.backgroundGradient.match(/to-\[(.*?)\]/)?.[1] || "#0f172a";

  return (
    <div
      className={`min-h-screen ${defaultConfig.text} relative overflow-hidden`}
      style={{
        background: `linear-gradient(to bottom right, ${fromColor}, ${toColor})`,
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* OG gradient glow effect, styled as before but with new colors */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: "500px",
          height: "500px",
          zIndex: 2,
          background: "#8B5CF6",
          opacity: 0.2,
          filter: "blur(120px)",
        }}
      ></div>
      {/* Main content */}
      <div
        className="container mx-auto px-4 py-12 max-w-3xl relative"
        style={{ zIndex: 5 }}
      >
        <div className="flex flex-col items-center justify-center">
          {/* Profile Section */}
          <div className="w-full max-w-lg mx-auto md:max-w-2xl">
            <div className="flex flex-col items-center mb-6">
              {/* Profile Image */}
              <div
                className={`w-24 h-24 rounded-full overflow-hidden bg-gray-200 mb-4 ${defaultConfig.profileRing}`}
              >
                {profile?.image ? (
                  <img
                    src={profile.image}
                    alt={profile.name || "Profile"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-700 text-gray-400">
                    ?
                  </div>
                )}
              </div>
              {/* Name and Title */}
              <h1 className="text-2xl font-bold text-white mb-1">
                {profile?.name || "Anonymous"}
              </h1>
              <p className="text-gray-400 mb-4">
                {profile?.bio || "No bio provided."}
              </p>
            </div>
            {/* Links Section */}
            <div className="space-y-3 mb-8">
              {links?.length ? (
                links
                  .sort((a, b) => a.order - b.order)
                  .map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      data-link-id={link.id}
                      className="flex items-center justify-between w-full p-4 rounded-lg transition-colors duration-200 font-medium text-white"
                      style={{
                        backgroundColor: "#24334a",
                        zIndex: 20,
                        position: "relative",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = "#324765";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "#24334a";
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="text-lg">{link.title}</span>
                      <span className="h-6 w-6 text-white">
                        {icons.arrowRight}
                      </span>
                    </a>
                  ))
              ) : (
                <div className="text-gray-500">No links available.</div>
              )}
            </div>
            {/* Social Links */}
            <div className="flex justify-center space-x-4 mt-8">
              {socials?.length
                ? socials
                    .sort((a, b) => a.order - b.order)
                    .map((social) => (
                      <a
                        key={social.platform}
                        href={social.url}
                        data-link-id={`social-${social.platform}`}
                        aria-label={social.platform}
                        className="transition-colors duration-200 p-3 rounded-full"
                        style={{
                          backgroundColor: "#24334a",
                          zIndex: 20,
                          position: "relative",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = "#324765";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = "#24334a";
                        }}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {getSocialIcon(social.platform)}
                      </a>
                    ))
                : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
