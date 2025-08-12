import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA3TKQRaYoEv0KBeuFl-JKElbKrX26vk5c",
  authDomain: "denuncias-dac4d.firebaseapp.com",
  projectId: "denuncias-dac4d",
  storageBucket: "denuncias-dac4d.firebasestorage.app",
  messagingSenderId: "91135327019",
  appId: "1:91135327019:web:2b9c72fd6f687a1396236e"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);