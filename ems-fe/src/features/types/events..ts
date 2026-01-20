export type Event = {
  id: number;
  title: string;
  date: string; // ISO string from backend
  location: string;
  category: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
};

