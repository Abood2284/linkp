"use client";

import {
  Collaboration,
  User,
  UserAchievement,
  UserCustomization,
} from "@repo/db/schema";
import { Icons } from "@/components/ui/icons";
import { Link } from "@repo/db/schema";
import { motion } from "framer-motion";
import {
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
} from "lucide-react";
import Image from "next/image";

interface UserProfileProps {
  user: User & {
    customization?: UserCustomization | null;
    achievements?: UserAchievement[];
    collaborations?: Collaboration[];
    links?: Link[];
  };
  isPreview?: boolean;
}

export function UserProfile({ user, isPreview }: UserProfileProps) {
  const socialLinks = user.customization?.socialLinks
    ? JSON.parse(user.customization.socialLinks)
    : {};

  const customSections = user.customization?.customSections
    ? JSON.parse(user.customization.customSections)
    : [];

  const theme = user.customization?.theme || "default";
  const brandColor = user.customization?.brandColor || "#000000";

  const socialPlatforms = {
    instagram: {
      name: "Instagram",
      icon: Instagram,
      placeholder: "username",
      prefix: "@",
    },
    twitter: {
      name: "Twitter",
      icon: Twitter,
      placeholder: "username",
      prefix: "@",
    },
    youtube: {
      name: "YouTube",
      icon: Youtube,
      placeholder: "channel URL",
    },
    tiktok: {
      name: "TikTok",
      icon: Youtube,
      placeholder: "username",
      prefix: "@",
    },
    facebook: {
      name: "Facebook",
      icon: Facebook,
      placeholder: "profile URL",
    },
    linkedin: {
      name: "LinkedIn",
      icon: Linkedin,
      placeholder: "profile URL",
    },
    github: {
      name: "GitHub",
      icon: Github,
      placeholder: "username",
    },
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-coffee-50 to-white"
      style={
        {
          "--brand-color": brandColor,
          backgroundColor: theme === "dark" ? "#1a1a1a" : undefined,
        } as React.CSSProperties
      }
    >
      <div className="mx-auto max-w-2xl px-4 py-8">
        {isPreview && (
          <div className="mb-4 rounded-lg bg-yellow-100 p-4 text-yellow-800">
            Preview Mode - This is how your page will look
          </div>
        )}

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {user.image && (
            <Image
              src={user.image}
              alt={user.username || "Profile"}
              className="mx-auto h-24 w-24 rounded-full object-cover"
            />
          )}
          <h1 className="mt-4 text-2xl font-bold text-coffee-800">
            {user.username}
          </h1>
          {user.bio && <p className="mt-2 text-coffee-600">{user.bio}</p>}
          {user.location && (
            <p className="mt-1 text-sm text-coffee-500">📍 {user.location}</p>
          )}
          {user.website && (
            <a
              href={user.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center text-sm text-coffee-600 hover:text-coffee-800"
            >
              <Icons.apple className="mr-1 h-4 w-4" />
              {new URL(user.website).hostname}
            </a>
          )}
        </motion.div>

        {/* Social Links */}
        {Object.keys(socialLinks).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 space-y-4"
          >
            {Object.entries(socialLinks).map(([platform, url]) => {
              const Icon =
                Icons[platform.toLowerCase() as keyof typeof Icons] ||
                Icons.logo;
              return (
                <a
                  key={platform}
                  href={url as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center rounded-lg bg-white p-4 shadow-sm transition-all hover:shadow-md"
                >
                  <Icon className="mr-2 h-5 w-5" />
                  <span className="capitalize">{platform}</span>
                </a>
              );
            })}
          </motion.div>
        )}

        {/* Custom Links */}
        {user.links && user.links.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 space-y-4"
          >
            {user.links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg bg-white p-4 text-center shadow-sm transition-all hover:shadow-md"
              >
                {link.title}{" "}
                {link.icon && <span className="ml-2">{link.icon}</span>}
              </a>
            ))}
          </motion.div>
        )}

        {/* Achievements */}
        {user.achievements && user.achievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
          >
            <h2 className="text-xl font-semibold text-coffee-800">
              Achievements
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {user.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="rounded-lg bg-white p-4 shadow-sm"
                >
                  <h3 className="font-medium text-coffee-800">
                    {achievement.title}
                  </h3>
                  <p className="mt-1 text-sm text-coffee-600">
                    {achievement.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Collaborations */}
        {user.collaborations && user.collaborations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
          >
            <h2 className="text-xl font-semibold text-coffee-800">
              Collaborations
            </h2>
            <div className="mt-4 space-y-4">
              {user.collaborations.map((collab) => (
                <div
                  key={collab.id}
                  className="rounded-lg bg-white p-4 shadow-sm"
                >
                  <h3 className="font-medium text-coffee-800">
                    {collab.brandName} - {collab.projectTitle}
                  </h3>
                  <p className="mt-1 text-sm text-coffee-600">
                    {collab.description}
                  </p>
                  {collab.testimonial && (
                    <blockquote className="mt-2 border-l-2 border-coffee-200 pl-4 text-sm italic text-coffee-600">
                      {collab.testimonial}
                    </blockquote>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Custom Sections */}
        {customSections.map((section: any) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
          >
            <h2 className="text-xl font-semibold text-coffee-800">
              {section.title}
            </h2>
            <div
              className="mt-4 prose prose-coffee"
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
