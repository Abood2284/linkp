"use client";

import { TemplateProps } from "@/lib/templates/template-types";
import { defaultConfig } from "./styles";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";

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
      <div className="relative z-10 min-h-screen px-4 py-8 flex flex-col items-center max-w-3xl mx-auto">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[500px] text-center mb-8"
        >
          <div className="mb-4 relative mx-auto w-24 h-24 rounded-full overflow-hidden border-2 border-white/50 shadow-lg">
            <Image
              src={
                data.profile.image ||
                "/assets/images/templates-bg/house_on_edge_LP-4k.jpg"
              }
              alt={data.profile.name}
              className="w-full h-full object-cover"
            />
          </div>

          <h1
            className="text-2xl md:text-3xl font-medium mb-2"
            style={{
              fontFamily: styles.typography.heading.fontFamily,
              color: styles.colors.heading,
            }}
          >
            {data.profile.name}
          </h1>
          {data.profile.bio && (
            <p
              className="text-sm md:text-base opacity-90"
              style={{
                fontFamily: styles.typography.body.fontFamily,
                color: styles.colors.text,
              }}
            >
              {data.profile.bio}
            </p>
          )}
        </motion.div>

        {/* Links Section */}
        <div className="w-full max-w-[500px] space-y-4">
          {data.links?.map((link, index) => (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="block w-full group"
              style={{ transition: styles.animation.transition }}
            >
              <div
                className={cn(
                  "w-full p-4 backdrop-blur-xl rounded-xl border",
                  "hover:transform hover:scale-[1.02] transition-all duration-300",
                  "bg-white/10 border-white/30"
                )}
                style={{
                  background: styles.effects.glassBackground,
                  borderColor: "rgba(255, 255, 255, 0.6)",
                  boxShadow: styles.effects.cardShadow,
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-base md:text-lg font-medium"
                    style={{
                      fontFamily: styles.typography.body.fontFamily,
                      color: styles.colors.text,
                    }}
                  >
                    {link.title}
                  </span>
                  {/* Add icon here if needed */}
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Social Links */}
        {data.socials.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 flex gap-4"
          >
            {data.socials.map((social) => (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:opacity-80 transition-opacity"
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
