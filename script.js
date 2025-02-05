// Pusher configuration
const pusher = new Pusher('5d814bdfd49de4d3e387', {
    cluster: 'us2',
    encrypted: true
});

const channel = pusher.subscribe('chat');

let username = '';

function login() {
    const usernameInput = document.getElementById('usernameInput').value;
    if (usernameInput.trim() !== '') {
        username = usernameInput;
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('chatContainer').style.display = 'flex';
    } else {
        alert('Please enter a valid username');
    }
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput').value;
    if (messageInput.trim() !== '') {
        fetch('https://nexuster,github.io/nexchat/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, message: messageInput })
        });
        document.getElementById('messageInput').value = '';
    } else {
        alert('Please enter a message');
    }
}

channel.bind('message', (data) => {
    const chatWindow = document.getElementById('chatWindow');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.innerHTML = `<span class="username">${data.username}:</span> <span class="text">${data.message}</span>`;
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight;
});