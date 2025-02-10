// إعداد Firebase
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// تسجيل الدخول كمجهول
firebase.auth().signInAnonymously().catch(error => console.error(error));

let username = localStorage.getItem("username") || prompt("أدخل اسمك:");
localStorage.setItem("username", username);

// إرسال الرسالة
function sendMessage() {
    let message = document.getElementById("message").value;
    let fileInput = document.getElementById("fileInput");
    let file = fileInput.files[0];

    if (message.trim() !== "" || file) {
        let chatRef = db.ref("chat").push();
        let msgData = {
            username: username,
            message: message,
            timestamp: Date.now()
        };

        if (file) {
            let reader = new FileReader();
            reader.onload = function(e) {
                msgData.file = {
                    name: file.name,
                    content: e.target.result
                };
                chatRef.set(msgData);
            };
            reader.readAsDataURL(file);
        } else {
            chatRef.set(msgData);
        }

        document.getElementById("message").value = "";
        fileInput.value = "";
    }
}

// عرض المحادثة الحية
db.ref("chat").on("child_added", snapshot => {
    let data = snapshot.val();
    let chatBox = document.getElementById("chat-box");

    let msgElement = document.createElement("p");
    msgElement.innerHTML = `<strong>${data.username}:</strong> ${data.message}`;

    if (data.file) {
        let fileLink = document.createElement("a");
        fileLink.href = data.file.content;
        fileLink.download = data.file.name;
        fileLink.innerText = ` 📁 تحميل ${data.file.name}`;
        fileLink.style.display = "block";
        msgElement.appendChild(fileLink);
    }

    chatBox.appendChild(msgElement);
    chatBox.scrollTop = chatBox.scrollHeight;
});
