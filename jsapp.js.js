/* ══════════════════════════════════════════════════════════════
   AP SCHOOLS — SHARED APP HELPERS
══════════════════════════════════════════════════════════════ */

/* ── NAVIGATION ── */
function goTo(path) {
  window.location.href = path;
}

function goBack() {
  if (document.referrer && document.referrer !== '') {
    window.history.back();
  } else {
    window.location.href = '../index.html';
  }
}

/* ── TOAST ── */
function showToast(message, type = 'success') {
  let toast = document.getElementById('toast');

  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.className = 'toast';
  if (type === 'error')   toast.classList.add('toast-error');
  if (type === 'warning') toast.classList.add('toast-warning');

  toast.textContent = message;

  void toast.offsetWidth;
  toast.classList.add('toast-show');

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('toast-show');
  }, 2600);
}

/* ── STORAGE HELPERS ── */
function getSetup() {
  try {
    return JSON.parse(localStorage.getItem('ap_device_setup') || 'null');
  } catch (e) {
    return null;
  }
}

function hasSetup() {
  const s = getSetup();
  return !!(s && s.schoolName && s.village && s.district && s.mandal);
}

/* ── ROUTE GUARDS ── */
function requireSetup() {
  if (!hasSetup()) {
    goTo('./setup.html');
    return false;
  }
  return true;
}

function requireActivation() {
  const activated = localStorage.getItem('ap_activated') === 'true';
  if (!activated) {
    goTo('./activation.html');
    return false;
  }
  return true;
}

function requireLogin() {
  const loggedIn = sessionStorage.getItem('ap_logged_in') === 'true';
  if (!loggedIn) {
    goTo('./login.html');
    return false;
  }
  return true;
}

/* ── HEADER INJECTOR ── */
function injectHeaderInfo() {
  const setup = getSetup();
  if (!setup) return;

  document.querySelectorAll('[data-header-school]').forEach(el => {
    el.textContent = setup.schoolName || 'School';
  });

  document.querySelectorAll('[data-header-village]').forEach(el => {
    el.textContent = setup.village || '';
  });

  document.querySelectorAll('[data-header-title]').forEach(el => {
    el.textContent = `${setup.schoolName || ''} · ${setup.village || ''}`.trim().replace(/^·|·$/g, '');
  });
}

/* ── FORM HELPERS ── */
function readForm(ids) {
  const data = {};
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) data[id] = (el.value || '').trim();
  });
  return data;
}

function validateRequired(ids) {
  for (const id of ids) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (!el.value || !el.value.trim()) {
      el.focus();
      return { ok: false, id, el };
    }
  }
  return { ok: true };
}

/* ── DATE HELPERS ── */
function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function formatDateNice(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}-${m}-${y}`;
}

function formatTime12() {
  const d = new Date();
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${ampm}`;
}

/* ── BOOT ── */
document.addEventListener('DOMContentLoaded', () => {
  injectHeaderInfo();

  document.querySelectorAll('[data-today]').forEach(el => {
    if (el.type === 'date') el.value = todayISO();
  });
});