const toast = document.querySelector('#toast');
let toastTimer;
function notify(message) { toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2600); }

document.querySelectorAll('.nav-item').forEach((item) => item.addEventListener('click', () => {
  document.querySelectorAll('.nav-item').forEach((nav) => nav.classList.remove('active'));
  item.classList.add('active');
  document.querySelector('#sidebar').classList.remove('open');
  notify(`${item.dataset.page} workspace selected`);
}));

document.querySelectorAll('.action-card').forEach((card) => card.addEventListener('click', () => notify(`${card.dataset.action} flow is ready to configure`)));
document.querySelector('#rangeSelect').addEventListener('click', () => notify('Date range selector opened'));
document.querySelector('#notifications').addEventListener('click', () => notify('You are all caught up'));
document.querySelector('#connectionStatus').addEventListener('click', () => notify('Instagram connection is healthy'));
document.querySelector('#logout').addEventListener('click', () => notify('Demo logout — session kept for preview'));
document.querySelector('#menuToggle').addEventListener('click', () => document.querySelector('#sidebar').classList.toggle('open'));
