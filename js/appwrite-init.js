// js/appwrite-init.js

import { Client, Account, Databases, ID } from 'appwrite';

// Configuración del cliente Appwrite
const appwrite = new Client();
appwrite
  .setEndpoint('https://nyc.cloud.appwrite.io/v1') // Tu endpoint Appwrite
  .setProject('6881adae003c0e128607');             // Tu ID de proyecto

// Instancias
const account = new Account(appwrite);
const databases = new Databases(appwrite);

// Configuración de IDs de base de datos y colecciones
const config = {
  databaseId: '6881b081002a1181df05',
  collectionUsuariosId: '6881b1740034fccc7a09',
  collectionServiciosId: '6882651900329425cab7'
};

export { appwrite, account, databases, ID, config };
