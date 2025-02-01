// chat.js – Contains Firebase-based chat functionality

// Import Firebase modules for chat functionality.
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getDatabase, ref, push, onValue, serverTimestamp, remove } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

// Check if Firebase has already been initialized (it was initialized in script.js)
// If not, initialize it here. (In many cases, Firebase will already be initialized.)
const firebaseConfig = {
  apiKey: "AIzaSyCPH7MTG1GmBPIVuMnT9bVAqlP0zmXjCLg",
  authDomain: "fir-7e1c5.firebaseapp.com",
  projectId: "fir-7e1c5",
  storageBucket: "fir-7e1c5.firebasestorage.app",
  messagingSenderId: "460395290497",
  appId: "1:460395290497:web:59b4d0bea369ac6a635280",
  measurementId: "G-C6K2GYRKP9"
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}
const db = getDatabase();

// Function to initialize and load the chat app
export function initChatApp() {
  // Create and inject the chat app container into the DOM.
  const appContainer = document.createElement("div");
  appContainer.id = "app";
  appContainer.innerHTML = `
    <header>
      <h1>Public Chat</h1>
      <button id="deleteAllMessagesButton">Delete All Messages</button>
    </header>
    <div id="chatSection">
      <div id="messages" class="messages"></div>
      <div id="messageInputSection">
        <input type="text" id="messageInput" placeholder="Type a message...">
        <button id="sendMessageButton">Send</button>
      </div>
    </div>
  `;
  document.body.appendChild(appContainer);

  // Get chat-related DOM elements.
  const messagesDiv = document.getElementById("messages");
  const messageInput = document.getElementById("messageInput");
  const sendMessageButton = document.getElementById("sendMessageButton");
  const deleteAllMessagesButton = document.getElementById("deleteAllMessagesButton");

  // Reference to the "messages" node in Firebase Realtime Database.
  const messagesRef = ref(db, "messages");

  // Helper function to add a message to the DOM.
  const addMessageToDOM = (message) => {
    const div = document.createElement("div");
    // Here, all messages are styled as "received." You could add logic to differentiate.
    div.className = "received";
    const time = message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : '...';
    div.textContent = `${message.text} (${time})`;
    messagesDiv.appendChild(div);
    // Auto-scroll to the bottom.
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  };

  // Listen for real-time updates from Firebase.
  onValue(messagesRef, (snapshot) => {
    messagesDiv.innerHTML = ""; // Clear existing messages.
    snapshot.forEach((childSnapshot) => {
      const message = childSnapshot.val();
      addMessageToDOM(message);
    });
  });

  // Send a message when the "Send" button is clicked.
  sendMessageButton.addEventListener("click", () => {
    const messageText = messageInput.value.trim();
    if (messageText) {
      push(messagesRef, {
        text: messageText,
        timestamp: serverTimestamp(),
      });
      messageInput.value = ""; // Clear the input after sending.
    }
  });

  // Allow sending messages via the Enter key.
  messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessageButton.click();
    }
  });

  // Delete all messages when the corresponding button is clicked.
  deleteAllMessagesButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all messages?")) {
      remove(messagesRef)
        .then(() => {
          alert("All messages deleted successfully.");
        })
        .catch((error) => {
          console.error("Error deleting messages:", error);
        });
    }
  });

  console.log("Chat app initialized.");
}
