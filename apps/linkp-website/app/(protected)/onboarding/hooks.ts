import { useForm } from "./form-providers";
import { getUserTypeConfig, getNicheConfig } from "./constants";
import { useCallback } from "react";

export function useOnboardingConfig() {
  const { data } = useForm();

  const userTypeConfig = useCallback(() => {
    if (!data.userType) return null;
    return getUserTypeConfig(data.userType);
  }, [data.userType]);

  const nicheConfig = useCallback(() => {
    if (!data.userType || !data.niche) return null;
    return getNicheConfig(data.userType, data.niche);
  }, [data.userType, data.niche]);

  const isStepValid = useCallback((step: string) => {
    switch (step) {
      case "niche":
        return !!data.userType;
      case "profile":
        return !!data.userType && !!data.niche;
      case "plan":
        return !!data.userType && !!data.niche && !!data.profile?.username;
      case "template":
        return !!data.userType && !!data.niche && !!data.profile?.username && !!data.plan;
      case "social":
        return !!data.userType && !!data.niche && !!data.profile?.username && !!data.plan && !!data.template;
      case "complete":
        return !!data.userType && !!data.niche && !!data.profile?.username && !!data.plan && !!data.template && !!data.socials;
      default:
        return true;
    }
  }, [data]);

  const getRedirectPath = useCallback(() => {
    if (!data.userType) return "/onboarding/identity";
    if (!data.niche) return "/onboarding/niche";
    if (!data.profile?.username) return "/onboarding/profile";
    if (!data.plan) return "/onboarding/plan";
    if (!data.template) return "/onboarding/template";
    if (!data.socials) return "/onboarding/social";
    return "/onboarding/complete";
  }, [data]);

  return {
    userTypeConfig,
    nicheConfig,
    isStepValid,
    getRedirectPath,
  };
}