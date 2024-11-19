"use client";

import { OnboardingData } from "@repo/db/schema";
import { createContext, useContext, useState } from "react";

const initialData: OnboardingData = {
  userType: undefined,
  niche: undefined,
  plan: undefined,
  template: undefined,
  profile: {
    username: "",
    bio: "",
    website: "",
    photo: "",
    location: "",
    displayEmail: true,
  },
  customization: {
    theme: "default",
    layout: "standard",
    brandColor: "#000000",
    fontPreference: "inter",
  },
  socials: {},
};

interface FormContextType {
  data: OnboardingData;
  updateData: <K extends keyof OnboardingData>(
    key: K,
    value: OnboardingData[K]
  ) => void;
  updateProfileData: <K extends keyof OnboardingData["profile"]>(
    key: K,
    value: OnboardingData["profile"][K]
  ) => void;
}

const FormContext = createContext<FormContextType>({
  data: initialData,
  updateData: () => {},
  updateProfileData: () => {},
});

export function FormProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<OnboardingData>(initialData);

  const updateData = <K extends keyof OnboardingData>(
    key: K,
    value: OnboardingData[K]
  ) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateProfileData = <K extends keyof OnboardingData["profile"]>(
    key: K,
    value: OnboardingData["profile"][K]
  ) => {
    setData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [key]: value,
      },
    }));
  };

  return (
    <FormContext.Provider value={{ data, updateData, updateProfileData }}>
      {children}
    </FormContext.Provider>
  );
}

export const useForm = () => useContext(FormContext);
