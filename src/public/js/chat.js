const socket = io();
const messageList = document.getElementById('message-list');


socket.on('allMessages', (data) => {
  // Limpiar la lista de mensajes antes de agregar los nuevos mensajes
  messageList.innerHTML = '';
  
  data.forEach((message) => {
    const newMessage = document.createElement('li');
    newMessage.innerHTML = `<strong>${message.name}</strong><small>(${message.email})</small>: ${message.message}`;
    messageList.appendChild(newMessage);
  });
});

document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();
  const { message, name, email } = event.target
  socket.emit('message', {
    name: name.value,
    email: email.value,
    message: message.value
  });
});