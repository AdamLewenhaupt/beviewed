var Hasher, colls, createHash, hash, valid;

colls = null;

Hasher = require('phpass').PasswordHash;

hash = new Hasher;

valid = function(pass, user) {
  return hash.checkPassword(pass, user.pass);
};

createHash = function(pass) {
  return hash.hashPassword(pass);
};

exports.fetch = function(inColls) {
  return colls = inColls;
};

exports.profile = {
  get: function(req, res) {
    return colls.users.get(req.params.id, function(err, user) {
      if (err) {
        return res.send(500, err);
      } else {
        return res.render("profile.html", {
          user: user
        });
      }
    });
  }
};

exports.authentication = {
  login: function(req, res) {
    var email, pass;
    email = req.query.email;
    pass = req.query.pass;
    return colls.users.model.find().where("email", email).exec(function(err, user) {
      if (err || !user[0]) {
        return res.send({
          isValid: false,
          error: "Please check your credientials, no user with that email was found."
        });
      } else {
        return res.send({
          isValid: valid(pass, user[0]),
          id: user[0]["_id"]
        });
      }
    });
  },
  verifyToken: function(req, res) {},
  signup: function(req, res) {}
};
