"use client";

import FreelancerAuthModal from "@/components/FreelancerAuthModal";

export default function FreelancerLoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <FreelancerAuthModal onClose={() => {}} />
    </div>
  );
}
