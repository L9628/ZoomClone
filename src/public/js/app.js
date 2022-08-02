const socket = io(); // io function은 알아서 socket.io를 실행하고 있는 서버를 찾는다.

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = "Someone joined!";
  ul.appendChild(li);
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
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
  socket.emit("enter_room", { payload: input.value }, showRoom);
  roomName = input.value;
  input.value = "";
}
form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", () => {
  addMessage("someone joined!");
});
