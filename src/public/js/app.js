const socket = io(); // io function은 알아서 socket.io를 실행하고 있는 서버를 찾는다.

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value; // 이 문항을 넣어줘야 된다? 왜이러지
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${input.value}`); //여기서도 value 대신 input.value를 넣으면 안된다 ;;
  });
  input.value = "";
}

function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#name input");
  socket.emit("nickname", input.value);
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const msgForm = room.querySelector("#msg");
  msgForm.addEventListener("submit", handleMessageSubmit);
  const nameForm = room.querySelector("#name");
  nameForm.addEventListener("submit", handleNicknameSubmit);
}
function backendDone(msg) {
  console.log(`The backend says: `, msg);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  // websocket을 사용할때는 메세지만 보낼 수 있고 object는 보낼 수 없었습니다.
  // socketio는 특정한 event를 emit해 줄 수 있습니다. 어떤 이름이든 상관 없습니다.
  // 첫번째 argument에는 event 이름이 들어갑니다.
  // 두번째 argument에는 보내고 싶은 payload가 들어갑니다. 원하는 만큼 보내고싶은 값을 넣어도 됩니다.
  // 세번째 argument에는 서버에서 호출하는 function이 들어갑니다.
  // 그 function이 가장 마지막 argument가 되어야합니다.
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
}
form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user) => {
  addMessage(`${user} arrived!`);
});

socket.on("bye", (left) => {
  addMessage(`${left} left ㅠㅠ`);
});

socket.on("new_message", addMessage); // 아래의 코드랑 똑같이 작동
// socket.on("new_message", (msg) => addMessage(msg));
// socket.on("room_change", console.log); // 콘솔 로그도 아래의 코드와 같이 사용할 수 있음
// socket.on("room_change", (msg) => console.log(msg)); // 앞서 언급했듯이 위의 코드와 같은 의미를 가짐

socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";
  if (rooms.length === 0) {
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
});
