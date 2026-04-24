// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDhVjXJX4Wmi6sTFT2-Lm8vUG_QB-nV6Fk",
  authDomain: "coffeeshop-61380.firebaseapp.com",
  projectId: "coffeeshop-61380",
  storageBucket: "coffeeshop-61380.firebasestorage.app",
  messagingSenderId: "545529883528",
  appId: "1:545529883528:web:9069b798b73b253ac3683d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
