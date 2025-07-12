document.addEventListener('DOMContentLoaded', () => {
    // --- Variables de CSS para colores ---
    const computedStyle = getComputedStyle(document.body);
    const successColor = computedStyle.getPropertyValue('--success-color');
    const errorColor = computedStyle.getPropertyValue('--error-color');

    // --- Variables Globales para Precios ---
    let usdToVesRate = parseFloat(document.getElementById('usd-to-ves-rate').value); // Tasa de cambio inicial
    const WHATSAPP_LINK = "https://walink.co/9fd827"; // Tu enlace de WhatsApp

    // --- Carrusel de Estrenos ---
    let slideIndex = 0;
    let slideTimer;

    const slides = document.querySelectorAll('.mySlides');
    const dots = document.querySelectorAll('.dot');
    const carouselContainer = document.querySelector('.carousel-container');

    function showSlides(n) {
        if (n >= slides.length) {
            slideIndex = 0;
        } else if (n < 0) {
            slideIndex = slides.length - 1;
        } else {
            slideIndex = n;
        }

        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        dots.forEach(dot => {
            dot.classList.remove('active');
        });

        slides[slideIndex].classList.add('active');
        dots[slideIndex].classList.add('active');
    }

    window.plusSlides = function(n) {
        clearTimeout(slideTimer);
        showSlides(slideIndex + n);
        startSlideTimer();
    };

    window.currentSlide = function(n) {
        clearTimeout(slideTimer);
        showSlides(n - 1);
        startSlideTimer();
    };

    function autoSlide() {
        showSlides(slideIndex + 1);
        slideTimer = setTimeout(autoSlide, 10000);
    }

    function startSlideTimer() {
        clearTimeout(slideTimer);
        slideTimer = setTimeout(autoSlide, 10000);
    }

    // --- Navegación entre secciones y control de visibilidad por rol ---
    const navLinks = document.querySelectorAll('.nav ul li a');
    const sections = document.querySelectorAll('main section');
    const headerElement = document.querySelector('.header');
    const footerElement = document.querySelector('.footer'); // Corregido: usar querySelector para la clase
    const pricingPanelElement = document.getElementById('pricing-panel');
    const authSection = document.getElementById('auth-section');
    const logoutLink = document.getElementById('logout-link');
    const clientsPanelNavLink = document.getElementById('clients-panel-nav-link'); // Enlace del panel de clientes

    // Función para mostrar una sección específica y ocultar las demás
    function showSection(sectionId) {
        sections.forEach(section => {
            section.classList.remove('active-section');
            section.classList.add('hidden-section');
        });

        const targetSectionElement = document.getElementById(sectionId);
        targetSectionElement.classList.remove('hidden-section');
        targetSectionElement.classList.add('active-section');

        // Lógica de visibilidad de elementos globales (header, footer, pricing panel)
        if (sectionId === 'auth-section') {
            headerElement.classList.add('hidden-on-auth');
            footerElement.classList.add('hidden-on-auth');
            pricingPanelElement.classList.add('hidden-on-auth');
            logoutLink.classList.add('hidden-on-auth');
            clientsPanelNavLink.classList.add('hidden-on-auth'); // Siempre ocultar en la sección de autenticación
            clearTimeout(slideTimer); // Detener el carrusel
        } else {
            headerElement.classList.remove('hidden-on-auth');
            footerElement.classList.remove('hidden-on-auth');
            pricingPanelElement.classList.remove('hidden-on-auth');
            logoutLink.classList.remove('hidden-on-auth');
            authSection.classList.add('hidden-section'); // Ocultar auth

            // Mostrar/ocultar el enlace del panel de clientes según el rol
            if (window.currentUserRole === 'admin') {
                clientsPanelNavLink.classList.remove('hidden-on-auth');
            } else {
                clientsPanelNavLink.classList.add('hidden-on-auth');
            }

            if (sectionId === 'home-section') {
                showSlides(slideIndex);
                startSlideTimer();
            } else {
                clearTimeout(slideTimer);
            }
        }
    } // Cierre de showSection

    // Manejar el éxito de autenticación para actualizar la UI
    window.handleAuthSuccess = (role) => {
        if (role === 'admin') {
            showSection('clients-panel-section'); // Ir al panel de clientes si es admin
        } else {
            showSection('home-section'); // Ir a la sección de inicio si es cliente
        }
    };

    // Al cargar la página, mostrar solo la sección de autenticación
    showSection('auth-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = e.target.dataset.section + '-section';
            if (e.target.id === 'logout-link') {
                return;
            }
            showSection(targetSection);
        });
    });

    logoutLink.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            await window.signOut(); // Usa la función signOut de Firebase
            showSection('auth-section');
            loginForm.reset();
            loginMessage.style.display = 'none';
            registerMessage.style.display = 'none';
            showLoginForm();
            console.log('Sesión cerrada correctamente.');
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            // Mostrar un mensaje de error al usuario si es necesario
        }
    });

    // --- Funciones para crear tarjetas de servicio ---
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
            openBuyModal(serviceData);
        });

        const detailsButton = document.createElement('button');
        detailsButton.classList.add('details-service-btn');
        detailsButton.textContent = 'Detalles';
        detailsButton.addEventListener('click', () => {
            openDetailsModal(serviceData);
        });

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

    const fullAccountsData = [
        { name: 'Netflix Premium', type: 'Cuenta Completa', usdPrice: '15.99', image: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/netflix_logo_icon_170919.png', duration: '30 días', accountType: 'cuenta completa', renewable: 'Sí' },
        { name: 'Disney+ Completa Estándar', type: 'Cuenta Completa', usdPrice: '21.48', image: 'img/disneyplus-full-account.png', duration: '30 días', accountType: 'cuenta completa', renewable: 'Sí' },
        { name: 'HBO Max Completa Estándar', type: 'Cuenta Completa', usdPrice: '14.99', image: 'img/hbomax-logo.png', duration: '30 días', accountType: 'cuenta completa', renewable: 'Sí' },
        { name: 'Prime Video', type: 'Cuenta Completa', usdPrice: '8.99', image: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/amazon_prime_video_logo_icon_170932.png', duration: '30 días', accountType: 'cuenta completa', renewable: 'Sí' },
        { name: 'Paramount+', type: 'Cuenta Completa', usdPrice: '9.99', image: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/paramount_plus_logo_icon_170928.png', duration: '30 días', accountType: 'cuenta completa', renewable: 'Sí' },
        { name: 'Tele Latino', type: 'Cuenta Completa', usdPrice: '6.99', image: 'https://placehold.co/220x120/000000/FFFFFF?text=Tele+Latino', duration: '30 días', accountType: 'cuenta completa', renewable: 'Sí' }, // Placeholder
        { name: 'Flow TV', type: 'Cuenta Completa', usdPrice: '12.99', image: 'https://placehold.co/220x120/000000/FFFFFF?text=Flow+TV', duration: '30 días', accountType: 'cuenta completa', renewable: 'Sí' }, // Placeholder
        { name: 'Spotify Premium', type: 'Cuenta Completa', usdPrice: '7.99', image: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/spotify_logo_icon_170925.png', duration: '30 días', accountType: 'cuenta completa', renewable: 'Sí' },
        { name: 'YouTube Premium', type: 'Cuenta Completa', usdPrice: '11.99', image: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/youtube_logo_icon_170908.png', duration: '30 días', accountType: 'cuenta completa', renewable: 'Sí' },
        { name: 'Canva Pro', type: 'Cuenta Completa', usdPrice: '9.99', image: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/canva_logo_icon_170934.png', duration: '30 días', accountType: 'cuenta completa', renewable: 'Sí' },
    ];

    const sharedProfilesData = [
        { name: 'Netflix Perfil', type: 'Perfil Compartido', usdPrice: '4.50', image: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/netflix_logo_icon_170919.png', duration: '30 días', accountType: 'perfil compartido', renewable: 'No' },
        { name: 'Disney+ Perfil', type: 'Perfil Compartido', usdPrice: '3.99', image: 'https://cdn.icon-icons.com/icons2/2201/PNG/512/disney_plus_logo_icon_134015.png', duration: '30 días', accountType: 'perfil compartido', renewable: 'No' },
        { name: 'Prime Video Perfil', type: 'Perfil Compartido', usdPrice: '2.99', image: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/amazon_prime_video_logo_icon_170932.png', duration: '30 días', accountType: 'perfil compartido', renewable: 'No' },
        { name: 'HBO Max Perfil', type: 'Perfil Compartido', usdPrice: '4.99', image: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/hbo_max_logo_icon_170914.png', duration: '30 días', accountType: 'perfil compartido', renewable: 'No' },
        { name: 'Tele Latino Perfil', type: 'Perfil Compartido', usdPrice: '2.99', image: 'https://placehold.co/220x120/000000/FFFFFF?text=Tele+Latino', duration: '30 días', accountType: 'perfil compartido', renewable: 'No' }, // Placeholder
    ];

    function renderAllServiceCards() {
        const fullAccountsCarousel = document.getElementById('full-accounts-carousel');
        const sharedProfilesCarousel = document.getElementById('shared-profiles-carousel');
        fullAccountsCarousel.innerHTML = '';
        fullAccountsData.forEach(service => {
            fullAccountsCarousel.appendChild(createServiceCard(service));
        });

        sharedProfilesCarousel.innerHTML = '';
        sharedProfilesData.forEach(service => {
            sharedProfilesCarousel.appendChild(createServiceCard(service));
        });
    }
    renderAllServiceCards();

    // --- Panel de Clientes (con Firestore y gestión de contraseña) ---
    const clientDataBody = document.getElementById('client-data-body');
    const renewalModal = document.getElementById('renewal-modal');
    const reportModal = document.getElementById('report-modal');
    const detailsModal = document.getElementById('details-modal');
    const resetPasswordModal = document.getElementById('reset-password-modal'); // Nuevo modal
    const closeButtons = document.querySelectorAll('.close-button');
    const renewalForm = document.getElementById('renewal-form');
    const renewalMessage = document.getElementById('renewal-message');
    const reportForm = document.getElementById('report-form');
    const reportMessage = document.getElementById('report-message');
    const reportedEmailInput = document.getElementById('reported-email');
    const reportedCountrySelect = document.getElementById('reported-country');
    const resetPasswordForm = document.getElementById('reset-password-form'); // Formulario de restablecimiento
    const resetClientEmailInput = document.getElementById('reset-client-email'); // Email en modal de restablecimiento
    const resetPasswordMessage = document.getElementById('reset-password-message'); // Mensaje de restablecimiento

    const countries = [
        "Argentina", "Bolivia", "Brasil", "Chile", "Colombia", "Costa Rica", "Cuba", "Ecuador", "El Salvador",
        "España", "Guatemala", "Honduras", "México", "Nicaragua", "Panamá", "Paraguay", "Perú", "República Dominicana",
        "Uruguay", "Venezuela", "Otro"
    ];

    function populateCountries() {
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            reportedCountrySelect.appendChild(option);
        });
    }
    populateCountries();

    // Función para renderizar datos de clientes en la tabla
    window.renderClients = function(clientsData) {
        console.log("Rendering clients. Data received:", clientsData);
        clientDataBody.innerHTML = '';
        if (clientsData.length === 0) {
            clientDataBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px; color: var(--light-gray);">No hay clientes registrados aún.</td></tr>';
            return;
        }
        clientsData.forEach(client => {
            const row = document.createElement('tr');
            const registrationDate = client.registrationDate ? new Date(client.registrationDate.toDate()).toLocaleDateString() : 'N/A';
            row.innerHTML = `
                <td>${client.email}</td>
                <td>${client.password ? '********' : 'N/A'}</td>
                <td>${registrationDate}</td>
                <td>N/A</td>
                <td class="actions-cell">
                    <button type="button" class="renew-btn" data-email="${client.email}">Renovar</button>
                    <button type="button" class="report-btn" data-email="${client.email}">Reportar Falla</button>
                    <button type="button" class="reset-password-btn" data-client-uid="${client.uid}" data-client-email="${client.email}">Restablecer Contraseña</button>
                </td>
            `;
            clientDataBody.appendChild(row);
        });

        // Event listeners para botones dinámicamente creados
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
                resetClientEmailInput.value = clientEmail; // Mostrar el email del cliente
                resetPasswordForm.dataset.clientUid = clientUid; // Guardar el UID en el formulario
                resetPasswordModal.style.display = 'flex';
                resetPasswordModal.classList.add('show');
                resetPasswordMessage.style.display = 'none';
                resetPasswordForm.reset();
            });
        });
    }

    // --- Firebase Readiness Check y Inicialización ---
    const registerSubmitBtn = document.getElementById('register-submit-btn');
    registerSubmitBtn.disabled = true; // Deshabilitar inicialmente
    registerSubmitBtn.textContent = 'Cargando...'; // Mensaje inicial

    function checkFirebaseReady() {
        // Verifica si las funciones de autenticación y Firestore de Firebase están disponibles
        if (typeof window.createUserWithEmailAndPassword === 'function' &&
            typeof window.signInWithEmailAndPassword === 'function' &&
            typeof window.signOut === 'function' && // Asegura que signOut también esté disponible
            window.firebaseAuth && // Asegura que el objeto de autenticación de Firebase esté disponible
            window.firebaseDb && // Asegura que el objeto de Firestore esté disponible
            typeof window.addDoc === 'function' &&
            typeof window.collection === 'function' &&
            typeof window.doc === 'function' &&
            typeof window.setDoc === 'function' &&
            typeof window.getDoc === 'function' && // Asegura getDoc
            typeof window.updateDoc === 'function' && // Asegura updateDoc
            typeof window.query === 'function' && // Asegura query
            typeof window.where === 'function' // Asegura where para la búsqueda de UID
        ) {
            console.log("Firebase Auth and Firestore functions are ready in script.js. Enabling registration.");
            registerSubmitBtn.disabled = false; // Habilitar el botón de registro
            registerSubmitBtn.textContent = 'Registrarse'; // Restaurar texto del botón
        } else {
            // Si no están listos, intenta de nuevo después de un breve retraso
            setTimeout(checkFirebaseReady, 100);
        }
    }
    checkFirebaseReady(); // Inicia la verificación de Firebase

    // --- Cierre de Modales ---
    function closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        });
        renewalForm.reset();
        reportForm.reset();
        paymentProofForm.reset();
        paymentMessage.style.display = 'none';
        resetImagePreview();
        resetPasswordForm.reset();
        resetPasswordMessage.style.display = 'none';
    }

    closeButtons.forEach(button => {
        button.addEventListener('click', closeAllModals);
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });

    // --- Lógica de Formularios de Modales ---
    renewalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const clientName = document.getElementById('client-name').value;
        const whatsapp = document.getElementById('whatsapp').value;
        const renewalText = document.getElementById('renewal-text').value;

        if (renewalText.toLowerCase() === 'renovar') {
            renewalMessage.textContent = '¡Su renovación fue exitosa!';
            renewalMessage.classList.remove('error-message');
            renewalMessage.classList.add('success-message');
            renewalMessage.style.display = 'block';
            
            console.log(`Simulación de renovación para ${clientName} (${whatsapp}).`);
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
        const reportedEmail = document.getElementById('reported-email').value;
        const reportedPassword = document.getElementById('reported-password').value;
        const reportedCountry = document.getElementById('reported-country').value;
        const issueDescription = document.getElementById('issue-description').value;

        reportMessage.textContent = '¡Reporte enviado con éxito!';
        reportMessage.classList.remove('error-message');
        reportMessage.classList.add('success-message');
        reportMessage.style.display = 'block';
        
        console.log(`Simulación de reporte para ${reportedEmail} desde ${reportedCountry}. Falla: ${issueDescription}`);
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

    function openBuyModal(serviceData) {
        selectedService = serviceData;
        modalServiceName.textContent = selectedService.name;
        modalServiceType.textContent = selectedService.type;
        paymentAmountVesDisplay.textContent = `Bs. ${(parseFloat(selectedService.usdPrice) * usdToVesRate).toFixed(2)}`;
        buyModal.style.display = 'flex';
        buyModal.classList.add('show');
        
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        document.getElementById('payment-date').value = `${year}-${month}-${day}`;

        const hours = String(today.getHours()).padStart(2, '0');
        const minutes = String(today.getMinutes()).padStart(2, '0');
        document.getElementById('payment-time').value = `${hours}:${minutes}`;

        paymentMessage.style.display = 'none';
        paymentProofForm.reset();
        resetImagePreview();
        document.getElementById('customer-name').value = '';
        document.getElementById('transaction-id').value = '';
    }

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

    function resetImagePreview() {
        imagePreview.src = '';
        imagePreview.style.display = 'none';
        previewText.style.display = 'block';
    }

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
                content.style.maxHeight = content.scrollHeight + 30 + "px";
                content.style.paddingTop = '15px';
                content.style.paddingBottom = '15px';
            }

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

    paymentProofForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const customerName = document.getElementById('customer-name').value;
        const paymentDate = document.getElementById('payment-date').value;
        const paymentTime = document.getElementById('payment-time').value;
        const transactionId = document.getElementById('transaction-id').value;
        const fileInput = document.getElementById('payment-proof');

        if (!customerName || !paymentDate || !paymentTime || !transactionId || fileInput.files.length === 0) {
            paymentMessage.textContent = 'Por favor, rellena todos los campos y sube tu comprobante.';
            paymentMessage.classList.remove('success-message');
            paymentMessage.classList.add('error-message');
            paymentMessage.style.display = 'block';
            return;
        }

        const whatsappMessage = `¡Hola! Soy *${encodeURIComponent(customerName)}* y he realizado un pago para adquirir un servicio.\n\n` +
                                `*Servicio:* ${encodeURIComponent(selectedService.name)} (${encodeURIComponent(selectedService.type)})\n` +
                                `*Monto Cancelado (VES):* Bs. ${encodeURIComponent((parseFloat(selectedService.usdPrice) * usdToVesRate).toFixed(2))}\n` +
                                `*Fecha del Pago:* ${encodeURIComponent(paymentDate)}\n` +
                                `*Hora del Pago:* ${encodeURIComponent(paymentTime)}\n` +
                                `*ID de Transacción:* ${encodeURIComponent(transactionId)}\n\n` +
                                `Adjunto mi comprobante de pago manualmente en este chat. ¡Por favor, revisa!`;

        window.open(`${WHATSAPP_LINK}?text=${whatsappMessage}`, '_blank');

        paymentMessage.textContent = '¡Información enviada! Abre el chat de WhatsApp y adjunta tu comprobante.';
        paymentMessage.classList.remove('error-message');
        paymentMessage.classList.add('success-message');
        paymentMessage.style.display = 'block';

        setTimeout(() => {
            closeAllModals();
        }, 5000);
    });

    // --- Panel de Precios Desplegable ---
    const pricingToggleBtn = document.querySelector('.pricing-toggle-btn');
    const pricingContent = document.querySelector('.pricing-content');
    const usdToVesRateInput = document.getElementById('usd-to-ves-rate');
    const applyRateBtn = document.querySelector('.apply-rate-btn');

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

    applyRateBtn.addEventListener('click', () => {
        const newRate = parseFloat(usdToVesRateInput.value);
        if (!isNaN(newRate) && newRate > 0) {
            usdToVesRate = newRate;
            renderAllServiceCards();
            if (buyModal.style.display === 'flex') {
                paymentAmountVesDisplay.textContent = `Bs. ${(parseFloat(selectedService.usdPrice) * usdToVesRate).toFixed(2)}`;
            }
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
    const detailsServiceName = document.getElementById('details-service-name');
    const detailsDuration = document.getElementById('details-duration');
    const detailsAccountType = document.getElementById('details-account-type');
    const detailsRenewable = document.getElementById('details-renewable');

    function openDetailsModal(serviceData) {
        detailsServiceName.textContent = serviceData.name;
        detailsDuration.textContent = serviceData.duration;
        detailsAccountType.textContent = serviceData.accountType;
        detailsRenewable.textContent = serviceData.renewable;

        detailsModal.style.display = 'flex';
        detailsModal.classList.add('show');
    }

    // --- Botones de Ayuda y Soporte ---
    document.querySelectorAll('.help-support-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const type = e.target.dataset.type;
            let message = `¡Hola! Necesito ayuda con ConnectTV. Mi consulta es sobre ${type}.`;
            window.open(`${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`, '_blank');
        });
    });

    // --- Lógica de Iniciar Sesión y Registro ---
    const loginFormContainer = document.getElementById('login-form-container');
    const registerFormContainer = document.getElementById('register-form-container');
    
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');

    const loginForm = document.getElementById('login-form');
    const loginEmailInput = document.getElementById('login-email'); // Cambiado a email
    const loginPasswordInput = document.getElementById('login-password');
    const loginMessage = document.getElementById('login-message');

    const registerForm = document.getElementById('register-form');
    const registerEmailInput = document.getElementById('register-email'); // Cambiado a email
    const registerPasswordInput = document.getElementById('register-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const registerMessage = document.getElementById('register-message');

    function showLoginForm() {
        loginFormContainer.style.display = 'block';
        registerFormContainer.style.display = 'none';
        loginMessage.style.display = 'none';
        loginForm.reset();
    }

    function showRegisterForm() {
        loginFormContainer.style.display = 'none';
        registerFormContainer.style.display = 'block';
        registerMessage.style.display = 'none';
        registerForm.reset();
    }

    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        showRegisterForm();
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        showLoginForm();
    });

    // Manejar el envío del formulario de Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = loginEmailInput.value;
        const password = loginPasswordInput.value;

        try {
            const userCredential = await window.signInWithEmailAndPassword(window.firebaseAuth, email, password);
            const user = userCredential.user;
            console.log("User logged in:", user.uid);

            // Fetch user role from Firestore
            // Usa window.firebaseApp.options.projectId para obtener el projectId de la configuración de Firebase
            // o usa el localAppId si prefieres una cadena fija.
            const currentAppId = window.firebaseApp.options.projectId || 'connecttv-local-app-fallback';
            const userDocRef = window.doc(window.firebaseDb, `artifacts/${currentAppId}/users`, user.uid);
            const userDocSnap = await window.getDoc(userDocRef);

            let role = 'client'; // Default role
            if (userDocSnap.exists()) {
                role = userDocSnap.data().role;
            } else {
                // If user doc doesn't exist (e.g., old anonymous user), create it with default client role
                await window.setDoc(userDocRef, { role: 'client', username: email }, { merge: true });
            }
            window.currentUserRole = role; // Update global role

            loginMessage.textContent = '¡Inicio de sesión exitoso! Redirigiendo...';
            loginMessage.classList.remove('error-message');
            loginMessage.classList.add('success-message');
            loginMessage.style.display = 'block';
            
            setTimeout(() => {
                window.handleAuthSuccess(role); // Call the global handler
                loginMessage.style.display = 'none';
            }, 1000);

        } catch (error) {
            console.error("Error logging in:", error);
            let errorMessage = "Error al iniciar sesión. Verifica tus credenciales.";
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

    // Manejar el envío del formulario de Registro
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log("Register form submitted!"); // Log to confirm event listener is firing

        // Show loading state
        registerSubmitBtn.disabled = true;
        registerSubmitBtn.textContent = 'Registrando...';
        registerMessage.style.display = 'none'; // Clear previous messages

        const email = registerEmailInput.value;
        const password = registerPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (password !== confirmPassword) {
            registerMessage.textContent = 'Las contraseñas no coinciden.';
            registerMessage.classList.remove('success-message');
            registerMessage.classList.add('error-message');
            registerMessage.style.display = 'block';
            registerSubmitBtn.disabled = false; // Re-enable button
            registerSubmitBtn.textContent = 'Registrarse';
            return;
        }

        try {
            console.log("Attempting to create user in Firebase Auth...");
            // 1. Crear usuario en Firebase Authentication
            const userCredential = await window.createUserWithEmailAndPassword(window.firebaseAuth, email, password);
            const user = userCredential.user;
            console.log("User successfully registered in Firebase Auth:", user.uid);

            // Usa window.firebaseApp.options.projectId para obtener el projectId de la configuración de Firebase
            // o usa el localAppId si prefieres una cadena fija.
            const currentAppId = window.firebaseApp.options.projectId || 'connecttv-local-app-fallback';

            console.log("Attempting to save user role and metadata to Firestore 'users' collection...");
            // 2. Guardar detalles del usuario (incluyendo el rol 'client') en Firestore
            const userDocRef = window.doc(window.firebaseDb, `artifacts/${currentAppId}/users`, user.uid);
            await window.setDoc(userDocRef, {
                email: email,
                role: 'client', // Por defecto, todos los nuevos registros son 'cliente'
                registrationDate: new Date(),
            });
            console.log("User role and metadata successfully saved to Firestore 'users' collection.");

            console.log("Attempting to save user details to 'registered_clients' collection for admin panel...");
            // 3. Guardar una entrada en la colección 'registered_clients' para el panel de admin
            await window.addDoc(window.collection(window.firebaseDb, `artifacts/${currentAppId}/public/data/registered_clients`), {
                uid: user.uid, // Guardar el UID para referencia
                email: email,
                password: password, // ¡¡¡ADVERTENCIA DE SEGURIDAD: NO HACER ESTO EN PRODUCCIÓN!!!
                registrationDate: new Date(),
            });
            console.log("User details successfully saved to 'registered_clients' collection.");

            registerMessage.textContent = '¡Registro exitoso! Ahora puedes iniciar sesión.';
            registerMessage.classList.remove('error-message');
            registerMessage.classList.add('success-message');
            registerMessage.style.display = 'block';
            
            setTimeout(() => {
                showLoginForm();
                registerMessage.style.display = 'none';
                registerSubmitBtn.disabled = false; // Re-enable button
                registerSubmitBtn.textContent = 'Registrarse';
            }, 2000);

        } catch (error) {
            console.error("Error during user registration process:", error);
            let errorMessage = "Error al registrar. Inténtalo de nuevo.";
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = "El correo electrónico ya está en uso.";
            } else if (error.code === 'auth/weak-password') {
                errorMessage = "La contraseña es demasiado débil (mínimo 6 caracteres).";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Formato de correo electrónico inválido.";
            } else if (error.code === 'permission-denied') { // Specific check for Firestore permission errors
                errorMessage = "Error de permisos. Asegúrate de que las reglas de seguridad de Firestore permitan el registro.";
            }
            registerMessage.textContent = errorMessage;
            registerMessage.classList.remove('success-message');
            registerMessage.classList.add('error-message');
            registerMessage.style.display = 'block';
            registerSubmitBtn.disabled = false; // Re-enable button
            registerSubmitBtn.textContent = 'Registrarse';
        }
    });

    // --- Lógica para Restablecer Contraseña del Cliente (por Admin) ---
    resetPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const clientUid = resetPasswordForm.dataset.clientUid;
        const newPassword = document.getElementById('new-password').value;
        const confirmNewPassword = document.getElementById('confirm-new-password').value;

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
            // Para este entorno de Canvas y para cumplir con el requisito, estamos simulando
            // la actualización de la contraseña en el lado del cliente, lo cual es INSEGURO.
            //
            // Aquí, actualizaremos la contraseña almacenada en el documento de Firestore del cliente
            // en la colección `registered_clients`. Esto NO CAMBIA la contraseña en Firebase Authentication.
            // Si quieres que la contraseña de Firebase Authentication se actualice, necesitarías
            // una función de backend (Cloud Function) que use el Admin SDK de Firebase.
            //
            // Dado que el objetivo es que el admin "restablezca" para su control, y las contraseñas
            // se guardan en texto plano en `registered_clients` (¡repito, INSEGURO para producción!),
            // esta actualización solo afecta esa entrada.

            // Primero, busca el documento del cliente en `registered_clients` por su UID
            const currentAppId = window.firebaseApp.options.projectId || 'connecttv-local-app-fallback';
            const clientsCollectionRef = window.collection(window.firebaseDb, `artifacts/${currentAppId}/public/data/registered_clients`);
            const q = window.query(clientsCollectionRef, window.where('uid', '==', clientUid));
            const querySnapshot = await window.getDocs(q);

            if (!querySnapshot.empty) {
                const clientDoc = querySnapshot.docs[0];
                await window.updateDoc(window.doc(window.firebaseDb, `artifacts/${currentAppId}/public/data/registered_clients`, clientDoc.id), {
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
});
