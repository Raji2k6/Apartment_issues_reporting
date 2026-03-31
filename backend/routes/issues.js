const express = require("express");
const router = express.Router();

const Issue = require("../models/Issue");


// ==============================
// CREATE ISSUE
// ==============================
// WHY: Create new issue from frontend
router.post("/", async (req, res) => {
  try {
    const issue = await Issue.create(req.body);
    res.status(201).json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ==============================
// UPDATE ISSUE STATUS
// ==============================
// WHY: Change status (Pending → In Progress → Resolved)
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


// ==============================
// ASSIGN ISSUE
// ==============================
// WHY: Assign issue to staff
router.put("/:id/assign", async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      {
        assignedTo: req.body.assignedTo, // string for now
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


// ==============================
// TEST STATUS (BROWSER ONLY)
// ==============================
// WHY: Browser can't send PUT → simulate using GET



// ==============================
// TEST ASSIGN (BROWSER ONLY)
// ==============================



// ==============================
// GET ALL ISSUES
// ==============================
// IMPORTANT: keep this LAST
router.get("/", async (req, res) => {
  try {
    const issues = await Issue.find();
    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;