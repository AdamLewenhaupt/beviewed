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

exports.community = {
  get: function(req, res) {
    return res.render("community.html");
  }
};

exports.explore = {
  get: function(req, res) {
    return res.render("explore.html");
  }
};
