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
const db = firebase.firestore();

let username = '';

function login() {
    const usernameInput = document.getElementById('usernameInput').value;
    // Debug statement to check if the login function is called
    alert('Login function called');
    if (usernameInput.trim() !== '') {
        username = usernameInput;
        alert('Username set: ' + username); // Debug statement to check if the username is set
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('chatContainer').style.display = 'flex';
        loadMessages();
    } else {
        alert('Please enter a valid username');
    }
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput').value;
    if (messageInput.trim() !== '') {
        db.collection('messages').add({
            username: username,
            text: messageInput,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            alert('Message sent'); // Debug statement to check if the message is sent
        }).catch((error) => {
            alert('Error sending message: ' + error); // Debug statement to catch errors
        });
        document.getElementById('messageInput').value = '';
    } else {
        alert('Please enter a message');
    }
}

function loadMessages() {
    db.collection('messages').orderBy('timestamp')
        .onSnapshot((snapshot) => {
            const chatWindow = document.getElementById('chatWindow');
            chatWindow.innerHTML = '';
            snapshot.forEach((doc) => {
                const message = doc.data();
                const messageElement = document.createElement('div');
                messageElement.classList.add('message');
                messageElement.innerHTML = `<span class="username">${message.username}:</span> <span class="text">${message.text}</span>`;
                chatWindow.appendChild(messageElement);
            });
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }, (error) => {
            alert('Error loading messages: ' + error); // Debug statement to catch errors
        });
}