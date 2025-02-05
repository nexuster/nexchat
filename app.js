// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD7mtvP8N6Wx54mQWfp-G_T_3OQKhRyH9M",
    authDomain: "nexchat-nex.firebaseapp.com",
    projectId: "nexchat-nex",
    storageBucket: "nexchat-nex.firebasestorage.app",
    messagingSenderId: "772371540643",
    appId: "1:772371540643:web:61a613cc1624f42b6ced16"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase services
const auth = firebase.auth();
const database = firebase.database();

// DOM Elements
const loginContainer = document.getElementById('login-container');
const registerContainer = document.getElementById('register-container');
const chatContainer = document.getElementById('chat-container');
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('message-input');

// Show register form
function showRegister() {
    loginContainer.style.display = 'none';
    registerContainer.style.display = 'block';
}

// Show login form
function showLogin() {
    registerContainer.style.display = 'none';
    loginContainer.style.display = 'block';
}

// Show chat
function showChat() {
    loginContainer.style.display = 'none';
    registerContainer.style.display = 'none';
    chatContainer.style.display = 'block';
}

// Register new user
function register() {
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
            alert('User registered successfully');
            showLogin();
        })
        .catch(error => {
            alert(error.message);
        });
}

// Login user
function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            showChat();
            loadMessages();
        })
        .catch(error => {
            alert(error.message);
        });
}

// Logout user
function logout() {
    auth.signOut()
        .then(() => {
            chatContainer.style.display = 'none';
            loginContainer.style.display = 'block';
        });
}

// Send message
function sendMessage() {
    const message = messageInput.value;
    const user = auth.currentUser;
    if (message && user) {
        database.ref('messages').push({
            text: message,
            uid: user.uid,
            email: user.email
        });
        messageInput.value = '';
    }
}

// Load messages
function loadMessages() {
    database.ref('messages').on('value', (snapshot) => {
        messagesDiv.innerHTML = '';
        snapshot.forEach((childSnapshot) => {
            const message = childSnapshot.val();
            const messageElement = document.createElement('div');
            messageElement.textContent = `${message.email}: ${message.text}`;
            messagesDiv.appendChild(messageElement);
        });
    });
}

// Auth state listener
auth.onAuthStateChanged(user => {
    if (user) {
        showChat();
        loadMessages();
    } else {
        loginContainer.style.display = 'block';
    }
});