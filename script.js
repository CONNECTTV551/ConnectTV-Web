document.addEventListener('DOMContentLoaded', () => {
    const sidebarButtons = document.querySelectorAll('.sidebar-button');
    const contentSections = document.querySelectorAll('.content-section-page');
    const pageTitle = document.getElementById('pageTitle'); // Obtener el elemento del título

    // Función para cambiar de sección y actualizar el título
    function showPage(pageId) {
        contentSections.forEach(section => {
            section.classList.remove('active-page');
        });
        const activeSection = document.getElementById(pageId + 'Section');
        if (activeSection) {
            activeSection.classList.add('active-page');
            // Actualizar el título de la pestaña según la sección activa
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
                case 'perfiles': // Nuevo caso para la sección de perfiles
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
                default:
                    pageTitle.textContent = 'ConnectTV - Tu Plataforma de Streaming';
            }
        }
    }

    // Event Listeners para los botones de la barra lateral
    sidebarButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = button.dataset.page;

            // Remover 'active' de todos los botones y añadirlo al clicado
            sidebarButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Mostrar la página correspondiente
            showPage(pageId);
        });
    });

    // Lógica para el acordeón de FAQ
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const icon = question.querySelector('i');

            // Cierra todas las respuestas abiertas excepto la actual
            faqQuestions.forEach(q => {
                if (q !== question && q.classList.contains('active')) {
                    q.classList.remove('active');
                    q.nextElementSibling.style.display = 'none';
                    q.querySelector('i').classList.remove('bx-chevron-up');
                    q.querySelector('i').classList.add('bx-chevron-down');
                }
            });

            // Abre o cierra la respuesta actual
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
            e.preventDefault(); // Evita que el formulario se envíe de forma tradicional
            // Aquí iría la lógica para procesar el formulario,
            // por ejemplo, enviarlo a un servicio backend o a tu WhatsApp.
            // Por ahora, solo mostraremos un mensaje.

            const transactionId = document.getElementById('transactionId').value;
            const paymentMethod = document.getElementById('paymentMethod').value;
            const notes = document.getElementById('notes').value;
            const proofFile = document.getElementById('proofFile').files[0]; // Obtener el archivo

            if (transactionId && paymentMethod && proofFile) {
                formMessage.textContent = '¡Comprobante enviado con éxito! Nos pondremos en contacto pronto.';
                formMessage.style.color = 'var(--success-color)';
                paymentProofForm.reset(); // Limpiar el formulario

                // Aquí podrías construir un mensaje de WhatsApp para ti con los detalles
                // y el nombre del archivo. El archivo en sí no se puede enviar directamente
                // desde JS a WhatsApp sin una API de por medio.
                const whatsappMsg = `Nuevo Comprobante de Pago:\n\nMétodo: ${paymentMethod}\nReferencia: ${transactionId}\nNotas: ${notes || 'N/A'}\nArchivo: ${proofFile.name}`;
                //alert(whatsappMsg); // Para depuración, puedes ver el mensaje

                // Si quieres que te redirija a WhatsApp para que envíen el archivo manualmente
                // window.open(`https://wa.me/TUNUMERODEWHATSAPP?text=${encodeURIComponent(whatsappMsg)}`, '_blank');

            } else {
                formMessage.textContent = 'Por favor, completa todos los campos requeridos.';
                formMessage.style.color = 'var(--primary-color)';
            }
        });
    }

    // Inicializar mostrando la página de inicio
    showPage('inicio');
});