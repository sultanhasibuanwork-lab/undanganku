// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBi4oAegbaobzY_FmGt2604hGiVfXMP1bY",
    authDomain: "undanganku-9074c.firebaseapp.com",
    databaseURL: "https://undanganku-9074c-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "undanganku-9074c",
    storageBucket: "undanganku-9074c.firebasestorage.app",
    messagingSenderId: "749510386244",
    appId: "1:749510386244:web:e80bcf2582a447f6c99211"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
