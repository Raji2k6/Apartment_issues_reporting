// ============================================================
//  app.js  —  Shared logic for all pages
//  When backend is ready: replace mock data with real API calls
// ============================================================

// ── Mock current user (swap with real login data later) ──────
const MOCK_USER = {
  id: "u001",
  name: "Arjun Kumar",
  flatNo: "B-204",
  block: "B",
  role: "resident",   // Change to "admin" or "staff" to test other views
  initials: "AK"
};

// ── Mock issues data ─────────────────────────────────────────
const MOCK_ISSUES = [
  {
    id: "ISS-001",
    title: "Water leakage from ceiling",
    description: "There is a continuous water leakage from the bathroom ceiling. The paint is peeling and water drips when it rains. This has been happening for about 2 weeks now.",
    category: "Plumbing",
    priority: "High",
    location: "Flat B-204",
    status: "Assigned",
    createdBy: "u001",
    assignedTo: "Ravi (Staff)",
    createdAt: "2025-03-28T10:30:00",
    updatedAt: "2025-03-29T14:00:00",
    mediaUrls: [],
    feedback: null,
    timeline: [
      { label: "Issue Reported",  time: "Mar 28, 10:30 AM", note: "Submitted by resident",       done: true  },
      { label: "Assigned",        time: "Mar 28, 12:00 PM", note: "Assigned to Ravi (Staff)",    done: true  },
      { label: "In Progress",     time: "Pending",          note: "Staff to begin work",          done: false },
      { label: "Resolved",        time: "—",               note: "Awaiting resolution",           done: false },
      { label: "Closed",          time: "—",               note: "Awaiting resident confirmation",done: false }
    ]
  },
  {
    id: "ISS-002",
    title: "Lift not working on 3rd floor",
    description: "The lift stops at all floors except 3rd. Residents on 3rd floor have to use stairs which is difficult for elderly people.",
    category: "Electrical",
    priority: "Emergency",
    location: "Block B – Common Area",
    status: "In Progress",
    createdBy: "u002",
    assignedTo: "Electrician Team",
    createdAt: "2025-03-27T09:00:00",
    updatedAt: "2025-03-29T11:00:00",
    mediaUrls: [],
    feedback: null,
    timeline: [
      { label: "Issue Reported", time: "Mar 27, 9:00 AM",  note: "Submitted by resident",      done: true },
      { label: "Assigned",       time: "Mar 27, 10:30 AM", note: "Electrician Team assigned",   done: true },
      { label: "In Progress",    time: "Mar 28, 9:00 AM",  note: "Team is working on the lift", done: true },
      { label: "Resolved",       time: "—",               note: "Awaiting resolution",           done: false },
      { label: "Closed",         time: "—",               note: "Awaiting resident confirmation",done: false }
    ]
  },
  {
    id: "ISS-003",
    title: "Garbage not collected for 3 days",
    description: "The garbage bins on the ground floor have not been cleared for 3 days. The area is smelling bad.",
    category: "Cleaning",
    priority: "Medium",
    location: "Ground Floor – Common Area",
    status: "Pending",
    createdBy: "u001",
    assignedTo: null,
    createdAt: "2025-03-29T08:00:00",
    updatedAt: "2025-03-29T08:00:00",
    mediaUrls: [],
    feedback: null,
    timeline: [
      { label: "Issue Reported", time: "Mar 29, 8:00 AM", note: "Submitted by resident", done: true  },
      { label: "Assigned",       time: "—",              note: "Awaiting admin assignment", done: false },
      { label: "In Progress",    time: "—",              note: "",                          done: false },
      { label: "Resolved",       time: "—",              note: "",                          done: false },
      { label: "Closed",         time: "—",              note: "",                          done: false }
    ]
  },
  {
    id: "ISS-004",
    title: "Street light broken near Gate 2",
    description: "The street light near Gate 2 has been broken for a week. The area is very dark at night.",
    category: "Electrical",
    priority: "High",
    location: "Gate 2 – Common Area",
    status: "Resolved",
    createdBy: "u003",
    assignedTo: "Ravi (Staff)",
    createdAt: "2025-03-20T16:00:00",
    updatedAt: "2025-03-25T12:00:00",
    mediaUrls: [],
    feedback: { rating: 4, comment: "Fixed quickly, thank you!" },
    timeline: [
      { label: "Issue Reported", time: "Mar 20, 4:00 PM", note: "Submitted by resident", done: true },
      { label: "Assigned",       time: "Mar 20, 5:00 PM", note: "Assigned to Ravi",      done: true },
      { label: "In Progress",    time: "Mar 22, 9:00 AM", note: "Work in progress",       done: true },
      { label: "Resolved",       time: "Mar 25, 12:00 PM",note: "Light replaced",          done: true },
      { label: "Closed",         time: "—",              note: "Awaiting confirmation",    done: false }
    ]
  }
];

// ── Helpers ──────────────────────────────────────────────────

// Get current user from localStorage (or use mock)
function getCurrentUser() {
  const saved = localStorage.getItem("currentUser");
  return saved ? JSON.parse(saved) : MOCK_USER;
}

// Get all issues from localStorage (or use mock)
function getIssues() {
  const saved = localStorage.getItem("issues");
  return saved ? JSON.parse(saved) : MOCK_ISSUES;
}

// Save issues to localStorage
function saveIssues(issues) {
  localStorage.setItem("issues", JSON.stringify(issues));
}

// Format date for display
function formatDate(isoString) {
  if (!isoString || isoString === "—") return "—";
  const d = new Date(isoString);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

// Time ago helper
function timeAgo(isoString) {
  const now = new Date();
  const then = new Date(isoString);
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60)    return "Just now";
  if (diff < 3600)  return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return `${Math.floor(diff/86400)}d ago`;
}

// Generate new issue ID
function generateId() {
  const issues = getIssues();
  return "ISS-" + String(issues.length + 1).padStart(3, "0");
}

// Status badge HTML
function statusBadge(status) {
  const map = {
    "Pending":     "badge-pending",
    "Assigned":    "badge-assigned",
    "In Progress": "badge-inprogress",
    "Resolved":    "badge-resolved",
    "Closed":      "badge-closed"
  };
  const cls = map[status] || "badge-pending";
  return `<span class="badge ${cls}">${status}</span>`;
}

// Priority badge HTML
function priorityBadge(priority) {
  const map = {
    "Emergency": "badge-emergency",
    "High":      "badge-high",
    "Medium":    "badge-medium",
    "Low":       "badge-low"
  };
  const cls = map[priority] || "badge-low";
  return `<span class="badge ${cls}">${priority}</span>`;
}

// Show toast notification
function showToast(message, type = "default") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  const icon = type === "success" ? "✓" : type === "error" ? "✕" : "ℹ";
  toast.innerHTML = `<span>${icon}</span> ${message}`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// Build the sidebar HTML based on role
function buildSidebar(activePage) {
  const user = getCurrentUser();

  const navByRole = {
    resident: [
      { icon: "⊞", label: "Dashboard",    href: "dashboard.html",     id: "dashboard"    },
      { icon: "＋", label: "Report Issue",  href: "issue-form.html",    id: "issue-form"   },
      { icon: "◉", label: "My Issues",     href: "dashboard.html",     id: "my-issues"    },
    ],
    admin: [
      { icon: "⊞", label: "Dashboard",    href: "dashboard.html",     id: "dashboard"    },
      { icon: "☰", label: "All Issues",   href: "dashboard.html",     id: "all-issues"   },
      { icon: "＋", label: "Create Issue", href: "issue-form.html",    id: "issue-form"   },
    ],
    staff: [
      { icon: "⊞", label: "Dashboard",    href: "dashboard.html",     id: "dashboard"    },
      { icon: "📋", label: "My Assigned",  href: "dashboard.html",     id: "assigned"     },
    ]
  };

  const links = navByRole[user.role] || navByRole.resident;

  const navHTML = links.map(link =>
    `<a href="${link.href}" class="nav-item ${activePage === link.id ? 'active' : ''}">
       <span class="icon">${link.icon}</span> ${link.label}
     </a>`
  ).join("");

  const roleLabel = { resident: "Resident", admin: "Admin", staff: "Staff" }[user.role];

  return `
    <aside class="sidebar">
      <div class="sidebar-brand">
        <h2>🏢 ApartmentCare</h2>
        <p>Issue Reporting System</p>
      </div>
      <nav class="sidebar-nav">
        <div class="nav-label">Menu</div>
        ${navHTML}
      </nav>
      <div class="sidebar-footer">
        <div class="user-pill">
          <div class="avatar">${user.initials || user.name.slice(0,2).toUpperCase()}</div>
          <div class="user-info">
            <p>${user.name}</p>
            <span>${user.flatNo || ""} · ${roleLabel}</span>
          </div>
          <button class="logout-btn" onclick="logout()" title="Logout">⇥</button>
        </div>
      </div>
    </aside>`;
}

// Logout
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

// Inject sidebar into page
function initSidebar(activePage) {
  const target = document.getElementById("sidebar-placeholder");
  if (target) target.outerHTML = buildSidebar(activePage);
}

// ── API Integration Points ────────────────────────────────────
// When backend is ready, replace these functions:

// const BASE_URL = "http://localhost:5000";  // ← your backend URL

// async function apiGetIssues() {
//   const res = await fetch(`${BASE_URL}/issues`, {
//     headers: { Authorization: "Bearer " + localStorage.getItem("token") }
//   });
//   return res.json();
// }

// async function apiCreateIssue(data) {
//   const res = await fetch(`${BASE_URL}/issues`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json", Authorization: "Bearer " + localStorage.getItem("token") },
//     body: JSON.stringify(data)
//   });
//   return res.json();
// }

// async function apiUpdateStatus(id, status) {
//   const res = await fetch(`${BASE_URL}/status/${id}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json", Authorization: "Bearer " + localStorage.getItem("token") },
//     body: JSON.stringify({ status })
//   });
//   return res.json();
// }