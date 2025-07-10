document.addEventListener('DOMContentLoaded', () => {
    const serviceSearchInput = document.getElementById('serviceSearch');
    const serviceCards = document.querySelectorAll('.service-card');
    const noResultsMessage = document.getElementById('noResultsMessage');

    // Funcionalidad de Búsqueda de Servicios (EXISTENTE)
    if (serviceSearchInput && serviceCards.length > 0 && noResultsMessage) {
        serviceSearchInput.addEventListener('keyup', () => {
            const searchTerm = serviceSearchInput.value.toLowerCase();
            let resultsFound = false; // Bandera para saber si se encontraron resultados

            serviceCards.forEach(card => {
                const title = card.querySelector('.service-title').textContent.toLowerCase();
                const price = card.querySelector('.service-price').textContent.toLowerCase();
                const details = card.querySelector('.service-details').textContent.toLowerCase(); // Contenido de los <li>

                // Si el término de búsqueda está en el título, precio o detalles, muestra la tarjeta
                if (title.includes(searchTerm) || price.includes(searchTerm) || details.includes(searchTerm)) {
                    card.style.display = 'flex'; // Usamos 'flex' porque las tarjetas tienen display: flex; en CSS
                    resultsFound = true; // Se encontró al menos un resultado
                } else {
                    card.style.display = 'none'; // Oculta la tarjeta
                }
            });

            // Muestra u oculta el mensaje de "no resultados"
            if (resultsFound) {
                noResultsMessage.style.display = 'none';
            } else {
                noResultsMessage.style.display = 'block';
            }
        });
    } else {
        console.warn('Algunos elementos esenciales (input de búsqueda, tarjetas de servicio o mensaje de no resultados) no se encontraron. La funcionalidad de búsqueda no se activará completamente.');
    }

    // INICIO NUEVA FUNCIONALIDAD - MODAL DE WHATSAPP
    const buyButtons = document.querySelectorAll('.buy-button');
    const whatsappModal = document.getElementById('whatsappModal');
    const closeWhatsappModal = document.querySelector('.close-whatsapp-modal');
    const whatsappForm = document.getElementById('whatsappForm');
    const customerNameInput = document.getElementById('customerName');
    const serviceNameInputHidden = document.getElementById('serviceNameHidden');
    const modalServiceNameDisplay = document.getElementById('modalServiceName');

    if (buyButtons.length > 0 && whatsappModal && closeWhatsappModal && whatsappForm && customerNameInput && serviceNameInputHidden && modalServiceNameDisplay) {
        buyButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const serviceName = event.target.dataset.service;
                serviceNameInputHidden.value = serviceName;
                modalServiceNameDisplay.textContent = serviceName;
                whatsappModal.classList.add('show');
                customerNameInput.focus();
            });
        });

        closeWhatsappModal.addEventListener('click', () => {
            whatsappModal.classList.remove('show');
            customerNameInput.value = '';
        });

        window.addEventListener('click', (event) => {
            if (event.target === whatsappModal) {
                whatsappModal.classList.remove('show');
                customerNameInput.value = '';
            }
        });

        whatsappForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const customerName = customerNameInput.value.trim();
            const serviceName = serviceNameInputHidden.value;

            if (customerName === '') {
                alert('Por favor, ingresa tu nombre.');
                return;
            }

            // TU NÚMERO DE WHATSAPP ACTUALIZADO
            const yourPhoneNumber = '584242357804'; // Número de WhatsApp configurado

            const whatsappMessage = `¡Hola! Me interesa comprar el servicio de ${serviceName}. Mi nombre es: ${customerName}.`;
            const whatsappURL = `https://wa.me/${yourPhoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

            window.open(whatsappURL, '_blank');

            whatsappModal.classList.remove('show');
            customerNameInput.value = '';
        });
    } else {
        console.warn('Algunos elementos esenciales del modal de WhatsApp no se encontraron. La funcionalidad de compra no se activará completamente.');
    }
});