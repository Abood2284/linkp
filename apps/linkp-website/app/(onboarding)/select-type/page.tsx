"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Building2,
  Trophy,
  DollarSign,
  BarChart3,
  Users,
  Target,
  TrendingUp,
  Rocket,
  ChevronRight,
  X,
} from "lucide-react";

const userTypes = {
  creator: {
    icon: Trophy,
    title: "Creator",
    description: "Transform your influence into income",
    categories: [
      "Content Creator",
      "Influencer",
      "Artist",
      "Musician",
      "Athlete",
      "Educator",
      "Streamer",
      "Writer",
    ],
    features: [
      {
        icon: BarChart3,
        title: "Advanced Analytics",
        description: "Track engagement and audience growth",
      },
      {
        icon: DollarSign,
        title: "Monetization Tools",
        description: "Turn your bio link into a revenue stream",
      },
      {
        icon: Target,
        title: "Brand Collaborations",
        description: "Connect with relevant businesses",
      },
    ],
    forWhom:
      "Perfect for content creators, influencers, and anyone building an engaged online community. Get advanced analytics and monetization opportunities through brand partnerships.",
  },
  business: {
    icon: Building2,
    title: "Business",
    description: "Scale your reach through creator partnerships",
    categories: [
      "E-commerce",
      "SaaS",
      "Agency",
      "Fashion",
      "Beauty",
      "Tech",
      "Food & Beverage",
      "Entertainment",
    ],
    features: [
      {
        icon: TrendingUp,
        title: "ROI Tracking",
        description: "Measure campaign performance",
      },
      {
        icon: Rocket,
        title: "Creator Discovery",
        description: "Find perfect brand ambassadors",
      },
      {
        icon: Users,
        title: "Audience Insights",
        description: "Target the right demographics",
      },
    ],
    forWhom:
      "Ideal for businesses looking to expand their reach through authentic creator partnerships. Access detailed campaign analytics and our curated creator network.",
  },
};

export default function TypePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<
    "creator" | "business" | null
  >(null);
  const [selectedCreatorTags, setSelectedCreatorTags] = useState<string[]>([
    "Tech",
  ]);
  const [selectedBusinessTags, setSelectedBusinessTags] = useState<string>("");
  const [hoveredType, setHoveredType] = useState<"creator" | "business" | null>(
    null
  );

  const handleTagClick = (tag: string) => {
    if (selectedType === "creator") {
      if (selectedCreatorTags.includes(tag)) {
        setSelectedCreatorTags(selectedCreatorTags.filter((t) => t !== tag));
      } else if (selectedCreatorTags.length < 5) {
        setSelectedCreatorTags([...selectedCreatorTags, tag]);
      }
    } else {
      // For business, only allow one tag
      if (selectedBusinessTags === tag) {
        setSelectedBusinessTags("");
      } else {
        setSelectedBusinessTags(tag);
      }
    }
  };

  const handleContinue = async () => {
    setIsLoading(true);
    if (selectedType && selectedCreatorTags.length > 0) {
      if (selectedType === "creator") {
        router.push(
          `/creator/workspace?categories=${selectedCreatorTags.join(",")}`
        );
      } else {
        router.push(`/business/dashboard?industry=${selectedBusinessTags}`);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Path</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Whether you're a creator looking to monetize your influence or a
            business seeking authentic partnerships, we've tailored our platform
            to meet your specific needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {(
            Object.entries(userTypes) as [
              keyof typeof userTypes,
              (typeof userTypes)[keyof typeof userTypes],
            ][]
          ).map(([type, data]) => {
            const Icon = data.icon;
            const isSelected = selectedType === type;
            const isHovered = hoveredType === type;

            return (
              <motion.div
                key={type}
                className={`relative rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? "bg-primary/10 border-2 border-primary"
                    : "bg-card border-2 border-transparent hover:border-primary/50"
                }`}
                onClick={() => setSelectedType(type)}
                onHoverStart={() => setHoveredType(type)}
                onHoverEnd={() => setHoveredType(null)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="absolute top-4 right-4">
                  <Icon
                    className={`w-8 h-8 ${
                      isSelected ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-2">{data.title}</h2>
                  <p className="text-muted-foreground">{data.description}</p>
                </div>

                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-6"
                  >
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {data.categories.map((cat) => {
                          const isSelected =
                            selectedType === "creator"
                              ? selectedCreatorTags.includes(cat)
                              : selectedBusinessTags === cat;
                          const isDisabled =
                            !isSelected &&
                            ((selectedType === "creator" &&
                              selectedCreatorTags.length >= 5) ||
                              (selectedType === "business" &&
                                selectedBusinessTags.length >= 1));

                          return (
                            <Badge
                              key={cat}
                              variant={isSelected ? "default" : "outline"}
                              className={cn(
                                "cursor-pointer transition-all duration-200 hover:scale-105",
                                isDisabled &&
                                  "opacity-50 cursor-not-allowed hover:scale-100"
                              )}
                              onClick={() => !isDisabled && handleTagClick(cat)}
                            >
                              {cat}
                              {isSelected && (
                                <X className="ml-1 h-3 w-3 hover:text-red-500" />
                              )}
                            </Badge>
                          );
                        })}
                      </div>
                      {selectedType === "creator" && (
                        <p className="text-xs text-muted-foreground">
                          Select up to 5 categories that best describe your
                          content
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

                <div className="space-y-4">
                  {data.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${
                        isHovered || isSelected
                          ? "bg-primary/5"
                          : "bg-transparent"
                      }`}
                      initial={false}
                      animate={{
                        x: isHovered || isSelected ? 10 : 0,
                        opacity: isHovered || isSelected ? 1 : 0.7,
                      }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <feature.icon className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <h3 className="font-medium">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.p
                  className="mt-6 text-sm text-muted-foreground"
                  initial={false}
                  animate={{
                    opacity: isHovered || isSelected ? 1 : 0.7,
                  }}
                >
                  {data.forWhom}
                </motion.p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{
            opacity:
              selectedType &&
              (selectedCreatorTags.length > 0 ||
                selectedBusinessTags.length > 0)
                ? 1
                : 0,
          }}
        >
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={
              !selectedType ||
              (selectedType === "creator" &&
                selectedCreatorTags.length === 0) ||
              (selectedType === "business" && selectedBusinessTags.length === 0)
            }
            className="group"
          >
            {isLoading ? "Please wait..." : "Continue"}
            <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
