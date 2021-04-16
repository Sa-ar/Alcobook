const socketIOJwt = require('socketio-jwt');

module.exports.userSocketMap = new Map();
const adminSockets = new Map();

module.exports.connect = function (io) {
  io.use(
    socketIOJwt.authorize({
      secret: process.env.JWT_SECRET,
      handshake: true,
    }),
  );

  io.on('connection', (socket) => {
    const userName = socket.request._query['username'];

    addClientToMap(userName, socket);
    console.log(`${userName} is connected`);

    adminSockets.forEach((adminSocket) =>
      adminSocket.emit({ online: module.exports.userSocketMap.size }),
    );

    socket.on('disconnect', () => {
      removeClientFromMap(userName, socket);
      console.log(`${userName} is disconnected`);
    });
  }).on('authenticated', (socket) => {
    const userName = socket.request._query['username'];

    addAdminToMap(userName, socket);

    socket.on('disconnect', () => {
      removeAdminFromMap(userName, socket);
    });
  });
};

function addClientToMap(userName, socket) {
  const userSocketMap = module.exports.userSocketMap;

  if (!userSocketMap.has(userName)) {
    userSocketMap.set(userName, new Set([socket]));
  } else {
    userSocketMap.get(userName).add(socket);
  }
}

function addAdminToMap(userName, socket) {
  if (!adminSockets.has(userName)) {
    adminSockets.set(userName, new Set([socket]));
  } else {
    adminSockets.get(userName).add(socket);
  }
}

function removeClientFromMap(userName, socket) {
  const userSocketMap = module.exports.userSocketMap;

  if (userSocketIdMap.has(userName)) {
    let userSocketSet = userSocketMap.get(userName);

    userSocketSet.delete(socket);

    if (userSocketIdSet.size == 0) {
      userSocketMap.delete(userName);
    }
  }
}

function removeAdminFromMap(userName, socket) {
  if (adminSockets.has(userName)) {
    let adminSocketIdSet = adminSockets.get(userName);

    adminSocketIdSet.delete(socket);

    if (adminSocketIdSet.size == 0) {
      adminSockets.delete(userName);
    }
  }
}
