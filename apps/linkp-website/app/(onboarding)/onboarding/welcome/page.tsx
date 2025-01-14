"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HelpCircle,
  Compass,
  Trophy,
  Building2,
  TrendingUp,
  Users,
  BarChart3,
  Link as LinkIcon,
  PieChart,
  DollarSign,
  Rocket,
  Target,
} from "lucide-react";

const userTypeContent = {
  regular: {
    welcome: "Welcome explorer",
    description: "Ready to discover a new way to share your digital world?",
    icon: Compass,
    features: [
      { icon: LinkIcon, text: "Create beautiful bio links" },
      { icon: Users, text: "Share with your audience" },
      { icon: PieChart, text: "Basic analytics insights" },
    ],
    benefits: [
      "Perfect for personal use",
      "Easy to get started",
      "Upgrade anytime",
    ],
    cta: "Start Exploring",
    tooltip:
      "Perfect for those starting out. Test drive our features and upgrade anytime to unlock more possibilities.",
  },
  creator: {
    welcome: "Welcome future influencer",
    description:
      "Transform your bio link into a revenue stream. Track every click, understand your audience, and monetize your reach.",
    icon: Trophy,
    features: [
      { icon: BarChart3, text: "Advanced analytics dashboard" },
      { icon: DollarSign, text: "Monetize your link-in-bio page" },
      { icon: Target, text: "Audience insights" },
    ],
    benefits: [
      "Maximize your earning potential",
      "Connect with premium brands",
      "Data-driven growth tools",
    ],
    cta: "Start Creating",
    tooltip:
      "Ideal for content creators, influencers, and anyone building an online presence. Get advanced analytics and monetization opportunities.",
  },
  business: {
    welcome: "Welcome growth seeker",
    description:
      "Connect with influential creators and maximize your ROI through targeted partnerships.",
    icon: Building2,
    features: [
      { icon: TrendingUp, text: "ROI tracking" },
      { icon: Rocket, text: "Creator partnerships" },
      { icon: Users, text: "Audience targeting" },
    ],
    benefits: [
      "Access top-tier creators",
      "Detailed performance metrics",
      "Brand safety controls",
    ],
    cta: "Start Growing",
    tooltip:
      "Perfect for businesses looking to expand their reach through creator partnerships. Access detailed analytics and proposal management tools.",
  },
};

export default function WelcomePage() {
  const [userType, setUserType] = useState("regular");
  const [isChanging, setIsChanging] = useState(false);

  const handleUserTypeChange = (value: string) => {
    setIsChanging(true);
    setUserType(value);
    setTimeout(() => setIsChanging(false), 300);
  };

  const Icon = userTypeContent[userType as keyof typeof userTypeContent].icon;

  return (
    <div className="relative mx-auto mt-24 flex max-w-lg flex-col items-center px-3 text-center md:mt-32 md:px-8 lg:mt-40">
      <title>Welcome to Linkp - Create Your Bio Link</title>
      <meta
        name="description"
        content="Get started with Linkp - Create marketing superpowers with short links that stand out."
      />

      <div className="flex flex-col items-center gap-6 mt-4">
        <div className="flex items-center gap-3">
          <div
            className={`transition-all duration-300 transform ${isChanging ? "scale-95 opacity-0" : "scale-100 opacity-100"}`}
          >
            <Icon className="w-8 h-8 text-primary" />
          </div>
          <h4
            className={`text-2xl font-bold transition-all duration-300 ${isChanging ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}
          >
            {userTypeContent[userType as keyof typeof userTypeContent].welcome}
          </h4>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="hover:bg-accent p-1 rounded-full transition-colors">
                  <HelpCircle className="h-5 w-5 text-gray-400 cursor-help" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="w-80 p-4">
                <div className="space-y-2">
                  <p className="font-semibold">
                    {
                      userTypeContent[userType as keyof typeof userTypeContent]
                        .tooltip
                    }
                  </p>
                  <div className="pt-2">
                    <p className="font-medium mb-1">Key Benefits:</p>
                    <ul className="space-y-1">
                      {userTypeContent[
                        userType as keyof typeof userTypeContent
                      ].benefits.map((benefit, index) => (
                        <li
                          key={index}
                          className="text-sm flex items-center gap-2"
                        >
                          <div className="w-1 h-1 bg-primary rounded-full" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Select value={userType} onValueChange={handleUserTypeChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="I am a..." />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(userTypeContent).map(([type, content]) => (
              <SelectItem key={type} value={type} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <content.icon className="w-4 h-4" />
                  <span className="capitalize">{type}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <p
          className={`font-sub-heading text-gray-500 max-w-md transition-all duration-300 ${isChanging ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}
        >
          {
            userTypeContent[userType as keyof typeof userTypeContent]
              .description
          }
        </p>

        <div
          className={`grid grid-cols-1 gap-4 w-full transition-all duration-300 ${isChanging ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
        >
          {userTypeContent[
            userType as keyof typeof userTypeContent
          ].features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-accent/10 p-3 rounded-lg"
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
            >
              <feature.icon className="w-5 h-5 text-primary" />
              <span className="text-sm">{feature.text}</span>
            </div>
          ))}
        </div>

        <Link href="/onboarding/workspace" className="w-full">
          <Button
            className={`w-full text-lg font-semibold group transition-all duration-300 ${isChanging ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
          >
            <span>
              {userTypeContent[userType as keyof typeof userTypeContent].cta}
            </span>
            <svg
              className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Button>
        </Link>
      </div>
    </div>
  );
}
