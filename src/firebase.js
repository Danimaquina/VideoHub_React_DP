// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBeti89NwwL1Y83QDcOakWMviq2_oqYqLI",
    authDomain: "videohub-8b7c3.firebaseapp.com",
    projectId: "videohub-8b7c3",
    storageBucket: "videohub-8b7c3.firebasestorage.app",
    messagingSenderId: "610896538920",
    appId: "1:610896538920:web:21ad520793a59ade8af41d",
    measurementId: "G-1ZPXNE8DK7"
};
  
// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar las instancias de los servicios
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
