var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');
var splitter = require('./splitter.js');

app.listen(1337);

function handler(req, res) {

    var body = "";
    req.on('data', function (chunk) {
        body += chunk;
    });
    req.on('end', function () {
        if (body != '') {
            var hash = splitter.formValues(body);
            var id = hash['id'];
            console.log('hash: ' + hash);
            console.log('peerId:' + id);

            //Notify the store of the incoming call request
            nsp.emit('incomingClientRequest', id);
            return;
        }
    });
}

var nsp = io.of('/store');
nsp.on('connection', function (socket) {
    console.log('store connected');

    socket.on('disconnect', function () {
        console.log('store disconnected');
    });
});

console.log('Server running at http://dmolton.noip.me:1337');

