//HTTP package
const http = require('http');
const app = require('./app');
//Assign a port proccess.env offer tools to inject enviarament variable to import to your server
//3000 Default
const port = process.env.PORT || 3000;

//Create Server
const server = http.createServer(app);

server.listen(port);
