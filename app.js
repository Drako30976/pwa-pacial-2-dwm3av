let urlCharters = 'https://gateway.marvel.com:443/v1/public/characters?ts=1&apikey=501d252bce4154b391c3e255c2876993&hash=44e3d767c9be976309eb21e2fa27764a&limit=50';
let urlChar = 'https://gateway.marvel.com:443/v1/public/characters/1017100?ts=1&apikey=501d252bce4154b391c3e255c2876993&hash=44e3d767c9be976309eb21e2fa27764a'

async function obtenerResultado() {
    try {
      const respuesta = await fetch(urlCharters);
      const datos = await respuesta.json();
      const heroes = datos.data.results;
      mostrarHeroes(heroes);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function mostrarHeroes(heroes) {
    const container = document.getElementById('contenedor');

    heroes.forEach(hero => {
      const card = document.createElement('div');
      card.className = 'card';
      card.addEventListener('click', () => mostrarModal(hero));

      const nombre = document.createElement('h2');
      nombre.textContent = hero.name;

      const imagen = document.createElement('img');
      imagen.src = `${hero.thumbnail.path}.${hero.thumbnail.extension}`;
      imagen.alt = hero.name;

      const button = document.createElement('button');
      button.addEventListener('click', () => mostrarModal(hero));
      button.className='btn-open-modal';
      button.textContent = 'Ver Detalles';
      button.addEventListener('click', () => mostrarModal(hero));



      card.appendChild(nombre);
      card.appendChild(imagen);
      card.appendChild(button);
      container.appendChild(card);
    });
  }

  function mostrarModal(hero) {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');

    modalContent.innerHTML = `
      <h2>${hero.name}</h2>
      <p>${hero.description || 'No description available.'}</p>
      <h3>Comics:</h3>
      <ul>
        ${hero.comics.items.map(comic => `<li>${comic.name}</li>`).join('')}
      </ul>
    `;

    modal.style.display = 'flex';

    modal.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  obtenerResultado();