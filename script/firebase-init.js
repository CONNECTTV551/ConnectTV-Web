// script/firebase-init.js

// Importa las funciones necesarias de los SDK que vas a usar
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js"; // <-- ¡IMPORTANTE! Para autenticación
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js"; // <-- ¡IMPORTANTE! Para Firestore

// Tu configuración de Firebase (usando los valores que me proporcionaste)
const firebaseConfig = {
    apiKey: "AIzaSyBPAASk4M0gCUv3kxRDrRPztLuEdU8lP80",
    authDomain: "miplataformaconnecttv.firebaseapp.com",
    projectId: "miplataformaconnecttv",
    storageBucket: "miplataformaconnecttv.firebasestorage.app",
    messagingSenderId: "10232906249",
    appId: "1:10232906249:web:34141fc9c383e4fb06aed8",
    measurementId: "G-V3YG3TVT1Y"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firebase Authentication y obtiene una referencia al servicio
const auth = getAuth(app); // <-- ¡IMPORTANTE!

// Inicializa Cloud Firestore y obtiene una referencia al servicio
const db = getFirestore(app); // <-- ¡IMPORTANTE!

// Exporta auth y db para que puedan ser utilizados en otros módulos
export { auth, db }; // <-- ¡IMPORTANTE!