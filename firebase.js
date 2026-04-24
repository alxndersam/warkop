import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "ISI_PUNYA_LO",
  authDomain: "ISI_PUNYA_LO",
  projectId: "ISI_PUNYA_LO",
  storageBucket: "ISI_PUNYA_LO",
  messagingSenderId: "ISI_PUNYA_LO",
  appId: "ISI_PUNYA_LO"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
