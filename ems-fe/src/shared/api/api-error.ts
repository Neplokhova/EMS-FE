export class ApiError extends Error {
  status: number;
  url: string;
  details?: unknown;

  constructor(params: { message: string; status: number; url: string; details?: unknown }) {
    super(params.message);
    this.name = 'ApiError';
    this.status = params.status;
    this.url = params.url;
    this.details = params.details;
  }
}

export function isApiError(e: unknown): e is ApiError {
  return e instanceof ApiError;
}