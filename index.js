var app = require('http').createServer(handler),
    io = require('socket.io')(app),
    fs = require('fs');
app.listen(5432);

function handler(req, res) {
    fs.readFile(__dirname + '/index.html', function (err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
        }
        res.writeHead(200);
        res.end(data);
    });
}
io.on('connection', function (socket) {
    console.log('connected on server side');
    socket.on('addToDB', function (data) {
        console.log('requesting an add to DB');
        socket.emit('addToDBComplete', {
            data: 'serverData'
        });
    });
});