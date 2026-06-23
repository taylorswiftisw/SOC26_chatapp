// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDSvbUZwAkovJMOOzQJunIdWK_moE3XyS0",
  authDomain: "chat-app-944cd.firebaseapp.com",
  projectId: "chat-app-944cd",
  storageBucket: "chat-app-944cd.firebasestorage.app",
  messagingSenderId: "113669108523",
  appId: "1:113669108523:web:d8b287afc8de924b4e0b6e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth=getAuth(app);
export const googleProvider=new GoogleAuthProvider();