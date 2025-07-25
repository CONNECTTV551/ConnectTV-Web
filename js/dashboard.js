// js/dashboard.js
import { account, databases, config } from './appwrite-init.js';

async function loadDashboard() {
  try {
    // Verificar sesión activa
    const user = await account.get();

    // Obtener datos del documento del usuario
    const userDocRes = await databases.listDocuments(
      config.databaseId,
      config.collectionUsuariosId,
      [`equal("user_id", "${user.$id}")`]
    );

    if (userDocRes.total === 0) {
      alert('No se encontró tu información de usuario.');
      return;
    }

    const userData = userDocRes.documents[0];

    // Mostrar info del usuario
    document.getElementById('user-email').textContent = user.email;
    document.getElementById('user-role').textContent = userData.rol;
    document.getElementById('user-subscription').textContent = userData.suscripcion || 'Ninguna';

    // (Opcional) Puedes cargar servicios activos aquí si los guardas por usuario

  } catch (err) {
    console.error('Error al cargar el panel:', err);
    window.location.href = 'login.html';
  }
}

// Cerrar sesión
document.getElementById('logout-btn').addEventListener('click', async () => {
  await account.deleteSession('current');
  window.location.href = 'login.html';
});

loadDashboard();
