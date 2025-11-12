// Client-side API calls for database settings
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Database statistics
export async function getDatabaseStats() {
  const response = await fetch(`${API_BASE_URL}/settings/stats`, {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch database stats');
  }
  return response.json();
}

// Export database backup
export async function exportDatabaseBackup() {
  const response = await fetch(`${API_BASE_URL}/settings/backup/export`);
  if (!response.ok) {
    throw new Error('Failed to export database');
  }
  return response;
}

// Reset database
export async function resetDatabase(confirmationPhrase: string) {
  const response = await fetch(`${API_BASE_URL}/settings/backup/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ confirmationPhrase }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to reset database');
  }
  return response.json();
}

// Import database backup
export async function importDatabaseBackup(formData: FormData) {
  const response = await fetch(`${API_BASE_URL}/settings/backup/import`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to import database');
  }
  return response.json();
}
