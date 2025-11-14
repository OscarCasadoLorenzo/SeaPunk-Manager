"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SettingsForm } from "./components/SettingsForm";

export default function SettingsPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN", "MASTER"]}>
      <div className="container mx-auto py-6">
        <div className="space-y-2 mb-6">
          <h1 className="text-3xl font-bold">Database Settings</h1>
          <p className="text-muted-foreground">
            Manage your database backups, imports, and system settings
          </p>
        </div>
        <SettingsForm />
      </div>
    </ProtectedRoute>
  );
}
