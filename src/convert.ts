export interface ConvertRequestBody {
  url: string;
  method: 'auto';
  retain_images: false;
}

export function buildRequestBody(url: string): ConvertRequestBody {
  return { url, method: 'auto', retain_images: false };
}

export function isValidHttpUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function convertUrl(
  url: string,
  fetchImpl: typeof fetch = fetch,
  timeoutMs = 30000
): Promise<string> {
  if (!isValidHttpUrl(url)) throw new Error('Invalid URL');
  const controller = new AbortController();
  const to = setTimeout(() => controller.abort(), timeoutMs);
  const res = await fetchImpl('https://markdown.new/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildRequestBody(url)),
    signal: controller.signal
  });
  clearTimeout(to);
  if (!res.ok) {
    if (res.status === 429) throw new Error('Rate limit exceeded (429). Try later.');
    throw new Error(`Request failed with ${res.status}`);
  }
  const text = await res.text();
  if (!text) throw new Error('Empty response');
  return text;
}
