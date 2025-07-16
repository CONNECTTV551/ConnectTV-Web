// script/firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBPAASk4M0gCUv3kxRDrRPztLuEdU8lP80",
    authDomain: "miplataformaconnecttv.firebaseapp.com",
    projectId: "miplataformaconnecttv",
    storageBucket: "miplataformaconnecttv.firebasestorage.app",
    messagingSenderId: "10232906249",
    appId: "1:10232906249:web:34141fc9c383e4fb06aed8",
    measurementId: "G-V3YG3TVT1Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export app, auth, and db for use in other modules
export { app, auth, db };
