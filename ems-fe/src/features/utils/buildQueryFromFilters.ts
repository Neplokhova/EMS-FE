import dayjs, { type Dayjs } from 'dayjs';
import type { EventsQuery } from '@/features/types';

export type EventsFiltersInput = {
  category: string; // '' means all
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  sort: EventsQuery['sort'];
  order: EventsQuery['order'];
};

export function buildQueryFromFilters(filters: EventsFiltersInput): EventsQuery {
  const q: EventsQuery = {
    sort: filters.sort,
    order: filters.order,
  };

  if (filters.category) q.category = filters.category;

  if (filters.startDate) q.dateFrom = dayjs(filters.startDate).format('YYYY-MM-DD');
  if (filters.endDate) q.dateTo = dayjs(filters.endDate).format('YYYY-MM-DD');

  return q;
}