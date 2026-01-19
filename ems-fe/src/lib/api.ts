import type { Event } from '@/types/event';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

export type EventsQuery = {
  category?: string;
  dateFrom?: string; // YYYY-MM-DD
  dateTo?: string;   // YYYY-MM-DD
  sort?: 'date' | 'createdAt' | 'title';
  order?: 'asc' | 'desc';
};

export type UpsertEventDto = {
  title: string;
  category: string;
  location: string;
  date: string; // ISO
  description: string;
};

export async function getEvents(query: EventsQuery = {}): Promise<Event[]> {
  const params = new URLSearchParams();

  if (query.category) params.set('category', query.category);
  if (query.dateFrom) params.set('dateFrom', query.dateFrom);
  if (query.dateTo) params.set('dateTo', query.dateTo);
  if (query.sort) params.set('sort', query.sort);
  if (query.order) params.set('order', query.order);

  const url = `${API_URL}/events${params.toString() ? `?${params.toString()}` : ''}`;

  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to load events: ${res.status} ${text}`);
  }

  return res.json() as Promise<Event[]>;
}
export async function createEvent(dto: UpsertEventDto) {
  const res = await fetch(`${API_URL}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to create event: ${res.status} ${text}`);
  }

  return res.json();
}

export async function updateEvent(id: number, dto: UpsertEventDto) {
  const res = await fetch(`${API_URL}/events/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to update event: ${res.status} ${text}`);
  }

  return res.json();
}


export async function deleteEvent(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/events/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to delete event: ${res.status} ${text}`);
  }
}

export async function getEventRecommendations(id: number): Promise<Event[]> {
  const res = await fetch(`${API_URL}/events/${id}/recommendations`, {
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Failed to load recommendations');
  return res.json();
}