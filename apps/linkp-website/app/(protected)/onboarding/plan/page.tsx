"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Check, ArrowLeft, ArrowUpSquare } from "lucide-react";
import { useForm } from "../form-providers";
import { useOnboardingConfig } from "../hooks";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

const plans = [
  {
    id: "free",
    name: "Starter",
    price: "Free",
    description: "Perfect for trying out our platform",
    features: [
      "Basic link-in-bio page",
      "3 social media links",
      "Basic analytics",
      "Mobile-friendly design",
    ],
    popular: false,
  },
  {
    id: "pro",
    name: "Professional",
    price: "$8/month",
    description: "Everything you need to grow your presence",
    features: [
      "Unlimited links",
      "Custom analytics",
      "Priority support",
      "Custom domains",
      "Remove branding",
      "Advanced themes",
    ],
    popular: true,
  },
{
    id: "business",
    name: "Business",
    price: "$24/month",
    description: "For teams and businesses",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "API access",
      "Multiple profiles",
      "Advanced integrations",
      "Dedicated support",
    ],
    popular: false,
  },
] as const;

type PlanId = (typeof plans)[number]["id"];

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

export default function PlanPage() {
  const router = useRouter();
  const { data, updateData } = useForm();
  const { isStepValid } = useOnboardingConfig();

  // Validation for previous steps
  if (!isStepValid("plan")) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertDescription>
            Please complete your profile first.
          </AlertDescription>
        </Alert>
        <Link
          href="/onboarding/profile"
          className="flex items-center text-sm text-coffee-600 hover:text-coffee-800"
        >
          <ArrowUpSquare/>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go back to complete your profile
        </Link>
      </div>
    );
  }

  const handleSelect = (plan: PlanId) => {
    updateData("plan", plan);
    router.push("/onboarding/template");
  };

  return (
    <div className="container mx-auto max-w-[1400px] px-4 space-y-12 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mx-auto"
      >
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-coffee-800">
          Choose Your Plan
        </h1>
        <p className="mt-4 text-coffee-600 text-base sm:text-lg lg:text-xl">
          Start with our free plan or unlock more features
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:gap-12 max-w-7xl mx-auto"
      >
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            variants={item}
            className="relative flex flex-col h-full min-w-[280px] lg:min-w-[320px]"
          >
            {plan.popular && (
              <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-coffee-500 px-4 py-1.5 text-sm font-medium text-white z-10">
                Popular Choice
              </div>
            )}
            <button
              onClick={() => handleSelect(plan.id)}
              className={`group relative h-full w-full overflow-hidden rounded-xl border bg-white p-6 md:p-8 text-left shadow-sm transition-all hover:shadow-md ${
                data.plan === plan.id
                  ? "border-coffee-500 ring-2 ring-coffee-500 ring-offset-2"
                  : "border-coffee-100 hover:border-coffee-200"
              }`}
            >
              <motion.div
                initial={false}
                animate={{ opacity: data.plan === plan.id ? 1 : 0 }}
                className="absolute inset-0 bg-coffee-50"
              />
              <div className="relative space-y-6">
                <div className="space-y-3">
                  <h3 className="text-xl md:text-2xl font-semibold text-coffee-800">
                    {plan.name}
                  </h3>
                  <p className="text-lg md:text-xl font-medium text-coffee-600">
                    {plan.price}
                  </p>
                  <p className="text-sm md:text-base text-coffee-500">
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center text-sm md:text-base text-coffee-700"
                    >
                      <Check className="mr-3 h-5 w-5 text-coffee-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <motion.div
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              />
            </button>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center text-sm sm:text-base lg:text-lg text-coffee-600 mt-12"
      >
        All plans come with a 14-day free trial. No credit card required.
      </motion.div>
    </div>
  );
}
