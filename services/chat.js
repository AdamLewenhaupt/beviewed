module.exports = function(socket, data) {
  return data.rooms.forEach(function(room) {
    socket.join("rooms/" + room);
    return socket.on("chat/" + room, function(data) {
      return socket.broadcast.to("rooms/" + room).emit("chat/update/" + room, data);
    });
  });
};
