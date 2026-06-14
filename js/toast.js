const ICONS = {
  success: "✓",
  error: "✕",
  warn: "⚠",
  info: "ℹ",
};

const DURATIONS = {
  success: 3000,
  error: 5000,
  warn: 4000,
  info: 3500,
};

let _container = null;

function _getContainer() {
  if (!_container) _container = document.getElementById("toast-container");
  return _container;
}

export function showToast(message, type = "info") {
  const container = _getContainer();
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon" aria-hidden="true">${ICONS[type] || ICONS.info}</span>
    <span class="toast-msg">${_esc(message)}</span>
  `;

  container.appendChild(toast);

  const duration = DURATIONS[type] || 3500;

  const dismiss = () => {
    toast.classList.add("toast-exit");
    toast.addEventListener("animationend", () => toast.remove(), { once: true });
  };

  const timer = setTimeout(dismiss, duration);

  toast.addEventListener("click", () => {
    clearTimeout(timer);
    dismiss();
  });
}

function _esc(str) {
  return (str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
