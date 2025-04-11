import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCc_rDKToJzYZe59X_UED-25DZJJCGVBs0",
  authDomain: "info-6132-lab-04-a5be0.firebaseapp.com",
  projectId: "info-6132-lab-04-a5be0",
  storageBucket: "info-6132-lab-04-a5be0.firebasestorage.app",
  messagingSenderId: "1079215297362",
  appId: "1:1079215297362:web:17aeaafbc7d5fda4cf608b",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
