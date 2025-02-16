// Configuração do Firebase
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_AUTH_DOMAIN",
    databaseURL: "SUA_DATABASE_URL",
    projectId: "SEU_PROJECT_ID",
    storageBucket: "SEU_STORAGE_BUCKET",
    messagingSenderId: "SEU_MESSAGING_SENDER_ID",
    appId: "SEU_APP_ID"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const messagesRef = db.ref("messages");

// Enviar Mensagem
function sendMessage() {
    const messageInput = document.getElementById("messageInput");
    const message = messageInput.value;

    if (message.trim() !== "") {
        messagesRef.push().set({
            text: message,
            timestamp: Date.now()
        });
        messageInput.value = "";
    }
}

// Receber Mensagens em Tempo Real
messagesRef.on("child_added", function(snapshot) {
    const messagesDiv = document.getElementById("messages");
    const data = snapshot.val();

    const messageElement = document.createElement("p");
    messageElement.textContent = data.text;
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});