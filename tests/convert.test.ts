import { describe, it, expect } from 'vitest';
import { buildRequestBody, isValidHttpUrl, convertUrl } from '../src/convert';

describe('buildRequestBody', () => {
  it('returns correct shape', () => {
    const body = buildRequestBody('https://example.com');
    expect(body).toEqual({ url: 'https://example.com', method: 'auto', retain_images: false });
  });
});

describe('isValidHttpUrl', () => {
  it('accepts http/https', () => {
    expect(isValidHttpUrl('https://example.com')).toBe(true);
    expect(isValidHttpUrl('http://example.com/path')).toBe(true);
  });
  it('rejects non-http', () => {
    expect(isValidHttpUrl('chrome://newtab')).toBe(false);
    expect(isValidHttpUrl('not a url')).toBe(false);
  });
});

describe('convertUrl', () => {
  it('calls fetch with correct payload and returns text', async () => {
    const mockFetch = async (url: RequestInfo | URL, opts: RequestInit) => {
      expect(url).toBe('https://markdown.new/');
      expect(opts.method).toBe('POST');
      expect(opts.headers).toEqual({ 'Content-Type': 'application/json' });
      const body = JSON.parse(opts.body as string);
      expect(body).toEqual({ url: 'https://example.com', method: 'auto', retain_images: false });
      return { ok: true, text: async () => '# Markdown' } as Response;
    };
    const result = await convertUrl('https://example.com', mockFetch as unknown as typeof fetch, 1000);
    expect(result).toBe('# Markdown');
  });

  it('throws on 429', async () => {
    const mockFetch = async () => ({ ok: false, status: 429 } as Response);
    await expect(convertUrl('https://example.com', mockFetch as unknown as typeof fetch)).rejects.toThrow('Rate limit exceeded');
  });

  it('throws on invalid url', async () => {
    const badFetch = (() => {}) as unknown as typeof fetch;
    await expect(convertUrl('chrome://bad', badFetch)).rejects.toThrow('Invalid URL');
  });
});
