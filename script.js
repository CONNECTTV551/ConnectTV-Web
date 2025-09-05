// nombre: script.js

// ============================================
// LÓGICA DEL SITIO - NO EDITAR DESDE AQUÍ
// Los datos de los servicios ahora se cargan desde servicios.js
// ============================================
let cart = [];
let hasSoundPermission = false; 

// ============================================
// FIREBASE CONFIG
// ============================================
const firebaseConfig = {
  apiKey: "AIzaSyBFsEmOKGZoxCYEnKYajBWxy_0zq86WXlg",
  authDomain: "pagina-web-1b6c3.firebaseapp.com",
  projectId: "pagina-web-1b6c3",
  storageBucket: "pagina-web-1b6c3.appspot.com",
  messagingSenderId: "739266339786",
  appId: "1:739266339786:web:7bb98f0a9d74ddcb2ee533"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();


// --- Funciones del Carrito ---
function saveCart() {
    localStorage.setItem('connectTVCart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('connectTVCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

async function addToCart(event, serviceName, numericPrice, displayPrice, serviceType) {
    const button = event.target;
    button.classList.add('loading');
    button.disabled = true;

    const existingItem = cart.find(item => item.name === serviceName);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name: serviceName, price: numericPrice, displayPrice: displayPrice, quantity: 1, months: 1, type: serviceType });
    }
    saveCart();
    updateCartDisplay();
    showNotification('✅ ¡Producto agregado al carrito!');
    await playSound('addSound');

    setTimeout(() => {
        button.classList.remove('loading');
        button.disabled = false;
    }, 1000); // Mantiene el spinner por 1 segundo
}

async function removeFromCart(serviceName) {
    cart = cart.filter(item => item.name !== serviceName);
    saveCart();
    updateCartDisplay();
    showNotification('🗑️ Producto eliminado del carrito.', 'remove');
    await playSound('removeSound');
}

function updateQuantity(serviceName, change) {
    const item = cart.find(item => item.name === serviceName);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(serviceName);
            return; // Salimos para evitar doble guardado
        }
    }
    saveCart();
    updateCartDisplay();
}

function updateDuration(serviceName, newDuration) {
    const item = cart.find(item => item.name === serviceName);
    if (item) {
        item.months = parseInt(newDuration, 10);
    }
    saveCart();
    updateCartDisplay();
}

function emptyCart() {
    if (cart.length > 0 && confirm("¿Estás seguro de que quieres vaciar tu carrito?")) {
        cart = [];
        saveCart();
        updateCartDisplay();
        showNotification('🛒 Carrito vaciado.', 'remove');
    }
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const totalAmount = document.getElementById('totalAmount');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    const cartTotalSection = document.getElementById('cartTotalSection');
    const cartActions = document.querySelector('.cart-actions');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Evita la animación en la carga inicial de la página
    const isInitialLoad = cartCount.textContent === '' && totalItems > 0;

    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';

    // --- LÓGICA PARA LA NUEVA ANIMACIÓN DEL CONTADOR ---
    if (!isInitialLoad && totalItems >= 0) {
        cartCount.classList.remove('cart-updated'); 
        void cartCount.offsetWidth; 
        cartCount.classList.add('cart-updated');
    }
    // --- FIN DE LA LÓGICA DE ANIMACIÓN ---

    if (cart.length === 0) {
        if(emptyCartMessage) emptyCartMessage.style.display = 'block';
        if(cartItems) cartItems.innerHTML = '';
        if(cartTotalSection) cartTotalSection.style.display = 'none';
        if(cartActions) cartActions.style.display = 'none';
    } else {
        if(emptyCartMessage) emptyCartMessage.style.display = 'none';
        if(cartTotalSection) cartTotalSection.style.display = 'block';
        if(cartActions) cartActions.style.display = 'flex';
        if(cartItems) {
            cartItems.innerHTML = cart.map(item => {
                const safeItemName = item.name.replace(/[^a-zA-Z0-9]/g, '-');
                let durationControlsHTML = '';
                let subtotalHTML = '';

                if (item.type === 'combo') {
                    item.months = 1; 
                    durationControlsHTML = `<div class="quantity-controls"><span style="font-size: 0.8em; margin-right: 5px;">Duración:</span><span style="font-weight: bold;">1 Mes</span></div>`;
                } else {
                    durationControlsHTML = `<div class="quantity-controls"><label for="months-${safeItemName}" style="font-size: 0.8em; margin-right: 5px;">Meses:</label><select id="months-${safeItemName}" onchange="updateDuration('${item.name}', this.value)" style="background: var(--input-bg); color: var(--text-color); border: 1px solid var(--card-border); border-radius: 5px; padding: 3px; cursor: pointer;"><option value="1" ${item.months === 1 ? 'selected' : ''}>1 Mes</option><option value="2" ${item.months === 2 ? 'selected' : ''}>2 Meses</option><option value="3" ${item.months === 3 ? 'selected' : ''}>3 Meses</option></select></div>`;
                }

                const originalSubtotal = item.price * item.quantity * item.months;
                let finalSubtotal = originalSubtotal;

                if (item.months === 3 && item.type !== 'combo') {
                    const discount = originalSubtotal * 0.05;
                    finalSubtotal = originalSubtotal - discount;
                    subtotalHTML = `<div class="discount-details"><span class="original-price">${originalSubtotal.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs</span> <span>(5% Dcto.)</span></div> <div>${finalSubtotal.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs</div>`;
                } else {
                    subtotalHTML = `${finalSubtotal.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs`;
                }
                
                item.finalSubtotal = finalSubtotal;

                return `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${item.displayPrice} / mes</div>
                    </div>
                    <div class="cart-item-controls">
                        ${durationControlsHTML}
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="updateQuantity('${item.name}', -1)">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity('${item.name}', 1)">+</button>
                        </div>
                        <button class="remove-btn" onclick="removeFromCart('${item.name}')">Eliminar</button>
                    </div>
                     <div style="width: 100%; text-align: right; font-weight: bold; margin-top: 10px; font-size: 1.1em;">
                        Subtotal: ${subtotalHTML}
                    </div>
                </div>`;
            }).join('');
        }

        const total = cart.reduce((sum, item) => sum + item.finalSubtotal, 0);
        if(totalAmount) totalAmount.textContent = `${total.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs`;
    }
}

function createServiceCard(service, index) {
    const card = document.createElement('div');
    card.className = `service-card ${!service.available ? 'out-of-stock' : ''}`;
    card.style.setProperty('--card-index', index);
    
    const popularBadge = service.popular ? '<div class="popular-badge">🔥 Más Vendido</div>' : '';
    
    card.innerHTML = `
        ${popularBadge}
        <div>
            <img src="${service.image}" alt="${service.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjMzMzMzMzIi8+Cjx0ZXh0IHg9IjYwIiB5PSI2MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzAwZmYwMCIgZm9udC1zaXplPSIxMiI+${service.name.replace(/ /g, '%20').split('%20')[0].substring(0,6)}</dGV4dD48L3N2Zz4='}">
            <h3>${service.name}</h3>
        </div>
        <div class="service-info">
            <div>
                <div class="service-details">📅 ${service.duration}</div>
                <div class="service-details">🔴 ${service.devices}</div>
                <div class="price">${service.price}</div>
                <div class="details-toggle" onclick="toggleDetails('${service.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '')}')">ℹ️ Ver Detalles</div>
                <div class="service-details-content" id="details-${service.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '')}">
                    <ul>${service.details.map(detail => `<li>${detail}</li>`).join('')}</ul>
                </div>
            </div>
            <button class="add-to-cart-btn ${!service.available ? 'out-of-stock' : ''}" onclick="addToCart(event, '${service.name}', ${service.numericPrice}, '${service.price}', '${service.type}')" ${!service.available ? 'disabled' : ''}>
                ${service.available ? '🛒 Agregar al Carrito' : '<i class="fas fa-ban"></i> Agotado'}
            </button>
        </div>
    `;
    return card;
}

function searchServices() {
    const input = document.getElementById('serviceSearch');
    const filter = input.value.toUpperCase();
    const grids = document.querySelectorAll('.services-grid');
    const noResultsMessage = document.getElementById('noResultsMessage');
    let resultsFound = false;

    grids.forEach(grid => {
        const cards = grid.getElementsByClassName('service-card');
        for (let card of cards) {
            const h3 = card.getElementsByTagName("h3")[0];
            if (h3) {
                const txtValue = h3.textContent || h3.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    card.style.display = "";
                    resultsFound = true;
                } else {
                    card.style.display = "none";
                }
            }
        }
    });

    noResultsMessage.style.display = resultsFound ? "none" : "block";
}


// --- Lógica de Navegación, UI y Ordenamiento ---

function renderServices(gridId, servicesArray) {
    const grid = document.getElementById(gridId);
    if (grid) {
        grid.innerHTML = servicesArray.map((s, i) => createServiceCard(s, i).outerHTML).join('');
    }
}

function sortServices(criteria) {
    const activeTab = document.querySelector('.services-container.active');
    if (!activeTab) return;

    const gridId = activeTab.querySelector('.services-grid').id;
    let servicesArray;
    
    // Mapea el ID del grid al array de datos correspondiente
    switch(gridId) {
        case 'perfilesGrid': servicesArray = [...perfiles]; break;
        case 'cuentasGrid': servicesArray = [...cuentas]; break;
        case 'combosGrid': servicesArray = [...combos]; break;
        case 'otrosGrid': servicesArray = [...otros]; break;
        default: return;
    }

    if (criteria === 'popular') {
        servicesArray.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    } else if (criteria === 'price-asc') {
        servicesArray.sort((a, b) => a.numericPrice - b.numericPrice);
    } else if (criteria === 'price-desc') {
        servicesArray.sort((a, b) => b.numericPrice - a.numericPrice);
    }

    // Actualiza los botones activos
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick').includes(criteria)) {
            btn.classList.add('active');
        }
    });

    renderServices(gridId, servicesArray);
}

function loadServices() {
    const loader = document.getElementById('servicesLoader');
    if (!loader) return;
    loader.style.display = 'flex';

    setTimeout(() => {
        renderServices('perfilesGrid', perfiles);
        renderServices('cuentasGrid', cuentas);
        renderServices('combosGrid', combos);
        renderServices('otrosGrid', otros);
        renderServices('featuredOffersGrid', featuredOffers);
        sortServices('popular'); // Ordena por popularidad por defecto
        loader.style.display = 'none';
    }, 500);
}

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');

    document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === sectionId) {
            link.classList.add('active');
        }
    });

    if (sectionId === 'store') showServicesTab('perfiles');
}

function showServicesTab(tabName) {
    document.querySelectorAll('.services-container').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    // Al cambiar de pestaña, re-aplica el ordenamiento actual
    const activeSortBtn = document.querySelector('.sort-btn.active');
    const sortCriteria = activeSortBtn ? activeSortBtn.getAttribute('onclick').match(/'([^']+)'/)[1] : 'popular';
    sortServices(sortCriteria);
}


// --- Mensajes de WhatsApp ---
function sendSupportMessage() {
    const message = `👋 ¡Hola ConnectTV! Necesito ayuda con un problema.\n\n*🚨 MI ERROR O PROBLEMA ES:*\n(Describe aquí tu inconveniente)\n\n*📺 SERVICIO AFECTADO:*\n(Ej: Netflix, Disney+)\n\n*🔍 YA INTENTÉ:*\n(Ej: Reiniciar la app, cambiar de dispositivo)\n\nEspero su pronta respuesta. ¡Gracias!`;
    window.open(`https://wa.me/584242357804?text=${encodeURIComponent(message)}`, '_blank');
}

function sendResellerMessage() {
    const message = `👋 ¡Hola ConnectTV! Estoy interesado/a en obtener información sobre los precios y condiciones para ser distribuidor. ¡Gracias!`;
    window.open(`https://wa.me/584242357804?text=${encodeURIComponent(message)}`, '_blank');
}

// ============================================
// FUNCIÓN DE CHECKOUT MODIFICADA
// ============================================
function processCheckout() {
    const customerName = document.getElementById('customerName').value.trim();
    if (!customerName) {
        alert('Por favor, ingresa tu nombre para continuar.');
        navigateToStep(2);
        return;
    }

    const formatDate = (date) => date.toLocaleDateString('es-VE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    const today = new Date();
    const orderId = Date.now().toString().slice(-6);

    const maxMonths = cart.length > 0 ? Math.max(...cart.map(item => item.months)) : 1;
    const expiryDate = new Date(today);
    expiryDate.setMonth(expiryDate.getMonth() + maxMonths);

    const total = cart.reduce((sum, item) => sum + item.finalSubtotal, 0);

    const itemsList = cart.map(item => {
        let priceDetail = `(${item.finalSubtotal.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs)`;
        return `• ${item.quantity}x ${item.name} / ${item.months} ${item.months > 1 ? 'Meses' : 'Mes'} ${priceDetail}`;
    }).join('\n');

    const message = `✨ *¡FACTURA DE COMPRA - CONNECTTV!* ✨\n` +
                    `-----------------------------------\n` +
                    `👤 *Cliente:* ${customerName}\n` +
                    `🗓️ *Fecha:* ${formatDate(today)}\n` +
                    `🔖 *ID de Pedido:* ${orderId}\n` +
                    `-----------------------------------\n` +
                    `🛍️ *DETALLES DEL PEDIDO:*\n` +
                    `${itemsList}\n` +
                    `-----------------------------------\n` +
                    `⏳ *PERÍODO DEL SERVICIO:*\n` +
                    `   *Activación:* ${formatDate(today)}\n` +
                    `   *Vencimiento:* ${formatDate(expiryDate)}\n` +
                    `-----------------------------------\n` +
                    `💳 *TOTAL A PAGAR:* *${total.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs*\n` +
                    `-----------------------------------\n` +
                    `🔐 *TUS CREDENCIALES DE ACCESO*\n` +
                    `_(Una vez verificado tu pago, recibirás los datos aquí)_\n\n` +
                    `*▫️ Correo/Usuario:*\n` +
                    `*▫️ Contraseña:*\n` +
                    `*▫️ Perfil:*\n` +
                    `*▫️ PIN:*\n` +
                    `-----------------------------------\n` +
                    `*¡Gracias por tu compra!* 🍿 A disfrutar.\n` +
                    `Para soporte, contáctanos. 💚`;


    window.open(`https://wa.me/584242357804?text=${encodeURIComponent(message)}`, '_blank');

    cart = [];
    saveCart();
    updateCartDisplay();
    closeCart();
}


// --- Lógica para el Modal de Términos y Condiciones ---
function setupTermsModal() {
    const modal = document.getElementById('termsModal');
    const link = document.getElementById('termsLink');
    const closeBtn = document.querySelector('.terms-modal-close');

    if (!modal || !link || !closeBtn) return;

    link.onclick = function(event) {
        event.preventDefault();
        modal.style.display = 'block';
    }

    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }

    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
}


// --- Inicialización y Event Listeners ---
document.addEventListener('DOMContentLoaded', function() {
    setupAuth();
});


// ============================================
// LÓGICA DE PERMISO DE SONIDO
// ============================================
function setupSoundPermission() {
    const modal = document.getElementById('sound-permission-modal');
    const confirmBtn = document.getElementById('confirm-sound-btn');
    if (!modal || !confirmBtn) return;
    
    const permissionGiven = localStorage.getItem('soundPermissionGiven');

    if (permissionGiven) {
        hasSoundPermission = true;
        modal.style.display = 'none';
        return;
    }

    modal.classList.add('visible');

    confirmBtn.addEventListener('click', async () => {
        await playSound('addSound');
        hasSoundPermission = true;
        localStorage.setItem('soundPermissionGiven', 'true');
        modal.classList.remove('visible');
         setTimeout(() => {
             modal.style.display = 'none';
         }, 400);
    });
}


// ============================================
// LÓGICA DE AUTENTICACIÓN (MODIFICADA)
// ============================================

function setupAuth() {
    const authGate = document.getElementById('auth-gate');
    const mainApp = document.getElementById('main-app');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const logoutBtn = document.getElementById('logout-btn');
    const userEmailSpan = document.getElementById('user-email');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');

    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginView.classList.add('hidden');
        registerView.classList.remove('hidden');
    });

     showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerView.classList.add('hidden');
        loginView.classList.remove('hidden');
    });

    auth.onAuthStateChanged(user => {
        if (user) {
            authGate.classList.add('hidden');
            mainApp.classList.remove('hidden');
            userEmailSpan.textContent = user.displayName || user.email;
            initializeApp(); 
        } else {
            authGate.classList.remove('hidden');
            mainApp.classList.add('hidden');
            userEmailSpan.textContent = '';
        }
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        const errorP = document.getElementById('register-error');
        errorP.textContent = '';

        if (password !== confirmPassword) {
            errorP.textContent = 'Las contraseñas no coinciden.';
            return;
        }

        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                return user.updateProfile({
                    displayName: name
                }).then(() => {
                     console.log('User registered and profile updated:', user);
                });
            })
            .catch((error) => {
                errorP.textContent = error.message;
            });
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const errorP = document.getElementById('login-error');
        errorP.textContent = '';

        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                console.log('User logged in:', userCredential.user);
            })
            .catch((error) => {
                 errorP.textContent = error.message;
            });
    });

    logoutBtn.addEventListener('click', () => {
        auth.signOut().then(() => {
            console.log('User signed out');
        }).catch((error) => {
            console.error('Sign out error', error);
        });
    });
}

function initializeApp() {
    setupSoundPermission();
    loadCart();
    createParticles();
    loadServices();
    updateCartDisplay();
    createDots();
    showSection('home');
    setupFAQAccordion();
    setupTermsModal();
    loadTheme();
    document.querySelectorAll('audio').forEach(audio => audio.load());
}


// ============================================
// El resto de funciones de UI (sin cambios mayores)
// ============================================
const carouselWrapper = document.getElementById('carouselWrapper');
const carouselDots = document.getElementById('carouselDots');
const carouselItems = document.querySelectorAll('.carousel-item');
let currentSlide = 0;
function createDots() { if (!carouselDots) return; carouselDots.innerHTML = ''; carouselItems.forEach((_, index) => { const dot = document.createElement('div'); dot.classList.add('dot'); if (index === 0) dot.classList.add('active'); dot.addEventListener('click', () => changeSlide(index)); carouselDots.appendChild(dot); }); }
function updateCarousel() { if (!carouselWrapper) return; carouselWrapper.style.transform = `translateX(-${currentSlide * 100}%)`; document.querySelectorAll('.dot').forEach((dot, index) => { dot.classList.toggle('active', index === currentSlide); }); }
function changeSlide(index) { currentSlide = index; updateCarousel(); }
function autoSlide() { if (carouselItems.length > 0) { currentSlide = (currentSlide + 1) % carouselItems.length; updateCarousel(); } }
setInterval(autoSlide, 5000);
function createParticles() { const particles = document.getElementById('particles'); if(!particles) return; for (let i = 0; i < 15; i++) { const particle = document.createElement('div'); particle.className = 'particle'; particle.style.left = Math.random() * 100 + '%'; particle.style.animationDelay = Math.random() * 15 + 's'; particle.style.animationDuration = (Math.random() * 10 + 10) + 's'; particles.appendChild(particle); } }
function toggleDetails(serviceId) { const detailsElement = document.getElementById(`details-${serviceId}`); if (detailsElement.classList.contains('active')) { detailsElement.classList.remove('active'); event.target.innerHTML = 'ℹ️ Ver Detalles'; } else { document.querySelectorAll('.service-details-content.active').forEach(el => el.classList.remove('active')); document.querySelectorAll('.details-toggle').forEach(btn => btn.innerHTML = 'ℹ️ Ver Detalles'); detailsElement.classList.add('active'); event.target.innerHTML = '❌ Cerrar Detalles'; } }

async function playSound(soundId) {
    if (!hasSoundPermission && !localStorage.getItem('soundPermissionGiven')) return;
    
    const sound = document.getElementById(soundId);
    if (!sound) {
        console.error(`Sound element with id "${soundId}" not found.`);
        return;
    }
    sound.currentTime = 0;
    sound.volume = 0.5;

    try {
        await sound.play();
    } catch (error) {
        console.error(`Error playing sound "${soundId}":`, error);
    }
}

function showNotification(message, type = 'add') { const notification = document.createElement('div'); const color = type === 'add' ? 'linear-gradient(45deg, var(--primary-color), #00cc00)' : 'linear-gradient(45deg, #ff9800, #ff5722)'; notification.style.cssText = `position: fixed; top: 100px; right: 20px; background: ${color}; color: black; padding: 1rem 1.5rem; border-radius: 10px; font-weight: bold; z-index: 10000; animation: slideInRight 0.3s ease, slideOutRight 0.3s ease 2.7s; box-shadow: 0 5px 15px rgba(0, 255, 0, 0.4);`; notification.innerHTML = message; document.body.appendChild(notification); setTimeout(() => notification.remove(), 3000); }
function openCart() { document.getElementById('cartModal').style.display = 'block'; document.body.style.overflow = 'hidden'; navigateToStep(1); }
function closeCart() { document.getElementById('cartModal').style.display = 'none'; document.body.style.overflow = 'auto'; }

function navigateToStep(step) {
    if (step > 2 && !document.getElementById('customerName').value.trim()) {
        alert('Por favor, ingresa tu nombre para continuar.');
        document.getElementById('customerName').focus();
        navigateToStep(2);
        return;
    }
    document.querySelectorAll('.cart-step').forEach(s => s.classList.remove('active'));
    document.getElementById(`cart-step-${step}`).classList.add('active');
    
    const progressBar = document.getElementById('progressBar');
    if (cart.length > 0) {
        progressBar.style.display = 'flex';
        document.querySelectorAll('.progress-step').forEach(p => {
            p.classList.remove('active', 'completed');
            const pStep = parseInt(p.dataset.step);
            if (pStep < step) {
                p.classList.add('completed');
            } else if (pStep === step) {
                p.classList.add('active');
            }
        });
    } else {
        progressBar.style.display = 'none';
    }

    const cartTitle = document.getElementById('cart-title');
    if(step === 1) cartTitle.innerText = "🛒 Tu Carrito de Compras";
    if(step === 2) cartTitle.innerText = "📝 Completa tus Datos";
    if(step === 3) cartTitle.innerText = "🏦 Realiza tu Pago";
    if(step === 4) {
        cartTitle.innerText = "✅ Confirma tu Pedido";
        generateFinalSummary();
    }
}

async function copyToClipboard(elementId) {
    try {
        const textToCopy = document.getElementById(elementId).innerText;
        await navigator.clipboard.writeText(textToCopy);
        showNotification('✅ ¡Copiado al portapapeles!');
    } catch (err) {
        console.error('Error al copiar: ', err);
        showNotification('❌ Error al copiar.', 'remove');
    }
}

function generateFinalSummary() { const customerName = document.getElementById('customerName').value.trim(); const itemsList = cart.map(item => `<tr><td style="padding: 5px; text-align: left;">${item.quantity}x ${item.name} (${item.months} ${item.months > 1 ? 'Meses' : 'Mes'})</td><td style="padding: 5px; text-align: right;">${item.finalSubtotal.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs</td></tr>`).join(''); const summaryHTML = `<div style="text-align: left; padding: 10px;"><p><strong>Cliente:</strong> ${customerName}</p><hr style="border-color: rgba(0,255,0,0.2); margin: 1rem 0;"><table style="width: 100%; border-collapse: collapse;"><thead><tr><th style="text-align: left; padding-bottom: 5px; border-bottom: 1px solid rgba(0,255,0,0.2);">Descripción</th><th style="text-align: right; padding-bottom: 5px; border-bottom: 1px solid rgba(0,255,0,0.2);">Subtotal</th></tr></thead><tbody>${itemsList}</tbody></table></div>`; document.getElementById('finalSummary').innerHTML = summaryHTML; const total = cart.reduce((sum, item) => sum + item.finalSubtotal, 0); document.getElementById('finalTotalAmount').textContent = `${total.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs`; }
function setupFAQAccordion() { document.querySelectorAll('.faq-question').forEach(q => { q.addEventListener('click', () => { const parentItem = q.parentElement; const isActive = parentItem.classList.contains('active'); document.querySelectorAll('.faq-item.active').forEach(i => i.classList.remove('active')); if (!isActive) parentItem.classList.add('active'); }); }); }
function toggleMobileMenu() { document.getElementById('mobileMenu').classList.toggle('active'); }
window.onclick = (event) => { if (event.target == document.getElementById('cartModal')) closeCart(); }
const desktopToggle = document.getElementById('theme-toggle');
const mobileToggle = document.getElementById('mobile-theme-toggle');
function setTheme(isLight) { if (isLight) { document.body.classList.add('light-theme'); if(desktopToggle) desktopToggle.checked = true; if(mobileToggle) mobileToggle.checked = true; localStorage.setItem('theme', 'light'); } else { document.body.classList.remove('light-theme'); if(desktopToggle) desktopToggle.checked = false; if(mobileToggle) mobileToggle.checked = false; localStorage.setItem('theme', 'dark'); } }
if(desktopToggle) desktopToggle.addEventListener('change', () => setTheme(desktopToggle.checked));
if(mobileToggle) mobileToggle.addEventListener('change', () => setTheme(mobileToggle.checked));
function loadTheme() { setTheme(localStorage.getItem('theme') === 'light'); }

// Funciones globales para HTML
window.toggleDetails = toggleDetails; 
window.addToCart = addToCart; 
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity; 
window.openCart = openCart; 
window.closeCart = closeCart;
window.processCheckout = processCheckout;
window.showServicesTab = showServicesTab; 
window.showSection = showSection; 
window.toggleMobileMenu = toggleMobileMenu;
window.sendSupportMessage = sendSupportMessage;
window.sendResellerMessage = sendResellerMessage;
window.searchServices = searchServices;
window.navigateToStep = navigateToStep;
window.updateDuration = updateDuration;
window.sortServices = sortServices;
window.copyToClipboard = copyToClipboard;
window.emptyCart = emptyCart;