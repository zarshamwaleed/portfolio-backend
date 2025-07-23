const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./db/config");
const Review = require("./db/reviews");

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ➤ GET all reviews
app.get("/api/reviews", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ date: -1 });
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➤ POST a new review
app.post("/api/reviews", async (req, res) => {
  try {
    const data = req.body;
    const avatar = data.name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "";
    const review = new Review({ ...data, avatar });
    const saved = await review.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ➤ PATCH toggle helpful
app.patch("/api/reviews/:id/helpful", async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: "Review not found" });

    // Toggle: if marked helpful, unmark; otherwise increment
    review.helpful = review.helpful > 0 ? review.helpful - 1 : review.helpful + 1;
    await review.save();

    res.status(200).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/", (req, res) => {
  res.send("✅ Backend API is running!");
});


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
