const socket = io.connect('http://localhost:8080');
const zone_chat = document.getElementById('zone_chat');
const form = document.forms['form_chat'];

let username = prompt('Quel est votre pseudo ?');
let room = prompt('Quel salon voulez vous rejoindre ?');
socket.emit('new_user', {username, room});

socket.on('message', ({username, message}) => insertMessage(username, message));

socket.on('new_user', (username) => insertMessage(username, 'a rejoint le Chat !'));

socket.on('user_init', (chat) =>
    chat.forEach(({username, message}) => insertMessage(username, message))
);

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (form.elements['message'].value !== '') {
        socket.emit('message', form.elements['message'].value);
    }
    return false;
});

const insertMessage = (username, message) => {
    inject(`
        <article class="message is-info">
            <div class="message-header">${username}</div>
            <div class="message-body">${message}</div>
        </article>
    `);
    form.elements['message'].value = '';
    form.elements['message'].focus();
};

const inject = (str) => {
    zone_chat.innerHTML = str + zone_chat.innerHTML;
};
