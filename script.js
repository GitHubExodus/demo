// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getDatabase, ref, push, onValue, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCPH7MTG1GmBPIVuMnT9bVAqlP0zmXjCLg",
    authDomain: "fir-7e1c5.firebaseapp.com",
    projectId: "fir-7e1c5",
    storageBucket: "fir-7e1c5.firebasestorage.app",
    messagingSenderId: "460395290497",
    appId: "1:460395290497:web:59b4d0bea369ac6a635280",
    measurementId: "G-C6K2GYRKP9"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// DOM Elements
const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendMessageButton = document.getElementById("sendMessageButton");

// Helper Functions
const addMessageToDOM = (message, isUserMessage) => {
    const div = document.createElement("div");
    div.className = isUserMessage ? "sent" : "received";
    div.textContent = `${message.text} (${new Date(message.timestamp).toLocaleTimeString()})`;
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto-scroll to the bottom
};

// Fetch Messages in Real-Time
const messagesRef = ref(db, "messages");
onValue(messagesRef, (snapshot) => {
    messagesDiv.innerHTML = ""; // Clear the chat window
    snapshot.forEach((childSnapshot) => {
        const message = childSnapshot.val();
        addMessageToDOM(message, false); // Display all messages as "received"
    });
});

// Send a Message
sendMessageButton.addEventListener("click", () => {
    const messageText = messageInput.value;
    if (messageText) {
        push(messagesRef, {
            text: messageText,
            timestamp: serverTimestamp(),
        });
        messageInput.value = ""; // Clear input field after sending
    }
});

// Optional: Send on Enter Keypress
messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        sendMessageButton.click();
    }
});

