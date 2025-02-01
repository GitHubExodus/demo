// script.js – Bootstraps the app by verifying the passcode from Firebase

// Import Firebase modules for the passcode retrieval
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

// Your Firebase configuration (this is public information; do not store sensitive secrets here)
const firebaseConfig = {
  apiKey: "AIzaSyCPH7MTG1GmBPIVuMnT9bVAqlP0zmXjCLg",
  authDomain: "fir-7e1c5.firebaseapp.com",
  projectId: "fir-7e1c5",
  storageBucket: "fir-7e1c5.firebasestorage.app",
  messagingSenderId: "460395290497",
  appId: "1:460395290497:web:59b4d0bea369ac6a635280",
  measurementId: "G-C6K2GYRKP9"
};

// Initialize Firebase (for passcode retrieval)
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Variable to hold the passcode fetched from Firebase
let storedPasscode = null;
// Assuming you stored the passcode in the database under "settings/passcode"
const passRef = ref(db, "password");


// Retrieve the passcode from Firebase
get(passRef)
  .then((snapshot) => {
    if (snapshot.exists()) {
      storedPasscode = snapshot.val();
      console.log("Passcode loaded.");
    } else {
      console.error("No passcode found in the database!");
    }
  })
  .catch((error) => {
    console.error("Error fetching passcode:", error);
  });

// Get DOM elements for the password screen
const passwordScreen = document.getElementById("passwordScreen");
const passwordInput = document.getElementById("passwordInput");
const submitPasswordButton = document.getElementById("submitPasswordButton");
const errorMessage = document.getElementById("errorMessage");

// Listen for passcode submission
submitPasswordButton.addEventListener("click", async () => {
  const userInput = passwordInput.value.trim();
  // If the passcode hasn’t loaded yet, ask the user to try later.
  if (!storedPasscode) {
    errorMessage.textContent = "Passcode not loaded. Please try again in a moment.";
    return;
  }
  // Compare user input to the passcode fetched from Firebase
  if (userInput === storedPasscode) {
    // Passcode is correct. Remove the password screen.
    passwordScreen.remove();
    // Dynamically import the chat module.
    try {
      const chatModule = await import('./chat.js');
      // If your chat module exports an initialization function, call it.
      if (chatModule && typeof chatModule.initChatApp === 'function') {
        chatModule.initChatApp();
      }
    } catch (error) {
      console.error("Error loading chat module:", error);
    }
  } else {
    errorMessage.textContent = "Incorrect passcode. Please try again.";
  }
});
