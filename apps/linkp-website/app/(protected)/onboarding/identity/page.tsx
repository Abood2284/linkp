"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useForm } from "../form-providers";
import { USER_TYPES } from "../constants";
import { UserType } from "@repo/db/schema";

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
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function IdentityPage() {
  const router = useRouter();
  const { data, updateData } = useForm();

  const handleSelect = (userType: UserType) => {
    updateData("userType", userType);
    const userTypeConfig = USER_TYPES.find((type) => type.id === userType);
    router.push(userTypeConfig?.nextStep || "/onboarding/niche");
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-2xl font-bold text-coffee-800">
          What best describes you?
        </h1>
        <p className="mt-2 text-coffee-600">
          This helps us personalize your experience
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {USER_TYPES.map((type) => (
          <motion.button
            key={type.id}
            variants={item}
            onClick={() => handleSelect(type.id)}
            className={`group relative overflow-hidden rounded-xl border bg-white p-6 text-left shadow-sm transition-all hover:shadow-md ${
              data.userType === type.id
                ? "border-coffee-500 ring-2 ring-coffee-500 ring-offset-2"
                : "border-coffee-100 hover:border-coffee-200"
            }`}
          >
            <motion.div
              initial={false}
              animate={{ opacity: data.userType === type.id ? 1 : 0 }}
              className="absolute inset-0 bg-coffee-50"
            />
            <div className="relative space-y-4">
              <div className="inline-flex rounded-lg bg-coffee-100 p-3">
                <div className="h-6 w-6 text-coffee-600">
                  <type.icon />
                </div>
              </div>
              <div>
                <h3 className="font-medium text-coffee-800">{type.title}</h3>
                <p className="mt-1 text-sm text-coffee-600">
                  {type.description}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
