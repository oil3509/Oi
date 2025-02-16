// app.js

const loginForm = document.getElementById('login-form');
const chatApp = document.getElementById('chat-app');
const contactList = document.getElementById('contact-list');
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendMessageBtn = document.getElementById('send-message-btn');
const logoutBtn = document.getElementById('logout-btn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

let currentUser = null;
let currentChat = null;

// Login user
document.getElementById('login-btn').addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            currentUser = userCredential.user;
            showChatApp();
            loadContacts();
        })
        .catch((error) => {
            alert('Error: ' + error.message);
        });
});

// Sign up user
document.getElementById('signup-btn').addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            currentUser = userCredential.user;
            showChatApp();
            loadContacts();
        })
        .catch((error) => {
            alert('Error: ' + error.message);
        });
});

// Logout user
logoutBtn.addEventListener('click', () => {
    firebase.auth().signOut().then(() => {
        currentUser = null;
        chatApp.style.display = 'none';
        loginForm.style.display = 'block';
    });
});

// Show chat interface
function showChatApp() {
    loginForm.style.display = 'none';
    chatApp.style.display = 'block';
}

// Load contacts from Firestore
function loadContacts() {
    db.collection('users').get().then(snapshot => {
        contactList.innerHTML = '';
        snapshot.forEach(doc => {
            if (doc.id !== currentUser.email) {
                const li = document.createElement('li');
                li.textContent = doc.id;
                li.addEventListener('click', () => openChat(doc.id));
                contactList.appendChild(li);
            }
        });
    });
}

// Open chat with selected contact
function openChat(contactEmail) {
    currentChat = contactEmail;
    messagesDiv.innerHTML = '';
    loadMessages();
}

// Load messages from Firestore
function loadMessages() {
    db.collection('chats').doc(currentChat).collection('messages').orderBy('timestamp')
        .onSnapshot(snapshot => {
            messagesDiv.innerHTML = '';
            snapshot.forEach(doc => {
                const message = doc.data();
                const messageDiv = document.createElement('div');
                messageDiv.textContent = `${message.sender}: ${message.text}`;
                messagesDiv.appendChild(messageDiv);
            });
        });
}

// Send message to Firestore
sendMessageBtn.addEventListener('click', () => {
    const messageText = messageInput.value;
    if (messageText && currentChat) {
        const message = {
            sender: currentUser.email,
            text: messageText,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };
        db.collection('chats').doc(currentChat).collection('messages').add(message);
        messageInput.value = '';
    }
});
