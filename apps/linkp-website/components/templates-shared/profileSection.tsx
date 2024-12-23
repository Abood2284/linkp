import { motion } from "framer-motion";
import Image from "next/image";

type ProfileSectionProps = {
  data: {
    profile: {
      name: string;
      bio: string;
      image: string;
    };
  };
  theme: {
    typography: {
      h1: {
        fontSize: string;
      };
      body: {
        fontSize: string;
      };
    };
  };
};
// Profile Section Component
const ProfileSection = ({ data, theme }: ProfileSectionProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <motion.div
      className="relative mx-auto"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <div className="w-32 h-32 md:w-40 md:h-40 relative mx-auto">
        {/* Gradient background effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 blur-md opacity-50" />

        {/* Glass container */}
        <div className="absolute inset-1 rounded-full overflow-hidden backdrop-blur-sm">
          <div className="relative w-full h-full">
            <Image
              src={data.profile.image}
              alt={data.profile.name}
              fill
              sizes="(max-width: 768px) 128px, 160px"
              className="object-cover"
              priority
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </motion.div>

    <motion.h1
      className="mt-6 font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700"
      style={{ fontSize: theme.typography.h1.fontSize }}
    >
      {data.profile.name}
    </motion.h1>
    <motion.p
      className="mt-2 text-gray-600"
      style={{ fontSize: theme.typography.body.fontSize }}
    >
      {data.profile.bio}
    </motion.p>
  </motion.div>
);

export default ProfileSection;
