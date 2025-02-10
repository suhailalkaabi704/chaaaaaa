const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname)); // يخدم الملفات من نفس المجلد

io.on("connection", (socket) => {
    console.log("مستخدم متصل");

    socket.on("chat message", (data) => {
        io.emit("chat message", data);
    });

    socket.on("disconnect", () => {
        console.log("مستخدم غادر");
    });
});

server.listen(3000, () => {
    console.log("الخادم يعمل على http://localhost:3000");
});
