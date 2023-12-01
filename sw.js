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

const urlH='https://gateway.marvel.com/v1/public/characters?ts=1&apikey=501d252bce4154b391c3e255c2876993&hash=44e3d767c9be976309eb21e2fa27764a&limit=50'


self.addEventListener("install", (e) => {
  caches.open("hero-colection").then((cache) => {
    cache.addAll(['./', './js/app.js', './stylo.css', './img']);
  });
});

self.addEventListener("fetch", (e)=>{
    const url=e.request.url
if (url==urlH) {
    caches.open('hero-cache').then(cache => {
      const resourceKey = 'http://127.0.0.1:5500/hero-colection';  
      cache.match(resourceKey).then(cachedResponse => {
        if (cachedResponse) {
          cachedResponse.text().then(content => {
            console.log('se encontro contenido de la cache');
          });
        }
      });
    });
    
}
})
