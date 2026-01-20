export type EventsQuery = {
  category?: string;
  dateFrom?: string; // YYYY-MM-DD
  dateTo?: string;   // YYYY-MM-DD
  sort?: 'date' | 'createdAt' | 'title';
  order?: 'asc' | 'desc';
};