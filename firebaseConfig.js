// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCieCOBIoX3gMloAbvJenoNGQW3soascmg",
  authDomain: "shopkeeper-2b342.firebaseapp.com",
  projectId: "shopkeeper-2b342",
  storageBucket: "shopkeeper-2b342.firebasestorage.app",
  messagingSenderId: "404751196963",
  appId: "1:404751196963:web:d32ef6633987ec5285e296",
  measurementId: "G-MMWLL594P6",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
