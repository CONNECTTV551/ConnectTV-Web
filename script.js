document.addEventListener('DOMContentLoaded', () => {
    // Lógica para el formulario de login/registro en index.html
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const toggleToRegister = document.getElementById('toggleToRegister');
    const toggleToLogin = document.getElementById('toggleToLogin');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Aquí iría la lógica de autenticación real.
            // Por ahora, simulamos un éxito y redirigimos.
            alert('Inicio de sesión simulado exitoso. Redirigiendo al dashboard...');
            window.location.href = 'dashboard.html'; // Redirige al nuevo dashboard
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Aquí iría la lógica de registro real.
            // Por ahora, simulamos un éxito y redirigimos.
            alert('Registro simulado exitoso. Redirigiendo al dashboard...');
            window.location.href = 'dashboard.html'; // Redirige al nuevo dashboard
        });
    }

    if (toggleToRegister) {
        toggleToRegister.addEventListener('click', () => {
            if (loginForm) loginForm.style.display = 'none';
            if (registerForm) registerForm.style.display = 'block';
        });
    }

    if (toggleToLogin) {
        toggleToLogin.addEventListener('click', () => {
            if (registerForm) registerForm.style.display = 'none';
            if (loginForm) loginForm.style.display = 'block';
        });
    }

    // Lógica para el dashboard.html
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    const dashboardSections = document.querySelectorAll('.dashboard-section');
    const closeAlertButton = document.querySelector('.alert-banner .close-alert');
    const alertBanner = document.querySelector('.alert-banner');

    // Manejar la navegación del sidebar
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSectionId = link.dataset.section;

            // Remover la clase 'active' de todos los enlaces y secciones
            sidebarLinks.forEach(item => item.classList.remove('active'));
            dashboardSections.forEach(section => section.classList.remove('active'));

            // Añadir la clase 'active' al enlace clickeado
            link.classList.add('active');

            // Mostrar la sección correspondiente
            const targetSection = document.getElementById(targetSectionId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });

    // Cerrar el banner de alerta
    if (closeAlertButton && alertBanner) {
        closeAlertButton.addEventListener('click', () => {
            alertBanner.style.display = 'none';
        });
    }

    // Asegurarse de que la primera sección del dashboard esté activa al cargar
    if (dashboardSections.length > 0) {
        // Solo activa la primera si no hay una activa por defecto en el HTML
        if (!document.querySelector('.dashboard-section.active')) {
            dashboardSections[0].classList.add('active');
            if (sidebarLinks.length > 0) {
                sidebarLinks[0].classList.add('active');
            }
        }
    }
});