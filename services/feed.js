module.exports = function(socket, data) {
  return data.communities.forEach(function(community) {
    return socket.join("community/" + community);
  });
};
