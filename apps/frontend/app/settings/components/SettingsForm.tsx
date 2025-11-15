"use client";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@seapunk/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Database, Download, Upload } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  exportDatabaseBackup,
  getDatabaseStats,
  importDatabaseBackup,
  resetDatabase,
} from "../actions";

export function SettingsForm() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resetConfirmation, setResetConfirmation] = useState("");

  const { data: stats, isLoading } = useQuery({
    queryKey: ["database-stats"],
    queryFn: getDatabaseStats,
  });

  const exportMutation = useMutation({
    mutationFn: async () => {
      const response = await exportDatabaseBackup();
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `seapunk-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    onSuccess: () => {
      toast.success("Database exported successfully");
    },
    onError: (error: Error) => {
      toast.error(`Export failed: ${error.message}`);
    },
  });

  const importMutation = useMutation({
    mutationFn: importDatabaseBackup,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["database-stats"] });
      toast.success(
        `Backup imported successfully! ${data.importStats.characters} characters imported.`,
      );
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    onError: (error: Error) => {
      toast.error(`Import failed: ${error.message}`);
    },
  });

  const resetMutation = useMutation({
    mutationFn: resetDatabase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["database-stats"] });
      toast.success("Database reset successfully");
      setResetConfirmation("");
    },
    onError: (error: Error) => {
      toast.error(`Reset failed: ${error.message}`);
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".json")) {
      toast.error("Please select a JSON file");
      return;
    }

    const formData = new FormData();
    formData.append("backup", file);
    importMutation.mutate(formData);
  };

  const handleReset = () => {
    if (resetConfirmation !== "RESET DATABASE") {
      toast.error('Please type exactly "RESET DATABASE" to confirm');
      return;
    }
    resetMutation.mutate(resetConfirmation);
  };

  return (
    <div className="space-y-6">
      {/* Database Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Statistics
          </CardTitle>
          <CardDescription>Current database information</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Characters</p>
                <p className="text-2xl font-bold">{stats?.characters || 0}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Users</p>
                <p className="text-2xl font-bold">{stats?.users || 0}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Backup & Restore */}
      <Card>
        <CardHeader>
          <CardTitle>Backup & Restore</CardTitle>
          <CardDescription>
            Export or import your complete database
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button
              onClick={() => exportMutation.mutate()}
              disabled={exportMutation.isPending}
              className="flex-1"
            >
              <Download className="mr-2 h-4 w-4" />
              {exportMutation.isPending ? "Exporting..." : "Export Database"}
            </Button>
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={importMutation.isPending}
              variant="outline"
              className="flex-1"
            >
              <Upload className="mr-2 h-4 w-4" />
              {importMutation.isPending ? "Importing..." : "Import Database"}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Export creates a complete backup. Import will merge data with
            existing records.
          </p>
        </CardContent>
      </Card>

      {/* Danger Zone - Reset Database */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible actions - proceed with caution
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-confirmation">
              Type <strong>RESET DATABASE</strong> to confirm
            </Label>
            <Input
              id="reset-confirmation"
              value={resetConfirmation}
              onChange={(e) => setResetConfirmation(e.target.value)}
              placeholder="RESET DATABASE"
              className="font-mono"
            />
          </div>
          <Button
            onClick={handleReset}
            disabled={
              resetMutation.isPending || resetConfirmation !== "RESET DATABASE"
            }
            variant="destructive"
            className="w-full"
          >
            {resetMutation.isPending ? "Resetting..." : "Reset Database"}
          </Button>
          <p className="text-xs text-muted-foreground">
            This will permanently delete all data from the database. This action
            cannot be undone.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
