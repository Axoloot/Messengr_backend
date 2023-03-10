import { Server } from 'socket.io';
import { Server as httpServer } from 'http';
import { Server as httpsServer } from 'https';

const socketIo = (app: httpServer | httpsServer) => {
  const io = new Server(app);
  const users: Record<string, string[]> = {};

  io.on('connection', (socket) => {

    const uid = socket.handshake.query.userId; // GET USER ID
    let userId: string;

    if (uid.length && uid[0]) userId = uid[0];
    else userId = uid.toString();

    // CHECK IS USER EXHIST
    if (!users[userId]) users[userId] = [];

    // PUSH SOCKET ID FOR PARTICULAR USER ID
    users[userId].push(socket.id);

    // USER IS ONLINE BROAD CAST TO ALL CONNECTED USERS
    io.sockets.emit('online', userId);

    // DISCONNECT EVENT
    socket.on('disconnect', (reason) => {

      // REMOVE FROM SOCKET USERS
      // _.remove(users[userId], (u) => u === socket.id);
      if (users[userId].length === 0) {
        // ISER IS OFFLINE BROAD CAST TO ALL CONNECTED USERS
        io.sockets.emit('offline', userId);
        // REMOVE OBJECT
        delete users[userId];
      }

      socket.disconnect(); // DISCONNECT SOCKET
    });
  });
}

export default socketIo;
