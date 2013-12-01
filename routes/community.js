var authorize, communities, fs, users;

fs = require('fs');

authorize = require('./users').authorize;

communities = null;

users = null;

exports.fetchCommunities = function(data) {
  return communities = data;
};

exports.fetchUsers = function(data) {
  return users = data;
};

exports.get = function(req, res) {
  return authorize(req, function(err, user) {
    return communities.get(req.params.id, function(err, community) {
      return res.render("community.html", {
        community: community,
        user: user || {
          id: ''
        }
      });
    });
  });
};

exports.init = function(data) {
  return communities.post(data, function(c) {
    return console.log(c);
  });
};

exports.log = function() {
  console.log("Running community logger");
  return communities.model.find().exec(function(err, data) {
    if (!err) {
      return data.forEach(function(community) {
        community.userCountLog.push(community.userCount);
        return community.save();
      });
    } else {
      return console.log("Error running community logger");
    }
  });
};

exports.post = function(req, res) {
  var admin;
  admin = req.body.admins[0];
  req.body.userCount = 1;
  if (admin) {
    return communities.post(req.body, function(err, community) {
      var encodedIcon, path;
      if (err) {
        return res.send(500, "save-err");
      } else {
        path = "./client/img/icons/" + community['_id'];
        encodedIcon = req.body.icon.replace(/^data:image\/png;base64,/, "");
        return fs.writeFile(path, encodedIcon, 'base64', function(err) {
          if (err) {
            return res.send(500, "img-err");
          } else {
            return users.get(admin, function(err, user) {
              if (err) {
                return res.send(500, "user-err");
              } else {
                user.admin.push(community['_id']);
                user.save();
                return res.send({
                  id: community["_id"]
                });
              }
            });
          }
        });
      }
    });
  } else {
    return res.send(500, "admin-err");
  }
};

exports.min = {
  get: function(req, res) {
    return communities.get(req.params.id, function(err, community) {
      if (err) {
        return res.send(500, err);
      } else {
        return res.send(200, {
          name: community.name,
          users: community.userCount
        });
      }
    });
  }
};

exports.api = {
  get: function(req, res) {
    return communities.get(req.params.id, function(err, community) {
      if (err) {
        return res.send(500, err);
      } else {
        return res.send(community);
      }
    });
  },
  put: function(req, res) {
    return authorize(req, function(err, user) {
      if (err) {
        return res.send(403);
      } else {
        return communities.put(req.params.id, req.body, function(err, community) {
          if (err) {
            return res.send(500);
          } else {
            return res.send(200);
          }
        });
      }
    });
  }
};

exports.explore = {
  get: function(req, res) {
    if (req.params.type === "init") {
      return communities.model.find().select("_id tags name").sort({
        userCount: -1
      }).limit(50).exec(function(err, communities) {
        if (err) {
          return res.send(500, err);
        } else {
          return res.send(200, communities);
        }
      });
    } else {
      return res.send(500, "invalid request");
    }
  }
};
