// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD3m3pej9qCWL8wKLZV0BBSBDKKeiF0Wo0",
  authDomain: "tayd-bd510.firebaseapp.com",
  projectId: "tayd-bd510",
  storageBucket: "tayd-bd510.appspot.com",
  messagingSenderId: "831094867010",
  appId: "1:831094867010:web:d796879f1a3b19c4f899db",
  measurementId: "G-FFP6PJ73L7",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
