const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['resident', 'admin', 'staff'], default: 'resident' },
    flatNo: { type: String },
    block: { type: String },
    initials: { type: String }
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
