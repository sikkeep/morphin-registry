"use client";

import * as React from "react";
import { OnboardingForm } from "@/components/onboarding-form";

export default function OnboardingFormDemo() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleCreateAccount = (username: string) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Account for @${username} created successfully!`);
    }, 2000);
  };

  const handleUpload = () => {
    alert("Upload button clicked!");
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <OnboardingForm
        imageSrc="https://ik.imagekit.io/fpxbgsota/Image.png?updatedAt=1760432307349q=80&w=2070&auto=format&fit=crop"
        avatarSrc="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80&auto=format&fit=crop"
        avatarFallback="A"
        title="Welcome, you're starting your first journey here!"
        description="Add your avatar and pick a username for a quick start."
        inputPlaceholder="username"
        buttonText="Create an account"
        onUploadClick={handleUpload}
        onSubmit={handleCreateAccount}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
