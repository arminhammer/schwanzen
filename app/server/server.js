/**
 * Created by armin on 1/10/15.
 */

/**
 * Main application file
 */

'use strict';

var port = 7788;
var ip = '0.0.0.0';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');

// Setup server
var app = express();
var server = require('http').createServer(app);
var socketio = require('socket.io')(server, {
    serveClient: true,
    path: '/socket.io-client'
});
//require('./config/socketio')(socketio);
//require('./config/express')(app);
//require('./routes')(app);

// Start server
server.listen(port, ip, function () {
    console.log('Express server listening on %d, in %s mode', port, app.get('env'));
});

// Expose app
//global.modules.exports = app;
