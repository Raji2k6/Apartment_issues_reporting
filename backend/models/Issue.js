const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
{
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String },
  priority: { type: String },
  location: { type: String },

  media: [String], // file paths (for now)
  fileUrl: [String],
  status: {
    type: String,
    default: "Pending"
  },

  createdBy: {
  type: String
},

  assignedTo: {
    type: String
  }

},
{ timestamps: true }
);

module.exports = mongoose.model("Issue", issueSchema);