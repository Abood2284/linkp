import type { WorkspaceData } from "@/lib/templates/template-types";

export const DEMO_DATA: WorkspaceData = {
  profile: {
    image: "/assets/images/abdul_pfp.jpg",
    name: "Abood Creator",
    bio: "Digital creator passionate about tech, design, and storytelling. Join me on this creative journey!",
  },
  socials: [
    { platform: "twitter", url: "#", order: 0, icon: "twitter" },
    { platform: "instagram", url: "#", order: 1, icon: "instagram" },
    { platform: "youtube", url: "#", order: 2, icon: "youtube" },
  ],
  links: [
    {
      id: "Linkp-link",
      title: "Visit Linkp",
      url: "https://linkp.co",
      icon: "link",
      backgroundColor: "#3B82F6",
      textColor: "#FFFFFF",
      order: 0,
    },
    {
      id: "LeanLaunchPad-link",
      title: "Visit Lean Launchpad",
      url: "https://leanlaunchpad.co",
      icon: "link",
      backgroundColor: "#3B82F6",
      textColor: "#FFFFFF",
      order: 1,
    },
  ],
};
