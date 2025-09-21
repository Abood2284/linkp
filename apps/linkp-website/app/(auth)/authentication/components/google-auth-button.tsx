// apps/linkp-website/app/(auth)/authentication/components/google-auth-button.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/loading"; // Assuming this component exists from your hero section

/**
 * Renders a Google icon.
 */
function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width="24px"
      height="24px"
      {...props}
    >
      <path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      />
      <path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.22,0-9.61-3.317-11.28-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      />
      <path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,35.53,44,30.1,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      />
    </svg>
  );
}

/**
 * A client component that handles the Google Sign-In flow.
 */
export function GoogleAuthButton() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleGoogleSignIn() {
    setIsLoading(true);
    // todo: this needs to be done by middleware,
    // if user created a workspace = onboarding completed in this case
    // redirect the user to the dashboard
    await signIn("google", { redirectTo: "/select-type" });

    // Placeholder for demonstration
    console.log("Initiating Google Sign-In...");
  }

  return (
    <Button
      size="lg"
      className="w-full bg-[#D5DF35] hover:bg-[#c8d230] text-[#382F2B] px-8 py-6 text-lg font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-nunSans flex items-center justify-center gap-3"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loading size={24} className="text-[#382F2B]" />
      ) : (
        <>
          <GoogleIcon />
          <span>Sign in with Google</span>
        </>
      )}
    </Button>
  );
}
