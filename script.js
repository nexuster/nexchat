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
    if (usernameInput.trim() !== '') {
        username = usernameInput;
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
            console.log('Message sent');
        }).catch((error) => {
            console.error('Error sending message: ', error);
        });
        document.getElementById('messageInput').value = '';
    } else {
        alert('Please enter a message');
    }
}

function loadMessages() {
    const displayOption = document.getElementById('displayOptions').value;
    db.collection('messages').orderBy('timestamp')
        .onSnapshot((snapshot) => {
            const chatWindow = document.getElementById('chatWindow');
            chatWindow.innerHTML = '';
            snapshot.forEach((doc) => {
                const message = doc.data();
                const messageElement = document.createElement('div');
                messageElement.classList.add('message');
                
                // Customize message display based on the selected option
                if (displayOption === 'default') {
                    messageElement.innerHTML = `<span class="username">${message.username}:</span> <span class="text">${message.text}</span>`;
                } else if (displayOption === 'timestamp') {
                    const timestamp = message.timestamp ? message.timestamp.toDate().toLocaleString() : '';
                    messageElement.innerHTML = `<span class="username">${message.username}:</span> <span class="text">${message.text}</span> <span class="timestamp">(${timestamp})</span>`;
                } else if (displayOption === 'username') {
                    messageElement.innerHTML = `<span class="username">${message.username}</span>`;
                }
                
                chatWindow.appendChild(messageElement);
            });
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }, (error) => {
            console.error('Error loading messages: ', error);
        });
}