// apps/linkp-website/templates/seaside-retreat/index.tsx
"use client";

import { TemplateProps } from "@/lib/templates/template-types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import { defaultConfig } from "./styles";

export default function Template({ data, isPreview }: TemplateProps) {
  const styles = defaultConfig;

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "url(/assets/images/templates-bg/house_on_edge_LP-4k.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.8,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: styles.effects.backgroundOverlay,
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen px-4 py-8 flex flex-col items-center max-w-5xl mx-auto">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[500px] text-center mb-12"
        >
          <div className="mb-6 relative mx-auto w-24 h-24 rounded-full overflow-hidden border-2 border-white/50 shadow-lg">
            <Image
              src={
                data.profile.image ||
                "/assets/images/templates-bg/house_on_edge_LP-4k.jpg"
              }
              alt={data.profile.name}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>

          <h1
            className="text-2xl md:text-3xl font-medium mb-3"
            style={{
              fontFamily: styles.typography.heading.fontFamily,
              color: styles.colors.heading,
            }}
          >
            {data.profile.name}
          </h1>

          <p
            className="text-sm md:text-base opacity-90 max-w-md mx-auto"
            style={{
              fontFamily: styles.typography.body.fontFamily,
              color: styles.colors.text,
            }}
          >
            {data.profile.bio}
          </p>
        </motion.div>

        {/* Links Section - Enhanced for desktop with narrower width */}
        <div className="w-full md:w-2/5 lg:w-1/3 mx-auto max-w-[400px] space-y-4">
          {data.links?.map((link, index) => (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              data-link-id={link.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="block w-full group"
              style={{ transition: styles.animation.transition }}
            >
              <div
                className={cn(
                  "w-full p-4 backdrop-blur-xl rounded-xl border",
                  "group-hover:transform group-hover:scale-[1.02] transition-all duration-300",
                  "border-white/30 group-hover:bg-white/25"
                )}
                style={{
                  background: "rgba(40, 40, 40, 0.25)",
                  borderColor: "rgba(255, 255, 255, 0.4)",
                  boxShadow: styles.effects.cardShadow,
                  transition: "all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)",
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-base md:text-lg font-medium truncate max-w-[85%]"
                    style={{
                      fontFamily: styles.typography.body.fontFamily,
                      color: styles.colors.text,
                    }}
                  >
                    {link.title}
                  </span>
                  <motion.span
                    className="text-white/80 text-sm group-hover:text-white transition-colors"
                    initial={{ x: 0 }}
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    →
                  </motion.span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Social Links - Enhanced for better visibility */}
        {data.socials.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 flex gap-6 justify-center"
          >
            {data.socials.map((social) => (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                data-link-id={`social-${social.platform}`}
                className="text-white hover:opacity-80 text-sm md:text-base backdrop-blur-md px-4 py-2 rounded-full bg-black/30 hover:bg-black/40 transition-all"
              >
                {/* Add social icons here */}
                {social.platform}
              </a>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
