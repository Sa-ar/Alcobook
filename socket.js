let usersSockets = [];

module.exports.connect = function (io) {
  io.on('connection', (socket) => {
    addClientToMap(socket);
    console.log(`user is connected ${socket.id}`);

    usersSockets.forEach((socket) =>
      socket.emit('online', {
        online: usersSockets.map((socket) => socket.id),
      }),
    );

    socket.on('disconnect', () => {
      removeClientFromMap(socket);
      console.log(`user is disconnected`);
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
