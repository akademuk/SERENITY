const CACHE_NAME = "serenity-bay-v4";
const ASSETS = [
  "./",
  "./index.html",
  "./css/style.min.css",
  "./css/fonts.css",
  "./js/main.js",
  "./assets/icons/monogram.svg",
  "./assets/fonts/PlayfairDisplay-Regular-Latin.woff2",
  "./assets/fonts/Montserrat-Regular-Latin.woff2",
  "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css",
  "https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css",
  "https://unpkg.com/lenis@1.0.45/dist/lenis.css",
  "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js",
  "https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js",
  "https://unpkg.com/lenis@1.0.45/dist/lenis.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js",
  "https://unpkg.com/split-type@0.3.4/umd/index.min.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // Force activation immediately
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim(); // Take control of all clients immediately
});

self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Strategy 1: Cache First (Images, Fonts, Audio, Video)
  // These assets rarely change, so we serve from cache immediately.
  if (
    url.pathname.match(/\.(webp|jpg|jpeg|png|svg|gif|ico|woff2?|ttf|otf|mp4)$/)
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(event.request).then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
  }
  // Strategy 2: Stale-While-Revalidate (HTML, CSS, JS)
  // Serve cached content immediately, but update cache in background for next visit.
  else {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request)
            .then((networkResponse) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            })
            .catch(() => {
              // If offline and no cache, maybe show offline page (optional)
            });

          return cachedResponse || fetchPromise;
        });
      })
    );
  }
});
