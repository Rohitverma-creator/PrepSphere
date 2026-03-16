import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "prepsphere-8e1ad.firebaseapp.com",
  projectId: "prepsphere-8e1ad",
  storageBucket: "prepsphere-8e1ad.firebasestorage.app",
  messagingSenderId: "581617730185",
  appId: "1:581617730185:web:014d69226c91980177bc58",
};

const app = initializeApp(firebaseConfig);

const auth=getAuth(app)
const provider = new GoogleAuthProvider();

export {auth, provider}