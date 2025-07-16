// script/main.js
import { auth, db, app } from './firebase-init.js'; // Importa auth y db desde el nuevo archivo
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import {
    collection,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// --- Funciones para mensajes y modales personalizados ---
const messageBox = document.getElementById('message-box');
const customModal = document.getElementById('custom-modal');
const modalMessage = document.getElementById('modal-message');
const modalCloseButton = document.getElementById('modal-close-button');
const modalOkButton = document.getElementById('modal-ok-button');
const modalConfirmButton = document.getElementById('modal-confirm-button');
const modalCancelButton = document.getElementById('modal-cancel-button');

// Función para mostrar mensajes en la caja de mensajes
function showMessage(message, type = 'info') {
    if (messageBox) {
        messageBox.textContent = message;
        messageBox.className = `message-box ${type}`; // Add type for styling (e.g., 'info', 'error', 'success')
        messageBox.style.display = 'block';
        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 5000); // Hide after 5 seconds
    } else {
        console.warn('Message box element not found.');
        // Fallback for development if messageBox is not present
        console.log(`Message (${type}): ${message}`);
    }
}

// Función para mostrar un modal de confirmación personalizado
function showConfirm(message, onConfirmCallback) {
    if (customModal && modalMessage && modalConfirmButton && modalCancelButton) {
        modalMessage.textContent = message;
        modalOkButton.style.display = 'none';
        modalConfirmButton.style.display = 'inline-block';
        modalCancelButton.style.display = 'inline-block';
        customModal.style.display = 'block';

        const confirmHandler = () => {
            onConfirmCallback(true);
            customModal.style.display = 'none';
            modalConfirmButton.removeEventListener('click', confirmHandler);
            modalCancelButton.removeEventListener('click', cancelHandler);
        };

        const cancelHandler = () => {
            onConfirmCallback(false);
            customModal.style.display = 'none';
            modalConfirmButton.removeEventListener('click', confirmHandler);
            modalCancelButton.removeEventListener('click', cancelHandler);
        };

        modalConfirmButton.addEventListener('click', confirmHandler);
        modalCancelButton.addEventListener('click', cancelHandler);

        modalCloseButton.onclick = () => {
            customModal.style.display = 'none';
            onConfirmCallback(false); // Treat closing as cancellation
            modalConfirmButton.removeEventListener('click', confirmHandler);
            modalCancelButton.removeEventListener('click', cancelHandler);
        };

        window.onclick = (event) => {
            if (event.target == customModal) {
                customModal.style.display = 'none';
                onConfirmCallback(false); // Treat clicking outside as cancellation
                modalConfirmButton.removeEventListener('click', confirmHandler);
                modalCancelButton.removeEventListener('click', cancelHandler);
            }
        };

    } else {
        console.error('Custom modal elements not found.');
        // Fallback if modal elements are missing
        const result = window.confirm(message);
        onConfirmCallback(result);
    }
}

// Exportar funciones para que admin.js pueda usarlas
window.showMessage = showMessage;
window.showConfirm = showConfirm;


// --- Lógica principal de la aplicación (envuelta en DOMContentLoaded) ---
document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM (asegurarse de que existan en la página actual)
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const registerLink = document.getElementById('register-link');
    const logoutBtn = document.getElementById('logout-btn');
    const userDisplayName = document.getElementById('user-display-name');
    const adminClientesNav = document.getElementById('admin-clientes-nav');
    const adminClientesSection = document.getElementById('administrador-clientes');
    const editarPaginaSection = document.getElementById('editar-pagina');

    // Lógica de Registro
    if (registerLink) {
        registerLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (loginForm) loginForm.style.display = 'none';
            if (registerForm) registerForm.style.display = 'flex';
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('reg-name').value;
            const lastname = document.getElementById('reg-lastname').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const whatsapp = document.getElementById('reg-whatsapp').value;

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Guardar información adicional del usuario en Firestore
                await setDoc(doc(db, 'users', user.uid), {
                    name: name,
                    lastname: lastname,
                    email: email,
                    whatsapp: whatsapp,
                    role: 'user' // Asignar rol por defecto
                });
                showMessage('Registro exitoso. ¡Inicia sesión!', 'success');
                if (loginForm) loginForm.style.display = 'flex';
                if (registerForm) registerForm.style.display = 'none';
            } catch (error) {
                console.error('Error de registro:', error.message);
                showMessage('Error de registro: ' + error.message, 'error');
            }
        });
    }

    // Lógica de Inicio de Sesión
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                await signInWithEmailAndPassword(auth, email, password);
                // Redirigir al panel después del inicio de sesión exitoso
                window.location.href = 'dashboard.html';
            } catch (error) {
                console.error('Error de inicio de sesión:', error.message);
                showMessage('Error de inicio de sesión: ' + error.message, 'error');
            }
        });
    }

    // Observador del estado de autenticación (para dashboard.html)
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            // Usuario logueado
            if (userDisplayName) { // Solo si estamos en dashboard.html
                userDisplayName.textContent = user.email; // Muestra el email por defecto

                // Obtener datos del usuario desde Firestore para mostrar nombre y rol
                const userDocRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    userDisplayName.textContent = userData.name || user.email; // Muestra el nombre si existe
                    if (userData.role === 'admin') {
                        // Mostrar opciones de administrador
                        if (adminClientesNav) adminClientesNav.style.display = 'list-item';
                        if (adminClientesSection) adminClientesSection.style.display = 'block';
                        if (editarPaginaSection) editarPaginaSection.style.display = 'block';

                        // Cargar clientes para el administrador (función en admin.js)
                        // Se llama a través de window porque admin.js se carga como un módulo separado
                        if (typeof window.loadClientsForAdmin === 'function') {
                            window.loadClientsForAdmin();
                        }
                        // Cargar contenido editable para admin
                        if (typeof window.loadEditableContent === 'function') {
                            window.loadEditableContent();
                        }
                    }
                }
            }
        } else {
            // Usuario no logueado
            // Solo redirigir si no estamos ya en index.html para evitar bucles
            if (window.location.pathname.includes('dashboard.html')) {
                window.location.href = 'index.html'; // Redirigir a la página de inicio de sesión
            }
        }
    });

    // Lógica de Cierre de Sesión
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await signOut(auth);
                window.location.href = 'index.html'; // Redirigir a la página de inicio de sesión
            } catch (error) {
                console.error('Error al cerrar sesión:', error.message);
                showMessage('Error al cerrar sesión: ' + error.message, 'error');
            }
        });
    }

    // --- Funcionalidad de Perfil (dentro de dashboard.html) ---
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const profileEditForm = document.getElementById('profile-edit-form');
    const saveProfileBtn = document.getElementById('save-profile-btn');

    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', async () => {
            // Cargar datos actuales del perfil
            const user = auth.currentUser;
            if (user) {
                const userDocRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    document.getElementById('profile-name').value = userData.name || '';
                    document.getElementById('profile-lastname').value = userData.lastname || '';
                    document.getElementById('profile-whatsapp').value = userData.whatsapp || '';
                    if (profileEditForm) profileEditForm.style.display = 'block'; // Mostrar el formulario
                }
            }
        });
    }

    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', async () => {
            const user = auth.currentUser;
            if (user) {
                const newName = document.getElementById('profile-name').value;
                const newLastname = document.getElementById('profile-lastname').value;
                const newWhatsapp = document.getElementById('profile-whatsapp').value;

                try {
                    const userDocRef = doc(db, 'users', user.uid);
                    await updateDoc(userDocRef, {
                        name: newName,
                        lastname: newLastname,
                        whatsapp: newWhatsapp
                    });
                    showMessage('Perfil actualizado con éxito!', 'success');
                    if (profileEditForm) profileEditForm.style.display = 'none'; // Ocultar el formulario
                    // Actualizar el nombre de visualización si es necesario
                    if (userDisplayName) userDisplayName.textContent = newName || user.email;
                } catch (error) {
                    console.error('Error al actualizar perfil:', error.message);
                    showMessage('Error al actualizar perfil: ' + error.message, 'error');
                }
            }
        });
    }
}); // Fin de DOMContentLoaded
