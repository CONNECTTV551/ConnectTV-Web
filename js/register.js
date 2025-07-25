// js/register.js

import { account, databases, ID, config } from './appwrite-init.js';

// Evento al enviar el formulario
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const correo = document.getElementById('correo').value.trim();
  const password = document.getElementById('password').value;

  try {
    // 1. Crear cuenta de usuario
    const nuevoUsuario = await account.create(ID.unique(), correo, password, nombre);
    const userId = nuevoUsuario.$id;

    // 2. Crear documento en colección Usuarios
    await databases.createDocument(
      config.databaseId,
      config.collectionUsuariosId,
      ID.unique(),
      {
        user_id: userId,
        nombre: nombre,
        correo: correo,
        rol: 'cliente' // Puedes cambiar a 'admin' si es necesario
      }
    );

    alert('¡Registro exitoso!');
    window.location.href = 'login.html';

  } catch (error) {
    console.error(error);
    alert('Error en el registro: ' + error.message);
  }
});
