document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica para el formulario de login/registro en index.html ---
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const toggleToRegister = document.getElementById('toggleToRegister');
    const toggleToLogin = document.getElementById('toggleToLogin');

    if (loginForm) {
        // Asegurarse de que el formulario de login esté activo por defecto
        if (!loginForm.classList.contains('active')) {
            loginForm.classList.add('active');
        }
        if (registerForm && registerForm.classList.contains('active')) {
            registerForm.classList.remove('active');
        }

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Lógica de autenticación (simulada)
            alert('Inicio de sesión simulado exitoso. Redirigiendo al panel...');
            window.location.href = 'dashboard.html';
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Lógica de registro (simulada)
            alert('Registro simulado exitoso. Redirigiendo al panel...');
            window.location.href = 'dashboard.html';
        });
    }

    if (toggleToRegister) {
        toggleToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            if (loginForm) loginForm.classList.remove('active');
            if (registerForm) registerForm.classList.add('active');
        });
    }

    if (toggleToLogin) {
        toggleToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            if (registerForm) registerForm.classList.remove('active');
            if (loginForm) loginForm.classList.add('active');
        });
    }

    // --- Lógica para el dashboard.html ---
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a[data-section]');
    const dashboardSections = document.querySelectorAll('.dashboard-section');
    const closeAlertButton = document.querySelector('.alert-banner .close-alert');
    const alertBanner = document.querySelector('.alert-banner');
    const logoutButton = document.getElementById('logoutButton');

    // Manejar la navegación del sidebar
    if (sidebarLinks.length > 0 && dashboardSections.length > 0) {
        sidebarLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Solo prevenir el comportamiento por defecto si tiene data-section
                // y no es un enlace externo (como 'Ver Página StreamWave')
                if (link.getAttribute('data-section')) {
                    e.preventDefault();
                    const targetSectionId = link.getAttribute('data-section');

                    // Remover 'active' de todos los enlaces del sidebar y secciones
                    sidebarLinks.forEach(item => item.classList.remove('active'));
                    dashboardSections.forEach(section => section.classList.remove('active'));

                    // Añadir 'active' a la sección y enlace correspondientes
                    const targetSection = document.getElementById(targetSectionId);
                    if (targetSection) {
                        targetSection.classList.add('active');
                        link.classList.add('active');
                    }
                }
            });
        });

        // Asegurarse de que la sección 'overview' esté activa al cargar si no hay ninguna activa
        const overviewSection = document.getElementById('overview');
        const overviewLink = document.querySelector('.sidebar-nav a[data-section="overview"]');
        
        if (overviewSection && overviewLink && !overviewSection.classList.contains('active')) {
            overviewSection.classList.add('active');
            overviewLink.classList.add('active');
        } else if (!document.querySelector('.dashboard-section.active') && dashboardSections.length > 0) {
            // Si overview no existe o no tiene data-section, activa la primera
            dashboardSections[0].classList.add('active');
            if (sidebarLinks.length > 0) {
                sidebarLinks[0].classList.add('active');
            }
        }
    }

    // Cerrar el banner de alerta
    if (closeAlertButton && alertBanner) {
        closeAlertButton.addEventListener('click', () => {
            alertBanner.style.display = 'none';
        });
    }

    // Lógica para el botón de cerrar sesión
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            alert('Sesión cerrada. Redirigiendo a la página de inicio de sesión...');
            window.location.href = 'index.html'; // Redirige al login
        });
    }

    // --- Lógica para el Modal de Producto ---
    const productModal = document.getElementById('productModal');
    const addProductBtn = document.getElementById('addProductBtn');
    const closeModalBtn = document.querySelector('#productModal .close-button');
    const productForm = document.getElementById('productForm');
    const modalTitle = document.getElementById('modalTitle');
    const saveProductBtn = document.getElementById('saveProductBtn');

    // Abre el modal al hacer clic en "Añadir Nuevo Producto"
    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => {
            productForm.reset(); // Limpia el formulario para un nuevo producto
            modalTitle.textContent = 'Añadir Nuevo Producto Streaming';
            saveProductBtn.textContent = 'Guardar Producto';
            productModal.classList.add('show');
        });
    }

    // Cierra el modal al hacer clic en la 'x'
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            productModal.classList.remove('show');
        });
    }

    // Cierra el modal al hacer clic fuera del contenido
    if (productModal) {
        window.addEventListener('click', (event) => {
            if (event.target == productModal) {
                productModal.classList.remove('show');
            }
        });
    }

    // Manejar el envío del formulario (simulado)
    if (productForm) {
        productForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Aquí iría la lógica para enviar los datos del producto a un backend
            // Por ahora, solo mostramos una alerta y cerramos el modal
            const productName = document.getElementById('product-name').value;
            const productPrice = document.getElementById('product-price').value;
            const productStock = document.getElementById('product-stock').value;
            const productStatus = document.getElementById('product-status').value;

            alert(`Producto "${productName}" (Precio: Bs. ${productPrice}, Stock: ${productStock}, Estado: ${productStatus}) guardado/actualizado simuladamente.`);
            productModal.classList.remove('show');
            // Aquí podrías añadir lógica para actualizar la tabla de productos dinámicamente
        });
    }
});