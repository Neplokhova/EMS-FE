import { http } from '@/shared/api/http';
import type { Event, EventsQuery, UpsertEventDto } from '@/features/types';

export async function getEvents(q: EventsQuery): Promise<Event[]> {
  const params = new URLSearchParams();

  if (q.category) params.set('category', q.category);
  if (q.dateFrom) params.set('dateFrom', q.dateFrom);
  if (q.dateTo) params.set('dateTo', q.dateTo);
  if (q.sort) params.set('sort', q.sort);
  if (q.order) params.set('order', q.order);

  const suffix = params.toString() ? `?${params.toString()}` : '';
  return http<Event[]>(`/events${suffix}`);
}

export async function createEvent(dto: UpsertEventDto): Promise<Event> {
  return http<Event>(`/events`, { method: 'POST', body: JSON.stringify(dto) });
}

export async function updateEvent(id: number, dto: UpsertEventDto): Promise<Event> {
  return http<Event>(`/events/${id}`, { method: 'PATCH', body: JSON.stringify(dto) });
}

export async function deleteEvent(id: number): Promise<void> {
  await http<void>(`/events/${id}`, { method: 'DELETE' });
}

export async function getEventRecommendations(id: number): Promise<Event[]> {
  return http<Event[]>(`/events/${id}/recommendations`);
}