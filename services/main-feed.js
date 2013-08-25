module.exports = function(socket, data) {
  var community, _i, _len, _ref, _results;
  _ref = data.communities;
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    community = _ref[_i];
    _results.push(socket.join("communities/" + community));
  }
  return _results;
};
