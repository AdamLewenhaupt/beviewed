var authorize, colls;

authorize = require('./users').authorize;

colls = void 0;

exports.fetch = function(collections) {
  return colls = collections;
};

exports.get = function(req, res) {
  return authorize(req, function(err, user) {
    if (err) {
      return res.redirect("/");
    } else {
      return res.render("dashboard.html", {
        user: user
      });
    }
  });
};
