const statusEl = document.getElementById('status') as HTMLElement;
const outputEl = document.getElementById('output') as HTMLTextAreaElement;
const convertBtn = document.getElementById('convert-btn') as HTMLButtonElement;
const copyBtn = document.getElementById('copy-btn') as HTMLButtonElement;
const retryBtn = document.getElementById('retry-btn') as HTMLButtonElement;

let inFlight = false;
let lastMarkdown = '';

function setState(state: string, message: string) {
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.className = 'status ' + state;
}

function setUI({
  loading = false,
  success = false,
  error = false,
}: {
  loading?: boolean;
  success?: boolean;
  error?: boolean;
}) {
  if (convertBtn) convertBtn.disabled = loading;
  if (copyBtn) copyBtn.disabled = !success;
  if (retryBtn) retryBtn.classList.toggle('hidden', !error);
}

async function getCurrentTabUrl(): Promise<string | null> {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];
  if (!tab?.url) return null;
  try {
    const u = new URL(tab.url);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
    return u.href;
  } catch {
    return null;
  }
}

async function convert(url: string) {
  setState('loading', 'Converting...');
  setUI({ loading: true });
  if (outputEl) outputEl.value = '';
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    const requestUrl = 'https://markdown.new/' + url;
    const res = await fetch(requestUrl, {
      method: 'GET',
      headers: { Accept: 'text/markdown' },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      if (res.status === 429) {
        throw new Error('Rate limit exceeded (429). Try later.');
      }
      throw new Error(`Request failed with ${res.status}`);
    }

    const text = await res.text();
    if (!text) {
      throw new Error('Empty Markdown content');
    }

    lastMarkdown = text;
    if (outputEl) outputEl.value = text;
    setState('success', 'Conversion succeeded');
    setUI({ success: true });
  } catch (err: unknown) {
    console.error(err);
    const message = err instanceof Error ? err.message : 'Conversion failed';
    setState('error', message);
    setUI({ error: true });
  } finally {
    inFlight = false;
  }
}

async function startConversion() {
  if (inFlight) return;
  inFlight = true;
  const url = await getCurrentTabUrl();
  if (!url) {
    setState('error', 'No valid tab URL');
    setUI({ error: true });
    inFlight = false;
    return;
  }
  await convert(url);
}

async function copyMarkdown() {
  if (!lastMarkdown) {
    setState('error', 'No content to copy');
    return;
  }
  setState('loading', 'Copying...');
  try {
    await navigator.clipboard.writeText(lastMarkdown);
    setState('success', 'Copied to clipboard');
  } catch {
    setState('error', 'Copy failed. Text remains visible.');
  }
}

convertBtn?.addEventListener('click', startConversion);
retryBtn?.addEventListener('click', startConversion);
copyBtn?.addEventListener('click', copyMarkdown);

setState('idle', 'Ready');
setUI({});
startConversion();
