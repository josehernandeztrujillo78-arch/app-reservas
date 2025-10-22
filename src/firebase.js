// Importa las funciones necesarias de Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Configuración de tu app Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAZG8Dl2OHJHIrjHoiid892gh9WDl0JuW8",
  authDomain: "app-reservas-7e01f.firebaseapp.com",
  projectId: "app-reservas-7e01f",
  storageBucket: "app-reservas-7e01f.firebasestorage.app",
  messagingSenderId: "735619796411",
  appId: "1:735619796411:web:1e3a6f11db1d48532d889e",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta los servicios que usará tu app
export const db = getFirestore(app);
export const auth = getAuth(app);
