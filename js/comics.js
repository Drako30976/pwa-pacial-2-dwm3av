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

  let urlCharters = 'https://gateway.marvel.com:443/v1/public/comics?ts=1&apikey=501d252bce4154b391c3e255c2876993&hash=44e3d767c9be976309eb21e2fa27764a&limit=20';
  let urlChar = 'https://gateway.marvel.com:443/v1/public/comics/'


  let comicsArray=[]

  const cacheName = 'comic-cache';

async function obtenerResultado() {
    try {
        const respuesta = await fetch(urlCharters);
        const datos = await respuesta.json();
        const heroes = datos.data.results;
        for (const char of heroes) {
            const { id, title, thumbnail } = char;
            comicsArray.push({ id, title, thumbnail });
        }
        mostrarComics();
    } catch (error) {
        console.error("Error:", error);
    }
}

function mostrarComics() {
    const container = document.getElementById('contenedor');

    comicsArray.forEach(hero => {
        const card = document.createElement('div');
        card.className = 'card';

        const nombre = document.createElement('h2');
        nombre.textContent = hero.title;

        const imagen = document.createElement('img');
        imagen.src = `${hero.thumbnail.path}.${hero.thumbnail.extension}`;
        imagen.alt = hero.title;

        const fav = document.createElement('button');
        fav.addEventListener('click', (e) => {
            agregarAFavoritos(hero);
        });
        fav.className = 'fav';
        fav.textContent = 'Agregar a Favoritos';

        card.dataset.heroId = hero.id;

        card.appendChild(nombre);
        card.appendChild(imagen);
        card.appendChild(fav);
        container.appendChild(card)
    });
}
function agregarAFavoritos(hero) {
    const cardId = hero.id;
    const heroName = hero.title;
    const cachedHeroes = getCachedHeroes();

    if (cachedHeroes.includes(cardId)) {
        alert(`¡${heroName} ya está en tus favoritos!`)
    } else {
        cachedHeroes.push(cardId);
        saveToCache(cachedHeroes);
        alert(`¡${heroName} agregado a Favoritos!`);
    }
}

function getCachedHeroes() {
    const cachedData = localStorage.getItem(cacheName);
    return cachedData ? JSON.parse(cachedData) : [];
}

function saveToCache(data) {
    localStorage.setItem(cacheName, JSON.stringify(data));
}


obtenerResultado();
