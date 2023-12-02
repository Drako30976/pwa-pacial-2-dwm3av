self.addEventListener("install", (e) => {
  const cache = caches.open("hero-colection").then((cache) => {
    cache.addAll([
      './',
      './js/app.js',
    ]);
  });
  e.waitUntil(cache);
});

self.addEventListener("fetch-cache-only", (e) => {
    const cacheResponse = caches.match(e.request);
    e.respondWith(cacheResponse);

});

self.addEventListener("fetch-and-network", (e) => {
    const cacheResponse = caches.match(e.request).then(response => {
        if(!response) {
            return fetch(e.request);
        }
        return response;
    });

    e.respondWith(cacheResponse);

});

self.addEventListener("fetch", (e) => {
    const response =
        fetch(e.request)
            .then((res) => {
              return caches.open('hero-colection').then(cache => {
                  cache.put(e.request, res.clone());
                  return res;
              })
            })
            .catch((err) => {
                return caches.match(e.request);
            })
    e.respondWith(response);

});