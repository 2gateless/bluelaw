const CACHE_NAME = 'bluelaw-v3';
const CORE_ASSETS = [
  './',
  './index.html',
  './cases.json',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  // http/https 외의 확장 프로그램 스킴 등은 가로채지 않음
  if (!url.protocol.startsWith('http')) return;

  // cases.json: 캐시를 우선 반환하고 백그라운드에서 최신 데이터 갱신 (SWR)
  if (url.origin === self.location.origin && url.pathname.endsWith('cases.json')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.ok) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => {
            if (cachedResponse) return cachedResponse;
            return new Response('[]', {
              status: 503,
              headers: { 'Content-Type': 'application/json; charset=utf-8' },
            });
          });
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 일반 요청: 네트워크 우선, 실패 시 캐시(네비게이션 요청은 index.html) 폴백
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.ok && response.type === 'basic') {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
        return Response.error();
      })
  );
});
