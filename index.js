var express = require('express');
var app = express();
var Game = function () {
    var gameId = 0;
    var isWaiting = false;

    Game.prototype.getGameId = function () {
        if (isWaiting) {
            isWaiting = false;
            return gameId;
        } else {
            isWaiting = true;
            return ++gameId;
        }
    }
};

var game = new Game();

app.get('/connect', function (req, res) {
    res.send({
        gameId: game.getGameId()
    });
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('RPS server listening at http://%s:%s', host, port);
});