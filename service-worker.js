const CACHE_NAME = "sbfv-v1";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./css/style.css",
  "./css/responsive.css",
  "./css/animations.css",
  "./js/config.js",
  "./js/main.js",
  "./js/menu.js",
  "./js/cart.js",
  "./js/reservation.js",
  "./js/checkout.js",
  "./js/gallery.js",
  "./js/translations.js",
  "./data/menu.js",
  "./data/offers.js",
  "./data/events.js"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});