let urlCharters = 'https://gateway.marvel.com:443/v1/public/characters?ts=1&apikey=501d252bce4154b391c3e255c2876993&hash=44e3d767c9be976309eb21e2fa27764a&limit=50';
let urlChar = 'https://gateway.marvel.com:443/v1/public/characters/'

let heroArray=[]

const cacheName = 'hero-cache';

caches.keys().then(keys=>{
    console.log(keys)
})

async function obtenerResultado() {
    try {
        const respuesta = await fetch(urlCharters);
        const datos = await respuesta.json();
        const heroes = datos.data.results;
        for (const char of heroes) {
            const { id, name, thumbnail } = char;
            heroArray.push({ id, name, thumbnail });
        }

        caches.open(cacheName).then(cache => {
            const jsonStr = JSON.stringify(heroArray);
            const cacheRequest = new Request('http://127.0.0.1:5500/hero-colection');
            const cacheResponse = new Response(jsonStr);
            cache.put(cacheRequest, cacheResponse)
          });
        mostrarHeroes();

    } catch (error) {
        console.error("Error:", error);
    }
}

function mostrarHeroes() {
    const container = document.getElementById('contenedor');

    heroArray.forEach(hero => {
        const card = document.createElement('div');
        card.className = 'card';

        const nombre = document.createElement('h2');
        nombre.textContent = hero.name;

        const imagen = document.createElement('img');
        imagen.src = `${hero.thumbnail.path}.${hero.thumbnail.extension}`;
        imagen.alt = hero.name;

        const button = document.createElement('button');
        button.addEventListener('click', () => obtenerDetalleHeroe(hero.id));
        button.className = 'btn-open-modal';
        button.textContent = 'Ver Detalles';

        const fav = document.createElement('button');
        fav.addEventListener('click', (e) => {
            agregarAFavoritos(hero);
        });
        fav.className = 'fav';
        fav.textContent = 'Agregar a Favoritos';

        card.dataset.heroId = hero.id;

        card.appendChild(nombre);
        card.appendChild(imagen);
        card.appendChild(button);
        card.appendChild(fav);
        container.appendChild(card)
    });
}

async function obtenerDetalleHeroe(heroId) {
    const url = `${urlChar}${heroId}?ts=1&apikey=501d252bce4154b391c3e255c2876993&hash=44e3d767c9be976309eb21e2fa27764a`;

    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();
        const hero = datos.data.results[0];
        mostrarModal(hero);
    } catch (error) {
        console.error("Error obteniendo detalles del héroe:", error);
    }
}

function mostrarModal(hero) {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');

    modalContent.innerHTML = `
      <h2>${hero.name}</h2>
      <p>${hero.description || 'No hay Descripcion disponible.'}</p>
      <h3>Comics:</h3>
      <ul>
        ${hero.comics.items.map(comic => `<li>${comic.name}</li>`).join('')}
      </ul>
      <button id="cerrar-modal">Cerrar</button>
    `;

    modal.style.display = 'flex';

    const cerrarModalButton = document.getElementById('cerrar-modal');
    cerrarModalButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    modal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

function agregarAFavoritos(hero) {
    const cardId = hero.id;
    const heroName = hero.name;
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
