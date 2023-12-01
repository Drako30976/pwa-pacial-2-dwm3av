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
    cache.addAll(["./", "./js/app.js", "./stylo.css", "./img"]);
  });
});

self.addEventListener("fetch", (e)=>{
    console.log("pedido de url", e.request.url)
    caches.has("hero-colection").then(res=>{
        console.log("cache: ", res)
    })
})
