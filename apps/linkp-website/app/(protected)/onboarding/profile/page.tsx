"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Camera, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "../form-providers";
import { useOnboardingConfig } from "../hooks";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { ProfileData } from "@repo/db/schema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

export default function ProfilePage() {
  const router = useRouter();
  const { data, updateData, updateProfileData } = useForm();
  const { isStepValid } = useOnboardingConfig();
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<ProfileData>(data.profile);

  useEffect(() => {
    if (!isStepValid("profile")) {
      router.push("/onboarding/niche");
    }
  }, [isStepValid, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    updateProfileData(name as keyof ProfileData, value);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // TODO: Implement actual file upload logic here
      const photoUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, photo: photoUrl }));
      updateProfileData("photo", photoUrl);
    } catch (error) {
      console.error("Error uploading photo:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateData("profile", formData);
    router.push("/onboarding/plan");
  };

  if (!isStepValid("profile")) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertDescription>
            Please complete the previous steps first.
          </AlertDescription>
        </Alert>
        <Link
          href="/onboarding/niche"
          className="flex items-center text-sm text-coffee-600 hover:text-coffee-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go back to previous step
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h1 className="text-2xl font-bold text-coffee-800">
          Create Your Profile
        </h1>
        <p className="mt-2 text-coffee-600">
          Let&apos;s make your page uniquely yours
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo Upload */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="group relative h-24 w-24 overflow-hidden rounded-full border-2 border-coffee-200 bg-coffee-50">
              {formData.photo ? (
                <Image
                  src={formData.photo}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Camera className="h-8 w-8 text-coffee-400" />
                </div>
              )}
              <label
                className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                htmlFor="photo-upload"
              >
                <span className="text-sm font-medium text-white">Change</span>
              </label>
            </div>
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            )}
          </div>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
            disabled={isUploading}
          />
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="text-sm font-medium text-coffee-700"
            >
              Display Name
            </label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
              className="mt-1"
              required
            />
          </div>

          <div>
            <label
              htmlFor="bio"
              className="text-sm font-medium text-coffee-700"
            >
              Bio
            </label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself"
              className="mt-1 h-24"
              required
            />
          </div>

          <div>
            <label
              htmlFor="website"
              className="text-sm font-medium text-coffee-700"
            >
              Website (optional)
            </label>
            <Input
              id="website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="https://your-website.com"
              className="mt-1"
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="text-sm font-medium text-coffee-700"
            >
              Location (optional)
            </label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="City, Country"
              className="mt-1"
            />
          </div>
        </div>

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
