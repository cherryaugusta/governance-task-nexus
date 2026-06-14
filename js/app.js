import {
  loadFromStorage,
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  toggleComplete,
  clearAll,
  getTask,
  subscribe,
} from "./store.js";

import { renderTaskList, updateStats, updateBadges } from "./render.js";

import {
  wireModalEvents,
  wireConfirmEvents,
  openAddModal,
  openEditModal,
  openConfirmDelete,
} from "./modal.js";

import { showToast } from "./toast.js";

// ── Application state ─────────────────────────────────────────
const state = {
  viewFilter: "all",
  categoryFilter: null,
  priorityFilter: "all",
  searchQuery: "",
  sortKey: "created-desc",
};

const $taskList = document.getElementById("task-list");
const $emptyState = document.getElementById("empty-state");

// ── Bootstrap ─────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  wireModalEvents(handleModalSave);
  wireConfirmEvents(null);

  _wireNavFilters();
  _wireSearch();
  _wireChips();
  _wireSort();
  _wireToolbar();
  _wireTheme();
  _wireEmptyAdd();
  _wireAddBtn();

  subscribe(() => _refreshUI());
  loadFromStorage();
});

// ── UI Refresh ────────────────────────────────────────────────
function _refreshUI() {
  const all = getTasks();
  const filtered = _applyFilters(all);
  const sorted = _applySort(filtered);

  renderTaskList($taskList, $emptyState, sorted, {
    onEdit: (id) => {
      const t = getTask(id);
      if (t) openEditModal(t);
    },
    onDelete: (id) => {
      const t = getTask(id);
      if (!t) return;
      openConfirmDelete(t.title, () => {
        deleteTask(id);
        showToast("Task deleted.", "success");
      });
    },
    onToggle: (id) => {
      toggleComplete(id);
      const t = getTask(id);
      if (!t) return;
      showToast(t.status === "Completed" ? "Task marked complete." : "Task reopened.", "success");
    },
  });

  updateStats(all);
  updateBadges(all);
}

// ── Modal Save Handler ────────────────────────────────────────
function handleModalSave({ id, fields, isEdit }) {
  if (isEdit) {
    updateTask(id, fields);
    showToast("Task updated.", "success");
  } else {
    addTask(fields);
    showToast("Task created.", "success");
  }
}

// ── Filtering ─────────────────────────────────────────────────
function _applyFilters(tasks) {
  return tasks.filter((t) => {
    if (state.viewFilter === "active" && t.status === "Completed") return false;
    if (state.viewFilter === "completed" && t.status !== "Completed") return false;
    if (state.viewFilter === "blocked" && t.status !== "Blocked") return false;

    if (state.categoryFilter && t.category !== state.categoryFilter) return false;

    if (state.priorityFilter !== "all" && t.priority !== state.priorityFilter) return false;

    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      const haystack = [t.title, t.description, t.category, t.owner, t.priority, t.status]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    return true;
  });
}

// ── Sorting ───────────────────────────────────────────────────
const PRIORITY_ORDER = { Critical: 4, High: 3, Medium: 2, Low: 1 };

function _applySort(tasks) {
  const arr = [...tasks];
  switch (state.sortKey) {
    case "created-asc":
      return arr.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    case "created-desc":
      return arr.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "due-asc":
      return arr.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      });
    case "priority-desc":
      return arr.sort(
        (a, b) => (PRIORITY_ORDER[b.priority] || 0) - (PRIORITY_ORDER[a.priority] || 0)
      );
    case "title-asc":
      return arr.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return arr;
  }
}

// ── Event Wiring ──────────────────────────────────────────────
function _wireNavFilters() {
  document.querySelectorAll("[data-filter-view]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.viewFilter = btn.dataset.filterView;
      state.categoryFilter = null;

      document.querySelectorAll("[data-filter-view]").forEach((b) => b.classList.remove("active"));
      document
        .querySelectorAll("[data-filter-category]")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      _refreshUI();
    });
  });

  document.querySelectorAll("[data-filter-category]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.filterCategory;
      state.categoryFilter = state.categoryFilter === cat ? null : cat;
      state.viewFilter = "all";

      document.querySelectorAll("[data-filter-view]").forEach((b) => b.classList.remove("active"));
      document
        .querySelectorAll("[data-filter-category]")
        .forEach((b) => b.classList.remove("active"));

      if (state.categoryFilter) {
        btn.classList.add("active");
      } else {
        document.querySelector('[data-filter-view="all"]')?.classList.add("active");
      }

      _refreshUI();
    });
  });
}

function _wireSearch() {
  const $search = document.getElementById("search-input");
  let debounce;
  $search.addEventListener("input", () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      state.searchQuery = $search.value.trim();
      _refreshUI();
    }, 150);
  });
}

function _wireChips() {
  document.querySelectorAll("[data-priority-filter]").forEach((chip) => {
    chip.addEventListener("click", () => {
      state.priorityFilter = chip.dataset.priorityFilter;
      document
        .querySelectorAll("[data-priority-filter]")
        .forEach((c) => c.classList.toggle("chip-active", c === chip));
      _refreshUI();
    });
  });
}

function _wireSort() {
  const $sort = document.getElementById("sort-select");
  $sort.addEventListener("change", () => {
    state.sortKey = $sort.value;
    _refreshUI();
  });
}

function _wireToolbar() {
  document.getElementById("export-btn").addEventListener("click", _exportJSON);

  document.getElementById("clear-btn").addEventListener("click", () => {
    if (getTasks().length === 0) {
      showToast("No tasks to clear.", "info");
      return;
    }
    openConfirmDelete("ALL tasks in the control plane", () => {
      clearAll();
      showToast("All tasks cleared.", "success");
    });
  });
}

function _wireAddBtn() {
  document.getElementById("add-task-btn").addEventListener("click", openAddModal);
}

function _wireEmptyAdd() {
  document.getElementById("empty-add-btn").addEventListener("click", openAddModal);
}

function _wireTheme() {
  const $btn = document.getElementById("theme-toggle-btn");
  const $icon = document.getElementById("theme-icon");
  const $label = document.getElementById("theme-label");

  const saved = localStorage.getItem("gtn_theme") || "dark";
  document.documentElement.setAttribute("data-theme", saved);
  _updateThemeUI(saved, $icon, $label);

  $btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("gtn_theme", next);
    _updateThemeUI(next, $icon, $label);
  });
}

function _updateThemeUI(theme, $icon, $label) {
  if (theme === "dark") {
    $icon.textContent = "☀";
    $label.textContent = "Light mode";
  } else {
    $icon.textContent = "☾";
    $label.textContent = "Dark mode";
  }
}

// ── JSON Export ───────────────────────────────────────────────
function _exportJSON() {
  const tasks = getTasks();

  if (tasks.length === 0) {
    showToast("No tasks to export.", "warn");
    return;
  }

  const payload = {
    exportedAt: new Date().toISOString(),
    application: "GovernanceTask Nexus",
    version: "1.2.0",
    portfolioContext:
      "Aligned with consumer-duty-evidence-engine, agentic-compliance-auditor, and ai-model-governance-workbench",
    taskCount: tasks.length,
    tasks,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `gtn-export-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast(`Exported ${tasks.length} task${tasks.length !== 1 ? "s" : ""}.`, "success");
}
