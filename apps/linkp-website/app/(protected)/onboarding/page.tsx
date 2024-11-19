// app/onboarding/page.tsx
"use client";

import { motion } from "framer-motion";
import { Coffee } from "lucide-react";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-[400px] flex-col items-center justify-center space-y-8 px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.2,
        }}
        className="rounded-full bg-coffee-100 p-6"
      >
        <Coffee className="h-12 w-12 text-coffee-600" strokeWidth={1.5} />
      </motion.div>

      <div className="space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold tracking-tight text-coffee-800"
        >
          Welcome to LinkBrew
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-coffee-600"
        >
          Let&apos;s create your perfect link-in-bio page together.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-sm"
      >
        <Link
          href="/onboarding/identity"
          className="group relative w-full overflow-hidden rounded-lg bg-coffee-600 px-6 py-3 text-white shadow-lg transition-all hover:bg-coffee-700"
        >
          <motion.span
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          />
          Get Started
        </Link>
      </motion.div>
    </motion.div>
  );
}
