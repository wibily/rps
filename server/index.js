var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var Game = function () {
    var gameId = 0;
    var isWaiting = false;

    Game.prototype.newGame = function () {
        if (isWaiting) {
            isWaiting = false;
            return _createGameResponse();

        } else {
            isWaiting = true;
            gameId++;
            return _createGameResponse();
        }

        function _createGameResponse() {
            var status = isWaiting ? 'WAITING' : 'READY';
            return {
                gameId: gameId,
                status: status
            };
        }
    }
};

var game = new Game();

app.get('/', function (req, res) {
    res.sendFile('index.html', {
        root: '../client/'
    });
});

io.on('connection', function (socket) {
    var _game = game.newGame();
    socket.emit('newGame', _game);
    if (_game.status === 'READY') {
        var readyEvent = _game.gameId + '/ready';
        console.log(readyEvent);
        io.emit(readyEvent);
    } else {
        console.log(_game.gameId + ' waiting');
    }
});

server.listen(3000, function () {
    console.log('listening on *:3000');
});