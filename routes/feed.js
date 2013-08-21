var colls;

colls = void 0;

exports.fetch = function(collections) {
  return colls = collections;
};

exports.newFeed = function(req, res) {
  return colls.communities.get(req.params.id, function(err, community) {
    var data;
    if (err) {
      return res.send(500, "404-community");
    } else {
      data = req.body.fields;
      data.community = req.params.id;
      if (community.type === "creative") {
        return colls.creatorFeeds.post(data, function(err) {
          if (err) {
            return res.send(500, "500-feed");
          } else {
            return res.send("success");
          }
        });
      } else {
        return res.send(500, "404-type");
      }
    }
  });
};
