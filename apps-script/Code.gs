/**
 * Backend for the AI for School Leaders 2026 workshop platform.
 * Bound to a Google Sheet. Deploy as a Web app (Execute as: Me; Who has access: Anyone).
 *
 * Tabs it creates on first use: Registrations, Progress, Polls, Quiz, Feedback.
 * POST (text/plain JSON) actions: register, progress, poll, quiz, feedback.
 * GET ?action=stats&session=N returns AGGREGATE counts only (no names, no phone numbers),
 * so the public web-app URL never exposes personal data.
 */

const TABS = {
  register: { name: 'Registrations', head: ['Timestamp', 'PID', 'Name', 'School', 'Role', 'District', 'WhatsApp', 'Consent'] },
  progress: { name: 'Progress', head: ['Timestamp', 'PID', 'Session', 'Mission', 'Value'] },
  poll:     { name: 'Polls', head: ['Timestamp', 'PID', 'Session', 'Poll', 'Option'] },
  quiz:     { name: 'Quiz', head: ['Timestamp', 'PID', 'Session', 'Quiz', 'Result'] },
  feedback: { name: 'Feedback', head: ['Timestamp', 'PID', 'Rating', 'Will use first', 'Could be better', 'Interests', 'May contact'] }
};
const MAX_PER_MINUTE = 30; // per participant id: generous for real use, blocks floods

function doPost(e) {
  try {
    const d = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (d.website) return json({ ok: true });            // honeypot filled: silently ignore bots
    const spec = TABS[d.action];
    if (!spec) return json({ ok: false, error: 'unknown action' });
    const pid = clip(d.pid, 40);
    if (!/^p[a-z0-9]{6,40}$/.test(pid)) return json({ ok: false, error: 'bad pid' });
    if (!allow(pid)) return json({ ok: false, error: 'slow down' });

    const now = new Date();
    let row;
    switch (d.action) {
      case 'register': row = [now, pid, clip(d.name, 80), clip(d.school, 120), clip(d.role, 40), clip(d.district, 40), clip(d.phone, 15), d.consent === 'yes' ? 'yes' : 'no']; break;
      case 'progress': row = [now, pid, num(d.session), clip(d.item, 40), clip(d.value, 20)]; break;
      case 'poll':     row = [now, pid, num(d.session), clip(d.item, 40), clip(d.value, 4)]; break;
      case 'quiz':     row = [now, pid, num(d.session), clip(d.item, 40), clip(d.value, 10)]; break;
      case 'feedback': row = [now, pid, num(d.rating), clip(d.best, 500), clip(d.improve, 500), clip(d.interests, 500), d.contact === 'yes' ? 'yes' : 'no']; break;
    }
    if (d.action === 'register' && row[7] !== 'yes') return json({ ok: false, error: 'consent required' });

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try { sheet(spec).appendRow(row.map(safeCell)); } finally { lock.releaseLock(); }
    CacheService.getScriptCache().remove('stats:' + (d.session || ''));
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err && err.message || err) });
  }
}

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.action !== 'stats') return json({ ok: true, service: 'AI for School Leaders 2026' });
  const session = String(p.session || '');
  const cache = CacheService.getScriptCache();
  const hit = cache.get('stats:' + session);
  if (hit) return ContentService.createTextOutput(hit).setMimeType(ContentService.MimeType.JSON);

  const regs = new Set(rows(TABS.register).map(r => r[1]));
  const missions = {}, seen = {};
  rows(TABS.progress).forEach(r => {
    if (session && String(r[2]) !== session) return;
    const k = r[3] + '|' + r[1]; if (seen[k]) return; seen[k] = 1;       // count each person once per mission
    missions[r[3]] = (missions[r[3]] || 0) + 1;
  });
  const polls = {}, voted = {};
  rows(TABS.poll).forEach(r => {
    if (session && String(r[2]) !== session) return;
    const k = r[3] + '|' + r[1]; if (voted[k]) return; voted[k] = 1;
    polls[r[3]] = polls[r[3]] || {};
    polls[r[3]][r[4]] = (polls[r[3]][r[4]] || 0) + 1;
  });
  const out = JSON.stringify({ ok: true, registered: regs.size, missions: missions, polls: polls, at: new Date().toISOString() });
  cache.put('stats:' + session, out, 10); // 10 s cache keeps the sheet light
  return ContentService.createTextOutput(out).setMimeType(ContentService.MimeType.JSON);
}

// ---------- helpers ----------
function sheet(spec) {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(spec.name);
  if (!sh) { sh = ss.insertSheet(spec.name); sh.appendRow(spec.head); sh.setFrozenRows(1); sh.getRange(1, 1, 1, spec.head.length).setFontWeight('bold'); }
  return sh;
}
function rows(spec) {
  const sh = SpreadsheetApp.getActive().getSheetByName(spec.name);
  if (!sh || sh.getLastRow() < 2) return [];
  return sh.getRange(2, 1, sh.getLastRow() - 1, spec.head.length).getValues();
}
function allow(pid) {
  const c = CacheService.getScriptCache(), k = 'rate:' + pid, n = parseInt(c.get(k) || '0', 10);
  if (n >= MAX_PER_MINUTE) return false;
  c.put(k, String(n + 1), 60); return true;
}
function clip(v, n) { return String(v == null ? '' : v).slice(0, n).trim(); }
function num(v) { const x = parseInt(v, 10); return isNaN(x) ? '' : x; }
// Stop formula injection: a cell starting with = + - @ is stored as text.
function safeCell(v) { return (typeof v === 'string' && /^[=+\-@]/.test(v)) ? "'" + v : v; }
function json(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
