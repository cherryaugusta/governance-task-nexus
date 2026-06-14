// Polyfill for crypto.randomUUID in older browsers
if (!crypto.randomUUID) {
  crypto.randomUUID = () =>
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
}

const STORAGE_KEY = "gtn_tasks_v1";

let _tasks = [];
const _listeners = new Set();

export function subscribe(fn) {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

function _notify() {
  _listeners.forEach((fn) => fn([..._tasks]));
}

function _persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(_tasks));
  } catch {
    // storage unavailable — silent fail
  }
}

export function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      _tasks = JSON.parse(raw);
    } else {
      _tasks = _seedData();
      _persist();
    }
  } catch {
    _tasks = _seedData();
  }
  _notify();
}

export function addTask(fields) {
  const now = new Date().toISOString();
  const task = {
    id: crypto.randomUUID(),
    title: fields.title.trim(),
    description: (fields.description || "").trim(),
    category: fields.category || "Compliance",
    priority: fields.priority || "Medium",
    status: fields.status || "Pending",
    dueDate: fields.dueDate || "",
    owner: (fields.owner || "").trim(),
    createdAt: now,
    updatedAt: now,
  };
  _tasks.unshift(task);
  _persist();
  _notify();
  return task;
}

export function updateTask(id, fields) {
  const idx = _tasks.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  _tasks[idx] = {
    ..._tasks[idx],
    ...fields,
    id,
    updatedAt: new Date().toISOString(),
  };
  _persist();
  _notify();
  return _tasks[idx];
}

export function deleteTask(id) {
  const len = _tasks.length;
  _tasks = _tasks.filter((t) => t.id !== id);
  if (_tasks.length === len) return false;
  _persist();
  _notify();
  return true;
}

export function toggleComplete(id) {
  const task = _tasks.find((t) => t.id === id);
  if (!task) return;
  const newStatus = task.status === "Completed" ? "Pending" : "Completed";
  updateTask(id, { status: newStatus });
}

export function clearAll() {
  _tasks = [];
  _persist();
  _notify();
}

export function getTasks() {
  return [..._tasks];
}

export function getTask(id) {
  return _tasks.find((t) => t.id === id) || null;
}

export function isDuplicateTitle(title, excludeId = null) {
  const normalised = title.trim().toLowerCase();
  return _tasks.some((t) => t.title.toLowerCase() === normalised && t.id !== excludeId);
}

function _seedData() {
  const now = new Date();

  const d = (days) => {
    const dt = new Date(now);
    dt.setDate(dt.getDate() + days);
    return dt.toISOString().slice(0, 10);
  };

  const ts = (daysAgo) => {
    const dt = new Date(now);
    dt.setDate(dt.getDate() - daysAgo);
    return dt.toISOString();
  };

  return [
    {
      id: crypto.randomUUID(),
      title: "Complete DORA evidence pack for Q2 submission",
      description:
        "Collate ICT risk management artefacts, incident register, and third-party testing results for regulatory submission deadline.",
      category: "Evidence",
      priority: "Critical",
      status: "In Review",
      dueDate: d(3),
      owner: "Compliance Lead",
      createdAt: ts(4),
      updatedAt: ts(1),
    },
    {
      id: crypto.randomUUID(),
      title: "Review AI model governance policy v2.4 against PS24/16",
      description:
        "Identify any policy gaps introduced by the FCA's updated model risk guidance. Annotate with change-log references.",
      category: "AI-Gov",
      priority: "High",
      status: "Pending",
      dueDate: d(7),
      owner: "Model Risk Officer",
      createdAt: ts(3),
      updatedAt: ts(3),
    },
    {
      id: crypto.randomUUID(),
      title: "Audit trail reconciliation for Consumer Duty outcomes",
      description:
        "Cross-check evidence sufficiency scores from Q1 against board-approved thresholds. Flag any sub-threshold controls.",
      category: "Audit",
      priority: "High",
      status: "Blocked",
      dueDate: d(2),
      owner: "Internal Audit",
      createdAt: ts(6),
      updatedAt: ts(2),
    },
    {
      id: crypto.randomUUID(),
      title: "Update sanctions screening policy to reflect OFSI guidance",
      description:
        "Incorporate March 2025 OFSI amendments covering crypto-asset intermediaries and correspondent banking obligations.",
      category: "Policy Review",
      priority: "Medium",
      status: "Pending",
      dueDate: d(14),
      owner: "Financial Crime Team",
      createdAt: ts(2),
      updatedAt: ts(2),
    },
    {
      id: crypto.randomUUID(),
      title: "Prompt versioning gate review — LLM v3.1 release",
      description:
        "Conduct eval gate review for production LLM prompt changes. Ensure rollback artefacts are stored in the governance workbench.",
      category: "AI-Gov",
      priority: "High",
      status: "In Review",
      dueDate: d(5),
      owner: "ML Governance Team",
      createdAt: ts(1),
      updatedAt: ts(1),
    },
    {
      id: crypto.randomUUID(),
      title: "PolicyPulse regulatory horizon-scan — June 2025",
      description:
        "Monthly scan of FCA, PRA, and EBA publications. Summarise material changes affecting model risk and operational resilience obligations.",
      category: "Regulatory",
      priority: "Medium",
      status: "Completed",
      dueDate: d(-2),
      owner: "Regulatory Affairs",
      createdAt: ts(10),
      updatedAt: ts(2),
    },
    {
      id: crypto.randomUUID(),
      title: "Incident post-mortem — OpsSentinel false-positive spike",
      description:
        "Root cause analysis for elevated false-positive rate observed in OpsSentinel anomaly detection on 14 May. Document remediation actions.",
      category: "Incident",
      priority: "High",
      status: "Completed",
      dueDate: d(-5),
      owner: "Platform Engineering",
      createdAt: ts(14),
      updatedAt: ts(5),
    },
  ];
}
