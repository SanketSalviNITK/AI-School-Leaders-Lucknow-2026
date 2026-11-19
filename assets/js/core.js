/* Shared core: language, storage, data loading, backend calls.
   Used by every page. No build step, no dependencies. */
(function () {
  'use strict';

  // ---------- safe storage (can fail in private mode / some webviews) ----------
  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem('aisl.' + key); return v === null ? fallback : JSON.parse(v); }
      catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem('aisl.' + key, JSON.stringify(value)); } catch (e) { /* ignore */ }
    }
  };

  // ---------- language ----------
  let lang = store.get('lang', 'en');
  function t(v) {
    if (v === null || v === undefined) return '';
    if (typeof v === 'string' || typeof v === 'number') return String(v);
    return v[lang] || v.en || v.hi || '';
  }
  function setLang(l) {
    lang = l; store.set('lang', l);
    document.documentElement.lang = l === 'hi' ? 'hi' : 'en';
    document.dispatchEvent(new CustomEvent('langchange'));
  }
  function getLang() { return lang; }

  // Static UI strings
  const UI = {
    register: { en: 'Register', hi: 'पंजीकरण' },
    start: { en: 'Start', hi: 'शुरू करें' },
    next: { en: 'Next', hi: 'आगे' },
    prev: { en: 'Back', hi: 'पीछे' },
    copy: { en: 'Copy prompt', hi: 'प्रॉम्प्ट कॉपी करें' },
    copied: { en: 'Copied ✓', hi: 'कॉपी हुआ ✓' },
    copySample: { en: 'Copy sample data', hi: 'नमूना डेटा कॉपी करें' },
    stretch: { en: 'Finished early? Try this', hi: 'जल्दी पूरा हुआ? यह आज़माएँ' },
    open: { en: 'Open', hi: 'खोलें' },
    done: { en: 'Mark done', hi: 'पूरा हुआ' },
    isDone: { en: 'Done ✓', hi: 'पूरा ✓' },
    minutes: { en: 'min', hi: 'मिनट' },
    steps: { en: 'Steps', hi: 'चरण' },
    expected: { en: 'You will get', hi: 'आपको मिलेगा' },
    check: { en: 'Check before you use it', hi: 'उपयोग से पहले जाँचें' },
    vote: { en: 'Submit', hi: 'जमा करें' },
    voted: { en: 'Thanks! Your answer is recorded.', hi: 'धन्यवाद! आपका उत्तर दर्ज हुआ।' },
    correct: { en: 'Correct!', hi: 'सही!' },
    notQuite: { en: 'Not quite.', hi: 'पूरी तरह सही नहीं।' },
    tapReveal: { en: 'Tap to reveal', hi: 'देखने के लिए टैप करें' },
    timer: { en: 'Start timer', hi: 'टाइमर शुरू करें' },
    mission: { en: 'Mission', hi: 'मिशन' },
    sessions: { en: 'Sessions', hi: 'सत्र' },
    resources: { en: 'Resources', hi: 'संसाधन' },
    feedback: { en: 'Feedback', hi: 'प्रतिक्रिया' },
    home: { en: 'Home', hi: 'मुख्य पृष्ठ' },
    offline: { en: 'Saved on this phone; will sync when online.', hi: 'इस फ़ोन पर सेव; ऑनलाइन होने पर भेजा जाएगा।' }
  };

  // ---------- data ----------
  const cache = {};
  async function loadJSON(path) {
    if (cache[path]) return cache[path];
    const res = await fetch(path, { cache: 'no-cache' });
    if (!res.ok) throw new Error('Could not load ' + path);
    cache[path] = await res.json();
    return cache[path];
  }

  // ---------- participant ----------
  function participant() {
    let p = store.get('participant', null);
    if (!p) { p = { pid: 'p' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36), registered: false }; store.set('participant', p); }
    return p;
  }
  function saveParticipant(p) { store.set('participant', p); }

  // ---------- backend (Google Apps Script web app) ----------
  // POST as text/plain to avoid a CORS preflight. Failed sends are queued and retried.
  let apiUrl = '';
  function setApi(url) { apiUrl = url || ''; flushQueue(); }

  async function send(action, payload) {
    const body = Object.assign({ action, pid: participant().pid, ts: new Date().toISOString(), website: '' }, payload || {});
    if (!apiUrl) { queue(body); return { ok: false, queued: true }; }
    try {
      const res = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body) });
      const data = await res.json().catch(() => ({ ok: res.ok }));
      if (!data.ok) throw new Error(data.error || 'failed');
      return data;
    } catch (e) { queue(body); return { ok: false, queued: true }; }
  }
  function queue(body) { const q = store.get('queue', []); q.push(body); store.set('queue', q.slice(-200)); }
  async function flushQueue() {
    if (!apiUrl) return;
    const q = store.get('queue', []);
    if (!q.length) return;
    store.set('queue', []);
    for (const body of q) {
      try {
        const res = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body) });
        const data = await res.json().catch(() => ({ ok: res.ok }));
        if (!data.ok) queue(body);
      } catch (e) { queue(body); }
    }
  }
  window.addEventListener('online', flushQueue);

  async function stats(session) {
    if (!apiUrl) return null;
    try {
      const res = await fetch(apiUrl + '?action=stats&session=' + encodeURIComponent(session || ''));
      return await res.json();
    } catch (e) { return null; }
  }

  // ---------- small helpers ----------
  function el(tag, attrs, children) {
    const n = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === 'html') n.innerHTML = attrs[k];
      else if (k === 'text') n.textContent = attrs[k];
      else if (k.startsWith('on')) n.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] !== false && attrs[k] !== null && attrs[k] !== undefined) n.setAttribute(k, attrs[k]);
    }
    (children || []).forEach(c => { if (c) n.append(c.nodeType ? c : document.createTextNode(c)); });
    return n;
  }
  // Content strings may hold simple <b>/<i> tags written by the facilitator; strip anything else.
  function safeHTML(s) {
    return String(s).replace(/</g, '&lt;').replace(/&lt;(\/?)(b|i|em|strong|br)\s*\/?>/g, '<$1$2>');
  }

  function langToggle() {
    const b = el('button', { class: 'lang', type: 'button', 'aria-label': 'Language / भाषा' });
    const paint = () => { b.textContent = lang === 'en' ? 'हिंदी' : 'English'; };
    b.addEventListener('click', () => setLang(lang === 'en' ? 'hi' : 'en'));
    document.addEventListener('langchange', paint); paint();
    return b;
  }

  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch (e) {
      const ta = el('textarea', { style: 'position:fixed;opacity:0' }); ta.value = text; document.body.append(ta);
      ta.select(); let ok = false; try { ok = document.execCommand('copy'); } catch (_) {} ta.remove(); return ok;
    }
  }

  window.AISL = { store, t, setLang, getLang, UI, loadJSON, participant, saveParticipant, setApi, send, stats, el, safeHTML, langToggle, copyText };
  document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';
})();
