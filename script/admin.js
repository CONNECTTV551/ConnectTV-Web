// script/admin.js
console.log("admin.js: Script loaded."); // Confirmar que el script se carga

import { auth, db } from './firebase-init.js';
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
    serverTimestamp,
    query, 
    where  
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Obtener el ID de la aplicación del entorno Canvas
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
console.log("admin.js: App ID detected:", appId);


// --- Variables DOM (declaradas con let para poder ser inicializadas en DOMContentLoaded) ---
let clientsTableBody;
let editClientModal;
let editClientModalCloseButton;
let editClientForm;
let resetPasswordBtn;
let deleteClientBtn;
let saveInicioTextBtn;
let editInicioTextarea;

let currentEditingClientId = null;
let editClientNameInput;
let editClientLastnameInput;
let editClientEmailInput;
let editClientWhatsappInput;
let itiEditClient; 

// --- Lógica principal de la aplicación (envuelta en DOMContentLoaded) ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("admin.js: DOMContentLoaded event fired. Initializing DOM elements.");

    clientsTableBody = document.getElementById('clients-table-body');
    editClientModal = document.getElementById('edit-client-modal');
    editClientModalCloseButton = document.getElementById('edit-client-modal-close');
    editClientForm = document.getElementById('edit-client-form');
    resetPasswordBtn = document.getElementById('reset-password-btn');
    deleteClientBtn = document.getElementById('delete-client-btn');
    saveInicioTextBtn = document.getElementById('save-inicio-text');
    editInicioTextarea = document.getElementById('edit-inicio-text');

    editClientNameInput = document.getElementById('edit-client-name');
    editClientLastnameInput = document.getElementById('edit-client-lastname');
    editClientEmailInput = document.getElementById('edit-client-email');
    editClientWhatsappInput = document.getElementById('edit-client-whatsapp');

    // Log the existence of key admin UI elements that are initialized here
    console.log("admin.js: clientsTableBody found (in DOMContentLoaded):", !!clientsTableBody);
    console.log("admin.js: editClientModal found (in DOMContentLoaded):", !!editClientModal);
    console.log("admin.js: editInicioTextarea found (in DOMContentLoaded):", !!editInicioTextarea);
    console.log("admin.js: editClientNameInput found (in DOMContentLoaded):", !!editClientNameInput);
    console.log("admin.js: editClientLastnameInput found (in DOMContentLoaded):", !!editClientLastnameInput);
    console.log("admin.js: editClientEmailInput found (in DOMContentLoaded):", !!editClientEmailInput);
    console.log("admin.js: editClientWhatsappInput found (in DOMContentLoaded):", !!editClientWhatsappInput);


    if (editClientWhatsappInput && typeof window.intlTelInput === 'function') {
        itiEditClient = window.intlTelInput(editClientWhatsappInput, {
            initialCountry: "auto",
            geoIpLookup: callback => {
                fetch("https://ipapi.co/json")
                    .then(res => res.json())
                    .then(data => callback(data.country_code))
                    .catch(() => callback("us"));
            },
            utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@17.0.13/build/js/utils.js"
        });
        console.log("admin.js: intlTelInput initialized for editClientWhatsappInput.");
    } else if (editClientWhatsappInput) {
        console.warn("admin.js: intlTelInput function not available for editClientWhatsappInput. Check script tag.");
    }


    if (editClientModalCloseButton) {
        editClientModalCloseButton.addEventListener('click', () => {
            editClientModal.style.display = 'none';
            currentEditingClientId = null;
            console.log("admin.js: Edit client modal closed.");
        });
    }

    if (editClientForm) {
        editClientForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log("admin.js: Edit client form submitted.");
            if (!currentEditingClientId) {
                console.warn("admin.js: No currentEditingClientId set for form submission.");
                return;
            }

            const newName = editClientNameInput.value;
            const newLastname = editClientLastnameInput.value;
            let newWhatsapp = '';

            if (editClientWhatsappInput && editClientWhatsappInput.value.trim()) {
                if (itiEditClient && typeof itiEditClient.getNumber === 'function') {
                    if (itiEditClient.isValidNumber()) {
                        newWhatsapp = itiEditClient.getNumber();
                        console.log("admin.js: Edit Client WhatsApp number valid and extracted:", newWhatsapp);
                    } else {
                        window.showMessage("Número de WhatsApp del cliente inválido.", 'error');
                        console.error("admin.js: Invalid edit client WhatsApp number:", editClientWhatsappInput.value);
                        return;
                    }
                } else {
                    newWhatsapp = editClientWhatsappInput.value.trim();
                    console.warn("admin.js: intlTelInput not fully initialized for edit client WhatsApp field. Using raw input value.", newWhatsapp);
                }
            }


            try {
                // --- RUTA FIRESTORE CORREGIDA para actualizar cliente ---
                await updateDoc(doc(db, `artifacts/${appId}/users`, currentEditingClientId), {
                    name: newName,
                    lastname: newLastname,
                    whatsapp: newWhatsapp
                });
                window.showMessage("Cliente actualizado con éxito!", 'success');
                editClientModal.style.display = 'none';
                window.loadClientsForAdmin(); 
                console.log("admin.js: Client updated successfully for UID:", currentEditingClientId);
            } catch (error) {
                console.error("admin.js: Error al actualizar cliente:", error);
                window.showMessage("Error al actualizar cliente: " + error.message, 'error');
            }
        });
    }

    if (resetPasswordBtn) {
        resetPasswordBtn.addEventListener('click', async () => {
            console.log("admin.js: Reset password button clicked.");
            if (!currentEditingClientId) {
                window.showMessage("No hay cliente seleccionado para restablecer la contraseña.", 'info');
                return;
            }
            const userEmail = editClientEmailInput.value; 

            window.showModal(`¿Estás seguro de que quieres enviar un correo de restablecimiento de contraseña a ${userEmail}?`, 'confirm', async () => {
                try {
                    await sendPasswordResetEmail(auth, userEmail);
                    window.showMessage(`Correo de restablecimiento enviado a ${userEmail}`, 'success');
                    editClientModal.style.display = 'none';
                    console.log("admin.js: Password reset email sent to:", userEmail);
                } catch (error) {
                    console.error("admin.js: Error al enviar correo de restablecimiento:", error);
                    let errorMessage = "Error al enviar correo de restablecimiento. Intenta de nuevo.";
                    if (error.code === 'auth/user-not-found') {
                        errorMessage = "No se encontró un usuario con ese correo electrónico.";
                    }
                    window.showMessage(errorMessage, 'error');
                }
            });
        });
    }

    if (deleteClientBtn) {
        deleteClientBtn.addEventListener('click', () => {
            console.log("admin.js: Delete client button clicked.");
            if (!currentEditingClientId) return;
            const userEmail = editClientEmailInput.value;

            window.showModal(`¡ADVERTENCIA! ¿Estás seguro de que quieres eliminar al cliente ${userEmail}? Esta acción es irreversible.`, 'confirm', async () => {
                try {
                    // --- RUTA FIRESTORE CORREGIDA para eliminar cliente ---
                    await deleteDoc(doc(db, `artifacts/${appId}/users`, currentEditingClientId));
                    window.showMessage('Cliente eliminado con éxito (solo de Firestore).', 'success');
                    console.warn('admin.js: Usuario eliminado de Firestore, pero para eliminarlo de Firebase Authentication, se requiere una función de Cloud Functions o un SDK de administrador.');
                    editClientModal.style.display = 'none';
                    window.loadClientsForAdmin(); 
                } catch (error) {
                    console.error("admin.js: Error al eliminar cliente:", error);
                    window.showMessage("Error al eliminar cliente: " + error.message, 'error');
                }
            });
        });
    }


    // --- Funciones de administración ---

    // Función para verificar si el usuario es administrador y mostrar/ocultar secciones
    window.checkAdminStatus = async (uid) => {
        console.log("checkAdminStatus: Iniciando verificación para UID:", uid);
        
        // Obtener referencias a los elementos de navegación y sección
        const adminNav = document.getElementById('admin-clientes-nav');
        const adminSection = document.getElementById('administrador-clientes');
        const editPageSection = document.getElementById('editar-pagina');
        const editPageNav = document.getElementById('editar-pagina-nav');

        // Log the state of these elements immediately
        console.log("checkAdminStatus: adminNav element found (at start of function):", !!adminNav);
        console.log("checkAdminStatus: adminSection element found (at start of function):", !!adminSection);
        console.log("checkAdminStatus: editPageSection element found (at start of function):", !!editPageSection);
        console.log("checkAdminStatus: editPageNav element found (at start of function):", !!editPageNav);

        if (!adminNav || !adminSection || !editPageSection || !editPageNav) {
            console.error("checkAdminStatus: Uno o más elementos de UI de administrador NO ENCONTRADOS en el DOM. Esto puede impedir que se muestren las opciones de admin.");
            // No retornar aquí, permitir que la lógica continúe para evitar errores si solo falta uno
        }

        try {
            // --- RUTA FIRESTORE CORREGIDA para el documento del usuario ---
            const userDocRef = doc(db, `artifacts/${appId}/users`, uid);
            const userDoc = await getDoc(userDocRef);
            
            if (!userDoc.exists()) {
                console.warn("checkAdminStatus: Documento de usuario NO EXISTE en Firestore para UID:", uid, "en la ruta:", `artifacts/${appId}/users/${uid}`, ". Esto podría ser un problema de reglas de seguridad o que el documento no se creó correctamente.");
                window.showMessage("Tu perfil no pudo ser cargado completamente. Contacta al soporte.", 'warning');
                // Asegurarse de ocultar las secciones si el documento no existe
                if (adminNav) adminNav.style.display = 'none';
                if (adminSection) adminSection.style.display = 'none';
                if (editPageSection) editPageSection.style.display = 'none';
                if (editPageNav) editPageNav.style.display = 'none';
                return;
            }

            const userData = userDoc.data();
            console.log("checkAdminStatus: Datos de usuario obtenidos de Firestore:", userData);
            console.log("checkAdminStatus: Rol del usuario en Firestore:", userData.role);

            if (userData.role === 'admin') {
                console.log("checkAdminStatus: Usuario es administrador. Procediendo a mostrar secciones de admin.");
                // Set display properties only if the elements exist
                if (adminNav) {
                    adminNav.style.display = 'list-item'; 
                    console.log("checkAdminStatus: adminNav display set to 'list-item'.");
                }
                if (adminSection) {
                    adminSection.style.display = 'block'; 
                    console.log("checkAdminStatus: adminSection display set to 'block'.");
                }
                if (editPageSection) {
                    editPageSection.style.display = 'block'; 
                    console.log("checkAdminStatus: editPageSection display set to 'block'.");
                }
                if (editPageNav) {
                    editPageNav.style.display = 'list-item'; 
                    console.log("checkAdminStatus: editPageNav display set to 'list-item'.");
                }
                
                if (clientsTableBody) {
                    console.log("checkAdminStatus: clientsTableBody encontrado. Iniciando carga de clientes.");
                    window.loadClientsForAdmin(); 
                } else {
                    console.log("checkAdminStatus: clientsTableBody NO encontrado. No se cargan clientes.");
                }
                if (editInicioTextarea) {
                    console.log("checkAdminStatus: editInicioTextarea encontrado. Iniciando carga de contenido editable.");
                    window.loadEditableContent(); 
                } else {
                    console.log("checkAdminStatus: editInicioTextarea NO encontrado. No se carga contenido editable.");
                }
            } else {
                console.log("checkAdminStatus: Usuario NO es administrador (rol es '" + (userData.role || 'undefined') + "'). Ocultando secciones de admin.");
                // Ensure elements are hidden if user is not admin
                if (adminNav) adminNav.style.display = 'none';
                if (adminSection) adminSection.style.display = 'none';
                if (editPageSection) editPageSection.style.display = 'none';
                if (editPageNav) editPageNav.style.display = 'none';
            }
        } catch (error) {
            console.error("checkAdminStatus: Error crítico al verificar el estado de administrador:", error);
            // Asegurarse de ocultar las secciones en caso de error
            if (adminNav) adminNav.style.display = 'none';
            if (adminSection) adminSection.style.display = 'none';
            if (editPageSection) editPageSection.style.display = 'none';
            if (editPageNav) editPageNav.style.display = 'none';
            window.showMessage("Error al verificar permisos de administrador. Revisa las reglas de seguridad de Firestore.", 'error');
        }
    };

    // Función para cargar todos los clientes para el administrador
    window.loadClientsForAdmin = async () => {
        console.log("loadClientsForAdmin: Iniciando carga de clientes.");
        if (!clientsTableBody) {
            console.warn("loadClientsForAdmin: clientsTableBody no está disponible. No se pueden cargar clientes.");
            return;
        }
        clientsTableBody.innerHTML = '<tr><td colspan="6">Cargando clientes...</td></tr>';
        try {
            // --- RUTA FIRESTORE CORREGIDA para obtener todos los usuarios ---
            const q = query(collection(db, `artifacts/${appId}/users`)); 
            const querySnapshot = await getDocs(q);

            clientsTableBody.innerHTML = '';
            if (querySnapshot.empty) {
                clientsTableBody.innerHTML = '<tr><td colspan="6">No hay clientes registrados aún.</td></tr>';
                console.log("loadClientsForAdmin: No se encontraron clientes.");
            } else {
                querySnapshot.forEach((doc) => {
                    const client = doc.data();
                    const clientId = doc.id;
                    const row = clientsTableBody.insertRow();
                    row.innerHTML = `
                        <td>${client.name || 'N/A'}</td>
                        <td>${client.lastname || 'N/A'}</td>
                        <td>${client.email || 'N/A'}</td>
                        <td>${client.whatsapp || 'N/A'}</td>
                        <td>${client.role || 'user'}</td>
                        <td>
                            <button data-id="${clientId}" class="edit-client-btn primary-button small-button">Editar</button>
                        </td>
                    `;
                    const editButton = row.querySelector('.edit-client-btn');
                    if (editButton) {
                        editButton.addEventListener('click', () => openEditClientModal(clientId, client));
                    }
                });
                console.log(`loadClientsForAdmin: Se cargaron ${querySnapshot.size} clientes.`);
            }
        } catch (error) {
            console.error("loadClientsForAdmin: Error al cargar clientes para el administrador:", error);
            clientsTableBody.innerHTML = '<tr><td colspan="6">Error al cargar clientes.</td></tr>';
        }
    };

    // Función para abrir el modal de edición de cliente
    function openEditClientModal(clientId, clientData) {
        console.log("openEditClientModal: Abriendo modal para cliente:", clientId);
        if (!editClientModal || !editClientNameInput || !editClientLastnameInput || !editClientEmailInput || !editClientWhatsappInput) {
            console.error("openEditClientModal: Elementos del modal de edición de cliente no encontrados.");
            return;
        }

        currentEditingClientId = clientId;
        editClientNameInput.value = clientData.name || '';
        editClientLastnameInput.value = clientData.lastname || '';
        editClientEmailInput.value = clientData.email || '';
        editClientWhatsappInput.value = clientData.whatsapp || '';

        if (itiEditClient && clientData.whatsapp) {
            itiEditClient.setNumber(clientData.whatsapp);
        } else if (itiEditClient) {
            itiEditClient.setNumber(""); 
        }

        editClientModal.style.display = 'block';
    }


    window.loadEditableContent = async function() {
        console.log("loadEditableContent: Iniciando carga de contenido editable.");
        if (!editInicioTextarea) {
            console.warn("loadEditableContent: editInicioTextarea no está disponible. No se puede cargar contenido editable.");
            return;
        }
        try {
            // --- RUTA FIRESTORE CORREGIDA para contenido de la página ---
            const websiteContentDocRef = doc(db, `artifacts/${appId}/public/data/websiteContent`, 'mainPage');
            const contentDocSnap = await getDoc(websiteContentDocRef);
            if (contentDocSnap.exists()) {
                const content = contentDocSnap.data();
                if (editInicioTextarea) {
                    editInicioTextarea.value = content.inicioText || '';
                    console.log("loadEditableContent: Contenido editable cargado.");
                }
            } else {
                console.warn("loadEditableContent: No se encontró el documento 'mainPage' para cargar contenido editable. Estableciendo valor por defecto.");
                if (editInicioTextarea) {
                    editInicioTextarea.value = 'Contenido por defecto de la sección de Inicio.';
                }
            }
        } catch (error) {
            console.error('loadEditableContent: Error al cargar contenido editable:', error.message);
            window.showMessage('Error al cargar contenido editable.', 'error');
        }
    };

    async function saveEditableContent() {
        console.log("saveEditableContent: Iniciando guardado de contenido editable.");
        const inicioText = editInicioTextarea ? editInicioTextarea.value : '';

        try {
            // --- RUTA FIRESTORE CORREGIDA para guardar contenido de la página ---
            const websiteContentDocRef = doc(db, `artifacts/${appId}/public/data/websiteContent`, 'mainPage');
            await setDoc(websiteContentDocRef, {
                inicioText: inicioText,
                lastUpdated: serverTimestamp()
            }, { merge: true }); 
            window.showMessage('Contenido de la página actualizado con éxito!', 'success');
            console.log("saveEditableContent: Contenido de la página guardado con éxito.");
        } catch (error) {
            console.error('saveEditableContent: Error al guardar contenido editable:', error.message);
            window.showMessage('Error al guardar contenido: ' + error.message, 'error');
        }
    }

    if (saveInicioTextBtn) {
        saveInicioTextBtn.addEventListener('click', saveEditableContent);
    }

}); // Fin de DOMContentLoaded