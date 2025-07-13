// Version: 1.6.1 - Mejoras en la depuración del restablecimiento de contraseña para capturar el código de error de Firebase.
document.addEventListener('DOMContentLoaded', () => {
    // --- Variables de CSS para colores ---
    const computedStyle = getComputedStyle(document.body);
    const successColor = computedStyle.getPropertyValue('--success-color');
    const errorColor = computedStyle.getPropertyValue('--error-color');

    // --- Variables Globales para Precios ---
    let usdToVesRate = parseFloat(document.getElementById('usd-to-ves-rate').value); // Tasa de cambio inicial
    const WHATSAPP_LINK = "https://walink.co/9fd827"; // Tu enlace de WhatsApp

    // --- Carrusel de Estrenos (Sección Home) ---
    let homeSlideIndex = 0;
    let homeSlideTimer;

    const homeSlides = document.querySelectorAll('.mySlides');
    const homeDots = document.querySelectorAll('.dot');

    function showHomeSlides(n) {
        if (n >= homeSlides.length) {
            homeSlideIndex = 0;
        } else if (n < 0) {
            homeSlideIndex = homeSlides.length - 1;
        } else {
            homeSlideIndex = n;
        }

        homeSlides.forEach(slide => {
            slide.classList.remove('active');
        });
        homeDots.forEach(dot => {
            dot.classList.remove('active');
        });

        homeSlides[homeSlideIndex].classList.add('active');
        homeDots[homeSlideIndex].classList.add('active');
    }

    window.plusSlides = function(n) {
        clearTimeout(homeSlideTimer);
        showHomeSlides(homeSlideIndex + n);
        startHomeSlideTimer();
    };

    window.currentSlide = function(n) {
        clearTimeout(homeSlideTimer);
        showHomeSlides(n - 1);
        startHomeSlideTimer();
    };

    function autoHomeSlide() {
        showHomeSlides(homeSlideIndex + 1);
        homeSlideTimer = setTimeout(autoHomeSlide, 10000);
    }

    function startHomeSlideTimer() {
        clearTimeout(homeSlideTimer);
        homeSlideTimer = setTimeout(autoHomeSlide, 10000);
    }

    // --- Navegación entre secciones y control de visibilidad por rol ---
    const navLinks = document.querySelectorAll('.nav ul li a');
    const sections = document.querySelectorAll('main section');
    const headerElement = document.querySelector('.header');
    const footerElement = document.querySelector('.footer');
    const pricingPanelElement = document.getElementById('pricing-panel');
    const authSection = document.getElementById('auth-section');
    const logoutLink = document.getElementById('logout-link');
    const clientsPanelNavLink = document.getElementById('clients-panel-nav-link'); // Enlace del panel de clientes

    // Función para mostrar una sección específica y ocultar las demás
    window.showSection = function(sectionId) { // Made global for index.html to call
        sections.forEach(section => {
            section.classList.remove('active-section');
            section.classList.add('hidden-section');
        });

        const targetSectionElement = document.getElementById(sectionId);
        if (targetSectionElement) { // Ensure the element exists
            targetSectionElement.classList.remove('hidden-section');
            targetSectionElement.classList.add('active-section');
        } else {
            console.error(`Section with ID ${sectionId} not found.`);
            return; // Exit if section not found
        }

        // Lógica de visibilidad de elementos globales (header, footer, pricing panel)
        if (sectionId === 'auth-section') {
            headerElement.classList.add('hidden-on-auth');
            footerElement.classList.add('hidden-on-auth');
            pricingPanelElement.classList.add('hidden-on-auth');
            logoutLink.classList.add('hidden-on-auth');
            clientsPanelNavLink.classList.add('hidden-on-auth'); // Siempre ocultar en la sección de autenticación
            clearTimeout(homeSlideTimer); // Detener el carrusel de la sección Home
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
                showHomeSlides(homeSlideIndex);
                startHomeSlideTimer();
            } else {
                clearTimeout(homeSlideTimer);
            }
        }

        navLinks.forEach(link => link.classList.remove('active'));
        const activeNavLink = document.querySelector(`.nav ul li a[data-section="${sectionId.replace('-section', '')}"]`);
        if (activeNavLink) {
            activeNavLink.classList.add('active');
        }
    }

    // Manejar el éxito de autenticación para actualizar la UI
    window.handleAuthSuccess = (role) => {
        console.log("handleAuthSuccess called with role:", role); // Added console log
        if (role === 'admin') {
            window.showSection('clients-panel-section'); // Ir al panel de clientes si es admin
        } else {
            window.showSection('home-section'); // Ir a la sección de inicio si es cliente
        }
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = e.target.dataset.section + '-section';
            if (e.target.id === 'logout-link') {
                return;
            }
            window.showSection(targetSection); // Use window.showSection
        });
    });

    logoutLink.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            await window.signOut(); // Usa la función signOut de Firebase
            window.showSection('auth-section'); // Use window.showSection
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
        console.log("Rendering all service cards."); // Log de depuración
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
    const resetPasswordModal = document.getElementById('reset-password-modal'); // Nuevo modal para admin
    const deleteConfirmModal = document.getElementById('delete-confirm-modal'); // Nuevo modal de confirmación
    const closeButtons = document.querySelectorAll('.close-button');
    const renewalForm = document.getElementById('renewal-form');
    const renewalMessage = document.getElementById('renewal-message');
    const reportForm = document.getElementById('report-form');
    const reportMessage = document.getElementById('report-message');
    const reportedEmailInput = document.getElementById('reported-email');
    const reportedCountrySelect = document.getElementById('reported-country');
    const resetPasswordForm = document.getElementById('reset-password-form'); // Formulario de restablecimiento para admin
    const resetClientEmailInput = document.getElementById('reset-client-email'); // Email en modal de restablecimiento para admin
    const resetPasswordMessage = document.getElementById('reset-password-message'); // Mensaje de restablecimiento para admin
    const clientToDeleteEmailDisplay = document.getElementById('client-to-delete-email'); // Email en modal de eliminación
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    const deleteMessage = document.getElementById('delete-message');


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
            clientDataBody.innerHTML = '<tr><td colspan="5"><p class="no-clients-message">No hay clientes registrados aún.</p></td></tr>';
            return;
        }
        clientsData.forEach(client => {
            const row = document.createElement('tr');
            // Ensure registrationDate is a valid Firestore Timestamp before calling toDate()
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

        document.querySelectorAll('.delete-client-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const clientId = e.target.dataset.clientId;
                const clientUid = e.target.dataset.clientUid;
                const clientEmail = e.target.dataset.clientEmail;

                clientToDeleteEmailDisplay.textContent = clientEmail; // Display email in confirmation modal
                confirmDeleteBtn.dataset.clientId = clientId; // Store Firestore doc ID
                confirmDeleteBtn.dataset.clientUid = clientUid; // Store Firebase Auth UID (if needed for future Admin SDK use)

                deleteConfirmModal.style.display = 'flex';
                deleteConfirmModal.classList.add('show');
                deleteMessage.style.display = 'none'; // Hide previous messages
            });
        });
    }

    // --- Firebase Readiness Check y Inicialización ---
    const registerSubmitBtn = document.getElementById('register-submit-btn');
    // Disable initially only if it's not already disabled (to avoid re-disabling if HTML sets it)
    if (registerSubmitBtn && !registerSubmitBtn.disabled) {
        registerSubmitBtn.disabled = true; 
    }

    function checkFirebaseReady() {
        // Check for all necessary Firebase globals to be available
        if (window.firebaseAuth && window.firebaseDb && window.addDoc && window.collection && 
            window.createUserWithEmailAndPassword && window.signInWithEmailAndPassword && 
            window.signOut && window.doc && window.getDoc && window.setDoc && window.updateDoc &&
            window.where && window.getDocs && window.deleteDoc && window.sendPasswordResetEmail && window.confirmPasswordReset) { 
            console.log("Firebase globals are ready in script.js.");
            if (registerSubmitBtn) {
                registerSubmitBtn.disabled = false; // Habilitar el botón de registro
            }
            // The onAuthStateChanged listener in index.html will handle initial UI state after auth
        } else {
            // If not ready, retry after a short delay
            setTimeout(checkFirebaseReady, 100);
        }
    }
    checkFirebaseReady(); // Start checking for Firebase readiness

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
        resetPasswordForm.reset(); // Reset admin reset form
        resetPasswordMessage.style.display = 'none'; // Hide admin reset message
        forgotPasswordCodeForm.reset(); // Reset client code reset form
        forgotPasswordCodeMessage.style.display = 'none'; // Hide client code reset message
        deleteMessage.style.display = 'none'; // Clear delete message
        showLoginForm(); // Always return to login form
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
    const forgotPasswordCodeFormContainer = document.getElementById('forgot-password-code-form-container'); // Nuevo contenedor

    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const showForgotPasswordLink = document.getElementById('show-forgot-password'); // Enlace para restablecer contraseña (inicial)
    const showLoginFromForgotCodeLink = document.getElementById('show-login-from-forgot-code'); // Nuevo enlace para volver al login

    const loginForm = document.getElementById('login-form');
    const loginEmailInput = document.getElementById('login-email');
    const loginPasswordInput = document.getElementById('login-password');
    const loginMessage = document.getElementById('login-message');

    const registerForm = document.getElementById('register-form');
    const registerEmailInput = document.getElementById('register-email');
    const registerPasswordInput = document.getElementById('register-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const registerMessage = document.getElementById('register-message');

    const forgotPasswordCodeForm = document.getElementById('forgot-password-code-form'); // Nuevo formulario
    const forgotEmailDisplay = document.getElementById('forgot-email-display'); // Campo de email en el nuevo formulario
    const oobCodeInput = document.getElementById('oob-code'); // Campo para el código
    const newPasswordResetInput = document.getElementById('new-password-reset'); // Campo para nueva contraseña
    const confirmNewPasswordResetInput = document.getElementById('confirm-new-password-reset'); // Campo para confirmar nueva contraseña
    const forgotPasswordCodeMessage = document.getElementById('forgot-password-code-message'); // Mensaje del nuevo formulario


    function showLoginForm() {
        loginFormContainer.style.display = 'block';
        registerFormContainer.style.display = 'none';
        forgotPasswordCodeFormContainer.style.display = 'none'; // Ocultar el nuevo formulario
        loginMessage.style.display = 'none';
        loginForm.reset();
    }

    function showRegisterForm() {
        loginFormContainer.style.display = 'none';
        registerFormContainer.style.display = 'block';
        forgotPasswordCodeFormContainer.style.display = 'none'; // Ocultar el nuevo formulario
        registerMessage.style.display = 'none';
        registerForm.reset();
    }

    function showForgotPasswordCodeForm(email) {
        loginFormContainer.style.display = 'none';
        registerFormContainer.style.display = 'none';
        forgotPasswordCodeFormContainer.style.display = 'block'; // Mostrar el nuevo formulario
        forgotEmailDisplay.value = email; // Pre-llenar el email
        forgotPasswordCodeMessage.style.display = 'none';
        forgotPasswordCodeForm.reset();
        oobCodeInput.value = ''; // Asegurarse de que el campo de código esté vacío
    }


    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        showRegisterForm();
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        showLoginForm();
    });

    showLoginFromForgotCodeLink.addEventListener('click', (e) => {
        e.preventDefault();
        showLoginForm();
    });

    // Maneja el clic en el enlace de "Olvidé mi contraseña"
    showForgotPasswordLink.addEventListener('click', async (e) => {
        e.preventDefault();
        console.log("Clicked 'Olvidé mi contraseña' link."); // Log de depuración
        const email = loginEmailInput.value; // Intenta usar el email ya ingresado

        // Si el campo de email está vacío, muestra un mensaje de error
        if (!email) {
            loginMessage.textContent = 'Por favor, ingresa tu correo electrónico en el campo de arriba para restablecer la contraseña.';
            loginMessage.classList.remove('success-message');
            loginMessage.classList.add('error-message');
            loginMessage.style.display = 'block';
            console.log("Email field is empty. Displaying error message."); // Log de depuración
            return; // Detiene la ejecución si el email está vacío
        }

        try {
            console.log(`Attempting to send password reset email to: ${email}`); // Log de depuración
            await window.sendPasswordResetEmail(window.firebaseAuth, email); // Usa la función global
            
            // Si el envío es exitoso, muestra el nuevo formulario para el código
            showForgotPasswordCodeForm(email);
            forgotPasswordCodeMessage.textContent = 'Se ha enviado un correo de restablecimiento de contraseña a tu dirección. Abre el correo y copia el código (oobCode) de la URL para pegarlo aquí.';
            forgotPasswordCodeMessage.classList.remove('error-message');
            forgotPasswordCodeMessage.classList.add('success-message');
            forgotPasswordCodeMessage.style.display = 'block';
            console.log("Password reset email sent successfully. Displaying success message and code form."); // Log de depuración

        } catch (error) {
            console.error("Error al enviar correo de restablecimiento:", error.code, error.message); // Log de depuración con código y mensaje
            let errorMessage = "Error al enviar correo de restablecimiento. Verifica el email.";
            if (error.code === 'auth/user-not-found') {
                errorMessage = "No hay usuario registrado con ese correo.";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Formato de correo electrónico inválido.";
            } else if (error.code === 'auth/network-request-failed') {
                errorMessage = "Problema de conexión. Verifica tu internet o inténtalo más tarde.";
            } else if (error.code === 'auth/operation-not-allowed') { // Specific check for the common error
                errorMessage = "La operación de restablecimiento de contraseña no está habilitada. Por favor, habilítala en la consola de Firebase (Authentication -> Sign-in method -> Email/Password).";
            }
            loginMessage.textContent = errorMessage;
            loginMessage.classList.remove('success-message');
            loginMessage.classList.add('error-message');
            loginMessage.style.display = 'block';
            console.log(`Displaying error message: ${errorMessage}`); // Log de depuración
        }
    });

    // Maneja el envío del formulario de Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = loginEmailInput.value;
        const password = loginPasswordInput.value;

        try {
            const userCredential = await window.signInWithEmailAndPassword(window.firebaseAuth, email, password);
            const user = userCredential.user;
            console.log("User logged in:", user.uid);

            const userDocRef = window.doc(window.firebaseDb, `artifacts/${window.__app_id}/users`, user.uid);
            const userDocSnap = await window.getDoc(userDocRef, { source: 'server' }); 

            let role = 'client'; // Default role
            if (userDocSnap.exists()) {
                role = userDocSnap.data().role;
            } else {
                await window.setDoc(userDocRef, { role: 'client', email: email }, { merge: true });
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
        const email = registerEmailInput.value;
        const password = registerPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (password !== confirmPassword) {
            registerMessage.textContent = 'Las contraseñas no coinciden.';
            registerMessage.classList.remove('success-message');
            registerMessage.classList.add('error-message');
            registerMessage.style.display = 'block';
            return;
        }

        try {
            // 1. Crear usuario en Firebase Authentication
            const userCredential = await window.createUserWithEmailAndPassword(window.firebaseAuth, email, password);
            const user = userCredential.user;
            console.log("User registered in Firebase Auth:", user.uid);

            // 2. Guardar detalles del usuario (incluyendo el rol 'client') en Firestore
            const userDocRef = window.doc(window.firebaseDb, `artifacts/${window.__app_id}/users`, user.uid);
            await window.setDoc(userDocRef, {
                email: email,
                role: 'client', // Por defecto, todos los nuevos registros son 'cliente'
                registrationDate: new Date(),
            });
            console.log("User role and metadata saved to Firestore.");

            // 3. Guardar una entrada en la colección 'registered_clients' para el panel de admin
            await window.addDoc(window.collection(window.firebaseDb, `artifacts/${window.__app_id}/public/data/registered_clients`), {
                uid: user.uid, // Guardar el UID para referencia
                email: email,
                password: password, // ¡¡¡ADVERTENCIA DE SEGURIDAD: NO HACER ESTO EN PRODUCCIÓN!!!
                registrationDate: new Date(),
            });
            console.log("User details saved to registered_clients collection for admin panel.");

            registerMessage.textContent = '¡Registro exitoso! Ahora puedes iniciar sesión.';
            registerMessage.classList.remove('error-message');
            registerMessage.classList.add('success-message');
            registerMessage.style.display = 'block';
            
            setTimeout(() => {
                showLoginForm();
                registerMessage.style.display = 'none';
            }, 2000);

        } catch (error) {
            console.error("Error al registrar usuario:", error);
            let errorMessage = "Error al registrar. Inténtalo de nuevo.";
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

            // Primero, busca el documento del cliente en `registered_clients` por su UID
            const clientsCollectionRef = window.collection(window.firebaseDb, `artifacts/${window.__app_id}/public/data/registered_clients`);
            const q = window.query(clientsCollectionRef, window.where('uid', '==', clientUid));
            const querySnapshot = await window.getDocs(q);

            if (!querySnapshot.empty) {
                const clientDoc = querySnapshot.docs[0];
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

    // --- Lógica para el formulario de restablecimiento de contraseña con código (para el cliente) ---
    forgotPasswordCodeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const oobCode = oobCodeInput.value;
        const newPassword = newPasswordResetInput.value;
        const confirmNewPassword = confirmNewPasswordResetInput.value;
        const emailToReset = forgotEmailDisplay.value; // Obtener el email del campo de sólo lectura

        if (newPassword !== confirmNewPassword) {
            forgotPasswordCodeMessage.textContent = 'Las contraseñas no coinciden.';
            forgotPasswordCodeMessage.classList.remove('success-message');
            forgotPasswordCodeMessage.classList.add('error-message');
            forgotPasswordCodeMessage.style.display = 'block';
            return;
        }

        if (newPassword.length < 6) {
            forgotPasswordCodeMessage.textContent = 'La nueva contraseña debe tener al menos 6 caracteres.';
            forgotPasswordCodeMessage.classList.remove('success-message');
            forgotPasswordCodeMessage.classList.add('error-message');
            forgotPasswordCodeMessage.style.display = 'block';
            return;
        }

        try {
            console.log(`Attempting to confirm password reset for ${emailToReset} with oobCode: ${oobCode}`);
            await window.confirmPasswordReset(window.firebaseAuth, oobCode, newPassword);

            // Opcional: Actualizar la contraseña en la colección 'registered_clients' si se está usando.
            // ADVERTENCIA: Esto sigue siendo inseguro si se guarda en texto plano en producción.
            const clientsCollectionRef = window.collection(window.firebaseDb, `artifacts/${window.__app_id}/public/data/registered_clients`);
            const q = window.query(clientsCollectionRef, window.where('email', '==', emailToReset));
            const querySnapshot = await window.getDocs(q);

            if (!querySnapshot.empty) {
                const clientDoc = querySnapshot.docs[0];
                await window.updateDoc(window.doc(window.firebaseDb, `artifacts/${window.__app_id}/public/data/registered_clients`, clientDoc.id), {
                    password: newPassword // ¡¡¡ADVERTENCIA DE SEGURIDAD: NO HACER ESTO EN PRODUCCIÓN!!!
                });
                console.log(`Password updated in 'registered_clients' for ${emailToReset}.`);
            } else {
                console.warn(`Client ${emailToReset} not found in 'registered_clients' collection. Password updated only in Firebase Auth.`);
            }

            forgotPasswordCodeMessage.textContent = '¡Contraseña restablecida con éxito! Ahora puedes iniciar sesión con tu nueva contraseña.';
            forgotPasswordCodeMessage.classList.remove('error-message');
            forgotPasswordCodeMessage.classList.add('success-message');
            forgotPasswordCodeMessage.style.display = 'block';
            
            setTimeout(() => {
                showLoginForm(); // Volver al formulario de login
            }, 3000);

        } catch (error) {
            console.error("Error al restablecer contraseña con código:", error.code, error.message); // Log de depuración con código y mensaje
            let errorMessage = "Error al restablecer contraseña. Verifica el código o inténtalo de nuevo.";
            if (error.code === 'auth/invalid-action-code') {
                errorMessage = "El código de verificación es inválido o ha expirado.";
            } else if (error.code === 'auth/expired-action-code') {
                errorMessage = "El código de verificación ha expirado. Solicita uno nuevo.";
            } else if (error.code === 'auth/user-disabled') {
                errorMessage = "La cuenta ha sido deshabilitada.";
            } else if (error.code === 'auth/user-not-found') {
                errorMessage = "Usuario no encontrado.";
            } else if (error.code === 'auth/weak-password') {
                errorMessage = "La nueva contraseña es demasiado débil (mínimo 6 caracteres).";
            }
            forgotPasswordCodeMessage.textContent = errorMessage;
            forgotPasswordCodeMessage.classList.remove('success-message');
            forgotPasswordCodeMessage.classList.add('error-message');
            forgotPasswordCodeMessage.style.display = 'block';
        }
    });


    // --- Lógica para Eliminar Cliente (por Admin) ---
    confirmDeleteBtn.addEventListener('click', async () => {
        const clientId = confirmDeleteBtn.dataset.clientId;
        const clientUid = confirmDeleteBtn.dataset.clientUid; // Esto es el UID de Firebase Auth

        try {
            // Eliminar el documento del cliente de la colección 'registered_clients'
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
            deleteMessage.classList.add('error-message');
            deleteMessage.style.display = 'block';
        }
    });

    cancelDeleteBtn.addEventListener('click', () => {
        closeAllModals();
    });
});
