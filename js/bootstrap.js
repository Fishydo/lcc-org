const APP_SHELL_PATH = '/pages/app-shell.html';
const APP_SCRIPTS = [
  '/js/inline-01.js',
  '/js/inline-02.js',
  '/js/inline-03.js',
  '/js/inline-04.js'
];

async function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(s);
  });
}

async function bootstrapApp() {
  const res = await fetch(APP_SHELL_PATH, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch app shell: ${res.status}`);

  const html = await res.text();
  document.body.innerHTML = html;

  for (const src of APP_SCRIPTS) {
    await loadScript(src);
  }
}

bootstrapApp().catch((error) => {
  console.error('[bootstrap] app failed to start', error);
  document.body.innerHTML = '<main style="padding:1rem;font-family:system-ui">Failed to load app.</main>';
});
