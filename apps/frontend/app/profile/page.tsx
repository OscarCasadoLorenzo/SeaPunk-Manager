"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PersonalInfoSection } from "./components/PersonalInfoSection";
import { SecuritySection } from "./components/SecuritySection";

export default function ProfilePage() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN", "MASTER", "PLAYER"]}>
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="space-y-2 mb-6">
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your personal information, security settings, and preferences
          </p>
        </div>

        <div className="space-y-6">
          <PersonalInfoSection />
          <SecuritySection />
        </div>
      </div>
    </ProtectedRoute>
  );
}
