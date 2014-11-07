var context = {},
    express = require('express.io'),
    app = express(),
    async = require('async');
// require('./app').init(context);
context.settings = require('./settings');
context.settings.root = __dirname;

function setupDb() {
    context.db = require('./db');
    context.db.init(context, setupView);
}

function setupApp(err) {
    if (err) throw err;
    context.app = require('./app');
    context.app.init(context, listen);
}

function setupView(callback) {
    context.view = require('./views');
    context.view.init({
        viewDir: __dirname + '/views'
    }, setupApp);
}

function listen(callback) {
    context.app.beginListen(context.application, context.settings.http.port);
    if (callback) callback(null);
}

function ready(err) {
    console.log(err);
    if (err) throw err;
    console.log("Ready and listening at http://localhost:" + context.settings.http.port);
}
async.series([setupDb, setupView, setupApp, listen], ready);