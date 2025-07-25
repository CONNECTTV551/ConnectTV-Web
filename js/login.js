// js/login.js

// Inicializa Appwrite
const client = new Appwrite.Client()
  .setEndpoint('https://nyc.cloud.appwrite.io/v1')
  .setProject('6881adae003c0e128607');

const account = new Appwrite.Account(client);
const databases = new Appwrite.Databases(client);

// IDs desde tu configuración
const config = {
  databaseId: '6881b081002a1181df05',
  collectionUsuariosId: '6881b1740034fccc7a09'
};

const form = document.getElementById('login-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    await account.createEmailSession(email, password);
    const user = await account.get();

    // Buscar documento del usuario
    const response = await databases.listDocuments(
      config.databaseId,
      config.collectionUsuariosId,
      [`equal("user_id", "${user.$id}")`]
    );

    if (response.total === 0) {
      alert('Tu cuenta no tiene datos asignados.');
      return;
    }

    const userDoc = response.documents[0];
    const rol = userDoc.rol;

    if (rol === 'admin' || rol === 'administrador') {
      window.location.href = 'admin.html';
    } else {
      window.location.href = 'dashboard.html';
    }

  } catch (err) {
    console.error(err);
    alert('Error al iniciar sesión. Verifica tus datos.');
  }
});
