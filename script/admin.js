// script/admin.js
import { auth, db, app } from './firebase-init.js'; // Importa auth y db desde el nuevo archivo
import {
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import {
    collection,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Referencias a elementos del DOM (se obtendrán dentro de DOMContentLoaded)
let clientsTableBody;
let editClientModal;
let editClientModalCloseButton; // Renamed to avoid conflict
let editClientForm;
let resetPasswordBtn;
let deleteClientBtn;
let saveInicioTextBtn;
let editInicioTextarea;

// --- Lógica principal de la aplicación (envuelta en DOMContentLoaded) ---
document.addEventListener('DOMContentLoaded', () => {
    clientsTableBody = document.getElementById('clients-table-body');
    editClientModal = document.getElementById('edit-client-modal');
    editClientModalCloseButton = document.getElementById('edit-client-modal-close'); // Use specific ID
    editClientForm = document.getElementById('edit-client-form');
    resetPasswordBtn = document.getElementById('reset-password-btn');
    deleteClientBtn = document.getElementById('delete-client-btn');
    saveInicioTextBtn = document.getElementById('save-inicio-text');
    editInicioTextarea = document.getElementById('edit-inicio-text');


    // Función para cargar y mostrar clientes para el administrador
    async function loadClientsForAdmin() {
        if (!clientsTableBody) {
            console.error('clientsTableBody not found.');
            return;
        }
        clientsTableBody.innerHTML = ''; // Limpiar tabla antes de cargar
        try {
            const usersCollectionRef = collection(db, 'users');
            const querySnapshot = await getDocs(usersCollectionRef);
            querySnapshot.forEach(docSnapshot => {
                const client = docSnapshot.data();
                const row = clientsTableBody.insertRow();
                row.dataset.clientId = docSnapshot.id; // Guardar el ID del documento en la fila

                row.innerHTML = `
                    <td>${client.name || ''}</td>
                    <td>${client.lastname || ''}</td>
                    <td>${client.email || ''}</td>
                    <td>${client.whatsapp || ''}</td>
                    <td>
                        <button class="edit-client-btn" data-client-id="${docSnapshot.id}">Editar</button>
                    </td>
                `;
            });

            // Añadir listeners a los botones de editar
            document.querySelectorAll('.edit-client-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const clientId = e.target.dataset.clientId;
                    openEditClientModal(clientId);
                });
            });

        } catch (error) {
            console.error('Error al cargar clientes:', error.message);
            window.showMessage('Error al cargar clientes.', 'error');
        }
    }

    // Función para abrir el modal de edición de cliente
    async function openEditClientModal(clientId) {
        try {
            const clientDocRef = doc(db, 'users', clientId);
            const docSnapshot = await getDoc(clientDocRef);
            if (docSnapshot.exists()) {
                const clientData = docSnapshot.data();
                if (document.getElementById('edit-client-id')) document.getElementById('edit-client-id').value = clientId;
                if (document.getElementById('edit-client-name')) document.getElementById('edit-client-name').value = clientData.name || '';
                if (document.getElementById('edit-client-lastname')) document.getElementById('edit-client-lastname').value = clientData.lastname || '';
                if (document.getElementById('edit-client-email')) document.getElementById('edit-client-email').value = clientData.email || ''; // Correo es readonly
                if (document.getElementById('edit-client-whatsapp')) document.getElementById('edit-client-whatsapp').value = clientData.whatsapp || '';

                if (editClientModal) editClientModal.style.display = 'block';
            }
        } catch (error) {
            console.error('Error al cargar datos del cliente para edición:', error.message);
            window.showMessage('Error al cargar datos del cliente.', 'error');
        }
    }

    // Cerrar el modal de edición de cliente
    if (editClientModalCloseButton) {
        editClientModalCloseButton.addEventListener('click', () => {
            if (editClientModal) editClientModal.style.display = 'none';
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target == editClientModal) {
            if (editClientModal) editClientModal.style.display = 'none';
        }
    });

    // Guardar cambios del cliente
    if (editClientForm) {
        editClientForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const clientId = document.getElementById('edit-client-id').value;
            const newName = document.getElementById('edit-client-name').value;
            const newLastname = document.getElementById('edit-client-lastname').value;
            const newWhatsapp = document.getElementById('edit-client-whatsapp').value;

            try {
                const clientDocRef = doc(db, 'users', clientId);
                await updateDoc(clientDocRef, {
                    name: newName,
                    lastname: newLastname,
                    whatsapp: newWhatsapp
                });
                window.showMessage('Cliente actualizado con éxito!', 'success');
                if (editClientModal) editClientModal.style.display = 'none';
                loadClientsForAdmin(); // Recargar la tabla
            } catch (error) {
                console.error('Error al actualizar cliente:', error.message);
                window.showMessage('Error al actualizar cliente: ' + error.message, 'error');
            }
        });
    }

    // Restablecer contraseña para un cliente (requiere Firebase Admin SDK en tu backend o una función Cloud)
    if (resetPasswordBtn) {
        resetPasswordBtn.addEventListener('click', () => {
            const clientId = document.getElementById('edit-client-id').value;
            const clientEmail = document.getElementById('edit-client-email').value;

            window.showConfirm(`¿Estás seguro de que quieres enviar un email para restablecer la contraseña a ${clientEmail}?`, async (confirmed) => {
                if (confirmed) {
                    try {
                        await sendPasswordResetEmail(auth, clientEmail);
                        window.showMessage('Se ha enviado un correo de restablecimiento de contraseña al cliente.', 'success');
                    } catch (error) {
                        console.error('Error al restablecer contraseña:', error.message);
                        window.showMessage('Error al restablecer contraseña: ' + error.message, 'error');
                    }
                }
            });
        });
    }

    // Eliminar cliente (requiere Firebase Admin SDK en tu backend o una función Cloud)
    if (deleteClientBtn) {
        deleteClientBtn.addEventListener('click', () => {
            const clientId = document.getElementById('edit-client-id').value;
            const clientEmail = document.getElementById('edit-client-email').value;

            window.showConfirm(`¿Estás seguro de que quieres eliminar al cliente ${clientEmail}? Esta acción es irreversible.`, async (confirmed) => {
                if (confirmed) {
                    try {
                        // Primero, eliminar el documento de Firestore
                        const clientDocRef = doc(db, 'users', clientId);
                        await deleteDoc(clientDocRef);
                        // Luego, eliminar la cuenta de autenticación (esto SÍ DEBERÍA SER UNA CLOUD FUNCTION)
                        // Por ahora, solo se elimina de Firestore.
                        window.showMessage('Cliente eliminado con éxito (solo datos de Firestore). Para eliminar la cuenta de Firebase Auth, se necesita una Cloud Function.', 'success');
                        if (editClientModal) editClientModal.style.display = 'none';
                        loadClientsForAdmin(); // Recargar la tabla
                    } catch (error) {
                        console.error('Error al eliminar cliente:', error.message);
                        window.showMessage('Error al eliminar cliente: ' + error.message, 'error');
                    }
                }
            });
        });
    }

    // --- Funcionalidad de Editar y Modificar cualquier cosa de la página web (para admin) ---
    // Usaremos Firestore para almacenar el contenido editable de la página
    async function loadEditableContent() {
        try {
            const websiteContentDocRef = doc(db, 'websiteContent', 'mainPage');
            const docSnapshot = await getDoc(websiteContentDocRef);
            if (docSnapshot.exists()) {
                const content = docSnapshot.data();
                if (editInicioTextarea) {
                    editInicioTextarea.value = content.inicioText || '';
                }
                // Aquí puedes cargar más campos editables si los añades
            }
        } catch (error) {
            console.error('Error al cargar contenido editable:', error.message);
            window.showMessage('Error al cargar contenido editable.', 'error');
        }
    }

    async function saveEditableContent() {
        const inicioText = editInicioTextarea ? editInicioTextarea.value : '';

        try {
            const websiteContentDocRef = doc(db, 'websiteContent', 'mainPage');
            await setDoc(websiteContentDocRef, {
                inicioText: inicioText,
                lastUpdated: serverTimestamp()
            }, { merge: true }); // Usar merge para no sobrescribir todo el documento
            window.showMessage('Contenido de la página actualizado con éxito!', 'success');
        } catch (error) {
            console.error('Error al guardar contenido editable:', error.message);
            window.showMessage('Error al guardar contenido: ' + error.message, 'error');
        }
    }

    if (saveInicioTextBtn) {
        saveInicioTextBtn.addEventListener('click', saveEditableContent);
    }

    // Exportar funciones para que puedan ser llamadas desde main.js
    window.loadClientsForAdmin = loadClientsForAdmin;
    window.loadEditableContent = loadEditableContent;

}); // Fin de DOMContentLoaded
