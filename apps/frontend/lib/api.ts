export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type RequestConfig = {
  method?: string;
  headers?: HeadersInit;
  body?: unknown;
} & Omit<RequestInit, 'body'>;

export async function fetchApi<TData>(
  endpoint: string,
  { body, ...config }: RequestConfig = {}
): Promise<TData> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...config,
    method: config.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...config.headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}
