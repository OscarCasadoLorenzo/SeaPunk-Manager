export async function getNarratives() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/narratives`
  );
  return response.json();
}

export async function updateNarrative(id: string, data: any) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/narratives/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  );
  return response.json();
}

export async function createNarrative(data: any) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/narratives`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  );
  return response.json();
}
