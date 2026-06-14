import { isDuplicateTitle } from "./store.js";

let $overlay, $titleInput, $descInput, $categorySelect, $prioritySelect,
    $statusSelect, $dueDateInput, $ownerInput, $titleError,
    $saveBtn, $saveLbl, $modalTitle, $cancelBtn, $closeBtn;

function _init() {
  if ($overlay) return;
  $overlay        = document.getElementById("modal-overlay");
  $titleInput     = document.getElementById("task-title");
  $descInput      = document.getElementById("task-desc");
  $categorySelect = document.getElementById("task-category");
  $prioritySelect = document.getElementById("task-priority");
  $statusSelect   = document.getElementById("task-status");
  $dueDateInput   = document.getElementById("task-due");
  $ownerInput     = document.getElementById("task-owner");
  $titleError     = document.getElementById("title-error");
  $saveBtn        = document.getElementById("modal-save-btn");
  $saveLbl        = document.getElementById("modal-save-label");
  $modalTitle     = document.getElementById("modal-title");
  $cancelBtn      = document.getElementById("modal-cancel-btn");
  $closeBtn       = document.getElementById("modal-close-btn");
}

let _currentEditId  = null;
let _onSaveCallback = null;

export function wireModalEvents(onSave) {
  _init();
  _onSaveCallback = onSave;

  $saveBtn.addEventListener("click", _handleSave);
  $cancelBtn.addEventListener("click", closeModal);
  $closeBtn.addEventListener("click", closeModal);

  $overlay.addEventListener("click", (e) => {
    if (e.target === $overlay) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !$overlay.classList.contains("hidden")) {
      closeModal();
    }
  });

  $titleInput.addEventListener("input", _clearTitleError);
}

export function openAddModal() {
  _init();
  _currentEditId = null;
  $modalTitle.textContent = "New Task";
  $saveLbl.textContent    = "Create Task";
  _clearFields();
  _clearTitleError();
  _openOverlay();
  setTimeout(() => $titleInput.focus(), 50);
}

export function openEditModal(task) {
  _init();
  _currentEditId = task.id;
  $modalTitle.textContent = "Edit Task";
  $saveLbl.textContent    = "Save Changes";

  $titleInput.value     = task.title;
  $descInput.value      = task.description || "";
  $categorySelect.value = task.category;
  $prioritySelect.value = task.priority;
  $statusSelect.value   = task.status;
  $dueDateInput.value   = task.dueDate || "";
  $ownerInput.value     = task.owner || "";

  _clearTitleError();
  _openOverlay();
  setTimeout(() => $titleInput.focus(), 50);
}

export function closeModal() {
  _init();
  $overlay.classList.add("hidden");
  _currentEditId = null;
}

function _openOverlay() {
  $overlay.classList.remove("hidden");
}

function _clearFields() {
  $titleInput.value     = "";
  $descInput.value      = "";
  $categorySelect.value = "Compliance";
  $prioritySelect.value = "Medium";
  $statusSelect.value   = "Pending";
  $dueDateInput.value   = "";
  $ownerInput.value     = "";
}

function _clearTitleError() {
  $titleError.textContent = "";
  $titleInput.classList.remove("error");
}

function _handleSave() {
  const title = $titleInput.value.trim();

  if (!title) {
    $titleError.textContent = "Task title is required.";
    $titleInput.classList.add("error");
    $titleInput.focus();
    return;
  }

  if (isDuplicateTitle(title, _currentEditId)) {
    $titleError.textContent = "A task with this title already exists.";
    $titleInput.classList.add("error");
    $titleInput.focus();
    return;
  }

  const fields = {
    title,
    description: $descInput.value.trim(),
    category:    $categorySelect.value,
    priority:    $prioritySelect.value,
    status:      $statusSelect.value,
    dueDate:     $dueDateInput.value,
    owner:       $ownerInput.value.trim(),
  };

  _onSaveCallback?.({
    id:     _currentEditId,
    fields,
    isEdit: _currentEditId !== null,
  });

  closeModal();
}

// ── CONFIRM DELETE DIALOG ─────────────────────────────────────
let $confirmOverlay, $confirmLabel, $confirmDeleteBtn, $confirmCancelBtn;
let _onDeleteConfirm = null;

function _initConfirm() {
  if ($confirmOverlay) return;
  $confirmOverlay   = document.getElementById("confirm-overlay");
  $confirmLabel     = document.getElementById("confirm-task-label");
  $confirmDeleteBtn = document.getElementById("confirm-delete-btn");
  $confirmCancelBtn = document.getElementById("confirm-cancel-btn");
}

export function wireConfirmEvents(_onDelete) {
  _initConfirm();

  $confirmDeleteBtn.addEventListener("click", () => {
    _onDeleteConfirm?.();
    closeConfirm();
  });

  $confirmCancelBtn.addEventListener("click", closeConfirm);

  $confirmOverlay.addEventListener("click", (e) => {
    if (e.target === $confirmOverlay) closeConfirm();
  });

  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      !$confirmOverlay.classList.contains("hidden")
    ) {
      closeConfirm();
    }
  });
}

export function openConfirmDelete(taskTitle, onConfirm) {
  _initConfirm();
  $confirmLabel.textContent = `"${taskTitle}"`;
  _onDeleteConfirm = onConfirm;
  $confirmOverlay.classList.remove("hidden");
  setTimeout(() => $confirmDeleteBtn.focus(), 50);
}

export function closeConfirm() {
  _initConfirm();
  $confirmOverlay.classList.add("hidden");
}
