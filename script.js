document.addEventListener('DOMContentLoaded', () => {
    const sidebarButtons = document.querySelectorAll('.sidebar-button');
    const contentSections = document.querySelectorAll('.content-section-page');
    const pageTitle = document.getElementById('pageTitle');
    const whatsappNumber = '584242357804'; // Tu número de WhatsApp aquí

    // Modal de Inicio de Sesión / Registro
    const loginRegisterModal = document.getElementById('loginRegisterModal');
    const openLoginModalBtn = document.getElementById('openLoginModal');
    const closeLoginRegisterModalBtn = loginRegisterModal.querySelector('.modal-close-btn');
    const loginFormContainer = document.getElementById('loginFormContainer');
    const registerFormContainer = document.getElementById('registerFormContainer');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');

    openLoginModalBtn.addEventListener('click', () => {
        loginRegisterModal.classList.add('active');
        document.body.classList.add('modal-open');
        loginFormContainer.style.display = 'block';
        registerFormContainer.style.display = 'none';
    });

    closeLoginRegisterModalBtn.addEventListener('click', () => {
        loginRegisterModal.classList.remove('active');
        document.body.classList.remove('modal-open');
    });

    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginFormContainer.style.display = 'none';
        registerFormContainer.style.display = 'block';
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginFormContainer.style.display = 'block';
        registerFormContainer.style.display = 'none';
    });

    // Simulación de envío de formularios de autenticación
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Funcionalidad de inicio de sesión no implementada. (Simulación)');
        loginRegisterModal.classList.remove('active');
        document.body.classList.remove('modal-open');
        // Aquí iría el código real para enviar datos a un servidor
    });

    document.getElementById('registerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Funcionalidad de registro no implementada. (Simulación)');
        loginRegisterModal.classList.remove('active');
        document.body.classList.remove('modal-open');
        // Aquí iría el código real para enviar datos a un servidor
    });


    // Modal de Detalles de Servicio
    const detailsModal = document.getElementById('detailsModal');
    const closeDetailsModalBtn = document.getElementById('closeDetailsModal');
    const modalDetailsTitle = document.getElementById('modalDetailsTitle');
    const modalDetailsImage = document.getElementById('modalDetailsImage');
    const modalDetailsDescription = document.getElementById('modalDetailsDescription');
    const modalDetailsPrice = document.getElementById('modalDetailsPrice');
    const modalDetailsWhatsappBtn = document.getElementById('modalDetailsWhatsappBtn');

    const detailsButtons = document.querySelectorAll('.details-btn');

    detailsButtons.forEach(button => {
        button.addEventListener('click', () => {
            const type = button.dataset.type; // 'plan', 'perfil', 'cuenta'
            const name = button.dataset.name;
            const price = button.dataset.price;
            const description = button.dataset.description;
            const img = button.dataset.img; // Solo para perfiles y cuentas

            modalDetailsTitle.textContent = name;
            modalDetailsDescription.textContent = description;
            modalDetailsPrice.textContent = price;

            if (img) {
                modalDetailsImage.src = img;
                modalDetailsImage.style.display = 'block';
            } else {
                modalDetailsImage.style.display = 'none';
            }

            // Generar mensaje de WhatsApp específico
            let whatsappMessage = `Hola! Estoy interesado en el ${name} con un precio de ${price}. ¿Podrías darme más información?`;
            modalDetailsWhatsappBtn.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

            detailsModal.classList.add('active');
            document.body.classList.add('modal-open');
        });
    });

    closeDetailsModalBtn.addEventListener('click', () => {
        detailsModal.classList.remove('active');
        document.body.classList.remove('modal-open');
    });

    // Cerrar modales al hacer clic fuera de ellos
    loginRegisterModal.addEventListener('click', (e) => {
        if (e.target === loginRegisterModal) {
            loginRegisterModal.classList.remove('active');
            document.body.classList.remove('modal-open');
        }
    });

    detailsModal.addEventListener('click', (e) => {
        if (e.target === detailsModal) {
            detailsModal.classList.remove('active');
            document.body.classList.remove('modal-open');
        }
    });


    // Función para cambiar de sección y actualizar el título
    function showPage(pageId) {
        contentSections.forEach(section => {
            section.classList.remove('active-page');
        });
        const activeSection = document.getElementById(pageId + 'Section');
        if (activeSection) {
            activeSection.classList.add('active-page');
            switch (pageId) {
                case 'inicio':
                    pageTitle.textContent = 'ConnectTV - Inicio';
                    break;
                case 'catalogo':
                    pageTitle.textContent = 'ConnectTV - Catálogo';
                    break;
                case 'planes':
                    pageTitle.textContent = 'ConnectTV - Nuestros Planes';
                    break;
                case 'perfiles':
                    pageTitle.textContent = 'ConnectTV - Perfiles Premium';
                    break;
                case 'cuentasCompletas':
                    pageTitle.textContent = 'ConnectTV - Cuentas Completas';
                    break;
                case 'subirComprobante':
                    pageTitle.textContent = 'ConnectTV - Subir Comprobante';
                    break;
                case 'ayuda':
                    pageTitle.textContent = 'ConnectTV - Ayuda y FAQ';
                    break;
                case 'soporte':
                    pageTitle.textContent = 'ConnectTV - Soporte';
                    break;
                case 'pagar':
                    pageTitle.textContent = 'ConnectTV - Métodos de Pago';
                    break;
                default:
                    pageTitle.textContent = 'ConnectTV - Tu Plataforma de Streaming';
            }
        }
    }

    // Event Listeners para los botones de la barra lateral y los enlaces internos
    sidebarButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = button.dataset.page;

            sidebarButtons.forEach(btn => btn.classList.remove('active'));
            // Aquí, podrías necesitar un control más fino si el botón en el header y el sidebar son el mismo elemento o distintos
            // Por ahora, si son enlaces independientes, el activo se manejará por separado para header y sidebar
            // Si son los mismos elementos, esto funcionará bien.
            document.querySelectorAll(`[data-page="${pageId}"]`).forEach(btn => btn.classList.add('active'));


            showPage(pageId);
        });
    });

    // Lógica para el acordeón de FAQ
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const icon = question.querySelector('i');

            faqQuestions.forEach(q => {
                if (q !== question && q.classList.contains('active')) {
                    q.classList.remove('active');
                    q.nextElementSibling.style.display = 'none';
                    q.querySelector('i').classList.remove('bx-chevron-up');
                    q.querySelector('i').classList.add('bx-chevron-down');
                }
            });

            if (answer.style.display === 'block') {
                answer.style.display = 'none';
                question.classList.remove('active');
                icon.classList.remove('bx-chevron-up');
                icon.classList.add('bx-chevron-down');
            } else {
                answer.style.display = 'block';
                question.classList.add('active');
                icon.classList.remove('bx-chevron-down');
                icon.classList.add('bx-chevron-up');
            }
        });
    });

    // Manejar el envío del formulario de comprobante de pago (ejemplo básico)
    const paymentProofForm = document.getElementById('paymentProofForm');
    const formMessage = document.getElementById('formMessage');

    if (paymentProofForm) {
        paymentProofForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const transactionId = document.getElementById('transactionId').value;
            const paymentMethod = document.getElementById('paymentMethod').value;
            const notes = document.getElementById('notes').value;
            const proofFile = document.getElementById('proofFile').files[0];

            if (transactionId && paymentMethod && proofFile) {
                formMessage.textContent = '¡Comprobante enviado con éxito! Nos pondremos en contacto pronto.';
                formMessage.style.color = 'var(--success-color)';
                paymentProofForm.reset();

                const whatsappMsg = `Nuevo Comprobante de Pago:\n\nMétodo: ${paymentMethod}\nReferencia: ${transactionId}\nNotas: ${notes || 'N/A'}\nArchivo: ${proofFile.name} (Por favor, envía el archivo de imagen directamente a nuestro WhatsApp para acelerar la verificación).`;

                // Abrir WhatsApp con el mensaje prellenado
                window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMsg)}`, '_blank');

            } else {
                formMessage.textContent = 'Por favor, completa todos los campos requeridos (Referencia, Método y Archivo).';
                formMessage.style.color = 'var(--primary-color)';
            }
        });
    }

    // Inicializar mostrando la página de inicio
    showPage('inicio');
});