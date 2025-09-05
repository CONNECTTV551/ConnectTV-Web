// nombre: sw.js
const CACHE_NAME = 'connect-tv-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/estilos.css',
  '/script.js',
  '/servicios.js', // <-- AÑADIDO EL NUEVO ARCHIVO DE SERVICIOS AL CACHÉ
  '/img/logo.png',
  '/img/estreno1.jpg',
  '/img/estreno2.jpg',
  '/img/estreno3.jpg',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css'
];

// Evento de instalación: se abre el caché y se añaden los archivos principales.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento fetch: intercepta las peticiones de red.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si el recurso está en caché, lo devuelve.
        if (response) {
          return response;
        }

        // Si no está en caché, hace la petición a la red.
        return fetch(event.request).then(
          response => {
            // Si la respuesta no es válida, la devuelve tal cual.
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clona la respuesta para poder guardarla en caché y devolverla al navegador.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Evento activate: limpia cachés antiguos si es necesario.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});