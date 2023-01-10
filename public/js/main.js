var socket = io();

const messages = document.getElementById('messages');
const input = document.getElementById('input');
const form = document.getElementById('form')

const url = window.location.search.toString().split('&');
const userInfo = url.map(e => e.toString().split('=')[1]);
const username = userInfo[0];
const room = userInfo[1];

//join room
socket.emit('join room', { room, username })

// user joined
socket.on('user joined', (user) => {
    const joinMsg = document.createElement('p');
    joinMsg.classList.add('toastMsg');
    joinMsg.innerText = `${user} has joined the chat room`;
    messages.appendChild(joinMsg)
    setTimeout(() => {
        joinMsg.style.display = 'none'
    }, 5000);
})

// send chat message

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = input.value;
    socket.emit('chat message', { username, msg })
    msg.value = ''
})

// renrender massage

socket.on('chat message', ({ username, msg }) => {
    const chatMsg = document.createElement('div');
    const user = document.createElement('p');
    const chat = document.createElement('p');

    // add class
    chatMsg.classList.add('chatmsg')
    chat.classList.add('chat');
    user.classList.add('username');


    user.innerHTML = username;
    chat.innerHTML = msg;
    chatMsg.appendChild(user);
    chatMsg.appendChild(chat);
    messages.appendChild(chatMsg)

})

// left room
socket.on('user left', (username) => {
    const leftMsg = document.createElement('p');
    leftMsg.classList.add('toastMsg');
    leftMsg.innerText = `${username} has left the chat room`;
    messages.appendChild(leftMsg)
    setTimeout(() => {
        leftMsg.style.display = 'none'
    }, 5000);
})

// leave btn
document.getElementById('leaveroom').addEventListener('click', () => {
        window.location = '../index.html';
})