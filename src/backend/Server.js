/**
 * @author Claudio
 * @date 28.12.2017
 * @version 1.0
 */

/**
 * Server class, support file service and chat function
 * @param proot source file root directory
 * @param port port
 * @constructor
 */
function Server(proot, port) {
    const express = require('express');
    const app = express();
    const http = require('http').Server(app);
    const io = require('socket.io')(http);
    const clients = {};

    /*
    init web
    */
    app.use(express.static('frontend'));
    app.get('/', (req, res) => {
        res.sendFile(`${proot}/frontend/index.html`);
    });
    //get static files
    app.get(/^(.+)$/, (req, res) => {
        res.sendFile(`${proot}/frontend/${req.params[0]}`);
    });

    /*
    init chat
    */
    io.on('connection', (socket) => {
        //on connected
        socket.on('user name', (name) => {
            clients[socket.id] = name;
            console.log(`${socket.id} has connected as ${name}`);
        });
        //on disconnected
        socket.on('disconnect', () => {
            console.log(`${socket.id} has disconnected as ${clients[socket.id]}`);
            delete clients[socket.id];
        });
        //broadcast
        socket.on('chat message', (msg) => {
            io.emit('chat message', `${clients[socket.id]}: ${msg}`);
        });
    });

    this.port = port;
    this.start = () => {
        http.listen(port, () => {
            console.log(`listening on *:${port}`);
        });
    };
}

module.exports = (proot, port) => new Server(proot, port);