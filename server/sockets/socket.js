const { io } = require('../server');
const { Users } = require('../classes/users');
const { createMessage } = require('../utilities/utilities')


const users = new Users();

io.on('connection', (client) => {

    client.on('enterChat', (user, callback) => {
        if (!user.name || !user.room) {
            return callback({
                err: true,
                message: 'El nombre/sala es necesario'
            });
        }

        client.join(user.room);

        users.addPerson(client.id, user.name, user.room);

        client.broadcast.to(user.room).emit('listPersons', users.getPersonsPerRoom(user.room));

        return callback(users.getPersonsPerRoom(user.room));
    });

    client.on('createMessage', (data) => {
        let person = users.getPerson(client.id);
        let message = createMessage(person.name, data.message);
        client.broadcast.to(person.room).emit('createMessage', message);
    });



    client.on('disconnect', () => {
        let deletedPerson = users.deletePerson(client.id);

        client.broadcast.to(deletedPerson.room).emit('createMessage', createMessage('Admin', `${deletedPerson.name} salió`));
        client.broadcast.to(deletedPerson.room).emit('listPersons', users.getPersonsPerRoom(deletedPerson.room));
    });

    client.on('privateMessage', (data) => {
        let person = users.getPerson(client.id);
        client.broadcast.to(data.to).emit('privateMessage', createMessage(person.name, data.message));
    });

});