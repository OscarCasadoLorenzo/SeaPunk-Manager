// Client-side API calls for database settings
import { fetchApi, fetchApiRaw } from "@/lib/api";

// Database statistics
export async function getDatabaseStats() {
  return fetchApi("/settings/stats", {
    cache: "no-store",
  });
}

// Export database backup
export async function exportDatabaseBackup() {
  return fetchApiRaw("/settings/backup/export");
}

// Reset database
export async function resetDatabase(confirmationPhrase: string) {
  return fetchApi("/settings/backup/reset", {
    method: "POST",
    body: { confirmationPhrase },
  });
}

// Import database backup
export async function importDatabaseBackup(formData: FormData) {
  const response = await fetchApiRaw("/settings/backup/import", {
    method: "POST",
    body: formData,
  });
  return response.json();
}
