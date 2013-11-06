var authorize;

exports.users = require("./users");

authorize = exports.users.authorize;

exports.index = {
  get: function(req, res) {
    return authorize(req, function(err, user) {
      if (err) {
        return res.render("index.html");
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
    return res.render("explore.html");
  }
};

exports.dashboard = require("./dashboard");

exports["create-community"] = {
  get: function(req, res) {
    return res.render("create-community.html");
  }
};

exports.write = require("./write");

exports.feed = require("./feed");

exports.fetch = function(colls) {
  exports.dashboard.fetch(colls);
  exports.write.fetch(colls);
  exports.feed.fetch(colls);
  exports.users.fetch(colls);
  return exports.community.fetchCommunities(colls.communities);
};
