require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const issueRoutes = require("./routes/issues");
app.use("/api/issues", issueRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API Running");
});

// ==============================
// TEMP CREATE ROUTE (FOR TESTING)
// ==============================
// WHY: quickly create issue from browser


// ==============================
// DB CONNECTION
// ==============================
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// ==============================
// START SERVER
// ==============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

console.log(process.env.MONGO_URI);