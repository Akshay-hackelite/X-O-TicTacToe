const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Replace with your frontend dev server port
    methods: ['GET', 'POST'],
    credentials: true
  }
});


let players = {};
let gameTurns = [];
let playerNames={}

function getActivePlayer() {
  return gameTurns.length % 2 === 0 ? 'X' : 'O';
}

io.on('connection', (socket) => {
  console.log('New connection:', socket.id);

  if (Object.keys(players).length < 2) {//this gives player object keys in fashion: [key1,key2]
    const symbol = Object.values(players).includes('X') ? 'O' : 'X';
    players[socket.id] = symbol;
    socket.emit('symbol', symbol);//socket.emit emits only to individual not all users
    io.emit('players', players);
  } else {
    socket.emit('roomFull');
    return;
  }
  socket.on('updateName', ({ symbol, name }) => {
    playerNames[symbol] = name;
    io.emit('names', playerNames); // Broadcast updated names
  });
  socket.emit('gameTurns', gameTurns);

  socket.on('makeMove', (data) => { //this makemove custom lsitener will run when from UI anything emitted with key 'makemove' and then the inside func will run
    const currentPlayer = getActivePlayer();
    if (players[socket.id] === currentPlayer) {
      gameTurns=[data,...gameTurns]
      io.emit('gameTurns', gameTurns); //io.emit gives this data to all users connected
    }
  });

  socket.on('restart', () => {
    gameTurns = [];
    io.emit('gameTurns', gameTurns);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected:', socket.id);
    delete players[socket.id];
    gameTurns = [];
    io.emit('players', players);
    io.emit('gameTurns', gameTurns);
  });
});

server.listen(3000, () => console.log('Server running on port 3000'));
