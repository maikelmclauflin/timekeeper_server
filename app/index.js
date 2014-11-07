var express = require('express'),
    expressLayouts = require('express-ejs-layouts'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    expressSession = require('express-session'),
    path = require('path'),
    passport = require('passport'),
    minimatch = require('minimatch'),
    fs = require('fs'),
    port;
module.exports = app = {
    init: function (context, callback) {
        var routes = require('../routes')(context),
            server = require('http').createServer(app),
            app = context.app = express(),
            io = require('socket.io')(server),
            root = context.settings.root;
        port = context.settings.http.port;
        app.use(expressLayouts);
        app.set('view engine', 'ejs');
        app.set('views', root + '/views/pages');
        app.use(cookieParser());
        app.use(express.static(path.join(root, '/public')));
        app.set("layout extractScripts", true);
        app.set('layout', '../templates/default');
        app.use(bodyParser.json());
        app.locals = require('./locals')(context);
        app.use(bodyParser.urlencoded({
            extended: true
        }));
        app.get('/', function (req, res) {
            res.render('index');
        });
        app.get('/signup', function (req, res) {
            res.render('register');
        });
        app.get('/signout', function (req, res) {
            req.logout();
            res.redirect('/');
        });
        app.get('/', routes.index);
        app.get('*', routes.cleanup);
        if (callback) callback();
    },
    listen: function (port) {
        app.listen(port, function () {
            console.log('listening on port ' + port);
            io.on('connection', function (socket) {
                console.log('connected on server side');
                socket.on('addToDB', function (data) {
                    console.log('requesting an add to DB');
                    socket.emit('addToDBComplete', {
                        data: 'serverData'
                    });
                });
            });
        });
    }
};