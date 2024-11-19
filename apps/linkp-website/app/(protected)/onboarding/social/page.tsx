// app/onboarding/social/page.tsx
"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  Linkedin,
  Github,
  Globe,
  Plus,
  Trash2,
} from "lucide-react";
import { useForm } from "../form-providers";

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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
};

export default function SocialPage() {
  const router = useRouter();
  const { data, updateData } = useForm();
  const [platforms, setPlatforms] = useState<string[]>([
    "instagram",
    "twitter",
  ]);
  const [links, setLinks] = useState(data.socials || {});

  const handleAddPlatform = () => {
    const availablePlatforms = Object.keys(socialPlatforms).filter(
      (p) => !platforms.includes(p)
    );
    if (availablePlatforms.length > 0) {
      setPlatforms([...platforms, availablePlatforms[0]]);
    }
  };

  const handleRemovePlatform = (platform: string) => {
    setPlatforms(platforms.filter((p) => p !== platform));
    const newLinks = { ...links };
    delete newLinks[platform];
    setLinks(newLinks);
  };

  const handleInputChange = (platform: string, value: string) => {
    setLinks((prev) => ({ ...prev, [platform]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateData("socials", links);
    router.push("/onboarding/complete");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h1 className="text-2xl font-bold text-coffee-800">
          Add Your Social Links
        </h1>
        <p className="mt-2 text-coffee-600">
          Connect with your audience across platforms
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {platforms.map((platform) => {
            const {
              name,
              icon: Icon,
              placeholder,
            } = socialPlatforms[platform as keyof typeof socialPlatforms];

            return (
              <motion.div
                key={platform}
                variants={item}
                className="group relative rounded-lg border border-coffee-100 bg-white p-4 shadow-sm transition-all hover:border-coffee-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-coffee-50">
                    <Icon className="h-5 w-5 text-coffee-600" />
                  </div>
                  <div className="flex-grow">
                    <label
                      htmlFor={platform}
                      className="text-sm font-medium text-coffee-700"
                    >
                      {name}
                    </label>
                    <div className="mt-1 flex items-center">
                      {/* {prefix && (
                        <span className="mr-1 text-coffee-500">{prefix}</span>
                      )} */}
                      <Input
                        id={platform}
                        value={links[platform] || ""}
                        onChange={(e) =>
                          handleInputChange(platform, e.target.value)
                        }
                        placeholder={placeholder}
                        className="border-coffee-200"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => handleRemovePlatform(platform)}
                  >
                    <Trash2 className="h-4 w-4 text-coffee-500" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {platforms.length < Object.keys(socialPlatforms).length && (
          <Button
            type="button"
            variant="outline"
            className="w-full border-dashed text-coffee-600 hover:border-coffee-300 hover:bg-coffee-50"
            onClick={handleAddPlatform}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Another Platform
          </Button>
        )}

        <Button
          type="submit"
          className="w-full bg-coffee-600 text-white hover:bg-coffee-700"
        >
          Continue
        </Button>
      </form>
    </motion.div>
  );
}
