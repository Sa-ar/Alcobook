let usersSockets = [];

module.exports.connect = function (io) {
  io.on('connection', (socket) => {
    addClientToMap(socket);
    console.log(`${socket.id} is connected`);

    io.emit(
      'online',
      usersSockets.map((socket) => socket.id),
    );

    socket.on('disconnect', () => {
      removeClientFromMap(socket);
      console.log(`${socket.id} is disconnected`);

      io.emit(
        'online',
        usersSockets.map((socket) => socket.id),
      );
    });
  });
};

function addClientToMap(socket) {
  usersSockets.push(socket);
}

function removeClientFromMap(socket) {
  usersSockets = usersSockets.filter(
    (userSocket) => userSocket.id === socket.id,
  );
}
