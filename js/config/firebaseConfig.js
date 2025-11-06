// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCclHekKw129GxHuVYBDjaxPII1XPmFSP0",
  authDomain: "proyectofinal-ff2ae.firebaseapp.com",
  projectId: "proyectofinal-ff2ae",
  storageBucket: "proyectofinal-ff2ae.firebasestorage.app",
  messagingSenderId: "415775890099",
  appId: "1:415775890099:web:374cdf0cb9abc981966ec6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };