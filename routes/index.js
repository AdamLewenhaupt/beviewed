exports.index = {
  get: function(req, res) {
    return res.render("index.html");
  }
};

exports.profile = {
  get: function(req, res) {
    return res.render("profile.html");
  }
};

exports.community = require('./community');

exports.explore = {
  get: function(req, res) {
    return res.render("explore.html");
  }
};

exports.dashboard = {
  get: function(req, res) {
    return res.render("dashboard.html");
  }
};

exports["create-community"] = {
  get: function(req, res) {
    return res.render("create-community.html");
  }
};
