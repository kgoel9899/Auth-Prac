var mongoose = require("mongoose");
var schema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

module.exports = mongoose.model("Campground", schema);
