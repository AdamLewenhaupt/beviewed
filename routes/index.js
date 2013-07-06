var index;

index = {
  get: function(req, res) {
    return res.render("index.html");
  }
};

exports.index = index;
