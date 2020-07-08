var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('name') || !params.has('room')) {
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios');
}

var user = {
    name: params.get('name'),
    room: params.get('room')
};

socket.on('connect', function() {
    console.log('Conectado al servidor');
    socket.emit('enterChat', user, (resp) => {
        // console.log(resp);
        renderUsers(resp);
    });
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
// socket.emit('createMessage', {
//     usuario: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información
socket.on('createMessage', function(message) {
    renderMessages(message, false);
    scrollBottom();
    // console.log('Servidor:', message);

});

// Escuchar salidas o entradas de usuarios
socket.on('listPersons', function(mensaje) {
    renderUsers(mensaje);
});


// Mensajes Privados

socket.on('privateMessage', (message) => {
    console.log('Mensaje privado: ', message);
});