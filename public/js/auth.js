import { auth } from "./firebase.js";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
// Conectamos el código con los elementos del HTML
const loginScreen = document.getElementById("login-screen");
const dashboardScreen = document.getElementById("dashboard-screen");
const btnLogin = document.getElementById("btnLogin");
const btnLogout = document.getElementById("btnLogout");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const errorMsg = document.getElementById("login-error");

// 1. EL GUARDIÁN: Escucha permanentemente si la sesión está abierta o cerrada
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Si hay usuario: Ocultar login, mostrar dashboard
    loginScreen.classList.add("hidden");
    dashboardScreen.classList.remove("hidden");
    console.log("Usuario autenticado:", user.email);
  } else {
    // Si no hay usuario: Mostrar login, ocultar dashboard
    loginScreen.classList.remove("hidden");
    dashboardScreen.classList.add("hidden");
  }
});

// 2. ACCIÓN: Qué pasa al hacer clic en "Ingresar"
btnLogin.addEventListener("click", async () => {
  let userVal = usernameInput.value.trim();
  const password = passwordInput.value;
  
  if (!userVal || !password) return;

  // LA MAGIA: Si el usuario no escribió el "@", se lo agregamos oculto
  let emailFinal = userVal;
  if (!userVal.includes("@")) {
    emailFinal = userVal + "@icelion.com";
  }

  try {
    errorMsg.classList.add("hidden");
    btnLogin.innerText = "Verificando...";
    
    // Mandamos el emailFinal ya construido a Firebase
    await signInWithEmailAndPassword(auth, emailFinal, password);
    
    btnLogin.innerText = "Ingresar al sistema";
    passwordInput.value = ""; 
  } catch (error) {
    console.error("Error de acceso:", error.code);
    errorMsg.classList.remove("hidden");
    btnLogin.innerText = "Ingresar al sistema";
  }
});

// 3. ACCIÓN: Qué pasa al hacer clic en "Cerrar Sesión"
btnLogout.addEventListener("click", () => {
  signOut(auth);
});