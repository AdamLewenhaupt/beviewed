var authorize;

exports.users = require("./users");

authorize = exports.users.authorize;

exports.index = {
  get: function(req, res) {
    return authorize(req, function(err, user) {
      if (err) {
        return res.render("index.html", {
          user: {
            id: ''
          }
        });
      } else {
        return res.render("dashboard.html", {
          user: user
        });
      }
    });
  }
};

exports.community = require('./community');

exports.explore = {
  get: function(req, res) {
    return authorize(req, function(err, user) {
      if (err) {
        return res.redirect("/");
      } else {
        return res.render("explore.html", {
          user: user
        });
      }
    });
  }
};

exports.dashboard = require("./dashboard");

exports["create-community"] = {
  get: function(req, res) {
    return authorize(req, function(err, user) {
      if (err) {
        return res.redirect("/");
      } else {
        return res.render("create-community.html", {
          user: user
        });
      }
    });
  }
};

exports.write = require("./write");

exports.feed = require("./feed");

exports.fetch = function(colls) {
  exports.dashboard.fetch(colls);
  exports.write.fetch(colls);
  exports.feed.fetch(colls);
  exports.users.fetch(colls);
  exports.community.fetchCommunities(colls.communities);
  return exports.community.fetchUsers(colls.users);
};
