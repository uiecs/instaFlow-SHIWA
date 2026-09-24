const toast = document.querySelector('#toast');
let toastTimer;
function notify(message) { toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2600); }

// Preserve the existing dashboard layout while adding the requested branded AI chat surface.
const brandCopy = document.querySelector('.brand-copy');
if (brandCopy) {
  brandCopy.innerHTML = '<strong class="shiwa-brand">ιɴѕтαɢrαм αι coɴтrol ceɴтer ѕнιwα</strong><span>AI-assisted Instagram workspace</span>';
}
const pageHeading = document.querySelector('.page-heading h1');
if (pageHeading) pageHeading.innerHTML = 'ιɴѕтαɢrαм αι coɴтrol ceɴтer <i>ѕнιwα</i> <span class="heading-crown">♔</span>';

const chatPanel = document.createElement('section');
chatPanel.className = 'panel shiwa-chat-panel';
chatPanel.innerHTML = `
  <div class="panel-heading"><h2><span class="heading-icon">▱</span>AI Chat</h2><button class="see-all" type="button" id="clearShiwaChat">Clear <span>×</span></button></div>
  <div class="shiwa-chat-log" id="shiwaChatLog"><div class="shiwa-welcome">Ask about Instagram strategy, captions, hashtags, or this dashboard.</div></div>
  <form class="shiwa-chat-form" id="shiwaChatForm">
    <textarea id="shiwaChatInput" aria-label="Chat message" placeholder="Ask your AI assistant..." rows="3"></textarea>
    <button class="shiwa-send" type="submit" aria-label="Send message">➤</button>
  </form>
`;
const main = document.querySelector('.main-content');
const footer = main?.querySelector('footer');
if (main && footer) main.insertBefore(chatPanel, footer);

const chatLog = document.querySelector('#shiwaChatLog');
const chatInput = document.querySelector('#shiwaChatInput');
const chatForm = document.querySelector('#shiwaChatForm');
const clearChat = document.querySelector('#clearShiwaChat');
const apiBase = (window.SHIWA_API_URL || window.localStorage.getItem('SHIWA_API_URL') || '').replace(/\/$/, '');

function addMessage(role, text) {
  if (!chatLog) return;
  const message = document.createElement('div');
  message.className = `shiwa-message ${role}`;
  message.innerHTML = `<b>${role === 'user' ? 'You' : 'AI'}</b><p></p>`;
  message.querySelector('p').textContent = text;
  chatLog.appendChild(message);
  chatLog.scrollTop = chatLog.scrollHeight;
}

chatForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const value = chatInput?.value.trim();
  if (!value) return;
  addMessage('user', value);
  chatInput.value = '';
  if (!apiBase) {
    addMessage('assistant', 'AI backend is not configured. Set SHIWA_API_URL or connect the official backend before sending messages.');
    return;
  }
  try {
    const response = await fetch(`${apiBase}/ai/chat`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({prompt: value}) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'The AI request failed.');
    addMessage('assistant', data.text || JSON.stringify(data));
  } catch (error) {
    addMessage('assistant', error instanceof Error ? error.message : 'The AI backend is unavailable.');
  }
});
clearChat?.addEventListener('click', () => { if (chatLog) chatLog.innerHTML = '<div class="shiwa-welcome">Ask about Instagram strategy, captions, hashtags, or this dashboard.</div>'; });

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

const style = document.createElement('style');
style.textContent = `
.shiwa-brand{font-family:'DM Sans',Arial,sans-serif;font-size:clamp(15px,1.4vw,21px);letter-spacing:.02em;white-space:nowrap}
.shiwa-chat-panel{margin-top:24px}
.shiwa-chat-log{min-height:180px;max-height:360px;overflow:auto;padding:10px 4px}
.shiwa-welcome{color:var(--muted);font-size:clamp(16px,1.5vw,20px);padding:18px 12px}
.shiwa-message{border-top:1px solid rgba(84,143,255,.18);padding:16px 12px;font-size:clamp(16px,1.5vw,20px);line-height:1.65}
.shiwa-message b{color:#00f3a4;font-size:clamp(15px,1.3vw,18px)}
.shiwa-message p{margin:5px 0;white-space:pre-wrap}
.shiwa-chat-form{display:flex;align-items:flex-end;gap:12px;margin-top:14px}
.shiwa-chat-form textarea{flex:1;min-height:92px;padding:18px 20px;border:2px solid rgba(84,143,255,.62);border-radius:18px;background:#071126;color:var(--text);font:inherit;font-size:clamp(17px,1.6vw,21px);line-height:1.5;resize:vertical;outline:none;box-shadow:0 0 0 3px rgba(36,108,255,.08)}
.shiwa-chat-form textarea:focus{border-color:#00f3a4;box-shadow:0 0 0 4px rgba(0,243,164,.12)}
.shiwa-send{width:58px;height:58px;border:1px solid rgba(0,243,164,.45);border-radius:16px;background:linear-gradient(135deg,#126bff,#00b98a);color:white;font-size:25px;cursor:pointer}
@media(max-width:640px){.shiwa-brand{white-space:normal;line-height:1.2}.shiwa-chat-form{align-items:stretch}.shiwa-send{width:52px;height:auto}}
`;
document.head.appendChild(style);
