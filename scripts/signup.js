
// Firebase SDKs importieren
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Deine Firebase-Konfiguration
const firebaseConfig = {
  apiKey: "AIzaSyC9j02JWuw06euMMvOiGk3z3xDkiQ_sw84",
  authDomain: "join-52020.firebaseapp.com",
  databaseURL: "https://join-52020-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "join-52020",
  storageBucket: "join-52020.firebasestorage.app",
  messagingSenderId: "26851051506",
  appId: "1:26851051506:web:7dac5a272e7c31d65e8d6b"
};

// Firebase initialisieren
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Warten bis das DOM geladen ist
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.login-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const inputs = form.querySelectorAll('input');
    const name = inputs[0].value.trim();
    const email = inputs[1].value.trim();
    const password = inputs[2].value;
    const confirmPassword = inputs[3].value;

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        createdAt: new Date()
      });

      alert("Registration successful!");
      window.location.href = "../html-templates/summary.html";

    } catch (error) {
      console.error("Registration error:", error.message);
      alert("Fehler: " + error.message);
    }

  });
});

const passwordFields = document.querySelectorAll('.password-field');

passwordFields.forEach((field) => {
  const inputGroup = field.closest('.input-group');
  const eyeIcon = inputGroup.querySelector('.eye');
  const eyeImg = eyeIcon.querySelector('img');
  const lockIcon = inputGroup.querySelector('.lock');

  field.addEventListener('input', () => {
    const hasValue = field.value.trim().length > 0;

    eyeIcon.style.display = hasValue ? 'inline' : 'none';

    lockIcon.style.display = hasValue ? 'none' : 'inline';

    if (!hasValue) {
      field.type = 'password';
      eyeImg.src = '../assets/icons/eye-icon.svg';
    }
  });

  eyeIcon.addEventListener('click', () => {
    const isPassword = field.type === 'password';
    field.type = isPassword ? 'text' : 'password';
    eyeImg.src = isPassword
      ? '../assets/icons/eye-slash.svg'
      : '../assets/icons/eye-icon.svg';
  });
});

