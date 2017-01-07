
//  TODO: Uncomment when SSL set up
// const https = require('https');

const express = require('express');

const app = express();

const path = require('path');
const logger = require('./utils/logger');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const config = require('./config');

//  Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//  Logging Middleware
app.use(morgan('dev'));
app.use('./utils/logger.js', express.static(path.join(__dirname, 'allLogs.log')));

//  JwT Secret Config
app.set('g14classified', config.secret);


const port = process.env.PORT || 8090;
const server = require('http').Server(app);

//  Server and Socket.io initialization
server.listen(port, () => logger.info(`Server listening on ${port}!`));
//  TODO: SSL? const sslPort = 3011;

const io = require('socket.io')(server);

//  Prevent circular dependency by defining router after exports
module.exports = { app, io };
const router = require('./routes.js');

//  Routes
app.use('/api', router);

//  TODO: Determine whether additional handling/rendering of static files is needed
//  Send all other API requests to client side router
app.get('*', (req, res) => {
  res.status(200).send('Hello from Pharos server!');
});
