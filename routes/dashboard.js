var colls;

colls = void 0;

exports.fetch = function(collections) {
  return colls = collections;
};

exports.get = function(req, res) {
  return colls.users.get(req.params.id, function(err, user) {
    if (err) {
      return res.send(500, err);
    } else {
      return res.render("dashboard.html", {
        user: user
      });
    }
  });
};
