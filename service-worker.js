const CACHE = 'volphas-v2';

// Core shell — pre-fetched on install so the app works offline immediately
const PRECACHE_URLS = [
  './volphas-app.html',
  './manifest.json',
  './audio/manifest.json',
  './images/volph_icon.png',
  './images/volph_inside.png',
  './images/volph_smile.png',
  './images/volph_sad.png',
  './images/heart.png',
  './images/heart_stone.png',
  './images/electric_bolt.png',
  './images/streak.png',
  './images/0_streak.png',
  './images/basic_chest.png',
  './images/good_chest.png',
  './images/premium_chest.png',
  './images/book.png',
  './images/clock.png',
  './images/ball.png',
  './images/nav_home.png',
  './images/nav_quests.png',
  './images/nav_rewards.png',
  './images/nav_league.png',
  './images/nav_profile.png',
  './images/level_1_beginner.png',
  './images/level_2_elementary.png',
  './images/level_3_intermediate.png',
  './images/level_4_upper.png',
  './images/level_5_advanced.png',
  './images/level_6_mastery.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Network-first for the HTML — user always gets updates when online,
  // falls back to cached version when offline
  if (url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(event.request, clone));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first for images and audio — fast loads + full offline support.
  // Files are cached on first visit and served instantly on repeat visits.
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(event.request, clone));
        }
        return res;
      }).catch(() => cached);
    })
  );
});
