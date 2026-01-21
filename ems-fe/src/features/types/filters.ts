import type { Dayjs } from 'dayjs';

export type FiltersState = {
  category: string; 
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  sort: 'date' | 'createdAt' | 'title';
  order: 'asc' | 'desc';
};
