/**
 * @author Claudio
 * @date 24.12.2017
 * @version 1.0
 */

const server = require('./backend/Server')(__dirname, 3000);
server.start();