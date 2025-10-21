"use client";

import ClientAuthModal from "@/components/ClientAuthModal";

export default function ClientLoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ClientAuthModal onClose={() => {}} />
    </div>
  );
}
