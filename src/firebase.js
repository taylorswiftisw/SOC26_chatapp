
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {getDatabase} from "firebase/database";//import RTDB


//firebase personal details
const firebaseConfig = {
  apiKey: "AIzaSyDSvbUZwAkovJMOOzQJunIdWK_moE3XyS0",
  authDomain: "chat-app-944cd.firebaseapp.com",
  databaseURL: "https://chat-app-944cd-default-rtdb.firebaseio.com/",//rtdb link
  projectId: "chat-app-944cd",
  storageBucket: "chat-app-944cd.firebasestorage.app",
  messagingSenderId: "113669108523",
  appId: "1:113669108523:web:d8b287afc8de924b4e0b6e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth=getAuth(app);
export const googleProvider=new GoogleAuthProvider();
export const db=getFirestore(app);
export const rtdb=getDatabase(app);