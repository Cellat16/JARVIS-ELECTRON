let apiKey = '', history = [], busy = false, pinned = false, listening = false, msgTotal = 0, wOff = 0;
let recognition = null;

// CLOCK
function clock() {
  const n = new Date();
  document.getElementById('time-display').textContent = n.toLocaleTimeString('tr-TR', { hour12: false });
  document.title = 'J.A.R.V.I.S. — ' + n.toLocaleTimeString('tr-TR', { hour12: false });
}
setInterval(clock, 1000); clock();

// STARS
(function initStars() {
  const cv = document.getElementById('stars');
  const ctx = cv.getContext('2d');
  let stars = [];
  function resize() {
    cv.width = window.innerWidth; cv.height = window.innerHeight;
    stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * cv.width, y: Math.random() * cv.height,
      r: Math.random() * 1.2, a: Math.random(), s: Math.random() * 0.005 + 0.001
    }));
  }
  window.addEventListener('resize', resize); resize();
  function frame() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    stars.forEach(s => {
      s.a += s.s; if (s.a > 1 || s.a < 0) s.s *= -1;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,255,255,${s.a * 0.6})`; ctx.fill();
    });
    requestAnimationFrame(frame);
  }
  frame();
})();

// ARC REACTOR
(function initArc() {
  const cv = document.getElementById('arc-canvas');
  const ctx = cv.getContext('2d');
  let angle = 0;
  function frame() {
    const w = cv.width, h = cv.height, cx = w / 2, cy = h / 2;
    ctx.clearRect(0, 0, w, h);
    [38, 28, 18].forEach((r, i) => {
      ctx.strokeStyle = `rgba(0,255,255,${0.08 + i * 0.04})`;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    });
    const rings = [{ r: 44, speed: 1, dashes: 8 }, { r: 34, speed: -1.5, dashes: 6 }, { r: 24, speed: 2, dashes: 4 }];
    rings.forEach(ring => {
      ctx.strokeStyle = 'rgba(0,255,255,0.5)';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#00ffff'; ctx.shadowBlur = 6;
      for (let i = 0; i < ring.dashes; i++) {
        const a = (i / ring.dashes) * Math.PI * 2 + angle * ring.speed;
        const x1 = cx + Math.cos(a) * (ring.r - 4), y1 = cy + Math.sin(a) * (ring.r - 4);
        const x2 = cx + Math.cos(a) * ring.r, y2 = cy + Math.sin(a) * ring.r;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      }
      ctx.shadowBlur = 0;
    });
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 14);
    grad.addColorStop(0, 'rgba(0,255,255,0.9)');
    grad.addColorStop(0.4, 'rgba(0,150,255,0.6)');
    grad.addColorStop(1, 'rgba(0,50,150,0.1)');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(cx, cy, 14, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(0,255,255,0.8)';
    ctx.lineWidth = 1;
    ctx.shadowColor = '#00ffff'; ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.arc(cx, cy, 14, 0, Math.PI * 2); ctx.stroke();
    ctx.shadowBlur = 0;
    angle += 0.015;
    requestAnimationFrame(frame);
  }
  frame();
})();

// HEX GRID
const hg = document.getElementById('hexgrid');
for (let i = 0; i < 20; i++) { const d = document.createElement('div'); d.className = 'hex'; hg.appendChild(d); }
setInterval(() => {
  document.querySelectorAll('.hex').forEach(h => h.classList.remove('on'));
  const n = Math.floor(Math.random() * 7) + 3;
  for (let i = 0; i < n; i++) document.querySelectorAll('.hex')[Math.floor(Math.random() * 20)].classList.add('on');
}, 1000);

// WAVE
(function initWave() {
  const cv = document.getElementById('wave-canvas');
  const ctx = cv.getContext('2d');
  function frame() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.strokeStyle = 'rgba(0,255,255,0.6)'; ctx.lineWidth = 1.5;
    ctx.shadowColor = '#00ffff'; ctx.shadowBlur = 3;
    ctx.beginPath();
    for (let x = 0; x < cv.width; x++) {
      const y = cv.height / 2 + Math.sin((x + wOff) * 0.12) * 10 + Math.sin((x + wOff) * 0.04) * 5;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke(); ctx.shadowBlur = 0; wOff += 2;
    requestAnimationFrame(frame);
  }
  frame();
})();

// STATS
function animateStats() {
  const cpu = Math.round(20 + Math.random() * 55);
  const ram = Math.round(35 + Math.random() * 45);
  const net = Math.round(10 + Math.random() * 75);
  document.getElementById('cpu-v').textContent = cpu + '%';
  document.getElementById('ram-v').textContent = ram + '%';
  document.getElementById('net-v').textContent = net + '%';
  document.getElementById('cpu-b').style.width = cpu + '%';
  document.getElementById('ram-b').style.width = ram + '%';
  document.getElementById('net-b').style.width = net + '%';
  document.getElementById('d1').textContent = (Math.random() * 9.9).toFixed(1) + 'MB';
  document.getElementById('d2').textContent = (Math.random() * 4.9).toFixed(1) + 'MB';
  document.getElementById('d3').textContent = Math.round(5 + Math.random() * 35) + 'ms';
  document.getElementById('d4').textContent = Math.round(Math.random() * 9999);
}
setInterval(animateStats, 2500); animateStats();

// ALERTS
function addAlert(txt, color) {
  const d = document.getElementById('alerts');
  const el = document.createElement('div');
  el.className = 'alert-item'; el.style.color = color;
  el.textContent = '▶ ' + txt;
  d.insertBefore(el, d.firstChild);
  if (d.children.length > 4) d.lastChild.remove();
}

// TASKS
function addTask(txt) {
  const d = document.getElementById('tasks');
  const now = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  const el = document.createElement('div'); el.className = 'task-item';
  el.innerHTML = `<span class="task-time">[${now}]</span> ${txt.substring(0, 16)}`;
  d.insertBefore(el, d.firstChild);
  if (d.children.length > 6) d.lastChild.remove();
}

// MESSAGES
function addMsg(role, text) {
  const d = document.getElementById('chat-messages');
  const el = document.createElement('div');
  el.className = 'msg ' + role;
  if (role === 'user') el.innerHTML = `<div class="msg-lbl">KULLANICI</div>${text}`;
  else if (role === 'ai') el.innerHTML = `<div class="msg-lbl">JARVIS</div>${text}`;
  else el.textContent = text;
  d.appendChild(el);
  d.scrollTop = d.scrollHeight;
  if (role !== 'sys') {
    msgTotal++;
    document.getElementById('msg-count').textContent = msgTotal;
    document.getElementById('msg-b').style.width = Math.min(msgTotal * 5, 100) + '%';
  }
}

function clearChat() {
  document.getElementById('chat-messages').innerHTML = '';
  history = [];
  addMsg('sys', '[ SOHBET TEMİZLENDİ ]');
}

// PIN
function togglePin() {
  pinned = !pinned;
  window.jarvis.togglePin(pinned);
  const btn = document.getElementById('pin-btn');
  btn.classList.toggle('active', pinned);
  btn.textContent = pinned ? '📌 SABİTLENDİ' : '📌 SABİTLE';
}

// SPACE = MIC
window.addEventListener('keydown', e => {
  if (e.code === 'Space' && document.activeElement === document.body) { e.preventDefault(); toggleMic(); }
});

// MIC
function toggleMic() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    addAlert('SES TANIMA DESTEKLENMIYOR', '#ff4444'); return;
  }
  if (listening) { recognition && recognition.stop(); return; }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SR();
  recognition.lang = 'tr-TR'; recognition.continuous = false; recognition.interimResults = false;
  recognition.onstart = () => { listening = true; document.getElementById('mic-btn').classList.add('listening'); };
  recognition.onresult = e => {
    const t = e.results[0][0].transcript;
    document.getElementById('msg-input').value = t;
    send();
  };
  recognition.onend = () => { listening = false; document.getElementById('mic-btn').classList.remove('listening'); };
  recognition.onerror = () => { listening = false; document.getElementById('mic-btn').classList.remove('listening'); };
  recognition.start();
}

// TTS
function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.substring(0, 200));
  u.lang = 'tr-TR'; u.rate = 1.1; u.pitch = 0.9;
  window.speechSynthesis.speak(u);
}

// API CONNECT
async function connect() {
  const v = document.getElementById('api-input').value.trim();
  if (!v.startsWith('sk-ant-')) { addAlert('GEÇERSİZ ANAHTAR FORMAT', '#ff4444'); return; }
  apiKey = v;
  await window.jarvis.saveApiKey(v);
  document.getElementById('conn-status').className = 'on';
  document.getElementById('conn-status').textContent = 'ONLINE';
  document.getElementById('status-txt').textContent = 'CLAUDE API BAĞLANTISI KURULDU';
  addAlert('API BAĞLANDI', '#00ff88');
  addMsg('ai', 'Sistemler aktive edildi, Efendim. Nasıl yardımcı olabilirim?');
  speak('Sistemler aktive edildi Efendim.');
}

// QUICK SEND
function quickSend(txt) {
  document.getElementById('msg-input').value = txt;
  send();
}

// SEND
async function send() {
  if (busy) return;
  if (!apiKey) { addAlert('API ANAHTARI GEREKLİ', '#ff4444'); return; }
  const inp = document.getElementById('msg-input');
  const txt = inp.value.trim();
  if (!txt) return;
  inp.value = '';
  addMsg('user', txt);
  history.push({ role: 'user', content: txt });
  busy = true;
  document.getElementById('typing').classList.add('show');
  addTask(txt);

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: 'Sen J.A.R.V.I.S. adında yapay zeka asistansın. Iron Man\'dan ilham aldın ve Stark Industries sistemlerini yönetiyorsun. Kullanıcıya "Efendim" diye hitap ediyorsun. Türkçe konuşuyorsun. Kısa, net ve yardımsever cevaplar veriyorsun. Teknik konularda uzmansın.',
        messages: history
      })
    });
    const data = await res.json();
    document.getElementById('typing').classList.remove('show');
    if (data.error) {
      addAlert('API HATASI: ' + data.error.type, '#ff4444');
    } else {
      const reply = data.content[0].text;
      addMsg('ai', reply);
      history.push({ role: 'assistant', content: reply });
      speak(reply);
    }
  } catch (e) {
    document.getElementById('typing').classList.remove('show');
    addAlert('BAĞLANTI HATASI', '#ff4444');
  }
  busy = false;
}

// INIT
addAlert('SİSTEM BAŞLATILDI', '#00ff88');
addAlert('API ANAHTARI BEKLENİYOR', '#ffaa00');

window.jarvis.getApiKey().then(key => {
  if (key && key.startsWith('sk-ant-')) {
    document.getElementById('api-input').value = key;
    apiKey = key;
    document.getElementById('conn-status').className = 'on';
    document.getElementById('conn-status').textContent = 'ONLINE';
    document.getElementById('status-txt').textContent = 'CLAUDE API BAĞLANTISI KURULDU';
    addAlert('OTOMATİK BAĞLANTI KURULDU', '#00ff88');
    addMsg('ai', 'Hoş geldiniz, Efendim. Sistemler hazır.');
  }
});
