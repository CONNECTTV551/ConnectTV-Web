// admin.js completo con gestión de usuarios y servicios
import { account, databases } from './appwrite-init.js';

const databaseId = '688286e20022b6073099'; // ID de la base de datos
const coleccionUsuarios = 'Usuarios';
const coleccionServicios = 'servicios';

// Verifica la sesión y rol del usuario
async function verificarAdmin() {
  try {
    const session = await account.get();
    const userId = session.$id;

    const response = await databases.listDocuments(databaseId, coleccionUsuarios);
    const usuario = response.documents.find(doc => doc.correo === session.email);

    if (!usuario || usuario.rol !== 'admin') {
      window.location.href = 'login.html';
    }
  } catch (error) {
    window.location.href = 'login.html';
  }
}

// Cerrar sesión
const btnLogout = document.getElementById('logoutBtn');
if (btnLogout) {
  btnLogout.addEventListener('click', async () => {
    await account.deleteSession('current');
    window.location.href = 'login.html';
  });
}

// Mostrar lista de usuarios
async function mostrarUsuarios() {
  try {
    const res = await databases.listDocuments(databaseId, coleccionUsuarios);
    const contenedor = document.getElementById('usuariosLista');
    if (!contenedor) return;

    contenedor.innerHTML = '';
    res.documents.forEach(usuario => {
      contenedor.innerHTML += `
        <div class="usuario-card">
          <strong>${usuario.nombre}</strong><br>
          <span>${usuario.correo}</span><br>
          <span>Rol: ${usuario.rol}</span>
        </div>
      `;
    });
  } catch (err) {
    console.error('Error al cargar usuarios:', err);
  }
}

// Mostrar lista de servicios
async function mostrarServicios() {
  try {
    const res = await databases.listDocuments(databaseId, coleccionServicios);
    const contenedor = document.getElementById('serviciosLista');
    if (!contenedor) return;

    contenedor.innerHTML = '';
    res.documents.forEach(servicio => {
      contenedor.innerHTML += `
        <div class="servicio-card">
          <strong>${servicio.nombre}</strong><br>
          <span>Precio: ${servicio.precio}</span><br>
          <span>Descripción: ${servicio.descripcion}</span>
        </div>
      `;
    });
  } catch (err) {
    console.error('Error al cargar servicios:', err);
  }
}

// Inicializar al cargar
verificarAdmin();
mostrarUsuarios();
mostrarServicios();
