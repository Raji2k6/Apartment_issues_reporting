const express = require("express");
const router = express.Router();

const Issue = require("../models/Issue");
const User = require("../models/User");
const upload = require("../middleware/uploadMiddleware");


// ==============================
// GET ALL STAFF (SPECIFIC ROUTE - must be before /:id)
// ==============================
router.get("/staff/list", async (req, res) => {
  try {
    const staff = await User.find({ role: "staff" }).select("name");
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ==============================
// CREATE ISSUE (with image upload)
// ==============================
router.post("/", upload.array("images", 5), async (req, res) => {
  try {
    // Extract image URLs from uploaded files
    const imageUrls = req.files ? req.files.map(file => file.path) : [];

    const issueData = {
      ...req.body,
      media: imageUrls
    };

    const issue = await Issue.create(issueData);
    res.status(201).json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ==============================
// GET ALL ISSUES (GENERIC GET - must be before /:id generic route)
// ==============================
router.get("/", async (req, res) => {
  try {
    const issues = await Issue.find();
    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ==============================
// ROUTES WITH :id PARAMETER (these go AFTER non-parameterized routes)
// ==============================

// GET ISSUE BY ID
router.get("/:id", async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }
    res.json(issue);
  } catch (err) {
    res.status(400).json({ message: "Invalid issue ID" });
  }
});


// UPDATE ISSUE STATUS
router.put("/:id/status", async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { returnDocument: "after" }
    );

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ASSIGN ISSUE
router.put("/:id/assign", async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      {
        assignedTo: req.body.assignedTo,
        status: "Assigned"
      },
      { returnDocument: "after" }
    );

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// UPDATE ISSUE (GENERIC PUT)
router.put("/:id", upload.array("images", 5), async (req, res) => {
  try {
    // If new images are uploaded, add them to existing media
    let updateData = { ...req.body };
    
    if (req.files && req.files.length > 0) {
      const newImageUrls = req.files.map(file => file.path);
      // Get existing issue to check if it has media
      const existingIssue = await Issue.findById(req.params.id);
      const existingMedia = existingIssue?.media || [];
      updateData.media = [...existingMedia, ...newImageUrls];
    }

    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument: "after" }
    );

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json(issue);
  } catch (err) {
    res.status(400).json({ message: "Invalid issue ID or update data" });
  }
});


// DELETE ISSUE
router.delete("/:id", async (req, res) => {
  try {
    const issue = await Issue.findByIdAndDelete(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }
    res.json({ message: "Issue deleted" });
  } catch (err) {
    res.status(400).json({ message: "Invalid issue ID" });
  }
});


module.exports = router;
