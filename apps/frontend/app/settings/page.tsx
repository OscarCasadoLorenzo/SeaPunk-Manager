"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardDescription, CardHeader, CardTitle } from "@seapunk/ui";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { SettingsForm } from "./components/SettingsForm";

/**
 * @deprecated This page is deprecated and will be removed in a future version.
 * Database settings have been moved to an admin-only section.
 * User profile settings are now available at /profile
 */
export default function SettingsPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN", "MASTER"]}>
      <div className="container mx-auto py-6">
        {/* Deprecation Notice */}
        <Card className="mb-6 border-orange-500 bg-orange-50 dark:bg-orange-950">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-orange-600">Page Deprecated</CardTitle>
            </div>
            <CardDescription className="text-orange-700 dark:text-orange-400">
              This settings page is deprecated. For user profile settings,
              please visit{" "}
              <Link href="/profile" className="underline font-medium">
                /profile
              </Link>
              . Database management features remain here for admin users only.
            </CardDescription>
          </CardHeader>
        </Card>

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
