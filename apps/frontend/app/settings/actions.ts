export async function getUserSettings() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/settings`
  );
  return response.json();
}

export async function updateUserSettings(settings: any) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/settings`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    }
  );
  return response.json();
}
