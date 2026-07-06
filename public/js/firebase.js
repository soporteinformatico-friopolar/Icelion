import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth }       from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore }  from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey:            "AIzaSyCFw6jdf8Q8iE9wLWDAnKMRX6QAi3Ba1hA",
  authDomain:        "friopolar-gestion.firebaseapp.com",
  projectId:         "friopolar-gestion",
  storageBucket:     "friopolar-gestion.firebasestorage.app",
  messagingSenderId: "433748741369",
  appId:             "1:433748741369:web:5813ae592ef66b7ff4a628"
};

const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
export const COL  = "movimientos";