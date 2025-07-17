// script/main.js

import { auth, db } from './firebase-init.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    updateProfile 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    collection, 
    query, 
    where, 
    getDocs,
    deleteDoc,
    addDoc, // Necesario para añadir documentos a subcolecciones
    serverTimestamp // Necesario para la fecha de compra
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Obtener el ID de la aplicación del entorno Canvas
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
console.log("main.js: App ID detected:", appId);


// --- Variables DOM (declaradas con let para poder ser inicializadas en DOMContentLoaded) ---
let messageBox;
let customModal;
let modalMessage;
let modalOkButton;
let modalConfirmButton;
let modalCancelButton;
let modalCloseButton;

let currentConfirmAction = null; // Para guardar la acción de confirmación

// Variables para el modal de detalles del servicio
let serviceDetailModal;
let serviceDetailModalCloseButton;
let serviceDetailName;
let serviceDetailImage;
let serviceDetailPrice;
let serviceDetailDescription;
let buyServiceBtn; // Nuevo botón de compra
let closeServiceDetailModalBtn;

let purchasedServicesList; // Contenedor para la lista de servicios comprados


// --- Lógica principal de la aplicación (envuelta en DOMContentLoaded para asegurar que el DOM esté cargado) ---
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar variables DOM aquí, cuando el DOM ya está cargado
    messageBox = document.getElementById('message-box');
    customModal = document.getElementById('custom-modal');
    modalMessage = document.getElementById('modal-message');
    modalOkButton = document.getElementById('modal-ok-button');
    modalConfirmButton = document.getElementById('modal-confirm-button');
    modalCancelButton = document.getElementById('modal-cancel-button');
    modalCloseButton = document.getElementById('modal-close-button');

    // Inicializar variables del modal de detalles del servicio
    serviceDetailModal = document.getElementById('service-detail-modal');
    serviceDetailModalCloseButton = document.getElementById('service-detail-modal-close');
    serviceDetailName = document.getElementById('service-detail-name');
    serviceDetailImage = document.getElementById('service-detail-image');
    serviceDetailPrice = document.getElementById('service-detail-price');
    serviceDetailDescription = document.getElementById('service-detail-description');
    buyServiceBtn = document.getElementById('buy-service-btn'); // Inicializar el botón de compra
    closeServiceDetailModalBtn = document.getElementById('close-service-detail-modal');

    purchasedServicesList = document.getElementById('purchased-services-list');


    // --- Funciones de Utilidad (globalizadas y definidas AHORA que el DOM está cargado) ---
    window.showMessage = function(message, type = 'info', duration = 3000) {
        if (!messageBox) {
            console.error("Error: messageBox element not found. Make sure the DOM is loaded.");
            return;
        }
        messageBox.textContent = message;
        messageBox.className = `message-box ${type}`;
        messageBox.style.display = 'block';
        messageBox.style.opacity = '1'; 
        setTimeout(() => {
            messageBox.style.opacity = '0'; 
            setTimeout(() => messageBox.style.display = 'none', 300); 
        }, duration);
    };

    window.showModal = function(message, type = 'alert', onConfirm = null) {
        if (!customModal || !modalMessage || !modalOkButton || !modalConfirmButton || !modalCancelButton || !modalCloseButton) {
            console.error("Error: Modal elements not found. Make sure the DOM is loaded.");
            return;
        }
        modalMessage.textContent = message;
        modalOkButton.style.display = 'none';
        modalConfirmButton.style.display = 'none';
        modalCancelButton.style.display = 'none';
        modalCloseButton.style.display = 'block'; 

        if (type === 'alert') {
            modalOkButton.style.display = 'block';
            modalOkButton.onclick = () => { customModal.style.display = 'none'; };
        } else if (type === 'confirm' && onConfirm) {
            modalConfirmButton.style.display = 'block';
            modalCancelButton.style.display = 'block';
            currentConfirmAction = onConfirm; 

            modalConfirmButton.onclick = () => {
                currentConfirmAction();
                customModal.style.display = 'none';
                currentConfirmAction = null; 
            };
            modalCancelButton.onclick = () => {
                customModal.style.display = 'none';
                currentConfirmAction = null; 
            };
        }
        customModal.style.display = 'flex'; 
    };


    // Asignar evento al botón de cerrar el modal
    if (modalCloseButton) {
        modalCloseButton.addEventListener('click', () => {
            customModal.style.display = 'none';
            currentConfirmAction = null; 
        });
    }

    // Event listeners para el modal de detalles del servicio
    if (serviceDetailModalCloseButton) {
        serviceDetailModalCloseButton.addEventListener('click', () => {
            serviceDetailModal.style.display = 'none';
        });
    }
    if (closeServiceDetailModalBtn) {
        closeServiceDetailModalBtn.addEventListener('click', () => {
            serviceDetailModal.style.display = 'none';
        });
    }


    // --- Lógica para index.html (Login/Register) ---
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const registerLink = document.getElementById('register-link');
    const loginLink = document.getElementById('login-link'); 
    const regWhatsappInput = document.getElementById('reg-whatsapp');
    let iti; 

    if (loginForm && registerForm && registerLink) {
        registerLink.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("Clicked register link. Toggling forms.");
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
            if (regWhatsappInput && !iti && typeof window.intlTelInput === 'function') {
                console.log("Initializing intlTelInput for registration form.");
                iti = window.intlTelInput(regWhatsappInput, {
                    initialCountry: "auto",
                    geoIpLookup: callback => {
                        fetch("https://ipapi.co/json")
                            .then(res => res.json())
                            .then(data => callback(data.country_code))
                            .catch(() => callback("us"));
                    },
                    utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@17.0.13/build/js/utils.js" 
                });
            } else if (regWhatsappInput) { 
                console.warn("intlTelInput function not available for registration WhatsApp input. Check script tag.");
            }
        });

        if (loginLink) {
            loginLink.addEventListener('click', (e) => {
                e.preventDefault();
                console.log("Clicked login link. Toggling forms.");
                registerForm.style.display = 'none';
                loginForm.style.display = 'block';
            });
        }

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log("Login form submitted.");
            const email = loginForm['email'].value;
            const password = loginForm['password'].value;

            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                console.log("User logged in:", userCredential.user.email);
                window.location.href = 'dashboard.html';
            } catch (error) {
                console.error("Error al iniciar sesión:", error);
                let errorMessage = "Error al iniciar sesión. Por favor, inténtalo de nuevo.";
                if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                    errorMessage = "Correo o contraseña incorrectos.";
                } else if (error.code === 'auth/invalid-email') {
                    errorMessage = "Formato de correo electrónico inválido.";
                } else if (error.code === 'auth/too-many-requests') {
                    errorMessage = "Demasiados intentos fallidos. Intenta de nuevo más tarde.";
                }
                window.showMessage(errorMessage, 'error');
            }
        });

        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log("Registration form submitted.");
            const name = registerForm['reg-name'].value;
            const lastname = registerForm['reg-lastname'].value;
            const email = registerForm['reg-email'].value;
            const password = registerForm['reg-password'].value;
            let whatsapp = '';

            if (regWhatsappInput && regWhatsappInput.value.trim()) {
                if (iti && typeof iti.getNumber === 'function') {
                    if (iti.isValidNumber()) {
                        whatsapp = iti.getNumber();
                        console.log("WhatsApp number valid and extracted:", whatsapp);
                    } else {
                        const errorCode = iti.getValidationError();
                        let whatsappErrorMessage = "Número de WhatsApp inválido.";
                        window.showMessage(whatsappErrorMessage, 'error');
                        console.error("Invalid WhatsApp number:", regWhatsappInput.value, "Error code:", errorCode);
                        return; 
                    }
                } else {
                    whatsapp = regWhatsappInput.value.trim();
                    console.warn("intlTelInput not fully initialized for WhatsApp field. Using raw input value.", whatsapp);
                }
            }
            
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                console.log("User registered:", user.email, "UID:", user.uid);

                await setDoc(doc(db, `artifacts/${appId}/users`, user.uid), {
                    name: name,
                    lastname: lastname,
                    email: email,
                    whatsapp: whatsapp,
                    role: 'user', 
                    createdAt: new Date()
                });
                console.log("User data saved to Firestore at correct path.");

                window.showMessage("Registro exitoso. ¡Bienvenido!", 'success');
                window.location.href = 'dashboard.html';

            } catch (error) {
                console.error("Error al registrar usuario:", error);
                let errorMessage = "Error al registrar. Por favor, inténtalo de nuevo.";
                if (error.code === 'auth/email-already-in-use') {
                    errorMessage = "Este correo electrónico ya está registrado.";
                } else if (error.code === 'auth/weak-password') {
                    errorMessage = "La contraseña debe tener al menos 6 caracteres.";
                } else if (error.code === 'auth/invalid-email') {
                    errorMessage = "Formato de correo electrónico inválido.";
                }
                window.showMessage(errorMessage, 'error');
            }
        });
    }


    // --- Lógica para dashboard.html ---
    const userDisplayName = document.getElementById('user-display-name');
    const logoutBtn = document.getElementById('logout-btn');
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const profileEditForm = document.getElementById('profile-edit-form');
    const saveProfileBtn = document.getElementById('save-profile-btn');
    const profileNameInput = document.getElementById('profile-name');
    const profileLastnameInput = document.getElementById('profile-lastname');
    const profileWhatsappInput = document.getElementById('profile-whatsapp');
    const servicesListContainer = document.getElementById('services-list'); // Contenedor para la lista de servicios


    // Nuevas variables para la navegación de secciones
    const navLinks = document.querySelectorAll('.main-nav .nav-link');
    const contentSections = document.querySelectorAll('.content-section');


    let itiProfile; 

    // Función para mostrar solo la sección activa
    function showSection(targetId) {
        console.log("main.js: showSection called for:", targetId);
        contentSections.forEach(section => {
            if (section.id === targetId.substring(1)) { // Eliminar '#' del ID
                section.style.display = 'block';
                console.log(`main.js: Showing section: ${section.id}`);
            } else {
                section.style.display = 'none';
            }
        });

        // Actualizar la clase 'active' en los enlaces de navegación
        navLinks.forEach(link => {
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Añadir event listeners a los enlaces de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Evitar el comportamiento de anclaje por defecto
            const targetId = e.target.getAttribute('href');
            showSection(targetId);

            // Cargar datos específicos de la sección si es necesario
            if (targetId === '#servicios') {
                loadServices();
            } else if (targetId === '#mis-suscripciones') {
                loadPurchasedServices(auth.currentUser.uid); // Cargar las suscripciones del usuario actual
            } else if (targetId === '#administrador-clientes' && typeof window.loadClientsForAdmin === 'function') {
                const user = auth.currentUser;
                if (user) {
                    // La función checkAdminStatus ya llama a loadClientsForAdmin si es admin
                }
            } else if (targetId === '#editar-pagina' && typeof window.loadEditableContent === 'function') {
                // La función checkAdminStatus ya llama a loadEditableContent si es admin
            }
        });
    });

    // Mostrar la sección de inicio por defecto al cargar la página
    showSection('#inicio');


    onAuthStateChanged(auth, async (user) => {
        console.log("main.js: onAuthStateChanged triggered. User:", user ? user.email : "Logged out");
        if (user) {
            console.log("main.js: User is logged in as", user.email);
            // Obtener el userId del usuario autenticado
            const userId = user.uid;

            if (userDisplayName) {
                // --- RUTA FIRESTORE CORREGIDA para el documento del usuario ---
                const userDocRef = doc(db, `artifacts/${appId}/users`, userId);
                try {
                    const userDocSnap = await getDoc(userDocRef);
                    if (userDocSnap.exists()) {
                        const userData = userDocSnap.data();
                        userDisplayName.textContent = userData.name || user.email; 
                        console.log("main.js: User data loaded from Firestore at correct path for display name.");
                        
                        if (profileNameInput) profileNameInput.value = userData.name || '';
                        if (profileLastnameInput) profileLastnameInput.value = userData.lastname || '';
                        if (profileWhatsappInput) {
                            profileWhatsappInput.value = userData.whatsapp || '';
                            if (!itiProfile && typeof window.intlTelInput === 'function') {
                                itiProfile = window.intlTelInput(profileWhatsappInput, {
                                    initialCountry: "auto", 
                                    geoIpLookup: callback => {
                                        fetch("https://ipapi.co/json")
                                            .then(res => res.json())
                                            .then(data => callback(data.country_code))
                                            .catch(() => callback("us"));
                                    },
                                    utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@17.0.13/build/js/utils.js"
                                });
                                console.log("main.js: intlTelInput initialized for profile Whatsapp.");
                            } else if (profileWhatsappInput) {
                                console.warn("main.js: intlTelInput function not available for profile Whatsapp input. Check script tag.");
                            }
                        }

                        // Lógica para mostrar/ocultar secciones de administrador (delegado a admin.js)
                        if (typeof window.checkAdminStatus === 'function') {
                            console.log("main.js: Calling window.checkAdminStatus for UID:", userId);
                            window.checkAdminStatus(userId); 
                        } else {
                            console.warn("main.js: Function window.checkAdminStatus not found. Ensure admin.js is loaded and properly exports it.");
                            const adminNav = document.getElementById('admin-clientes-nav');
                            const adminSection = document.getElementById('administrador-clientes');
                            const editPageSection = document.getElementById('editar-pagina');
                            const editPageNav = document.getElementById('editar-pagina-nav');
                            if (adminNav) adminNav.style.display = 'none';
                            if (adminSection) adminSection.style.display = 'none';
                            if (editPageSection) editPageSection.style.display = 'none';
                            if (editPageNav) editPageNav.style.display = 'none';
                        }

                    } else {
                        console.warn("main.js: User document not found in Firestore for UID:", userId, "at path:", `artifacts/${appId}/users/${userId}`);
                        window.showMessage("Tu perfil no pudo ser cargado completamente. Contacta al soporte.", 'warning');
                        // Si el documento de usuario no existe, ocultar las opciones de admin por defecto
                        const adminNav = document.getElementById('admin-clientes-nav');
                        const adminSection = document.getElementById('administrador-clientes');
                        const editPageSection = document.getElementById('editar-pagina');
                        const editPageNav = document.getElementById('editar-pagina-nav');
                        if (adminNav) adminNav.style.display = 'none';
                        if (adminSection) adminSection.style.display = 'none';
                        if (editPageSection) editPageSection.style.display = 'none';
                        if (editPageNav) editPageNav.style.display = 'none';
                    }
                } catch (error) {
                    console.error("main.js: Error fetching user document from Firestore:", error);
                    window.showMessage("Error al cargar datos del perfil. Revisa las reglas de seguridad de Firestore.", 'error');
                    // En caso de error, también ocultar las opciones de admin
                    const adminNav = document.getElementById('admin-clientes-nav');
                    const adminSection = document.getElementById('administrador-clientes');
                    const editPageSection = document.getElementById('editar-pagina');
                    const editPageNav = document.getElementById('editar-pagina-nav');
                    if (adminNav) adminNav.style.display = 'none';
                    if (adminSection) adminSection.style.display = 'none';
                    if (editPageSection) editPageSection.style.display = 'none';
                    if (editPageNav) editPageNav.style.display = 'none';
                }
            }
            // loadStreamingAccounts(userId); // Ya no se usa directamente, ahora es loadPurchasedServices
            loadInicioContent();
            loadServices(); // Cargar los servicios al iniciar sesión
            loadPurchasedServices(userId); // Cargar las suscripciones compradas al iniciar sesión
        } else {
            console.log("main.js: Auth state changed: User is logged out. Redirecting if on dashboard.html");
            if (window.location.pathname.includes('dashboard.html')) {
                window.location.href = 'index.html';
            }
        }
    });

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await signOut(auth);
                window.showMessage("Has cerrado sesión.", 'info');
                console.log("main.js: User logged out. Redirecting to index.html");
                window.location.href = 'index.html'; 
            } catch (error) {
                console.error("main.js: Error al cerrar sesión:", error);
                window.showMessage("Error al cerrar sesión. Por favor, inténtalo de nuevo.", 'error');
            }
        });
    }

    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            if (profileEditForm) {
                profileEditForm.style.display = profileEditForm.style.display === 'none' ? 'flex' : 'none';
                console.log("main.js: Toggling profile edit form visibility.");
            }
        });
    }

    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', async () => {
            const user = auth.currentUser;
            if (user) {
                const newName = profileNameInput.value;
                const newLastname = profileLastnameInput.value;
                let newWhatsapp = '';

                if (profileWhatsappInput && profileWhatsappInput.value.trim()) {
                    if (itiProfile && typeof itiProfile.getNumber === 'function') {
                        if (itiProfile.isValidNumber()) {
                            newWhatsapp = itiProfile.getNumber();
                            console.log("main.js: Profile WhatsApp number valid and extracted:", newWhatsapp);
                        } else {
                            window.showMessage("Número de WhatsApp del perfil inválido.", 'error');
                            console.error("main.js: Invalid profile WhatsApp number:", profileWhatsappInput.value);
                            return; 
                        }
                    } else {
                        newWhatsapp = profileWhatsappInput.value.trim();
                        console.warn("main.js: intlTelInput not fully initialized for profile WhatsApp field. Using raw input value.", newWhatsapp);
                    }
                }

                try {
                    // --- RUTA FIRESTORE CORREGIDA para actualizar perfil ---
                    await updateDoc(doc(db, `artifacts/${appId}/users`, user.uid), {
                        name: newName,
                        lastname: newLastname,
                        whatsapp: newWhatsapp
                    });
                    window.showMessage("Perfil actualizado exitosamente!", 'success');
                    console.log("main.js: Profile updated successfully.");
                    if (userDisplayName) userDisplayName.textContent = newName || user.email;
                    profileEditForm.style.display = 'none'; 
                } catch (error) {
                    console.error("main.js: Error al actualizar perfil:", error);
                    window.showMessage("Error al actualizar perfil. Intenta de nuevo.", 'error');
                }
            }
        });
    }

    // Esta función ya no se usa para las cuentas de streaming, ahora es loadPurchasedServices
    // async function loadStreamingAccounts(userId) {
    //     console.log("main.js: Loading streaming accounts for userId:", userId);
    //     // ... (código anterior)
    // }


    // if (addAccountBtn) { // Este botón ya no es necesario aquí
    //     addAccountBtn.addEventListener('click', () => {
    //         window.showModal('Funcionalidad para añadir nueva cuenta (próximamente).', 'alert');
    //     });
    // }

    async function loadInicioContent() {
        console.log("main.js: Loading inicio content.");
        if (!inicioDynamicContent) {
            console.warn("main.js: inicioDynamicContent element not found.");
            return;
        }
        try {
            // --- RUTA FIRESTORE CORREGIDA para contenido de la página ---
            const websiteContentDocRef = doc(db, `artifacts/${appId}/public/data/websiteContent`, 'mainPage');
            const contentDocSnap = await getDoc(websiteContentDocRef);
            if (contentDocSnap.exists()) {
                const contentData = contentDocSnap.data();
                inicioDynamicContent.textContent = contentData.inicioText || 'Aquí encontrarás información relevante sobre tus suscripciones y novedades.';
                console.log("main.js: Dynamic inicio content loaded from correct path.");
            } else {
                inicioDynamicContent.textContent = 'Aquí encontrarás información relevante sobre tus suscripciones y novedades.';
                console.warn("main.js: No se encontró el documento 'mainPage' en la colección 'websiteContent' en la ruta esperada:", `artifacts/${appId}/public/data/websiteContent/mainPage`);
            }
        } catch (error) {
            console.error('main.js: Error al cargar contenido de inicio:', error);
            inicioDynamicContent.textContent = 'Error al cargar la información. Intenta de nuevo.';
        }
    }

    // --- FUNCIÓN: Cargar Servicios Públicos ---
    async function loadServices() {
        console.log("main.js: loadServices: Iniciando carga de servicios públicos.");
        if (!servicesListContainer) {
            console.warn("main.js: loadServices: servicesListContainer element not found.");
            return;
        }
        servicesListContainer.innerHTML = '<p>Cargando servicios...</p>'; // Mensaje de carga

        try {
            // Ruta para los servicios públicos
            const servicesCollectionRef = collection(db, `artifacts/${appId}/public/data/services`);
            console.log("main.js: loadServices: Intentando obtener servicios de la ruta:", `artifacts/${appId}/public/data/services`);
            const querySnapshot = await getDocs(servicesCollectionRef);

            servicesListContainer.innerHTML = ''; // Limpiar el contenedor
            if (querySnapshot.empty) {
                servicesListContainer.innerHTML = '<p>No hay servicios disponibles en este momento.</p>';
                console.log("main.js: loadServices: No se encontraron servicios.");
            } else {
                let servicesHtml = '';
                querySnapshot.forEach((doc) => {
                    const service = doc.data();
                    const serviceId = doc.id;
                    console.log("main.js: loadServices: Procesando servicio:", service);
                    const imageUrl = service.imageUrl || 'https://placehold.co/300x200/cccccc/000000?text=No+Image';

                    servicesHtml += `
                        <div class="service-card">
                            <img src="${imageUrl}" alt="${service.name || 'Servicio'}" class="service-image" onerror="this.onerror=null;this.src='https://placehold.co/300x200/cccccc/000000?text=No+Image';">
                            <h3>${service.name || 'Servicio Desconocido'}</h3>
                            <p class="service-price">${service.price ? `$${service.price}` : 'Precio no disponible'}</p>
                            <button class="primary-button small-button view-details-btn" 
                                data-id="${serviceId}"
                                data-name="${service.name || ''}"
                                data-image="${imageUrl}"
                                data-price="${service.price || ''}"
                                data-description="${service.description || 'No hay detalles disponibles para este servicio.'}">
                                Ver Detalles
                            </button>
                        </div>
                    `;
                });
                servicesListContainer.innerHTML = servicesHtml;
                console.log(`main.js: loadServices: Se cargaron ${querySnapshot.size} servicios.`);

                // Añadir event listeners a los botones "Ver Detalles"
                servicesListContainer.querySelectorAll('.view-details-btn').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const serviceData = e.target.dataset;
                        showServiceDetailsModal(serviceData);
                    });
                });
            }
        } catch (error) {
            console.error("main.js: loadServices: Error al cargar servicios:", error);
            servicesListContainer.innerHTML = '<p>Error al cargar los servicios. Intenta de nuevo más tarde.</p>';
        }
    }

    // Función para mostrar el modal de detalles del servicio
    function showServiceDetailsModal(serviceData) {
        console.log("main.js: showServiceDetailsModal: Abriendo modal para:", serviceData.name);
        if (!serviceDetailModal) {
            console.error("main.js: showServiceDetailsModal: serviceDetailModal not found.");
            return;
        }
        serviceDetailName.textContent = serviceData.name;
        serviceDetailImage.src = serviceData.image;
        serviceDetailPrice.textContent = serviceData.price ? `Precio: $${serviceData.price}` : 'Precio: No disponible';
        serviceDetailDescription.textContent = serviceData.description;

        // Configurar el botón de compra con los datos del servicio
        buyServiceBtn.onclick = () => {
            purchaseService(serviceData.id, serviceData.name, serviceData.price);
        };

        serviceDetailModal.style.display = 'flex'; // Usar flex para centrar
        console.log("main.js: showServiceDetailsModal: Displaying service details for:", serviceData.name);
    }

    // --- NUEVA FUNCIÓN: Comprar Servicio (Simulada) ---
    async function purchaseService(serviceId, serviceName, servicePrice) {
        const user = auth.currentUser;
        if (!user) {
            window.showMessage("Debes iniciar sesión para comprar servicios.", 'error');
            return;
        }

        window.showModal(`¿Confirmas la compra de "${serviceName}" por $${servicePrice}?`, 'confirm', async () => {
            try {
                const purchaseDate = new Date();
                const activationDate = new Date();
                const cutOffDate = new Date();
                cutOffDate.setMonth(cutOffDate.getMonth() + 1); // Servicio por 1 mes

                // Ruta para la subcolección de servicios comprados por el usuario
                const purchasedServicesCollectionRef = collection(db, `artifacts/${appId}/users/${user.uid}/purchasedServices`);
                
                await addDoc(purchasedServicesCollectionRef, {
                    serviceId: serviceId,
                    serviceName: serviceName,
                    price: parseFloat(servicePrice), // Asegurarse de que el precio sea un número
                    purchaseDate: serverTimestamp(), // Firestore Timestamp
                    activationDate: activationDate, // JavaScript Date object
                    cutOffDate: cutOffDate, // JavaScript Date object
                    status: 'active',
                    // ADVERTENCIA DE SEGURIDAD: No almacenar credenciales sensibles aquí.
                    // Esto es un placeholder. La cuenta real y contraseña deberían
                    // ser entregadas de forma segura (ej. por WhatsApp/email del admin).
                    accountDetails: `Detalles de acceso para ${serviceName} serán enviados a tu WhatsApp/Email registrado.`, 
                    userId: user.uid
                });

                window.showMessage(`¡"${serviceName}" comprado con éxito! Revisa "Mis Suscripciones".`, 'success');
                serviceDetailModal.style.display = 'none'; // Cerrar modal de detalles
                loadPurchasedServices(user.uid); // Recargar la lista de suscripciones
                showSection('#mis-suscripciones'); // Navegar a la sección de suscripciones
                console.log(`main.js: purchaseService: Servicio ${serviceName} comprado y registrado para el usuario ${user.uid}`);

            } catch (error) {
                console.error("main.js: purchaseService: Error al registrar la compra:", error);
                window.showMessage("Error al procesar la compra. Intenta de nuevo.", 'error');
            }
        });
    }

    // --- NUEVA FUNCIÓN: Cargar Servicios Comprados por el Usuario ---
    async function loadPurchasedServices(userId) {
        console.log("main.js: loadPurchasedServices: Iniciando carga de suscripciones para userId:", userId);
        if (!purchasedServicesList) {
            console.warn("main.js: loadPurchasedServices: purchasedServicesList element not found.");
            return;
        }
        purchasedServicesList.innerHTML = '<p>Cargando tus suscripciones...</p>';

        try {
            const q = query(collection(db, `artifacts/${appId}/users/${userId}/purchasedServices`));
            const querySnapshot = await getDocs(q);

            purchasedServicesList.innerHTML = '';
            if (querySnapshot.empty) {
                purchasedServicesList.innerHTML = '<p>No tienes suscripciones activas.</p>';
                console.log("main.js: loadPurchasedServices: No se encontraron suscripciones para el usuario.");
            } else {
                let subscriptionsHtml = '<div class="subscriptions-grid">'; // Usar un grid para las suscripciones
                querySnapshot.forEach((doc) => {
                    const subscription = doc.data();
                    const activationDate = subscription.activationDate ? subscription.activationDate.toDate().toLocaleDateString() : 'N/A';
                    const cutOffDate = subscription.cutOffDate ? subscription.cutOffDate.toDate().toLocaleDateString() : 'N/A';
                    
                    subscriptionsHtml += `
                        <div class="subscription-card">
                            <h3>${subscription.serviceName || 'Servicio Desconocido'}</h3>
                            <p><strong>Estado:</strong> <span class="status-${subscription.status || 'unknown'}">${subscription.status || 'Desconocido'}</span></p>
                            <p><strong>Activación:</strong> ${activationDate}</p>
                            <p><strong>Corte:</strong> ${cutOffDate}</p>
                            <p class="account-details-info">${subscription.accountDetails || 'Detalles no disponibles.'}</p>
                            <!-- Aquí podrías añadir botones para renovar, contactar soporte, etc. -->
                        </div>
                    `;
                });
                subscriptionsHtml += '</div>';
                purchasedServicesList.innerHTML = subscriptionsHtml;
                console.log(`main.js: loadPurchasedServices: Se cargaron ${querySnapshot.size} suscripciones.`);
            }
        } catch (error) {
            console.error("main.js: loadPurchasedServices: Error al cargar suscripciones:", error);
            purchasedServicesList.innerHTML = '<p>Error al cargar tus suscripciones. Intenta de nuevo más tarde.</p>';
        }
    }


}); // Fin de DOMContentLoaded