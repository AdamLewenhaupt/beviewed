var index, profile;

index = {
  get: function(req, res) {
    return res.render("index.html");
  }
};

profile = {
  get: function(req, res) {
    return res.render("profile.html");
  }
};

exports.index = index;

exports.profile = profile;
