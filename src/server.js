import http from "http";
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
  wsServer.socketsJoin("announcement"); // 모든 유저가 announcement 채널로 가게한다.
  socket.nickname = "Anonymous";
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  // server.js에서 emit 했던 3번째 argument에 있던 함수가 done이 됩니다.
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    console.log(roomName);
    // 이 done function은 프론트엔드에서 실행 버튼을 눌러주는 것이라 보면됩니다.
    done(); // 이 function은 보안 문제의 이유로 백엔드에서 실행시키지 않습니다.
    socket.to(roomName).emit("welcome", socket.nickname);
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname)
    );
  });
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
    done();
  });
  socket.on("nickname", (nickname) => (socket.nickname = nickname));
});
// function handleConnection(socket) {
//   console.log(socket);
// }

// const sockets = [];
// wss.on("connection", (socket) => {
//   sockets.push(socket);
//   socket["nickname"] = "Anonymous";
//   console.log("Connected to Browser!");
//   socket.on("close", () => console.log("Disconnected from the Browser!"));
//   socket.on("message", (msg) => {
//     const message = JSON.parse(msg);
//     switch (message.type) {
//       case "new_message":
//         sockets.forEach((aSocket) =>
//           aSocket.send(`${socket.nickname}: ${message.payload}`)
//         );
//       case "nickname":
//         socket.nickname = message.payload;
//     }
//   });
// });
const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);
