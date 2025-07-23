const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  name: String,
  role: String,
  company: String,
  rating: Number,
  review: String,
  project: String,
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  verified: { type: Boolean, default: false },
  avatar: String,
  helpful: { type: Number, default: 0 }
});

module.exports = mongoose.model("reviews", reviewSchema); // 'reviews' is the collection name
