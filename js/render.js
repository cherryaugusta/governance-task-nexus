const CAT_COLORS = {
  Compliance: "var(--cat-compliance)",
  Evidence: "var(--cat-evidence)",
  "AI-Gov": "var(--cat-aigov)",
  Audit: "var(--cat-audit)",
  "Policy Review": "var(--cat-policy)",
  Regulatory: "var(--cat-regulatory)",
  Incident: "var(--cat-incident)",
};

const PRI_COLORS = {
  Critical: "var(--pri-critical)",
  High: "var(--pri-high)",
  Medium: "var(--pri-medium)",
  Low: "var(--pri-low)",
};

const ST_COLORS = {
  Pending: "var(--status-pending)",
  "In Review": "var(--status-in-review)",
  Blocked: "var(--status-blocked)",
  Completed: "var(--status-completed)",
};

const DATE_FMT = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function _fmtDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  return isNaN(d) ? null : DATE_FMT.format(d);
}

function _fmtTs(isoFull) {
  if (!isoFull) return "—";
  const d = new Date(isoFull);
  if (isNaN(d)) return "—";
  return (
    DATE_FMT.format(d) + " " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
  );
}

function _dueCls(dueDateStr) {
  if (!dueDateStr) return "";
  const due = new Date(dueDateStr);
  const now = new Date();
  const diff = (due - now) / 86_400_000;
  if (diff < 0) return "due-overdue";
  if (diff < 2) return "due-soon";
  return "";
}

export function buildTaskCard(task, callbacks) {
  const card = document.createElement("div");
  card.className = "task-card" + (task.status === "Completed" ? " completed" : "");
  card.setAttribute("role", "listitem");
  card.setAttribute("data-task-id", task.id);
  card.style.setProperty("--cat-color", CAT_COLORS[task.category] || "var(--accent)");

  // Checkbox
  const cbWrap = document.createElement("div");
  cbWrap.className = "task-checkbox-wrap";
  const cb = document.createElement("input");
  cb.type = "checkbox";
  cb.className = "task-checkbox";
  cb.checked = task.status === "Completed";
  cb.setAttribute(
    "aria-label",
    `Mark "${task.title}" as ${cb.checked ? "incomplete" : "complete"}`
  );
  cb.addEventListener("change", () => callbacks.onToggle(task.id));
  cbWrap.appendChild(cb);

  // Body
  const body = document.createElement("div");
  body.className = "task-body";

  const titleRow = document.createElement("div");
  titleRow.className = "task-title-row";

  const titleEl = document.createElement("span");
  titleEl.className = "task-title-text";
  titleEl.textContent = task.title;

  const catTag = _makeTag("tag-category", task.category);
  catTag.style.setProperty("--cat-color", CAT_COLORS[task.category] || "var(--accent)");

  const priTag = _makeTag("tag-priority", task.priority);
  priTag.style.setProperty("--pri-color", PRI_COLORS[task.priority] || "var(--warning)");

  const stTag = _makeTag("tag-status", task.status);
  stTag.style.setProperty("--st-color", ST_COLORS[task.status] || "var(--text-muted)");

  titleRow.append(titleEl, catTag, priTag, stTag);
  body.appendChild(titleRow);

  if (task.description) {
    const desc = document.createElement("p");
    desc.className = "task-desc";
    desc.textContent = task.description;
    body.appendChild(desc);
  }

  // Meta row
  const meta = document.createElement("div");
  meta.className = "task-meta-row";

  if (task.owner) {
    meta.appendChild(_metaItem("◷", task.owner));
  }

  if (task.dueDate) {
    const fmted = _fmtDate(task.dueDate);
    const cls = _dueCls(task.dueDate);
    const dueEl = _metaItem("⏱", fmted || task.dueDate);
    if (cls) dueEl.classList.add(cls);
    meta.appendChild(dueEl);
  }

  meta.appendChild(_metaItem("＋", _fmtTs(task.createdAt)));

  if (task.updatedAt !== task.createdAt) {
    meta.appendChild(_metaItem("↻", _fmtTs(task.updatedAt)));
  }

  const stamp = document.createElement("span");
  stamp.className = "governance-stamp";
  stamp.textContent = "AUDIT-READY";
  meta.appendChild(stamp);

  body.appendChild(meta);

  // Actions
  const actions = document.createElement("div");
  actions.className = "task-actions";

  const editBtn = _actionBtn("✎", "Edit task", false);
  editBtn.addEventListener("click", () => callbacks.onEdit(task.id));

  const delBtn = _actionBtn("⊗", "Delete task", true);
  delBtn.addEventListener("click", () => callbacks.onDelete(task.id));

  actions.append(editBtn, delBtn);

  card.append(cbWrap, body, actions);
  return card;
}

export function renderTaskList(listEl, emptyEl, tasks, callbacks) {
  if (tasks.length === 0) {
    listEl.innerHTML = "";
    emptyEl.classList.remove("hidden");
    return;
  }

  emptyEl.classList.add("hidden");
  listEl.innerHTML = "";

  const frag = document.createDocumentFragment();
  tasks.forEach((task) => {
    frag.appendChild(buildTaskCard(task, callbacks));
  });
  listEl.appendChild(frag);
}

export function updateStats(allTasks) {
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };
  set("stat-total", allTasks.length);
  set("stat-pending", allTasks.filter((t) => t.status === "Pending").length);
  set("stat-review", allTasks.filter((t) => t.status === "In Review").length);
  set("stat-blocked", allTasks.filter((t) => t.status === "Blocked").length);
  set("stat-done", allTasks.filter((t) => t.status === "Completed").length);
}

export function updateBadges(allTasks) {
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };
  set("badge-all", allTasks.length);
  set("badge-active", allTasks.filter((t) => t.status !== "Completed").length);
  set("badge-completed", allTasks.filter((t) => t.status === "Completed").length);
  set("badge-blocked", allTasks.filter((t) => t.status === "Blocked").length);
}

function _makeTag(cls, text) {
  const span = document.createElement("span");
  span.className = `tag ${cls}`;
  span.textContent = text;
  return span;
}

function _metaItem(icon, text) {
  const span = document.createElement("span");
  span.className = "task-meta-item";
  span.innerHTML = `<span class="meta-icon">${icon}</span>${_esc(text)}`;
  return span;
}

function _actionBtn(icon, label, isDanger) {
  const btn = document.createElement("button");
  btn.className = "task-action-btn" + (isDanger ? " delete" : "");
  btn.setAttribute("aria-label", label);
  btn.textContent = icon;
  return btn;
}

function _esc(str) {
  return (str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
