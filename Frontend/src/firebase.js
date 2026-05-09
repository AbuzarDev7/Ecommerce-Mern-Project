import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDhVDD_Ru0d93lUFyglAu9qOMUP1lsIa5A",
  authDomain: "real-time-chat-app-66850.firebaseapp.com",
  projectId: "real-time-chat-app-66850",
  storageBucket: "real-time-chat-app-66850.firebasestorage.app",
  messagingSenderId: "793476777032",
  appId: "1:793476777032:web:d57ee45c38b0be0165047d",
  measurementId: "G-SKHDZZ4NDR"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
