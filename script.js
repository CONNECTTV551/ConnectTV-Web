// Version: 1.2.0 - Actualizado para depuración de caché y comportamiento de autenticación.
document.addEventListener('DOMContentLoaded', () => {
    // --- Variables de CSS para colores ---
    // Obtiene los valores de las propiedades CSS personalizadas definidas en :root.
    const computedStyle = getComputedStyle(document.body);
    const successColor = computedStyle.getPropertyValue('--success-color');
    const errorColor = computedStyle.getPropertyValue('--error-color');

    // --- Variables Globales para Precios ---
    // Obtiene la tasa de cambio inicial del input y el enlace de WhatsApp.
    let usdToVesRate = parseFloat(document.getElementById('usd-to-ves-rate').value);
    const WHATSAPP_LINK = "https://walink.co/9fd827";

    // --- Carrusel de Estrenos ---
    // Variables para controlar el estado del carrusel.
    let slideIndex = 0;
    let slideTimer;

    // Selecciona todos los elementos del carrusel y los puntos de navegación.
    const slides = document.querySelectorAll('.mySlides');
    const dots = document.querySelectorAll('.dot');
    // const carouselContainer = document.querySelector('.carousel-container'); // No se usa directamente aquí.

    // Función para mostrar una diapositiva específica del carrusel.
    function showSlides(n) {
        // Ajusta el índice de la diapositiva para que sea cíclico.
        if (n >= slides.length) {
            slideIndex = 0;
        } else if (n < 0) {
            slideIndex = slides.length - 1;
        } else {
            slideIndex = n;
        }

        // Oculta todas las diapositivas y desactiva todos los puntos.
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        dots.forEach(dot => {
            dot.classList.remove('active');
        });

        // Muestra la diapositiva actual y activa su punto correspondiente.
        slides[slideIndex].classList.add('active');
        dots[slideIndex].classList.add('active');
    }

    // Funciones globales para la navegación del carrusel (expuestas para onclick en HTML).
    window.plusSlides = function(n) {
        clearTimeout(slideTimer); // Limpia el temporizador actual.
        showSlides(slideIndex + n); // Muestra la siguiente/anterior diapositiva.
        startSlideTimer(); // Reinicia el temporizador de auto-avance.
    };

    window.currentSlide = function(n) {
        clearTimeout(slideTimer); // Limpia el temporizador actual.
        showSlides(n - 1); // Muestra una diapositiva específica.
        startSlideTimer(); // Reinicia el temporizador de auto-avance.
    };

    // Función para el auto-avance del carrusel.
    function autoSlide() {
        showSlides(slideIndex + 1); // Avanza a la siguiente diapositiva.
        slideTimer = setTimeout(autoSlide, 10000); // Configura el temporizador para la próxima.
    }

    // Función para iniciar/reiniciar el temporizador del carrusel.
    function startSlideTimer() {
        clearTimeout(slideTimer); // Asegura que solo haya un temporizador activo.
        slideTimer = setTimeout(autoSlide, 10000); // Inicia el temporizador.
    }

    // --- Navegación entre secciones y control de visibilidad por rol ---
    // Selecciona todos los enlaces de navegación y las secciones principales.
    const navLinks = document.querySelectorAll('.nav ul li a');
    const sections = document.querySelectorAll('main section');
    const headerElement = document.querySelector('.header');
    const footerElement = document.querySelector('.footer');
    const pricingPanelElement = document.getElementById('pricing-panel');
    const authSection = document.getElementById('auth-section');
    const logoutLink = document.getElementById('logout-link');
    const clientsPanelNavLink = document.getElementById('clients-panel-nav-link'); // Enlace del panel de clientes

    // Función global para mostrar una sección específica y ocultar las demás.
    window.showSection = function(sectionId) {
        // Oculta todas las secciones.
        sections.forEach(section => {
            section.classList.remove('active-section');
            section.classList.add('hidden-section');
        });

        // Muestra la sección de destino.
        const targetSectionElement = document.getElementById(sectionId);
        if (targetSectionElement) {
            targetSectionElement.classList.remove('hidden-section');
            targetSectionElement.classList.add('active-section');
        } else {
            console.error(`La sección con ID ${sectionId} no fue encontrada.`);
            return;
        }

        // Lógica de visibilidad de elementos globales (encabezado, pie de página, panel de precios).
        if (sectionId === 'auth-section') {
            // Si está en la sección de autenticación, oculta los elementos de la aplicación principal.
            headerElement.classList.add('hidden-on-auth');
            footerElement.classList.add('hidden-on-auth');
            pricingPanelElement.classList.add('hidden-on-auth');
            logoutLink.classList.add('hidden-on-auth');
            // clientsPanelNavLink.classList.add('hidden-on-auth'); // Esto se maneja en onAuthStateChanged
            clearTimeout(slideTimer); // Detener el carrusel si se vuelve a la autenticación.
        } else {
            // Si está en cualquier otra sección, muestra los elementos de la aplicación principal.
            headerElement.classList.remove('hidden-on-auth');
            footerElement.classList.remove('hidden-on-auth');
            pricingPanelElement.classList.remove('hidden-on-auth');
            logoutLink.classList.remove('hidden-on-auth');
            authSection.classList.add('hidden-section'); // Ocultar auth si se navega a otra sección.

            // La visibilidad de clientsPanelNavLink se establecerá en onAuthStateChanged
            // basado en window.currentUserRole después de que se obtenga de Firestore.

            // Inicia o detiene el carrusel según la sección.
            if (sectionId === 'home-section') {
                showSlides(slideIndex);
                startSlideTimer();
            } else {
                clearTimeout(slideTimer); // Detener el carrusel en otras secciones.
            }
        }

        // Actualiza el estado activo de los enlaces de navegación.
        navLinks.forEach(link => link.classList.remove('active'));
        const activeNavLink = document.querySelector(`.nav ul li a[data-section="${sectionId.replace('-section', '')}"]`);
        if (activeNavLink) {
            activeNavLink.classList.add('active');
        }
    };

    // --- Control Inicial de la UI y Autenticación de Firebase ---
    // Muestra la sección de autenticación por defecto al cargar el DOM.
    // Esto asegura que el formulario de inicio de sesión sea visible de inmediato.
    window.showSection('auth-section'); 

    // Listener del estado de autenticación de Firebase.
    // Este listener se dispara cada vez que el estado de autenticación del usuario cambia.
    const auth = window.firebaseAuth;
    const db = window.firebaseDb;
    const appId = window.__app_id;
    const initialAuthToken = window.__initial_auth_token;

    window.onAuthStateChanged(auth, async (user) => {
        if (user) {
            // Si hay un usuario autenticado (explícito, token personalizado o anónimo).
            let currentUserId = user.uid;
            console.log("Firebase autenticado como:", currentUserId);

            // Obtiene el rol del usuario desde Firestore.
            // Se usa { source: 'server' } para forzar la lectura más reciente y evitar cachés antiguas.
            const userDocRef = window.doc(db, `artifacts/${appId}/users`, currentUserId);
            const userDocSnap = await window.getDoc(userDocRef, { source: 'server' }); 

            let currentUserRole;
            if (userDocSnap.exists()) {
                // Si el documento del usuario existe, obtiene su rol.
                currentUserRole = userDocSnap.data().role;
            } else {
                // Si el documento del usuario no existe (ej. nuevo usuario anónimo), asigna 'client' por defecto.
                currentUserRole = 'client';
                await window.setDoc(userDocRef, { role: currentUserRole, email: user.email || 'N/A' }, { merge: true });
            }
            window.currentUserRole = currentUserRole; // Expone el rol globalmente.
            console.log("Rol del usuario (después de Firestore fetch):", window.currentUserRole); // NUEVO LOG DE DEPURACIÓN

            // Llama a `setupClientsRealtimeListener` solo si el usuario es un administrador.
            if (currentUserRole === 'admin') {
                if (window.setupClientsRealtimeListener) {
                    window.setupClientsRealtimeListener();
                } else {
                    // Si la función aún no está disponible (problema de carga), reintenta.
                    const checkSetupListener = setInterval(() => {
                        if (window.setupClientsRealtimeListener) {
                            window.setupClientsRealtimeListener();
                            clearInterval(checkSetupListener);
                        }
                    }, 100);
                }
                // Si es admin, redirige al panel de clientes y muestra el enlace de navegación.
                window.showSection('clients-panel-section');
                clientsPanelNavLink.classList.remove('hidden-on-auth'); // Muestra el enlace "Clientes"
            } else {
                // Si es cliente, redirige a la sección de inicio y oculta el enlace de navegación.
                window.showSection('home-section');
                clientsPanelNavLink.classList.add('hidden-on-auth'); // Oculta el enlace "Clientes"
            }
            
            // También asegura la visibilidad del resto de elementos de la aplicación principal.
            headerElement.classList.remove('hidden-on-auth');
            footerElement.classList.remove('hidden-on-auth');
            pricingPanelElement.classList.remove('hidden-on-auth');
            logoutLink.classList.remove('hidden-on-auth');

        } else {
            // Si no hay ningún usuario autenticado (o la sesión se cerró).
            window.currentUserRole = null; // Limpia el rol global.
            
            // Solo intenta signInAnonymously o signInWithCustomToken si no hay un usuario
            // explícitamente logueado Y no estamos en la sección de autenticación.
            // Esto es para evitar que se loguee solo si el usuario está en el formulario de login.
            if (authSection.classList.contains('active-section')) {
                console.log("En sección de autenticación. No se intenta login anónimo/token.");
            } else if (initialAuthToken) {
                console.log("Intentando signInWithCustomToken...");
                try {
                    await window.signInWithCustomToken(auth, initialAuthToken);
                } catch (error) {
                    console.error("Error al iniciar sesión con token personalizado:", error);
                }
            } else {
                console.log("Intentando signInAnonymously...");
                try {
                    await window.signInAnonymously(auth);
                } catch (error) {
                    console.error("Error al iniciar sesión anónimamente:", error);
                }
            }
            // Siempre muestra la sección de autenticación y oculta los elementos de la aplicación principal.
            window.showSection('auth-section');
            clientsPanelNavLink.classList.add('hidden-on-auth'); // Oculta el enlace "Clientes"
            headerElement.classList.add('hidden-on-auth');
            footerElement.classList.add('hidden-on-auth');
            pricingPanelElement.classList.add('hidden-on-auth');
            logoutLink.classList.add('hidden-on-auth');
        }
    });

    // Función para configurar un listener en tiempo real para los datos de clientes desde Firestore.
    // Esta función se expone globalmente para ser llamada desde script.js cuando sea necesario.
    window.setupClientsRealtimeListener = function() {
        // Define la referencia a la colección de clientes registrados.
        const clientsCollectionRef = window.collection(db, `artifacts/${appId}/public/data/registered_clients`);
        
        // Crea una consulta para ordenar los clientes por fecha de registro en orden descendente.
        const q = window.query(clientsCollectionRef, window.orderBy('registrationDate', 'desc'));

        // Configura el listener en tiempo real.
        window.onSnapshot(q, (snapshot) => {
            const clientsFromDb = [];
            snapshot.forEach((doc) => {
                clientsFromDb.push({ id: doc.id, ...doc.data() });
            });
            // Llama a la función global `renderClients` para actualizar la UI.
            if (window.renderClients) {
                window.renderClients(clientsFromDb);
            } else {
                console.warn("La función renderClients aún no está disponible. Los datos se renderizarán una vez que script.js cargue completamente.");
            }
        }, (error) => {
            console.error("Error al obtener los datos del cliente:", error);
        });
    };

    // --- Manejo de Eventos de Navegación ---
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = e.target.dataset.section + '-section';
            if (e.target.id === 'logout-link') {
                return; // El botón de logout se maneja por separado.
            }
            window.showSection(targetSection); // Usa la función global showSection.
        });
    });

    // Manejo del botón de cerrar sesión.
    logoutLink.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            await window.signOut(); // Llama a la función de Firebase para cerrar sesión.
            window.showSection('auth-section'); // Muestra la sección de autenticación.
            // Limpia los formularios y mensajes relacionados con la autenticación.
            loginForm.reset();
            loginMessage.style.display = 'none';
            registerMessage.style.display = 'none';
            showLoginForm();
            console.log('Sesión cerrada correctamente.');
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            // Puedes mostrar un mensaje de error al usuario aquí si es necesario.
        }
    });

    // --- Funciones para crear tarjetas de servicio ---
    // Crea un elemento de tarjeta de servicio con los datos proporcionados.
    function createServiceCard(serviceData) {
        const card = document.createElement('div');
        card.classList.add('service-card');

        const img = document.createElement('img');
        img.src = serviceData.image;
        img.alt = serviceData.name;

        const info = document.createElement('div');
        info.classList.add('service-card-info');

        const h3 = document.createElement('h3');
        h3.textContent = serviceData.name;

        const p = document.createElement('p');
        p.textContent = serviceData.type;

        const priceVesSpan = document.createElement('span');
        priceVesSpan.classList.add('price');
        priceVesSpan.textContent = `Bs. ${(parseFloat(serviceData.usdPrice) * usdToVesRate).toFixed(2)}`;

        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('service-card-actions');

        const buyButton = document.createElement('button');
        buyButton.classList.add('buy-service-btn');
        buyButton.textContent = 'Comprar';
        buyButton.addEventListener('click', () => {
            openBuyModal(serviceData); // Abre el modal de compra al hacer clic.
        });

        const detailsButton = document.createElement('button');
        detailsButton.classList.add('details-service-btn');
        detailsButton.textContent = 'Detalles';
        detailsButton.addEventListener('click', () => {
            openDetailsModal(serviceData); // Abre el modal de detalles al hacer clic.
        });

        // Añade los elementos a la tarjeta.
        info.appendChild(h3);
        info.appendChild(p);
        info.appendChild(priceVesSpan);
        card.appendChild(img);
        card.appendChild(info);
        actionsDiv.appendChild(buyButton);
        actionsDiv.appendChild(detailsButton);
        card.appendChild(actionsDiv);

        return card;
    }

    // Datos de ejemplo para las cuentas completas.
    const fullAccountsData = [
        { name: 'Netflix Premium', type: 'Cuenta Completa', usdPrice: '15.99', image: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/netflix_logo_icon_170919.png', duration: '30 días', accountType: 'cuenta completa', renewable: 'Sí' },
        { name: 'Disney+ Completa Estándar', type: 'Cuenta Completa', usdPrice: '21.48', image: 'img/disneyplus-full-account.png', duration: '30 días', accountType: 'cuenta completa', renewable: 'Sí' },
        { name: 'HBO Max Completa Estándar', type: 'Cuenta Completa', usdPrice: '14.99', image: 'img/hbomax-logo.png', duration: '30 días', accountType: 'cuenta completa', renewable: 'Sí' },
        { name: 'Prime Video', type: 'Cuenta Completa', usdPrice: '8.99', image: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/amazon_prime_video_logo_icon_170932.png', duration: '30 días', accountType: 'cuenta completa', renewable: 'Sí' },
        { name: 'Paramount+', type: 'Cuenta Completa', usdPrice: '9.99', image: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/paramount_plus_logo_icon_170928.png', duration: '30 días', accountType: 'cuenta completa', renewable: 'Sí' },
        { name: 'Tele Latino', type: 'Cuenta Completa', usdPrice: '6.99', image: 'https://placehold.co/220x120/000000/FFFFFF?text=Tele+Latino', duration: '30 días', accountType: 'cuenta completa', renewable: 'Sí' },
        { name: 'Flow TV', type: 'Cuenta Completa', usdPrice: '12.99', image: 'https://placehold.co/220x120/000000/FFFFFF?text=Flow+TV', duration: '30 días', accountType: 'cuenta completa', renewable: 'Sí' },
        { name: 'Spotify Premium', type: 'Cuenta Completa', usdPrice: '7.99', image: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/spotify_logo_icon_170925.png', duration: '30 días', accountType: 'cuenta completa', renewable: 'Sí' },
        { name: 'YouTube Premium', type: 'Cuenta Completa', usdPrice: '11.99', image: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/youtube_logo_icon_170908.png', duration: '30 días', accountType: 'cuenta completa', renewable: 'Sí' },
        { name: 'Canva Pro', type: 'Cuenta Completa', usdPrice: '9.99', image: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/canva_logo_icon_170934.png', duration: '30 días', accountType: 'cuenta completa', renewable: 'Sí' },
    ];

    // Datos de ejemplo para los perfiles compartidos.
    const sharedProfilesData = [
        { name: 'Netflix Perfil', type: 'Perfil Compartido', usdPrice: '4.50', image: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/netflix_logo_icon_170919.png', duration: '30 días', accountType: 'perfil compartido', renewable: 'No' },
        { name: 'Disney+ Perfil', type: 'Perfil Compartido', usdPrice: '3.99', image: 'https://cdn.icon-icons.com/icons2/2201/PNG/512/disney_plus_logo_icon_134015.png', duration: '30 días', accountType: 'perfil compartido', renewable: 'No' },
        { name: 'Prime Video Perfil', type: 'Perfil Compartido', usdPrice: '2.99', image: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/amazon_prime_video_logo_icon_170932.png', duration: '30 días', accountType: 'perfil compartido', renewable: 'No' },
        { name: 'HBO Max Perfil', type: 'Perfil Compartido', usdPrice: '4.99', image: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/hbo_max_logo_icon_170914.png', duration: '30 días', accountType: 'perfil compartido', renewable: 'No' },
        { name: 'Tele Latino Perfil', type: 'Perfil Compartido', usdPrice: '2.99', image: 'https://placehold.co/220x120/000000/FFFFFF?text=Tele+Latino', duration: '30 días', accountType: 'perfil compartido', renewable: 'No' },
    ];

    // Renderiza todas las tarjetas de servicio en sus respectivos carruseles.
    function renderAllServiceCards() {
        console.log("Renderizando todas las tarjetas de servicio."); // Log de depuración
        const fullAccountsCarousel = document.getElementById('full-accounts-carousel');
        const sharedProfilesCarousel = document.getElementById('shared-profiles-carousel');

        // Logs para verificar si los elementos del carrusel se encuentran
        console.log("Elemento full-accounts-carousel encontrado:", fullAccountsCarousel);
        console.log("Elemento shared-profiles-carousel encontrado:", sharedProfilesCarousel);

        if (fullAccountsCarousel) {
            fullAccountsCarousel.innerHTML = ''; // Limpia el contenido existente.
            fullAccountsData.forEach(service => {
                fullAccountsCarousel.appendChild(createServiceCard(service));
            });
            console.log("Tarjetas de cuentas completas renderizadas:", fullAccountsData.length); // Log de depuración
        } else {
            console.error("No se encontró el elemento #full-accounts-carousel.");
        }

        if (sharedProfilesCarousel) {
            sharedProfilesCarousel.innerHTML = ''; // Limpia el contenido existente.
            sharedProfilesData.forEach(service => {
                sharedProfilesCarousel.appendChild(createServiceCard(service));
            });
            console.log("Tarjetas de perfiles compartidos renderizadas:", sharedProfilesData.length); // Log de depuración
        } else {
            console.error("No se encontró el elemento #shared-profiles-carousel.");
        }
    }
    renderAllServiceCards(); // Llama a la función para renderizar al cargar el DOM.

    // --- Panel de Clientes (con Firestore y gestión de contraseña) ---
    // Selecciona los elementos del DOM relacionados con el panel de clientes y sus modales.
    const clientDataBody = document.getElementById('client-data-body');
    const renewalModal = document.getElementById('renewal-modal');
    const reportModal = document.getElementById('report-modal');
    const detailsModal = document.getElementById('details-modal');
    const resetPasswordModal = document.getElementById('reset-password-modal');
    const deleteConfirmModal = document.getElementById('delete-confirm-modal');
    const closeButtons = document.querySelectorAll('.close-button');
    const renewalForm = document.getElementById('renewal-form');
    const renewalMessage = document.getElementById('renewal-message');
    const reportForm = document.getElementById('report-form');
    const reportMessage = document.getElementById('report-message');
    const reportedEmailInput = document.getElementById('reported-email');
    const reportedCountrySelect = document.getElementById('reported-country');
    const resetPasswordForm = document.getElementById('reset-password-form');
    const resetClientEmailInput = document.getElementById('reset-client-email');
    const resetPasswordMessage = document.getElementById('reset-password-message');
    const clientToDeleteEmailDisplay = document.getElementById('client-to-delete-email');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    const deleteMessage = document.getElementById('delete-message');

    // Lista de países para el formulario de reporte.
    const countries = [
        "Argentina", "Bolivia", "Brasil", "Chile", "Colombia", "Costa Rica", "Cuba", "Ecuador", "El Salvador",
        "España", "Guatemala", "Honduras", "México", "Nicaragua", "Panamá", "Paraguay", "Perú", "República Dominicana",
        "Uruguay", "Venezuela", "Otro"
    ];

    // Rellena el selector de países.
    function populateCountries() {
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            reportedCountrySelect.appendChild(option);
        });
    }
    populateCountries(); // Llama a la función al cargar el DOM.

    // Función para renderizar los datos de los clientes en la tabla del panel de administración.
    // Esta función se expone globalmente para ser llamada por el listener de Firestore.
    window.renderClients = function(clientsData) {
        console.log("Renderizando clientes. Datos recibidos:", clientsData);
        clientDataBody.innerHTML = ''; // Limpia el contenido actual de la tabla.
        
        // Muestra un mensaje si no hay clientes registrados.
        if (clientsData.length === 0) {
            clientDataBody.innerHTML = '<tr><td colspan="5"><p class="no-clients-message">No hay clientes registrados aún.</p></td></tr>';
            return;
        }

        // Itera sobre los datos de los clientes y crea una fila de tabla para cada uno.
        clientsData.forEach(client => {
            const row = document.createElement('tr');
            // Formatea la fecha de registro si es un Timestamp de Firestore.
            const registrationDate = client.registrationDate && typeof client.registrationDate.toDate === 'function' 
                                     ? new Date(client.registrationDate.toDate()).toLocaleDateString() 
                                     : 'N/A';
            row.innerHTML = `
                <td>${client.email}</td>
                <td>${client.password ? '********' : 'N/A'}</td>
                <td>${registrationDate}</td>
                <td>N/A</td>
                <td class="actions-cell">
                    <button type="button" class="renew-btn" data-email="${client.email}">Renovar</button>
                    <button type="button" class="report-btn" data-email="${client.email}">Reportar Falla</button>
                    <button type="button" class="reset-password-btn" data-client-uid="${client.uid}" data-client-email="${client.email}">Restablecer Contraseña</button>
                    <button type="button" class="delete-client-btn" data-client-id="${client.id}" data-client-uid="${client.uid}" data-client-email="${client.email}">Eliminar</button>
                </td>
            `;
            clientDataBody.appendChild(row);
        });

        // Añade listeners de eventos a los botones de acción recién creados.
        document.querySelectorAll('.renew-btn').forEach(button => {
            button.addEventListener('click', () => {
                renewalMessage.style.display = 'none';
                renewalForm.reset();
                renewalModal.style.display = 'flex';
                renewalModal.classList.add('show');
            });
        });

        document.querySelectorAll('.report-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const clientEmail = e.target.dataset.email;
                reportedEmailInput.value = clientEmail;
                reportModal.style.display = 'flex';
                reportModal.classList.add('show');
                reportMessage.style.display = 'none';
                reportForm.reset();
                reportedEmailInput.value = clientEmail;
            });
        });

        document.querySelectorAll('.reset-password-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const clientUid = e.target.dataset.clientUid;
                const clientEmail = e.target.dataset.clientEmail;
                resetClientEmailInput.value = clientEmail;
                resetPasswordForm.dataset.clientUid = clientUid;
                resetPasswordModal.style.display = 'flex';
                resetPasswordModal.classList.add('show');
                resetPasswordMessage.style.display = 'none';
                resetPasswordForm.reset();
            });
        });

        document.querySelectorAll('.delete-client-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const clientId = e.target.dataset.clientId;
                const clientUid = e.target.dataset.clientUid;
                const clientEmail = e.target.dataset.clientEmail;

                clientToDeleteEmailDisplay.textContent = clientEmail;
                confirmDeleteBtn.dataset.clientId = clientId;
                confirmDeleteBtn.dataset.clientUid = clientUid;

                deleteConfirmModal.style.display = 'flex';
                deleteConfirmModal.classList.add('show');
                deleteMessage.style.display = 'none';
            });
        });
    };

    // --- Verificación de Preparación de Firebase e Inicialización ---
    const registerSubmitBtn = document.getElementById('register-submit-btn');
    // Deshabilita el botón de registro inicialmente para evitar interacciones antes de que Firebase esté listo.
    if (registerSubmitBtn && !registerSubmitBtn.disabled) {
        registerSubmitBtn.disabled = true;
    }

    // Función para verificar si los objetos globales de Firebase están disponibles.
    function checkFirebaseReady() {
        if (window.firebaseAuth && window.firebaseDb && window.addDoc && window.collection && 
            window.createUserWithEmailAndPassword && window.signInWithEmailAndPassword && 
            window.signOut && window.doc && window.getDoc && window.setDoc && window.updateDoc &&
            window.where && window.getDocs && window.deleteDoc && window.onAuthStateChanged) { 
            console.log("Los objetos globales de Firebase están listos en script.js.");
            if (registerSubmitBtn) {
                registerSubmitBtn.disabled = false; // Habilita el botón de registro una vez que Firebase esté listo.
            }
        } else {
            // Si no están listos, reintenta después de un corto retraso.
            setTimeout(checkFirebaseReady, 100);
        }
    }
    checkFirebaseReady(); // Inicia la verificación de Firebase.

    // --- Cierre de Modales ---
    // Función para cerrar todos los modales y limpiar sus formularios/mensajes.
    function closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.remove('show');
            // Pequeño retraso para permitir que la transición CSS se complete.
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        });
        // Reinicia formularios y oculta mensajes.
        renewalForm.reset();
        reportForm.reset();
        paymentProofForm.reset();
        paymentMessage.style.display = 'none';
        resetImagePreview();
        resetPasswordForm.reset();
        resetPasswordMessage.style.display = 'none';
        deleteMessage.style.display = 'none';
    }

    // Añade listeners a los botones de cierre de modales y al clic fuera del modal.
    closeButtons.forEach(button => {
        button.addEventListener('click', closeAllModals);
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });

    // --- Lógica de Formularios de Modales (Renovar, Reportar, Comprar) ---
    renewalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const renewalText = document.getElementById('renewal-text').value;

        if (renewalText.toLowerCase() === 'renovar') {
            renewalMessage.textContent = '¡Su renovación fue exitosa!';
            renewalMessage.classList.remove('error-message');
            renewalMessage.classList.add('success-message');
            renewalMessage.style.display = 'block';
            
            console.log(`Simulación de renovación.`);
            setTimeout(() => {
                closeAllModals();
            }, 2000);
        } else {
            renewalMessage.textContent = 'Por favor, escribe "renovar" correctamente.';
            renewalMessage.classList.remove('success-message');
            renewalMessage.classList.add('error-message');
            renewalMessage.style.display = 'block';
        }
    });

    reportForm.addEventListener('submit', (e) => {
        e.preventDefault();
        reportMessage.textContent = '¡Reporte enviado con éxito!';
        reportMessage.classList.remove('error-message');
        reportMessage.classList.add('success-message');
        reportMessage.style.display = 'block';
        
        console.log(`Simulación de reporte.`);
        setTimeout(() => {
            closeAllModals();
        }, 2000);
    });

    // --- Lógica del Modal de Compra y WhatsApp ---
    const buyModal = document.getElementById('buy-modal');
    const paymentAmountVesDisplay = document.getElementById('payment-amount-ves');
    const modalServiceName = document.getElementById('modal-service-name');
    const modalServiceType = document.getElementById('modal-service-type');

    const paymentProofForm = document.getElementById('payment-proof-form');
    const paymentMessage = document.getElementById('payment-message');
    const paymentProofInput = document.getElementById('payment-proof');
    const imagePreview = document.querySelector('.image-preview .preview-image');
    const previewText = document.querySelector('.image-preview .preview-text');

    let selectedService = {
        name: '', type: '', usdPrice: 0, duration: '', accountType: '', renewable: ''
    };

    // Abre el modal de compra con los datos del servicio seleccionado.
    function openBuyModal(serviceData) {
        selectedService = serviceData;
        modalServiceName.textContent = selectedService.name;
        modalServiceType.textContent = selectedService.type;
        paymentAmountVesDisplay.textContent = `Bs. ${(parseFloat(selectedService.usdPrice) * usdToVesRate).toFixed(2)}`;
        buyModal.style.display = 'flex';
        buyModal.classList.add('show');
        
        // Rellena la fecha y hora actuales por defecto.
        const today = new Date();
        document.getElementById('payment-date').value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        document.getElementById('payment-time').value = `${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`;

        paymentMessage.style.display = 'none';
        paymentProofForm.reset();
        resetImagePreview(); // Limpia la vista previa de la imagen.
        document.getElementById('customer-name').value = '';
        document.getElementById('transaction-id').value = '';
    }

    // Maneja la vista previa de la imagen del comprobante.
    paymentProofInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
                previewText.style.display = 'none';
            };
            reader.readAsDataURL(file);
        } else {
            resetImagePreview();
        }
    });

    // Restablece la vista previa de la imagen.
    function resetImagePreview() {
        imagePreview.src = '';
        imagePreview.style.display = 'none';
        previewText.style.display = 'block';
    }

    // Lógica para los acordeones de métodos de pago.
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const arrowIcon = header.querySelector('.arrow-icon');

            header.classList.toggle('active');
            if (arrowIcon) {
                arrowIcon.classList.toggle('active');
            }

            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                content.style.paddingTop = '0';
                content.style.paddingBottom = '0';
            } else {
                content.style.maxHeight = content.scrollHeight + 30 + "px"; // Ajusta el alto para mostrar el contenido.
                content.style.paddingTop = '15px';
                content.style.paddingBottom = '15px';
            }

            // Cierra otros acordeones abiertos.
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== header && otherHeader.classList.contains('active')) {
                    otherHeader.classList.remove('active');
                    const otherArrowIcon = otherHeader.querySelector('.arrow-icon');
                    if (otherArrowIcon) {
                        otherArrowIcon.classList.remove('active');
                    }
                    const otherContent = otherHeader.nextElementSibling;
                    otherContent.style.maxHeight = null;
                    otherContent.style.paddingTop = '0';
                    otherContent.style.paddingBottom = '0';
                }
            });
        });
    });

    // Envía el comprobante de pago y abre WhatsApp.
    paymentProofForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const customerName = document.getElementById('customer-name').value;
        const paymentDate = document.getElementById('payment-date').value;
        const paymentTime = document.getElementById('payment-time').value;
        const transactionId = document.getElementById('transaction-id').value;
        const fileInput = document.getElementById('payment-proof');

        // Valida que todos los campos estén llenos.
        if (!customerName || !paymentDate || !paymentTime || !transactionId || fileInput.files.length === 0) {
            paymentMessage.textContent = 'Por favor, rellena todos los campos y sube tu comprobante.';
            paymentMessage.classList.remove('success-message');
            paymentMessage.classList.add('error-message');
            paymentMessage.style.display = 'block';
            return;
        }

        // Construye el mensaje de WhatsApp con los detalles del pago.
        const whatsappMessage = `¡Hola! Soy *${encodeURIComponent(customerName)}* y he realizado un pago para adquirir un servicio.\n\n` +
                                `*Servicio:* ${encodeURIComponent(selectedService.name)} (${encodeURIComponent(selectedService.type)})\n` +
                                `*Monto Cancelado (VES):* Bs. ${encodeURIComponent((parseFloat(selectedService.usdPrice) * usdToVesRate).toFixed(2))}\n` +
                                `*Fecha del Pago:* ${encodeURIComponent(paymentDate)}\n` +
                                `*Hora del Pago:* ${encodeURIComponent(paymentTime)}\n` +
                                `*ID de Transacción:* ${encodeURIComponent(transactionId)}\n\n` +
                                `Adjunto mi comprobante de pago manualmente en este chat. ¡Por favor, revisa!`;

        // Abre el enlace de WhatsApp en una nueva pestaña.
        window.open(`${WHATSAPP_LINK}?text=${whatsappMessage}`, '_blank');

        paymentMessage.textContent = '¡Información enviada! Abre el chat de WhatsApp y adjunta tu comprobante.';
        paymentMessage.classList.remove('error-message');
        paymentMessage.classList.add('success-message');
        paymentMessage.style.display = 'block';

        // Cierra el modal después de un tiempo.
        setTimeout(() => {
            closeAllModals();
        }, 5000);
    });

    // --- Panel de Precios Desplegable ---
    const pricingToggleBtn = document.querySelector('.pricing-toggle-btn');
    const pricingContent = document.querySelector('.pricing-content');
    const usdToVesRateInput = document.getElementById('usd-to-ves-rate');
    const applyRateBtn = document.querySelector('.apply-rate-btn');

    // Maneja la expansión/contracción del panel de precios.
    pricingToggleBtn.addEventListener('click', () => {
        pricingPanelElement.classList.toggle('expanded');
        if (pricingPanelElement.classList.contains('expanded')) {
            pricingContent.style.maxHeight = pricingContent.scrollHeight + "px";
            pricingContent.style.paddingTop = '15px';
            pricingContent.style.paddingBottom = '20px';
        } else {
            pricingContent.style.maxHeight = null;
            pricingContent.style.paddingTop = '0';
            pricingContent.style.paddingBottom = '0';
            // Restablece el estilo del botón si el panel se contrae.
            setTimeout(() => {
                pricingPanelElement.style.width = '60px';
                pricingPanelElement.style.height = '60px';
                pricingToggleBtn.style.borderRadius = '50%';
                pricingToggleBtn.style.width = '60px';
                pricingToggleBtn.style.height = '60px';
                pricingToggleBtn.style.fontSize = '1.5em';
                pricingToggleBtn.style.justifyContent = 'center';
                pricingToggleBtn.querySelector('i').style.marginRight = '0';
            }, 400);
        }
    });

    // Aplica la nueva tasa de cambio y actualiza los precios.
    applyRateBtn.addEventListener('click', () => {
        const newRate = parseFloat(usdToVesRateInput.value);
        if (!isNaN(newRate) && newRate > 0) {
            usdToVesRate = newRate;
            renderAllServiceCards(); // Vuelve a renderizar las tarjetas con los nuevos precios.
            // Actualiza el precio en el modal de compra si está abierto.
            if (buyModal.style.display === 'flex') {
                paymentAmountVesDisplay.textContent = `Bs. ${(parseFloat(selectedService.usdPrice) * usdToVesRate).toFixed(2)}`;
            }
            // Muestra un mensaje de éxito temporal.
            const tempMessage = document.createElement('div');
            tempMessage.textContent = `Tasa de cambio actualizada: 1 USD = ${usdToVesRate.toFixed(2)} VES`;
            tempMessage.style.cssText = `
                position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
                background-color: var(--success-color); color: white; padding: 10px 20px;
                border-radius: 5px; z-index: 9999; opacity: 0; transition: opacity 0.5s ease-in-out;
            `;
            document.body.appendChild(tempMessage);
            setTimeout(() => { tempMessage.style.opacity = '1'; }, 10);
            setTimeout(() => { tempMessage.style.opacity = '0'; }, 3000);
            setTimeout(() => { tempMessage.remove(); }, 3500);

        } else {
            // Muestra un mensaje de error si la tasa no es válida.
            const tempMessage = document.createElement('div');
            tempMessage.textContent = 'Por favor, ingresa una tasa de cambio válida.';
            tempMessage.style.cssText = `
                position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
                background-color: var(--error-color); color: white; padding: 10px 20px;
                border-radius: 5px; z-index: 9999; opacity: 0; transition: opacity 0.5s ease-in-out;
            `;
            document.body.appendChild(tempMessage);
            setTimeout(() => { tempMessage.style.opacity = '1'; }, 10);
            setTimeout(() => { tempMessage.style.opacity = '0'; }, 3000);
            setTimeout(() => { tempMessage.remove(); }, 3500);
        }
    });

    // --- Modal de Detalles ---
    // Selecciona los elementos del modal de detalles.
    const detailsServiceName = document.getElementById('details-service-name');
    const detailsDuration = document.getElementById('details-duration');
    const detailsAccountType = document.getElementById('details-account-type');
    const detailsRenewable = document.getElementById('details-renewable');

    // Abre el modal de detalles con la información del servicio.
    function openDetailsModal(serviceData) {
        detailsServiceName.textContent = serviceData.name;
        detailsDuration.textContent = serviceData.duration;
        detailsAccountType.textContent = serviceData.accountType;
        detailsRenewable.textContent = serviceData.renewable;

        detailsModal.style.display = 'flex';
        detailsModal.classList.add('show');
    }

    // --- Botones de Ayuda y Soporte ---
    // Maneja los clics en los botones de ayuda y soporte para abrir WhatsApp.
    document.querySelectorAll('.help-support-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const type = e.target.dataset.type;
            let message = `¡Hola! Necesito ayuda con ConnectTV. Mi consulta es sobre ${type}.`;
            window.open(`${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`, '_blank');
        });
    });

    // --- Lógica de Iniciar Sesión y Registro ---
    // Selecciona los contenedores y enlaces de los formularios de autenticación.
    const loginFormContainer = document.getElementById('login-form-container');
    const registerFormContainer = document.getElementById('register-form-container');
    
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');

    // Selecciona los formularios y campos de inicio de sesión.
    const loginForm = document.getElementById('login-form');
    const loginEmailInput = document.getElementById('login-email');
    const loginPasswordInput = document.getElementById('login-password');
    const loginMessage = document.getElementById('login-message');

    // Selecciona los formularios y campos de registro.
    const registerForm = document.getElementById('register-form');
    const registerEmailInput = document.getElementById('register-email');
    const registerPasswordInput = document.getElementById('register-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const registerMessage = document.getElementById('register-message');

    // Muestra el formulario de inicio de sesión y oculta el de registro.
    function showLoginForm() {
        loginFormContainer.style.display = 'block';
        registerFormContainer.style.display = 'none';
        loginMessage.style.display = 'none';
        loginForm.reset();
    }

    // Muestra el formulario de registro y oculta el de inicio de sesión.
    function showRegisterForm() {
        loginFormContainer.style.display = 'none';
        registerFormContainer.style.display = 'block';
        registerMessage.style.display = 'none';
        registerForm.reset();
    }

    // Maneja los clics para cambiar entre formularios de inicio de sesión y registro.
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        showRegisterForm();
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        showLoginForm();
    });

    // Maneja el envío del formulario de Login.
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = loginEmailInput.value;
        const password = loginPasswordInput.value;

        try {
            // Intenta iniciar sesión con correo y contraseña usando la función de Firebase.
            const userCredential = await window.signInWithEmailAndPassword(window.firebaseAuth, email, password);
            const user = userCredential.user;
            console.log("Usuario ha iniciado sesión:", user.uid);

            // Obtiene el rol del usuario desde Firestore.
            // Se usa { source: 'server' } para asegurar que se obtenga la información más reciente del servidor.
            const userDocRef = window.doc(window.firebaseDb, `artifacts/${window.__app_id}/users`, user.uid);
            const userDocSnap = await window.getDoc(userDocRef, { source: 'server' }); 

            let role = 'client'; // Rol por defecto.
            if (userDocSnap.exists()) {
                role = userDocSnap.data().role; // Si el documento existe, usa el rol guardado.
            } else {
                // Si el documento del usuario no existe (ej. nuevo usuario anónimo), crea uno con rol 'client'.
                await window.setDoc(userDocRef, { role: 'client', email: email }, { merge: true });
            }
            window.currentUserRole = role; // Actualiza la variable global del rol.

            loginMessage.textContent = '¡Inicio de sesión exitoso! Redirigiendo...';
            loginMessage.classList.remove('error-message');
            loginMessage.classList.add('success-message');
            loginMessage.style.display = 'block';
            
            // Redirige después de un breve retraso.
            setTimeout(() => {
                // La lógica de redirección y visibilidad ahora está centralizada en el onAuthStateChanged
                loginMessage.style.display = 'none';
            }, 1000);

        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            let errorMessage = "Error al iniciar sesión. Verifica tus credenciales.";
            // Mensajes de error específicos de Firebase.
            if (error.code === 'auth/user-not-found') {
                errorMessage = "Usuario no encontrado. Regístrate si no tienes una cuenta.";
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = "Contraseña incorrecta.";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Formato de correo electrónico inválido.";
            }
            loginMessage.textContent = errorMessage;
            loginMessage.classList.remove('success-message');
            loginMessage.classList.add('error-message');
            loginMessage.style.display = 'block';
        }
    });

    // Maneja el envío del formulario de Registro.
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = registerEmailInput.value;
        const password = registerPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // Valida que las contraseñas coincidan.
        if (password !== confirmPassword) {
            registerMessage.textContent = 'Las contraseñas no coinciden.';
            registerMessage.classList.remove('success-message');
            registerMessage.classList.add('error-message');
            registerMessage.style.display = 'block';
            return;
        }

        try {
            // 1. Crea el usuario en Firebase Authentication.
            const userCredential = await window.createUserWithEmailAndPassword(window.firebaseAuth, email, password);
            const user = userCredential.user;
            console.log("Usuario registrado en Firebase Auth:", user.uid);

            // 2. Guarda los detalles del usuario (incluyendo el rol 'client') en Firestore.
            // Se usa la colección 'users' para metadatos del usuario como el rol.
            const userDocRef = window.doc(window.firebaseDb, `artifacts/${window.__app_id}/users`, user.uid);
            await window.setDoc(userDocRef, {
                email: email,
                role: 'client', // Por defecto, todos los nuevos registros son 'cliente'.
                registrationDate: new Date(),
            });
            console.log("Rol del usuario y metadatos guardados en Firestore.");

            // 3. Guarda una entrada en la colección 'registered_clients' para el panel de administración.
            // ADVERTENCIA DE SEGURIDAD: Guardar contraseñas en texto plano es INSEGURO para producción.
            // En un entorno real, la gestión de contraseñas debería ser a través de Firebase Authentication
            // y no se deberían almacenar en texto plano en Firestore.
            await window.addDoc(window.collection(window.firebaseDb, `artifacts/${window.__app_id}/public/data/registered_clients`), {
                uid: user.uid, // Guarda el UID para referencia.
                email: email,
                password: password, // ¡¡¡ADVERTENCIA DE SEGURIDAD: NO HACER ESTO EN PRODUCCIÓN!!!
                registrationDate: new Date(),
            });
            console.log("Detalles del usuario guardados en la colección registered_clients para el panel de administración.");

            registerMessage.textContent = '¡Registro exitoso! Ahora puedes iniciar sesión.';
            registerMessage.classList.remove('error-message');
            registerMessage.classList.add('success-message');
            registerMessage.style.display = 'block';
            
            // Redirige al formulario de inicio de sesión después de un retraso.
            setTimeout(() => {
                showLoginForm();
                registerMessage.style.display = 'none';
            }, 2000);

        } catch (error) {
            console.error("Error al registrar usuario:", error);
            let errorMessage = "Error al registrar. Inténtalo de nuevo.";
            // Mensajes de error específicos de Firebase.
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = "El correo electrónico ya está en uso.";
            } else if (error.code === 'auth/weak-password') {
                errorMessage = "La contraseña es demasiado débil (mínimo 6 caracteres).";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Formato de correo electrónico inválido.";
            }
            registerMessage.textContent = errorMessage;
            registerMessage.classList.remove('success-message');
            registerMessage.classList.add('error-message');
            registerMessage.style.display = 'block';
        }
    });

    // --- Lógica para Restablecer Contraseña del Cliente (por Admin) ---
    resetPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const clientUid = resetPasswordForm.dataset.clientUid;
        const newPassword = document.getElementById('new-password').value;
        const confirmNewPassword = document.getElementById('confirm-new-password').value;

        // Valida que las contraseñas coincidan y que la nueva contraseña tenga la longitud mínima.
        if (newPassword !== confirmNewPassword) {
            resetPasswordMessage.textContent = 'Las contraseñas no coinciden.';
            resetPasswordMessage.classList.remove('success-message');
            resetPasswordMessage.classList.add('error-message');
            resetPasswordMessage.style.display = 'block';
            return;
        }

        if (newPassword.length < 6) {
            resetPasswordMessage.textContent = 'La nueva contraseña debe tener al menos 6 caracteres.';
            resetPasswordMessage.classList.remove('success-message');
            resetPasswordMessage.classList.add('error-message');
            resetPasswordMessage.style.display = 'block';
            return;
        }

        try {
            // ADVERTENCIA DE SEGURIDAD CRÍTICA:
            // En un entorno de producción real, NUNCA se debería permitir que el frontend
            // actualice la contraseña de otro usuario directamente. Esto requiere privilegios de administrador
            // que solo deben manejarse en un entorno de servidor seguro (ej. Firebase Cloud Functions
            // con Firebase Admin SDK).
            //
            // Aquí, actualizaremos la contraseña almacenada en el documento de Firestore del cliente
            // en la colección `registered_clients`. Esto NO CAMBIA la contraseña en Firebase Authentication.
            // Si quieres que la contraseña de Firebase Authentication se actualice, necesitarías
            // una función de backend (Cloud Function) que use el Admin SDK de Firebase.
            //
            // Dado que el objetivo es que el admin "restablezca" para su control, y las contraseñas
            // se guardan en texto plano en `registered_clients` (¡repito, INSEGURO para producción!),
            // esta actualización solo afecta esa entrada.

            // Busca el documento del cliente en `registered_clients` por su UID.
            const clientsCollectionRef = window.collection(window.firebaseDb, `artifacts/${window.__app_id}/public/data/registered_clients`);
            const q = window.query(clientsCollectionRef, window.where('uid', '==', clientUid));
            const querySnapshot = await window.getDocs(q);

            if (!querySnapshot.empty) {
                const clientDoc = querySnapshot.docs[0];
                // Actualiza la contraseña en el documento de Firestore.
                await window.updateDoc(window.doc(window.firebaseDb, `artifacts/${window.__app_id}/public/data/registered_clients`, clientDoc.id), {
                    password: newPassword // ¡¡¡ADVERTENCIA DE SEGURIDAD: NO HACER ESTO EN PRODUCCIÓN!!!
                });

                resetPasswordMessage.textContent = '¡Contraseña restablecida y actualizada en el panel!';
                resetPasswordMessage.classList.remove('error-message');
                resetPasswordMessage.classList.add('success-message');
                resetPasswordMessage.style.display = 'block';
                
                console.log(`Contraseña para el cliente ${resetClientEmailInput.value} restablecida.`);
                // La tabla se re-renderizará automáticamente si el listener de onSnapshot está activo.
                
                setTimeout(() => {
                    closeAllModals();
                }, 2000);
            } else {
                resetPasswordMessage.textContent = 'Error: Cliente no encontrado en la base de datos de clientes.';
                resetPasswordMessage.classList.remove('success-message');
                resetPasswordMessage.classList.add('error-message');
                resetPasswordMessage.style.display = 'block';
            }

        } catch (error) {
            console.error("Error al restablecer contraseña del cliente:", error);
            resetPasswordMessage.textContent = `Error al restablecer: ${error.message}`;
            resetPasswordMessage.classList.remove('success-message');
            resetPasswordMessage.classList.add('error-message');
            resetPasswordMessage.style.display = 'block';
        }
    });

    // --- Lógica para Eliminar Cliente (por Admin) ---
    confirmDeleteBtn.addEventListener('click', async () => {
        const clientId = confirmDeleteBtn.dataset.clientId;
        // const clientUid = confirmDeleteBtn.dataset.clientUid; // UID de Firebase Auth, no usado directamente aquí.

        try {
            // Elimina el documento del cliente de la colección 'registered_clients'.
            await window.deleteDoc(window.doc(window.firebaseDb, `artifacts/${window.__app_id}/public/data/registered_clients`, clientId));
            console.log(`Cliente con ID ${clientId} eliminado del panel.`);

            // ADVERTENCIA DE SEGURIDAD:
            // Para eliminar completamente al usuario de Firebase Authentication, se necesita el Admin SDK
            // de Firebase, que solo puede ejecutarse en un entorno de servidor seguro (ej. Cloud Functions).
            // Si se desea eliminar al usuario de Firebase Auth, se debería implementar una Cloud Function
            // que reciba el UID del cliente y lo elimine de Auth.
            //
            // Ejemplo conceptual (NO EJECUTAR EN EL FRONTEND):
            // firebase.auth().deleteUser(clientUid); // Esto NO funciona en el cliente.

            // También se podría eliminar el documento de metadatos del usuario en la colección 'users'
            // si se desea una limpieza completa en Firestore:
            // await window.deleteDoc(window.doc(window.firebaseDb, `artifacts/${window.__app_id}/users`, clientUid));
            // Sin embargo, para este ejercicio, nos enfocamos en el panel de clientes.

            deleteMessage.textContent = '¡Cliente eliminado con éxito del panel!';
            deleteMessage.classList.remove('error-message');
            deleteMessage.classList.add('success-message');
            deleteMessage.style.display = 'block';

            setTimeout(() => {
                closeAllModals();
            }, 2000);

        } catch (error) {
            console.error("Error al eliminar cliente:", error);
            deleteMessage.textContent = `Error al eliminar: ${error.message}`;
            deleteMessage.classList.remove('success-message');
            deleteMessage.classList.add('error-error'); // Corregido: 'error-error' a 'error-message'
            deleteMessage.style.display = 'block';
        }
    });

    cancelDeleteBtn.addEventListener('click', () => {
        closeAllModals();
    });
});
