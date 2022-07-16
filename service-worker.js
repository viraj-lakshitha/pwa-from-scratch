const staticCache = "food-pwa-site-static-v1.0.2";
const dynamicCache = "food-pwa-site-dynamic-v1.0.2";
const maxCacheLimit = 10
const assets = [
  "/",
  "/index.html",
  "/js/app.js",
  "/js/scripts.js",
  "/js/materialize.min.js",
  "/css/styles.css",
  "/css/materialize.min.css",
  "/img/dish.png",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2",
  "/pages/fallback.html",
];

// Limit caching (delete oldest cache items)
const handleCacheLimit = (name, size) => {
  caches.open(name).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        cache
          .delete(keys[0])
          .then(handleCacheLimit(name, size))
          .catch((error) => console.error(error));
      }
    });
  });
};

// Install Service Worker and Cache all static content
this.addEventListener("install", (event) => {
  console.log("INFO - Service Worker Installed", event);
  event.waitUntil(
    caches
      .open(staticCache)
      .then((cache) => {
        console.log("INFO - Caching shell assets");
        cache.addAll(assets);
      })
      .catch((error) => {
        console.error(error);
      })
  );
});

// Activate service worker and Delete all cache data
this.addEventListener("activate", (event) => {
  console.log("INFO - Service Worker Activated", event);
  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys
            .filter((key) => key !== staticCache && key !== dynamicCache)
            .map((key) => caches.delete(key))
        );
      })
      .catch((error) => {
        console.error(error);
      })
  );
});

// Fetch events and Use caches
this.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((cacheRes) => {
        return (
          cacheRes ||
          fetch(event.request).then(async (fetchRes) => {
            const cache = await caches.open(dynamicCache);
            cache.put(event.request.url, fetchRes.clone());
            handleCacheLimit(dynamicCache, maxCacheLimit)
            return fetchRes;
          })
        );
      })
      .catch(() => {
        if (event.request.url.indexOf(".html") > -1) {
          return caches.match("/pages/fallback.html");
        }
      })
  );
});
