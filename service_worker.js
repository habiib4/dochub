const cacheName = "v2";

self.addEventListener("install", e => {
  console.log("Service Worker: Installed");
});

self.addEventListener("activate", e => {
  console.log("Service Worker: Activated");

  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== cacheName) {
            console.log("Service Worker: Delete Old Cache");
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", e => {
  console.log("Service Worker: Fetching");
  if (e.request.method === "GET") {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const resClone = res.clone();
          caches.open(cacheName).then(cache => {
            cache.put(e.request, resClone);
          });
          return res;
        })
        .catch(err => caches.match(e.request).then(res => res))
    );
  }
});
