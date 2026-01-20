import type { Dayjs } from 'dayjs';

export type FiltersState = {
  category: string; // '' means all
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  sort: 'date' | 'createdAt' | 'title';
  order: 'asc' | 'desc';
};