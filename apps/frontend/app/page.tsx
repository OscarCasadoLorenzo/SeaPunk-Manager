"use client";

import { CharacterList } from "@/components/character-list";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="container py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
          <p className="text-muted-foreground mt-2">
            Manage your SeaPunk RPG characters and campaigns
          </p>
        </div>
        <CharacterList />
      </div>
    </ProtectedRoute>
  );
}
