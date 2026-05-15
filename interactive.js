// Interactive helpers: toast, modal simulation, keyboard and delegated handlers
function showToast(message, timeout = 3500) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = message;
  document.body.appendChild(t);
  // allow CSS transition
  requestAnimationFrame(() => t.classList.add('visible'));
  setTimeout(() => {
    t.classList.remove('visible');
    t.addEventListener('transitionend', () => t.remove());
  }, timeout);
}

function openDownloadModal(label) {
  const modal = document.getElementById('downloadModal');
  const fill = document.getElementById('progressFill');
  const text = document.getElementById('progressText');
  const status = document.getElementById('downloadStatus');
  if (!modal || !fill || !text || !status) return;
  modal.style.display = 'block';
  modal.setAttribute('aria-hidden', 'false');
  const close = document.getElementById('closeModalBtn');
  if (close) close.focus();
  fill.style.width = '0%';
  fill.setAttribute('aria-valuenow', 0);
  text.textContent = '0%';
  status.textContent = `Starting download: ${label}`;

  // simulate progress
  let progress = 0;
  const iv = setInterval(() => {
    progress += Math.floor(Math.random() * 12) + 8;
    if (progress > 100) progress = 100;
    fill.style.width = progress + '%';
    fill.setAttribute('aria-valuenow', progress);
    text.textContent = progress + '%';
    if (progress >= 100) {
      clearInterval(iv);
      status.textContent = 'Download complete';
      showToast(`${label} downloaded`);
      modal.setAttribute('aria-hidden', 'true');
      setTimeout(() => { modal.style.display = 'none'; }, 600);
      if (window.app) {
        window.app.downloadCount++;
        window.app.updateDownloadCounter();
        localStorage.setItem('downloadCount', window.app.downloadCount.toString());
      }
    }
  }, 300);
}

function closeDownloadModal() {
  const modal = document.getElementById('downloadModal');
  if (!modal) return;
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
}

// Delegated clicks for generated download buttons
document.addEventListener('click', function (e) {
  const btn = e.target.closest && e.target.closest('.download-btn');
  if (btn) {
    e.preventDefault();
    const label = btn.getAttribute('aria-label') || btn.textContent.trim() || 'Download';
    openDownloadModal(label);
    showToast('Download started');
  }
});

// Replace main download behavior: open modal instead of raw anchor download
document.addEventListener('DOMContentLoaded', function () {
  const main = document.getElementById('mainDownloadBtn');
  if (main) {
    main.addEventListener('click', function (e) {
      e.preventDefault();
      openDownloadModal('UltraEdit — Recommended');
      showToast('Download started');
    });
  }

  // Close button behavior
  const closeBtn = document.getElementById('closeModalBtn');
  if (closeBtn) { closeBtn.addEventListener('click', closeDownloadModal); }
});

// Keyboard: Escape closes modal & collapses dropdowns
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    const modal = document.getElementById('downloadModal');
    if (modal && modal.style.display === 'block') { closeDownloadModal(); }
    document.querySelectorAll('.dropdown-trigger').forEach(d => d.setAttribute('aria-expanded', 'false'));
  }
});
