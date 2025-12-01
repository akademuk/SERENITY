const CACHE_NAME = "serenity-bay-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/main.js",
  "./assets/icons/monogram.svg",
  "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&family=Pinyon+Script&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap",
  "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css",
  "https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css",
  "https://unpkg.com/lenis@1.0.45/dist/lenis.css",
  "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js",
  "https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js",
  "https://unpkg.com/lenis@1.0.45/dist/lenis.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js",
  "https://unpkg.com/split-type",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).then((fetchResponse) => {
          // Cache new requests (Stale-While-Revalidate logic could be more complex, but this is basic caching)
          // For external resources, we might not want to cache everything blindly, but for this demo it's fine.
          return fetchResponse;
        })
      );
    })
  );
});
