"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons"; // You'll need to create this
import { signIn } from "next-auth/react";
import * as React from "react";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // todo: this needs to be done by middleware,
      // if user created a workspace = onboarding completed in this case
      // redirect the user to the dashboard
      await signIn("google", { redirectTo: "/onboarding/welcome" });
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6" {...props}>
      {/* Add GITHUB AUTH option */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        disabled={isLoading}
        onClick={handleGoogleSignIn}
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}
        Google
      </Button>
    </div>
  );
}
