import { ApiError } from './api-error';
import { hasMessage } from './utils';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

export async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;

  // ✅ merge headers safely
  const headers = new Headers(init.headers);

  // ✅ only set Content-Type when we actually send a body
  const hasBody = init.body !== undefined && init.body !== null;
  if (hasBody && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(url, {
    ...init,
    headers,
    cache: 'no-store',
  });

  const contentType = res.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');

  let data: unknown = null;

  try {
    data = isJson ? await res.json() : await res.text();
  } catch {
    data = null;
  }

  if (!res.ok) {
    let message = `Request failed (${res.status})`;

    if (hasMessage(data)) {
      message = data.message;
    } else if (typeof data === 'string' && data.trim()) {
      message = data;
    }

    throw new ApiError({
      message,
      status: res.status,
      url,
      details: data,
    });
  }

  return data as T;
}