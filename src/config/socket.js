const {http} = require('../app');
const io = require("../util/socket").init(http);


const clients = {};

io.on("connection", (socket) => {
  console.log('socket is connected')
  socket.on("add-user", (data) => {
    clients[data.userId] = {
      socket: socket.id,
    };
  });

  //Removing the socket on disconnect
  socket.on("disconnect", () => {
    for (const userId in clients) {
      if (clients[userId].socket === socket.id) {
        delete clients[userId];
        break;
      }
    }
  });
});


exports.clients = clients;