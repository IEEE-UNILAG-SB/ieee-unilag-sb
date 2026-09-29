const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export interface EventData {
  _id: string;
  header: string;
  body: string;
  location: string;
  banner_url: string;
  registration_link: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  message: string;
  data: T;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  errors?: Array<{ msg: string; param: string }>;
}

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${path}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      data?.message ?? data?.errors?.[0]?.msg ?? `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return data as T;
}

export async function fetchLatestEvents(): Promise<EventData[]> {
  const response = await fetchApi<{ message: string; data: EventData[] }>(
    "/api/v1/events"
  );
  return response.data;
}

export async function fetchAllEvents(page = 1, limit = 10): Promise<PaginatedResponse<EventData[]>> {
  return fetchApi<PaginatedResponse<EventData[]>>(
    `/api/v1/events/all?page=${page}&limit=${limit}`
  );
}

export async function subscribeToNewsletter(email: string): Promise<{ message: string }> {
  return fetchApi<{ message: string }>("/api/v1/newsletter/signup", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}
