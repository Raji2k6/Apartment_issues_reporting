const express = require("express");
const router = express.Router();

const Issue = require("../models/Issue");
const User = require("../models/User");


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
// CREATE ISSUE
// ==============================
router.post("/", async (req, res) => {
  try {
    const issue = await Issue.create(req.body);
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
router.put("/:id", async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      req.body,
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