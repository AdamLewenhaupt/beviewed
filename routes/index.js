var community, index, profile;

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

community = {
  get: function(req, res) {
    return res.render("community.html");
  }
};

exports.index = index;

exports.profile = profile;

exports.community = community;
