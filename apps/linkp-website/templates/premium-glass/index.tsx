"use client";

import { TrackedLink } from "@/components/shared/trackedLinks";
import { TemplateProps } from "@/lib/templates/template-types";
import { motion } from "framer-motion";
import Link from "next/link";
import { defaultTheme } from "./theme";
import ProfileSection from "@/components/templates-shared/profileSection";

export const runtime = "edge";

const Section = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className={className}
  >
    {children}
  </motion.div>
);

const PremiumGlassTemplate: React.FC<TemplateProps> = ({
  data,
  isPreview = false,
}) => {
  const theme = defaultTheme;

  return (
    <div className="min-h-screen w-full px-4 py-8 md:py-12 relative overflow-hidden bg-gradient-to-br from-white to-gray-100">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="max-w-2xl mx-auto relative">
        {/* Profile Section */}
        <ProfileSection data={data} theme={theme} />

        {/* Social Links */}
        {data.socials.length > 0 && (
          <Section className="flex justify-center gap-4 my-8">
            {data.socials
              .sort((a, b) => a.order - b.order)
              .map((social) => (
                <motion.div
                  key={social.platform}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-gray-800 hover:bg-white/20 transition-all duration-300"
                  >
                    <span className="sr-only">{social.platform}</span>
                    <i
                      className={`icon-${social.icon} text-xl`}
                      aria-hidden="true"
                    />
                  </Link>
                </motion.div>
              ))}
          </Section>
        )}

        {/* Links Section */}
        {data.links.length > 0 && (
          <Section className="space-y-4">
            {data.links
              .sort((a, b) => a.order - b.order)
              .map((link, index) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <TrackedLink
                    href={link.url}
                    linkId={link.id}
                    className="group block w-full p-4 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 transition-all duration-300 hover:bg-white/20 hover:scale-[1.02]"
                  >
                    <div className="flex items-center justify-between px-4">
                      <span
                        className="text-gray-800 font-medium group-hover:text-gray-900 transition-colors"
                        style={{ fontSize: theme.typography.body.fontSize }}
                      >
                        {link.title}
                      </span>
                      <i
                        className={`icon-${link.icon} text-xl text-gray-600 group-hover:text-gray-800 transition-colors`}
                        aria-hidden="true"
                      />
                    </div>
                  </TrackedLink>
                </motion.div>
              ))}
          </Section>
        )}
      </div>
    </div>
  );
};

export default PremiumGlassTemplate;
