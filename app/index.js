var express = require('express'),
    socketIO = require('socket.io'),
    http = require('http'),
    expressLayouts = require('express-ejs-layouts'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    expressSession = require('express-session'),
    path = require('path'),
    passport = require('passport'),
    minimatch = require('minimatch'),
    fs = require('fs');
module.exports = app = {
    init: function (context, callback) {
        var routes = require('../routes')(context),
            application = context.application = express(),
            root = context.settings.root;
        io = socketIO(8080);
        application.use(expressLayouts);
        application.set('view engine', 'ejs');
        application.set('views', root + '/views/pages');
        application.use(cookieParser());
        application.use(express.static(path.join(root, '/public')));
        application.set("layout extractScripts", true);
        application.set('layout', '../templates/default');
        application.use(bodyParser.json());
        application.locals = require('./locals')(context);
        application.use(bodyParser.urlencoded({
            extended: true
        }));
        application.get('*', routes.pre);
        application.get('/', routes.index);
        application.get('/signup', routes.signup);
        application.get('/signout', routes.signout);
        application.get('/', routes.index);
        application.get('*', routes.cleanup);
        if (callback) callback();
    },
    beginListen: function (application, port) {
        application.listen(port, function () {
            console.log('listening on port ' + port);
        });
        io.on('connection', function (socket) {
            console.log('connected on server side');
            socket.emit('addToDBComplete', {
                working: true
            });
            socket.on('logging-pushEvents', function (data) {
                console.log(arguments);
            });
        });
    }
};