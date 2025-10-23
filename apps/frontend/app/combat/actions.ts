export async function getCombatState() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/combat`);
  return response.json();
}

export async function startCombat(characterIds: string[]) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/combat`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ characterIds }),
    }
  );
  return response.json();
}

export async function updateCombatState(id: string, data: any) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/combat`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, ...data }),
    }
  );
  return response.json();
}
