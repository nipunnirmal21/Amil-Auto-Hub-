import { apiBase } from '../data/business';

const apiRoot = `${apiBase}/api`;

export function resolveMediaUrl(value) {
  if (!value) return '';
  if (/^https?:\/\//.test(value) || value.startsWith('blob:')) return value;
  return `${apiBase}${value}`;
}

export async function apiRequest(path, { token, body, method = 'GET', signal } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const isFormData = body instanceof FormData;
  if (body && !isFormData) headers['Content-Type'] = 'application/json';
  let response;
  try {
    response = await fetch(`${apiRoot}${path}`, {
      method,
      headers,
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
      signal,
    });
  } catch (cause) {
    const error = new Error('Cannot connect to the server. Make sure the backend is running.');
    error.cause = cause;
    error.status = 0;
    throw error;
  }
  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json().catch(() => ({})) : {};
  if (!response.ok) {
    let message = payload.message;
    if (!message && response.status === 401) message = 'Invalid email or password.';
    if (!message && response.status >= 500) message = 'Cannot connect to the server. Make sure the backend is running.';
    if (!message) message = 'The request could not be completed.';
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  return payload;
}
