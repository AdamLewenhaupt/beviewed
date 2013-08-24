var colls;

colls = void 0;

exports.fetch = function(collections) {
  return colls = collections;
};

exports.api = {
  get: function(req, res) {
    var community, from, to, type;
    community = req.params.community;
    type = req.params.type;
    from = req.params.from || 0;
    to = req.params.to;
    if (type === "creative") {
      return colls.creatorFeeds.model.find().where("community", community).sort({
        '_id': -1
      }).skip(from).limit(to).exec(function(err, feeds) {
        if (err) {
          return res.send(500, err);
        } else {
          return res.send(feeds);
        }
      });
    } else {
      return res.send(500, "nope");
    }
  },
  multi: function(req, res) {
    var communities, from, to;
    communities = req.query.communities.split(" ");
    from = req.params.from || 0;
    to = req.params.to;
    return colls.creatorFeeds.model.find()["in"]("community", communities).sort({
      "_id": -1
    }).skip(from).limit(to).exec(function(err, feeds) {
      if (err) {
        return res.send(500, err);
      } else {
        return res.send(feeds);
      }
    });
  }
};
