if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./sw.js")
    .then((registration) => {
      console.log("service worker registrado");
    })
    .catch((error) => {
      console.log("service worker no registrado");
    });
}

self.addEventListener("install", (e) => {
  caches.open("hero-colection").then((cache) => {
    cache.addAll([
      "./",
      "./js/app.js",
      "./stylo.css",
      "./img",
      'https://gateway.marvel.com:443/v1/public/characters?ts=1&apikey=501d252bce4154b391c3e255c2876993&hash=44e3d767c9be976309eb21e2fa27764a&limit=50',
    ]);
  });
});

self.addEventListener("fetch-and-network", (e) => {
  const cacheResponse = caches.match(e.request).then((response) => {
    if (!response) {
      return fetch(e.request);
    }
    return response;
  });

  e.respondWith(cacheResponse);
});

self.addEventListener("fetch", (e) => {
  const response = fetch(e.request)
    .then((res) => {
      return caches.open("hero-cache").then((cache) => {
        cache.put(e.request, res.clone());
        return res;
      });
    })
    .catch((err) => {
      return caches.match(e.request);
    });
  e.respondWith(response);
});
