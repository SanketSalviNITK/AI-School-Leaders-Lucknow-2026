/* Presenter "deck" mode: renders a session's steps as 16:9 slides that match the
   Session 3 PowerPoint (layouts, infographics, GIFs, build animations).
   Live polls, quizzes, timers and mission counts keep working.
   Only used by presenter.html when the session JSON sets "deck": true. */
(function () {
  'use strict';
  const A = window.AISL, { t, safeHTML, UI } = A, ICON = window.AISL_ICONS || {};
  const IMG = 'assets/img/deck/';
  const h = x => safeHTML(t(x));
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const ic = (n, style) => '<span class="ic"' + (style ? ' style="' + style + '"' : '') + '>' + (ICON[n] || '') + '</span>';
  const circ = (n, bg, size, cls, d) => '<div class="circ ' + (cls || '') + '" style="width:' + size + 'px;height:' + size + 'px;background:' + bg + (d !== undefined ? ';--d:' + d + 'ms' : '') + '">' + ic(n) + '</div>';
  const TEAL = '#0f5c63', SAFF = '#e07a2e', GREEN = '#2f7d4f', PURPLE = '#6b4fa0', GOLD = '#f2b705';
  const other = x => (x && typeof x === 'object') ? (A.getLang() === 'hi' ? x.en : x.hi) || '' : '';
  const LET = 'ABCDEF';

  // ---------- frames ----------
  function frame(kind, meta, inner, title, sub) {
    const s = document.createElement('div');
    s.className = 'slide f-' + kind;
    let html = '';
    if (kind === 'content') {
      html += '<h2 class="s-title a left">' + title + '</h2>';
      if (sub) html += '<p class="s-sub a fade" style="--d:150ms">' + sub + '</p>';
      html += '<img class="s-logo" src="assets/img/mitwpu-logo.png" alt="MIT World Peace University, Pune">';
      html += '<div class="body">' + inner + '</div>';
    } else if (kind === 'mission') {
      html += inner;
    } else html += inner;
    if (kind !== 'dark') html += '<div class="s-foot">' + esc(meta.foot) + '</div><div class="s-num">' + meta.num + '</div>';
    s.innerHTML = html;
    return s;
  }

  // ---------- small helpers ----------
  function countUp(root) {
    root.querySelectorAll('[data-count]').forEach(n => {
      const to = parseFloat(n.dataset.count), d = parseInt(n.dataset.delay || '0', 10), pre = n.dataset.pre || '', post = n.dataset.post || '';
      n.textContent = pre + '0' + post;
      setTimeout(() => {
        const t0 = performance.now(), dur = 1100;
        const step = now => { const k = Math.min(1, (now - t0) / dur), v = Math.round(to * (1 - Math.pow(1 - k, 3))); n.textContent = pre + v + post; if (k < 1) requestAnimationFrame(step); };
        requestAnimationFrame(step);
      }, d);
    });
  }
  function bindReveals(root) {
    root.querySelectorAll('.reveal-x').forEach(r => r.addEventListener('click', () => r.classList.toggle('open')));
  }
  function timerBind(btn, face, minutes) {
    let id = null;
    btn.addEventListener('click', e => {
      e.stopPropagation();
      if (id) { clearInterval(id); id = null; face.textContent = minutes + ':00'; face.classList.remove('over'); btn.textContent = '▶ ' + t(UI.timer); return; }
      const end = Date.now() + minutes * 60000; btn.textContent = '■ stop';
      id = setInterval(() => {
        const left = Math.max(0, end - Date.now()), m = Math.floor(left / 60000), sec = Math.floor(left / 1000) % 60;
        face.textContent = m + ':' + String(sec).padStart(2, '0');
        if (!left) { clearInterval(id); id = null; face.classList.add('over'); btn.textContent = '▶ ' + t(UI.timer); }
      }, 300);
    });
  }

  // ---------- options: poll (live bars) and quiz (click to answer) ----------
  function pollOpts(s, ctx, box) {
    const n = s.options.length, cols = n === 4 ? 2 : n;
    const wrap = document.createElement('div');
    wrap.className = 'opts'; wrap.dataset.poll = s.id;
    Object.assign(wrap.style, box, { gridTemplateColumns: 'repeat(' + cols + ',1fr)' });
    wrap.innerHTML = s.options.map((o, i) => '<div class="opt bar a pop" data-i="' + i + '" style="--d:' + (250 + i * 180) + 'ms"><span class="fill"></span><span class="let">' + LET[i] + '</span><span class="otext">' + h(o) + '</span>' + (other(o) ? '<span class="oalt">' + safeHTML(other(o)) + '</span>' : '') + '<span class="n">0</span></div>').join('');
    ctx.widgets.push(wrap);
    return wrap;
  }
  function quizOpts(s, box, explainBox, after) {
    const n = s.options.length, cols = n === 4 ? 2 : n;
    const wrap = document.createElement('div');
    wrap.className = 'opts';
    Object.assign(wrap.style, box, { gridTemplateColumns: 'repeat(' + cols + ',1fr)' });
    const ex = document.createElement('div'); ex.className = 'explain'; Object.assign(ex.style, explainBox, { display: 'none' });
    s.options.forEach((o, i) => {
      const b = document.createElement('button');
      b.className = 'opt a pop'; b.style.setProperty('--d', (250 + i * 180) + 'ms');
      b.innerHTML = '<span class="let">' + LET[i] + '</span><span class="otext">' + h(o) + '</span>';
      b.addEventListener('click', () => {
        wrap.querySelectorAll('.opt').forEach((x, j) => { x.classList.toggle('right', j === s.answer); if (j !== s.answer && j !== i) x.classList.add('dim'); x.disabled = true; });
        if (i !== s.answer) b.classList.add('wrong');
        ex.innerHTML = '<b>' + t(i === s.answer ? UI.correct : UI.notQuite) + '</b> ' + h(s.explain);
        ex.style.display = ''; ex.classList.add('a');
        if (after) after();
      });
      wrap.append(b);
    });
    return [wrap, ex];
  }

  // ---------- visuals (Session 3 deck) ----------
  const V = {};

  V.title = (s, meta) => {
    const cons = [['board', 1010, 230, 150, SAFF], ['robot', 1150, 325, 125, '#146e76'], ['puzzle', 980, 410, 110, '#146e76'], ['leaf', 1100, 490, 100, GREEN], ['star', 1205, 225, 80, '#146e76']];
    const inner = '<div class="logo-box"><img src="assets/img/mitwpu-logo.png" alt="MIT World Peace University, Pune"></div>' +
      '<div class="peace"><img src="' + IMG + 'peace-logo.png" alt="PEACe: Professional Enhancement and Advancement in Classroom Education"></div>' +
      '<p class="a fade" style="position:absolute;left:70px;top:178px;color:#e07a2e;font-weight:700;letter-spacing:.18em;font-size:16px;--d:200ms">SESSION ' + (s.session || 3) + ' · 2:00 – 3:30 · LUCKNOW</p>' +
      '<h1 class="serif a" style="position:absolute;left:70px;top:215px;width:820px;font-size:50px;line-height:1.12;--d:350ms">' + h(s.title) + '</h1>' +
      '<p class="a" style="position:absolute;left:70px;top:420px;width:820px;font-size:21px;color:#eef5f5;--d:650ms">From the CT &amp; AI circular to your classrooms, without a computer lab<br><span style="font-size:17px;color:#f2b705">CT और AI परिपत्र से आपकी कक्षाओं तक, बिना कंप्यूटर लैब के</span></p>' +
      '<p class="a fade" style="position:absolute;left:70px;bottom:36px;width:900px;font-size:14px;color:#cfe3e3;--d:900ms">Capacity Building Workshop for School Leaders 2026 · Barabanki &amp; Bahraich Sahodaya<br>Facilitator: Dr. Sanket Salvi, MIT World Peace University, Pune</p>' +
      cons.map(([n, x, y, d, c], i) => '<div class="a pop" style="position:absolute;left:' + x + 'px;top:' + y + 'px;--d:' + (900 + i * 220) + 'ms"><div class="float" style="animation-delay:' + i * 0.6 + 's">' + circ(n, c, d) + '</div></div>').join('');
    return frame('dark', meta, inner);
  };

  V.journey = (s, meta) => {
    const stops = [['2:00', 'Why it matters', 'The CT & AI mandate', 'board'], ['2:09', 'Human algorithm', 'Be the computer', 'users'], ['2:12', 'New exam pattern', 'Competency questions', 'file'], ['2:20', 'Missions 1–6', '60 minutes, hands-on', 'rocket'], ['3:20', 'Pro demo', 'What grows next', 'magic'], ['3:27', 'Your plan', '30 days, 4 steps', 'cal']];
    let inner = '<div class="drawline" style="position:absolute;left:40px;right:40px;top:233px;height:8px;border-radius:4px;background:#dcecec;--d:100ms"></div>';
    stops.forEach(([tm, a, b, n], i) => {
      const x = i * 197, d = 300 + i * 330;
      inner += '<div class="a" style="position:absolute;left:' + x + 'px;top:40px;width:180px;text-align:center;--d:' + d + 'ms">' +
        '<div style="font-size:22px;font-weight:700;color:#e07a2e;margin-bottom:22px">' + tm + '</div>' +
        '<div style="display:flex;justify-content:center">' + circ(n, i === 3 ? SAFF : TEAL, 132, i === 3 ? 'pulse' : '') + '</div>' +
        '<div style="font-size:19px;font-weight:700;margin-top:22px">' + a + '</div><div class="muted" style="font-size:15px;margin-top:4px">' + b + '</div></div>';
    });
    return frame('content', meta, inner, h(s.title), 'आज की यात्रा · 90 minutes, 70% hands-on');
  };

  V.poll = (s, meta, ctx) => {
    const sl = frame('content', meta, '', s.deckTitle ? h(s.deckTitle) : (A.getLang() === 'hi' ? 'त्वरित पोल' : 'Quick poll'), safeHTML(other(s.question)));
    const body = sl.querySelector('.body');
    const q = document.createElement('p'); q.className = 'a'; q.style.cssText = 'position:absolute;left:0;top:0;width:1100px;font-size:26px;font-weight:700;--d:150ms'; q.innerHTML = h(s.question);
    body.append(q);
    const n = s.options.length;
    body.append(pollOpts(s, ctx, { left: '0', right: '0', top: n === 4 ? '72px' : '90px', height: n === 4 ? '300px' : '240px' }));
    const hl = document.createElement('div'); hl.className = 'hintline a fade'; hl.style.cssText = 'left:0;bottom:6px;--d:1100ms';
    hl.innerHTML = ic('hand') + ' Vote on your phone, or raise a hand / hold up your A-B-C card';
    body.append(hl);
    if (s.deckMsg) {
      const m = document.createElement('div'); m.className = 'dkc teal a pop'; m.style.cssText = 'right:0;bottom:0;width:470px;padding:16px 22px;font-size:18px;font-weight:700;--d:1600ms';
      m.innerHTML = h(s.deckMsg); body.append(m);
    }
    return sl;
  };

  V.quiz = (s, meta) => {
    const sl = frame('content', meta, '', s.deckTitle ? h(s.deckTitle) : 'Quiz', safeHTML(other(s.question)));
    const body = sl.querySelector('.body');
    const q = document.createElement('p'); q.className = 'a'; q.style.cssText = 'position:absolute;left:0;top:0;width:1100px;font-size:26px;font-weight:700;--d:150ms'; q.innerHTML = h(s.question);
    body.append(q);
    const n = s.options.length;
    const [o, ex] = quizOpts(s, { left: '0', right: '0', top: '70px', height: n === 4 ? '270px' : '200px' }, { left: '0', right: '0', top: n === 4 ? '360px' : '300px' });
    body.append(o, ex);
    return sl;
  };

  V.mandate = (s, meta) => {
    const inner =
      '<div class="dkc a" style="left:0;top:0;width:540px;height:380px;--d:200ms">' +
        '<div class="teal-t" style="font-size:22px;font-weight:700">Classes III–V</div>' +
        '<div style="display:flex;align-items:baseline;gap:14px;margin:6px 0 10px"><span class="teal-t serif" style="font-size:84px;font-weight:700" data-count="50" data-pre="≈ " data-delay="400">≈ 50</span><span style="font-size:22px">hours a year</span></div>' +
        '<p style="font-size:19px">Inside Maths and The World Around Us periods. Mostly unplugged: paper, cards and movement.</p>' +
        '<p class="hi-sub" style="font-size:15px">गणित और TWAU के भीतर, अधिकतर बिना कंप्यूटर</p></div>' +
      '<div class="dkc warm a" style="left:580px;top:0;width:584px;height:380px;--d:900ms">' +
        '<div class="saff-t" style="font-size:22px;font-weight:700">Classes VI–VIII</div>' +
        '<div style="display:flex;align-items:baseline;gap:14px;margin:6px 0 16px"><span class="saff-t serif" style="font-size:84px;font-weight:700" data-count="100" data-pre="≈ " data-delay="1100">≈ 100</span><span style="font-size:22px">hours a year</span></div>' +
        '<div style="display:flex;gap:6px;height:62px">' +
          [['40 CT', 40, TEAL], ['20 AI', 20, PURPLE], ['40 projects', 40, SAFF]].map(([l, v, c], i) => '<div class="a grow" style="flex:' + v + ';background:' + c + ';border-radius:10px;color:#fff;font-weight:700;display:flex;align-items:center;justify-content:center;font-size:18px;--d:' + (1400 + i * 300) + 'ms">' + l + '</div>').join('') +
        '</div><p class="a fade" style="font-size:18px;margin-top:16px;--d:2300ms">Shared by subject and computer teachers</p></div>' +
      [['No board exam: continuous assessment', 'check'], ['Free CBSE handbooks, Classes 3–8', 'book'], ['Hours are indicative: a partial plan is fine', 'cal']].map(([x, n], i) =>
        '<div class="a" style="position:absolute;left:' + (i * 395) + 'px;top:420px;width:380px;display:flex;align-items:center;gap:12px;font-size:17px;--d:' + (2600 + i * 250) + 'ms">' + ic(n, 'color:#0f5c63;width:30px;height:30px;flex:none') + x + '</div>').join('');
    const sl = frame('content', meta, inner, h(s.title), 'CBSE Circulars Acad-15/2026 and Acad-18/2026 · hours are indicative');
    countUp(sl); return sl;
  };

  V.venn = (s, meta) => {
    const sl = frame('content', meta, '', h(s.deckTitle || s.question), safeHTML(other(s.question)));
    const body = sl.querySelector('.body');
    const [o, ex] = quizOpts(s, { left: '0', top: '0', width: '560px', height: '400px' }, { left: '0', top: '420px', width: '560px', fontSize: '16px', padding: '10px 16px' }, () => {
      art.querySelectorAll('.later').forEach((x, i) => { x.style.setProperty('--d', (i * 350) + 'ms'); x.classList.add('a'); x.classList.remove('later'); x.style.visibility = ''; });
    });
    o.style.gridTemplateColumns = '1fr';
    o.querySelectorAll('.opt').forEach(x => { x.style.minHeight = '84px'; x.querySelector('.otext').style.fontSize = '18px'; });
    const art = document.createElement('div');
    art.style.cssText = 'position:absolute;left:600px;top:0;width:564px;height:470px';
    art.innerHTML =
      '<div class="a pop" style="position:absolute;left:0;top:40px;width:300px;height:300px;border-radius:50%;background:rgba(15,92,99,.78);--d:500ms"></div>' +
      '<div class="a pop" style="position:absolute;left:190px;top:40px;width:300px;height:300px;border-radius:50%;background:rgba(47,125,79,.75);--d:800ms"></div>' +
      '<div class="a fade" style="position:absolute;left:28px;top:172px;width:150px;text-align:center;color:#fff;font-size:26px;font-weight:700;--d:900ms">Maths</div>' +
      '<div class="a fade" style="position:absolute;left:320px;top:160px;width:150px;text-align:center;color:#fff;font-size:22px;font-weight:700;--d:1100ms">The World<br>Around Us</div>' +
      '<div class="later" style="visibility:hidden;position:absolute;left:197px;top:143px;width:96px;height:96px;border-radius:50%;background:#f2b705;border:4px solid #fff;display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:700;animation-name:pop">CT</div>' +
      '<div class="later" style="visibility:hidden;position:absolute;left:250px;top:360px;width:300px;height:80px;border:4px solid #e07a2e;border-radius:14px;background:#fff;color:#e07a2e;font-size:30px;font-weight:700;display:flex;align-items:center;justify-content:center;animation-name:stamp;transform:rotate(-6deg)">NO LAB NEEDED</div>';
    body.append(o, ex, art);
    return sl;
  };

  V.ideas = (s, meta) => {
    const meta4 = [['puzzle', TEAL, 'Break a big task into small steps'], ['search', GREEN, 'Spot what repeats'], ['layers', PURPLE, 'Keep only what matters'], ['list', SAFF, 'Exact steps in the right order']];
    const inner = (s.items || []).slice(0, 4).map((it, i) => {
      const [n, c, d] = meta4[i];
      return '<div class="dkc line reveal-x a" style="left:' + (i * 296) + 'px;top:0;width:276px;height:470px;--d:' + (200 + i * 350) + 'ms">' +
        circ(n, c, 92) + '<div style="font-size:23px;font-weight:700;margin-top:18px">' + h(it.front) + '</div>' +
        '<div class="muted" style="font-size:18px;margin-top:6px">' + d + '</div>' +
        '<div class="hid" style="font-size:17px;font-style:italic;margin-top:22px;border-top:1px dashed #d9d2c5;padding-top:14px">' + h(it.back).replace(/^[^.]+\.\s*/, '') + '</div>' +
        '<div class="tap" style="position:absolute;left:24px;bottom:18px">Ask a table first, then tap ▸</div></div>';
    }).join('');
    const sl = frame('content', meta, inner, h(s.deckTitle || s.title), 'Before each card: ask a table for an example from school life');
    bindReveals(sl); return sl;
  };

  V.algo = (s, meta) => {
    const steps = ['Draw a simple shape. Do not show it.', 'Give your partner exact steps, without naming the shape.', 'Your partner draws, following only your steps.', 'Compare. Where was the bug?'];
    const inner = steps.map((x, i) => '<div class="a left" style="position:absolute;left:0;top:' + (i * 112) + 'px;width:700px;display:flex;align-items:center;gap:22px;font-size:23px;--d:' + (200 + i * 400) + 'ms"><div class="numdot" style="width:64px;height:64px;font-size:28px;background:' + (i === 3 ? SAFF : TEAL) + '">' + (i + 1) + '</div>' + x + '</div>').join('') +
      '<div class="dkc teal a pop" style="left:760px;top:0;width:404px;height:220px;--d:1900ms"><div style="display:flex;align-items:center;gap:18px">' + ic('clock', 'width:56px;height:56px') + '<span class="tface serif" style="font-size:72px;font-weight:700;font-variant-numeric:tabular-nums">2:00</span></div>' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px"><span style="font-size:20px;color:#dcecec">Laughter is the goal</span><button class="tbtn" style="background:#e07a2e;border:0;color:#fff;border-radius:999px;padding:6px 16px;font-weight:700">▶ Start</button></div></div>' +
      '<div class="dkc warm a" style="left:760px;top:250px;width:404px;height:190px;display:flex;gap:18px;align-items:center;--d:2300ms">' + ic('bug', 'width:60px;height:60px;color:#e07a2e;flex:none') + '<span style="font-size:19px">Children learn precision and debugging this way, years before any computer.</span></div>';
    const sl = frame('content', meta, inner, h(s.deckTitle || 'Activity: be the computer'), 'The human algorithm · strictly 2 minutes · in pairs');
    const b = sl.querySelector('.tbtn'), f = sl.querySelector('.tface');
    timerBind(b, f, 2); b.textContent = '▶ Start';
    return sl;
  };

  V.maths = (s, meta) => {
    const sq = (n, c, base) => { let o = ''; for (let k = 0; k < n; k++) o += '<span class="a pop" style="display:inline-block;width:22px;height:22px;margin:0 6px 6px 0;border-radius:3px;background:' + c + ';--d:' + (base + Math.floor(k / 17) * 140 + (k % 17) * 18) + 'ms"></span>'; return o; };
    const inner =
      '<div style="position:absolute;left:0;top:0;width:520px;font-size:20px;font-weight:700">2 sections per class</div>' +
      '<div style="position:absolute;left:0;top:38px;width:520px">' + sq(34, TEAL, 200) + '</div>' +
      '<div class="a" style="position:absolute;left:0;top:110px;--d:900ms"><span class="teal-t serif" style="font-size:52px;font-weight:700" data-count="34" data-pre="≈ " data-delay="900">≈ 34</span> <span style="font-size:19px">periods a week</span></div>' +
      '<div class="a fade" style="position:absolute;left:0;top:215px;font-size:20px;font-weight:700;--d:1400ms">6 sections per class</div>' +
      '<div style="position:absolute;left:0;top:253px;width:520px">' + sq(101, SAFF, 1500) + '</div>' +
      '<div class="a" style="position:absolute;left:560px;top:360px;--d:2600ms"><span class="saff-t serif" style="font-size:52px;font-weight:700" data-count="100" data-pre="≈ " data-delay="2600">≈ 100</span> <span style="font-size:19px">periods a week</span></div>' +
      '<div class="dkc a" style="left:830px;top:0;width:334px;height:440px;--d:3000ms">' + ic('users', 'width:64px;height:64px;color:#0f5c63') +
        '<p style="font-size:21px;font-weight:700;margin:16px 0 14px">One computer teacher cannot carry this.</p>' +
        '<p style="font-size:18px;margin-bottom:10px">• III–V: class and Maths teachers</p><p style="font-size:18px">• VI–VIII: Maths, Science and computer teachers together</p></div>';
    const sl = frame('content', meta, inner, h(s.title), 'CT & AI periods needed every week, whole school (full year, 40-minute periods)');
    countUp(sl); return sl;
  };

  V.donut = (s, meta) => {
    const R = 120, C = 2 * Math.PI * R, segs = [[50, TEAL, 'Competency-based'], [20, GOLD, 'MCQ'], [30, SAFF, 'Constructed response']];
    let off = 0, circles = '';
    segs.forEach(([v, c], i) => { const len = C * v / 100; circles += '<circle class="seg" data-len="' + (len - 3) + '" cx="160" cy="160" r="' + R + '" fill="none" stroke="' + c + '" stroke-width="64" stroke-dasharray="0 ' + C + '" stroke-dashoffset="' + (-off) + '" transform="rotate(-90 160 160)" style="transition-delay:' + (300 + i * 500) + 'ms"></circle>'; off += len; });
    const cards = [['Case-based, source-based and assertion-reason questions: about half the paper', 'file'], ['Two board exams: the main exam in February, an optional improvement exam in May', 'cal'], ['Teachers need many good practice questions every term. AI drafts; teachers verify', 'check']];
    const inner = '<svg class="donut" viewBox="0 0 320 320" style="position:absolute;left:40px;top:0;width:380px;height:380px">' + circles + '</svg>' +
      '<div class="a fade" style="position:absolute;left:40px;top:150px;width:380px;text-align:center;--d:800ms"><div class="teal-t serif" style="font-size:44px;font-weight:700" data-count="50" data-pre="≈ " data-post="%" data-delay="800">≈ 50%</div><div class="muted">competency</div></div>' +
      '<div class="a fade" style="position:absolute;left:0;top:400px;width:470px;display:flex;justify-content:center;gap:18px;font-size:15px;--d:1800ms">' + segs.map(([v, c, l]) => '<span><span style="display:inline-block;width:14px;height:14px;border-radius:3px;background:' + c + ';margin-right:6px"></span>' + l + ' ' + v + '%</span>').join('') + '</div>' +
      cards.map(([x, n], i) => '<div class="dkc ' + (i === 2 ? 'warm' : '') + ' a" style="left:530px;top:' + (i * 150) + 'px;width:634px;height:130px;display:flex;gap:20px;align-items:center;--d:' + (900 + i * 450) + 'ms">' + circ(n, i === 2 ? SAFF : TEAL, 70) + '<span style="font-size:19px">' + x + '</span></div>').join('');
    const sl = frame('content', meta, inner, h(s.title), 'बोर्ड परीक्षा का स्वरूप बदल गया है');
    requestAnimationFrame(() => setTimeout(() => sl.querySelectorAll('circle.seg').forEach(c => c.setAttribute('stroke-dasharray', c.dataset.len + ' ' + C)), 60));
    countUp(sl); return sl;
  };

  V.qtypes = (s, meta) => {
    const cols = [TEAL, GREEN, SAFF];
    const inner = (s.items || []).slice(0, 3).map((it, i) => {
      const parts = t(it.back).split(/<br\s*\/?>/i);
      return '<div class="dkc line reveal-x a" style="left:' + (i * 395) + 'px;top:0;width:375px;height:470px;--d:' + (200 + i * 400) + 'ms">' +
        '<div style="background:' + cols[i] + ';color:#fff;border-radius:10px;padding:10px;text-align:center;font-size:20px;font-weight:700">' + h(it.front) + '</div>' +
        '<div style="margin-top:18px">' + ic('quote', 'width:34px;height:34px;color:' + cols[i]) + '</div>' +
        '<p style="font-size:18px;margin-top:10px">' + safeHTML(parts[0]) + '</p>' +
        (parts[1] ? '<p class="hid" style="position:absolute;left:24px;right:24px;bottom:22px;font-size:17px;color:' + cols[i] + '">' + safeHTML(parts.slice(1).join(' ')) + '</p><div class="tap" style="position:absolute;left:24px;bottom:22px">Tap to show the answer ▸</div>' : '<p style="position:absolute;left:24px;right:24px;bottom:22px;font-size:16px;color:' + cols[i] + ';font-weight:700">A real-life passage + 3–4 linked questions</p>') +
        '</div>';
    }).join('');
    const sl = frame('content', meta, inner, h(s.title), 'These are the formats Mission 3 will write');
    bindReveals(sl); return sl;
  };

  V.grounding = (s, meta) => {
    const panel = (x, cls, n, c, head, eg, pts, d) => '<div class="dkc ' + cls + ' a" style="left:' + x + 'px;top:0;width:560px;height:330px;--d:' + d + 'ms"><div style="display:flex;align-items:center;gap:16px">' + circ(n, c, 70) + '<div><div style="font-size:24px;font-weight:700">' + head + '</div><div class="muted" style="font-size:15px">' + eg + '</div></div></div>' +
      '<ul style="margin:26px 0 0;padding-left:22px;font-size:19px;line-height:1.6">' + pts.map(p => '<li>' + p + '</li>').join('') + '</ul></div>';
    const inner = panel(0, '', 'robot', PURPLE, 'General chatbot', 'e.g. Gemini chat', ['Answers from everything it has read', 'Usually right, sometimes confidently wrong', 'No source to check'], 200) +
      panel(604, 'mint', 'book', GREEN, 'Grounded tool', 'e.g. NotebookLM with an NCERT chapter', ['Answers only from your documents', 'Shows the exact line [1]', 'Any answer checked in seconds'], 700) +
      '<div class="dkc teal a pop" style="left:0;right:0;top:370px;height:90px;display:flex;align-items:center;gap:16px;font-size:22px;--d:1400ms">' + ic('quote', 'width:34px;height:34px;color:#f2b705') + '<span><b>"It comes from the NCERT book"</b> is the sentence that builds trust with parents. <span style="color:#f2b705">यह NCERT पुस्तक से है</span></span></div>';
    return frame('content', meta, inner, h(s.deckTitle || s.title), 'Why grounding matters for teachers and parents');
  };

  V.pipeline = (s, meta) => {
    const sl = frame('content', meta, '', h(s.deckTitle || 'Before any AI question reaches a class test'), 'AI drafts, a teacher checks · AI ड्राफ़्ट बनाता है, शिक्षक जाँचते हैं');
    const body = sl.querySelector('.body');
    const q = document.createElement('p'); q.className = 'a'; q.style.cssText = 'position:absolute;left:0;top:0;width:1150px;font-size:22px;font-weight:700;--d:150ms'; q.innerHTML = h(s.question);
    const stages = [['magic', PURPLE, 'AI drafts', 'Gemini writes board-pattern questions'], ['search', TEAL, 'AI self-checks', '"Act as a strict paper setter"'], ['user', SAFF, 'Teacher verifies', 'Against NCERT and the CBSE sample paper'], ['table', TEAL, 'Question Bank', 'Verified = Yes, then use it']];
    const pipe = document.createElement('div'); pipe.style.cssText = 'position:absolute;left:0;right:0;top:305px;height:200px;display:none';
    pipe.innerHTML = stages.map(([n, c, a, b], i) => '<div class="a" style="position:absolute;left:' + (i * 296) + 'px;top:0;width:270px;text-align:center;--d:' + (i * 350) + 'ms"><div style="display:flex;justify-content:center">' + circ(n, c, 110) + '</div><div style="font-size:20px;font-weight:700;margin-top:12px">' + a + '</div><div class="muted" style="font-size:15px">' + b + '</div></div>' + (i < 3 ? '<div class="a fade" style="position:absolute;left:' + (i * 296 + 214) + 'px;top:38px;width:60px;color:#9bc6c9;--d:' + (i * 350 + 200) + 'ms">' + ic('arrow', 'width:40px;height:40px') + '</div>' : '')).join('');
    const [o, ex] = quizOpts(s, { left: '0', right: '0', top: '50px', height: '170px' }, { left: '0', right: '0', top: '232px', fontSize: '16px', padding: '8px 16px' }, () => { setTimeout(() => { pipe.style.display = ''; }, 900); });
    o.querySelectorAll('.opt').forEach(x => { x.style.minHeight = '70px'; x.style.padding = '10px 16px 10px 76px'; x.querySelector('.otext').style.fontSize = '17px'; });
    body.append(q, o, ex, pipe);
    return sl;
  };

  V.missions = (s, meta) => {
    const ms = [['1', '5 min', 'Set up your assistant in a new chat', 'phone'], ['2', '10 min', 'Fit the CT & AI hours into your timetable', 'cal'], ['3', '12 min', 'An unplugged CT lesson for Class 4', 'puzzle'], ['4', '13 min', 'Board-pattern questions, then check the AI', 'file'], ['5', '10 min', 'Keep AI inside the textbook (NotebookLM)', 'book'], ['6', '10 min', 'A student AI project on a local problem', 'leaf']];
    const inner = ms.map(([n, m, x, icn], i) => '<div class="dkc ' + (i % 2 ? '' : 'line') + ' a" style="left:' + (i * 198) + 'px;top:0;width:182px;height:470px;padding:20px 18px;--d:' + (200 + i * 280) + 'ms"><div style="display:flex;justify-content:space-between;align-items:flex-start"><span class="saff-t serif" style="font-size:72px;font-weight:700;line-height:1">' + n + '</span>' + circ(icn, TEAL, 62) + '</div>' +
      '<p style="font-size:19px;font-weight:700;margin-top:28px">' + x + '</p><p class="muted" style="position:absolute;left:18px;bottom:22px;font-size:17px">' + ic('clock', 'width:16px;height:16px;vertical-align:-2px') + ' ' + m + '</p></div>').join('');
    return frame('content', meta, inner, h(s.title), 'On your phone, in one assistant chat · no internet? use your table booklet and workbook');
  };

  // missions: condensed PowerPoint content per mission number
  const MISSION = {
    1: { tool: 'Gemini app or website', goal: 'One chat that knows your school, on any phone. No laptop, no Gem needed', offline: 'No internet?<br>Skip this one: the booklet<br>works without an assistant',
      steps: ['Open Gemini on your phone and start a New chat', 'Paste the instructions as your first message, with your school\'s details', 'Test: "Who are you working for?" Then stay in this chat all session'],
      side: () => '<div class="a pop" style="position:absolute;left:520px;top:-10px;width:250px;height:300px;border-radius:30px;border:8px solid #1c2430;background:#f6f8f8;padding:16px 12px;overflow:hidden;--d:1300ms">' +
        '<div style="font-size:12px;font-weight:700;color:#5b6573;text-align:center;margin-bottom:10px">Gemini · New chat</div>' +
        '<div class="a" style="margin-left:30px;background:#0f5c63;color:#fff;border-radius:14px 14px 2px 14px;padding:8px 10px;font-size:12px;--d:1900ms">For the rest of this conversation, act as the personal assistant to the Principal of [School]…</div>' +
        '<div class="a" style="margin-top:10px;margin-right:40px;background:#fff;border:1px solid #d9d2c5;border-radius:14px 14px 14px 2px;padding:8px 10px;font-size:12px;--d:2700ms"><b>Ready.</b> I will help the Principal of your CBSE school in Barabanki.</div>' +
        '<div class="a" style="margin-top:10px;margin-left:60px;background:#0f5c63;color:#fff;border-radius:14px 14px 2px 14px;padding:8px 10px;font-size:12px;--d:3400ms">Who are you working for?</div></div>',
      check: 'stay in this same chat for Missions 2 to 6. Never add student names, marks or phone numbers.' },
    2: { tool: 'Assistant chat + CT & AI Plan tab', goal: '4 months left in 2026-27: make a realistic, documented plan', offline: 'No internet?<br>Booklet page 2<br>Workbook page 3',
      steps: ['Ask your assistant chat for a class-wise plan for the rest of the session', 'Open the CT & AI Plan tab and change the blue numbers to your school\'s', 'Compare the two and decide who owns each class'],
      side: () => '<div class="muted" style="position:absolute;left:470px;top:0;font-size:14px">Sample numbers: 16 weeks left = 40% of the year</div>' +
        [['III–V', '50 h × 40% = 20 h → 30 periods', '≈ 1.9 / week', '', TEAL], ['VI–VIII', '100 h × 40% = 40 h → 60 periods', '≈ 3.75 / week', 'warm', SAFF]].map(([a, b, c, cls, col], i) => '<div class="dkc ' + cls + ' a" style="left:470px;top:' + (30 + i * 160) + 'px;width:395px;height:140px;padding:16px 22px;--d:' + (1400 + i * 600) + 'ms"><div style="font-size:19px;font-weight:700;color:' + col + '">' + a + '</div><div style="font-size:16px;margin:6px 0">' + b + '</div><div class="serif" style="font-size:30px;font-weight:700">' + c + '</div></div>').join(''),
      check: 'the hours are indicative. A documented partial plan this year is far better than none.' },
    3: { tool: 'Your assistant chat', goal: 'Patterns with paper, chalk and the children themselves: no lab, no budget', offline: 'No internet?<br>Booklet pages 3–4<br>Workbook page 4',
      steps: ['Ask for a 40-minute patterns lesson: warm-up, activity, pair work, exit ticket, rubric', 'Teacher instructions in Hindi; student instructions in English and Hindi', 'Add up the minutes, then compare with the CBSE Class 4 handbook'],
      side: () => '<div class="gifbox a pop" style="left:440px;top:0;width:425px;height:239px;--d:1400ms"><img src="' + IMG + 'pattern-robots.gif" alt="A partner follows a three-step algorithm card and draws circle, triangle, repeated four times."></div><div class="caption" style="left:440px;top:246px;width:425px">Pattern Robots: a partner follows the steps exactly</div>',
      check: 'does it fit 40 minutes and work with 40 children, without devices?' },
    4: { tool: 'Assistant chat, two prompts', goal: 'Class X Science, Light: write with prompt A, then make Gemini check itself with prompt B', offline: 'No internet?<br>Booklet pages 5–6<br>Workbook page 5',
      steps: ['Prompt A: a case-based question (1+1+2+4 marks) and two assertion-reason questions', 'Prompt B, same chat: "Act as a strict CBSE paper setter. Check everything."', 'Your best question goes into the Question Bank: Verified = Not yet'],
      side: () => '<div class="dkc reveal-x a" style="left:440px;top:0;width:425px;height:239px;padding:0;overflow:hidden;--d:1400ms"><div style="padding:18px 22px;font-size:16px"><b style="font-size:18px">Common first-draft slips</b><ul style="margin:8px 0 0;padding-left:20px;line-height:1.55"><li>Wrong sign for a convex mirror\'s focal length</li><li>A "real image" from a convex mirror</li><li>Marks that do not add up to the total</li></ul></div><img class="hid" src="' + IMG + 'convex-mirror.gif" alt="Ray diagram: convex mirror forms a virtual, erect, diminished image 12 cm behind the mirror." style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"></div><div class="caption" style="left:440px;top:246px;width:425px">Tap to reveal the worked answer</div>',
      check: 'ask 2–3 principals what Gemini corrected. That is the lesson.' },
    5: { tool: 'NotebookLM', goal: 'Upload the NCERT chapter and ask: every answer shows the exact line', offline: 'No internet?<br>Booklet page 7<br>Workbook page 6',
      flow: [['Download', 'NCERT Class X Science Ch. 9 PDF', 'download'], ['Upload', 'notebooklm.google.com → Create new', 'upload'], ['Ask', '"Make 10 questions with answers from this chapter"', 'comments'], ['Tap [1]', 'See the exact line in the book', 'search']],
      check: 'compare with Mission 4: Gemini drafted from general knowledge; NotebookLM stays inside the chapter.' },
    6: { tool: 'Gemini + Teachable Machine', goal: 'Classes VI–VIII, one shared laptop, a problem from your own district', offline: 'No internet?<br>Booklet pages 8–9<br>Workbook page 7',
      steps: ['Ask for 3 low-cost project ideas on a local problem, with a 4-week plan', 'Students collect photos of leaves or objects, never people', 'Train, then test on new examples, and discuss fairness and errors'],
      side: () => '<div class="dkc mint reveal-x a" style="left:440px;top:0;width:425px;height:239px;padding:0;overflow:hidden;--d:1400ms"><div style="padding:20px 22px;display:flex;gap:16px">' + ic('leaf', 'width:54px;height:54px;color:#2f7d4f;flex:none') + '<div style="font-size:16px"><b style="font-size:18px">Example: healthy or sick leaf?</b><br>40 photos of each, from nearby fields, with the farmer\'s permission. Links Science, Maths and Hindi.</div></div><img class="hid" src="' + IMG + 'be-the-model.gif" alt="Six training mangoes teach the rule yellow means ripe; a ripe green Langra mango is wrongly called unripe." style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"></div><div class="caption" style="left:440px;top:246px;width:425px">Tap for the "be the AI model" game</div>',
      check: 'no faces or personal data in the training data. Asking permission is part of the lesson.' }
  };

  V.mission = (s, meta, ctx) => {
    const M = MISSION[s.number] || {}, pre = !s.number;
    const sl = document.createElement('div'); sl.className = 'slide f-mission';
    const steps = pre ? (s.steps || []).slice(0, 5).map(x => t(x).replace(/<[^>]+>/g, '')) : M.steps;
    let body = '';
    if (M.flow) {
      body += M.flow.map(([a, b, n], i) => '<div class="a" style="position:absolute;left:' + (i * 218) + 'px;top:20px;width:200px;text-align:center;--d:' + (300 + i * 400) + 'ms"><div style="display:flex;justify-content:center">' + circ(n, i === 3 ? SAFF : TEAL, 100) + '</div><div style="font-size:21px;font-weight:700;margin-top:14px">' + a + '</div><div class="muted" style="font-size:16px;margin-top:4px">' + b + '</div></div>' + (i < 3 ? '<div class="a fade" style="position:absolute;left:' + (i * 218 + 168) + 'px;top:52px;color:#9bc6c9;--d:' + (500 + i * 400) + 'ms">' + ic('arrow', 'width:34px;height:34px') + '</div>' : '')).join('');
    } else if (steps) {
      body += '<div class="steps3" style="position:absolute;left:0;top:10px;width:' + (pre ? 865 : 420) + 'px">' + steps.map((x, i) => '<div class="st a left" style="--d:' + (300 + i * 350) + 'ms' + (pre ? ';font-size:16px' : '') + '"><div class="numdot"' + (pre ? ' style="width:38px;height:38px;font-size:17px"' : '') + '>' + (i + 1) + '</div><span>' + esc(x) + '</span></div>').join('') + '</div>';
    }
    if (M.side) body += M.side();
    const check = pre ? t(s.check) : M.check;
    if (check) body += '<div class="checkbar a" style="--d:' + (pre ? 1600 : 2200) + 'ms">' + circ('check', GREEN, 48) + '<span><b>Check:</b> ' + safeHTML(check) + '</span></div>';

    sl.innerHTML =
      '<div class="band">' +
        '<div class="eyebrow2">' + (pre ? 'BEFORE THE SESSION' : 'MISSION') + '</div>' +
        (pre ? '<div class="gemicon">' + ic('gem') + '</div>' : '<div class="big a pop" style="--d:100ms">' + s.number + '</div>') +
        '<div class="row2">' + ic('clock') + '<span class="bigtime">' + (s.minutes || '') + ':00</span><button class="tbtn tstart">▶ ' + t(UI.timer) + '</button></div>' +
        '<div class="row2">' + ic('phone') + '<span>' + esc(pre ? (s.tool || 'Gemini') : (M.tool || s.tool || '')) + '</span></div>' +
        '<div class="done" data-mission="' + s.id + '">0 done</div>' +
        '<div class="spacer"></div>' +
        (s.prompt ? '<button class="tbtn pbtn" style="align-self:flex-start;margin-bottom:16px">' + ic('copy', 'width:14px;height:14px;vertical-align:-2px') + ' Show prompt</button>' : '') +
        (M.offline ? '<div class="offline">' + M.offline + '</div>' : '') +
      '</div>' +
      '<h2 class="s-title a left">' + h(s.title) + '</h2>' +
      '<p class="s-sub a fade" style="--d:200ms">' + (pre ? h(s.scenario) : M.goal || h(s.scenario)) + '</p>' +
      '<img class="s-logo" src="assets/img/mitwpu-logo.png" alt="MIT World Peace University, Pune">' +
      '<div class="mbody">' + body + '</div>' +
      '<div class="s-foot">' + esc(meta.foot) + '</div><div class="s-num">' + meta.num + '</div>';
    if (pre) { sl.querySelector('.s-sub').style.width = '840px'; sl.querySelector('.mbody').style.top = '215px'; }
    timerBind(sl.querySelector('.tstart'), sl.querySelector('.bigtime'), s.minutes || 10);
    ctx.widgets.push(sl.querySelector('.done'));
    const pb = sl.querySelector('.pbtn');
    if (pb) pb.addEventListener('click', () => {
      if (sl.querySelector('.povl')) return;
      const o = document.createElement('div'); o.className = 'povl';
      o.innerHTML = '<h2 class="serif teal-t" style="font-size:26px">' + h(s.title) + ' · prompt</h2><pre></pre><div class="prow"><button class="pb copy">' + t(UI.copy) + '</button><button class="pb ghost close">Close (Esc)</button></div>';
      o.querySelector('pre').textContent = t(s.prompt);
      o.querySelector('.copy').addEventListener('click', async e => { if (await A.copyText(t(s.prompt))) e.target.textContent = t(UI.copied); });
      o.querySelector('.close').addEventListener('click', () => o.remove());
      sl.append(o);
    });
    bindReveals(sl);
    return sl;
  };

  V.growth = (s, meta) => {
    const lad = [['Free, today', 'Gemini · NotebookLM · Teachable Machine', 'Plans, lessons, questions, projects', TEAL], ['Claude', 'A playable classroom game in about a minute', 'From the Mission 3 lesson, no coding', SAFF], ['Google AI Pro', 'All the CBSE CT handbooks in one notebook', 'More sources, higher limits, Gemini in Gmail and Docs', PURPLE]];
    const inner = lad.map(([a, b, c, col], i) => { const H = 240 + i * 110; return '<div class="a grow" style="position:absolute;left:' + (i * 395) + 'px;bottom:0;width:375px;height:' + H + 'px;border-radius:16px;background:' + col + ';color:#fff;padding:22px 24px;--d:' + (300 + i * 700) + 'ms"><div style="font-size:26px;font-weight:700">' + a + '</div><div style="font-size:19px;font-weight:700;margin-top:12px">' + b + '</div><div style="font-size:16px;margin-top:12px;color:#eef5f5">' + c + '</div></div>'; }).join('') +
      '<div class="a" style="position:absolute;left:0;top:0;width:720px;font-size:24px;font-weight:700;color:#e07a2e;--d:2500ms">' + ic('rocket', 'width:26px;height:26px;vertical-align:-4px') + ' Start free. Upgrade only when a teacher is using it every week.</div>';
    return frame('content', meta, inner, 'Free today. Here is where it grows', 'No vendor sponsors this workshop. Prices and features change; check before you buy');
  };

  V.robot = (s, meta) => {
    const rg = [['Call out the arrows', 'The room writes the algorithm together', 'users', TEAL], ['Spot the bug', 'One wrong arrow? Find it and fix it', 'bug', SAFF], ['No lab needed', 'Draw the grid on the board for Class 4', 'board', TEAL]];
    const inner = '<div class="gifbox a pop" style="left:0;top:0;width:790px;height:444px;--d:200ms"><img src="' + IMG + 'robot-path.gif" alt="A robot follows arrow steps on a grid to reach a star."></div>' +
      rg.map(([a, b, n, c], i) => '<div class="a" style="position:absolute;left:830px;top:' + (i * 135) + 'px;width:334px;display:flex;gap:16px;--d:' + (700 + i * 350) + 'ms">' + circ(n, c, 76) + '<div><div style="font-size:20px;font-weight:700">' + a + '</div><div class="muted" style="font-size:16px;margin-top:4px">' + b + '</div></div></div>').join('') +
      '<a class="a pop" href="demo/robot-algorithm.html" target="_blank" rel="noopener" style="position:absolute;left:830px;top:410px;background:#e07a2e;color:#fff;text-decoration:none;font-weight:700;border-radius:12px;padding:10px 20px;font-size:18px;--d:1900ms">' + ic('play', 'width:14px;height:14px') + ' Play the robot game</a>';
    return frame('content', meta, inner, h(s.title), 'Works offline · demo/robot-algorithm.html on the workshop site and the laptop pack');
  };

  V.plan30 = (s, meta) => {
    const wk = [['Week 1', 'Share the CT & AI plan with coordinators; download the CBSE handbooks', 'cal'], ['Week 2', 'One teacher runs the unplugged lesson; you observe', 'puzzle'], ['Week 3', 'Teachers write and verify 5 competency questions; build one NotebookLM notebook', 'check'], ['Week 4', 'Start one student AI project with Classes VI to VIII', 'seed']];
    const inner = wk.map(([w, x, n], i) => '<div class="dkc ' + (i === 3 ? 'warm' : '') + ' a" style="left:' + (i * 296) + 'px;top:0;width:276px;height:420px;--d:' + (200 + i * 450) + 'ms"><div style="background:' + (i === 3 ? SAFF : TEAL) + ';color:#fff;border-radius:10px;padding:10px;text-align:center;font-size:22px;font-weight:700">' + w + '</div>' +
      '<div style="display:flex;justify-content:center;margin:22px 0">' + circ(n, '#fff', 86) + '</div><p style="font-size:19px">' + x + '</p></div>').join('') +
      '<div class="a" style="position:absolute;left:0;top:440px;font-size:20px;font-weight:700;color:#e07a2e;--d:2200ms">Write the one thing you will do on Monday in your workbook now.</div>';
    const sl = frame('content', meta, inner, h(s.title), 'Workbook page 8 · मेरी 30-दिन की योजना');
    sl.querySelectorAll('.body .circ').forEach(c => { c.style.color = TEAL; c.style.border = '3px solid #0f5c63'; });
    return sl;
  };

  V.thanks = (s, meta) => {
    const qrs = [['qr-s3.png', 'Session page'], ['qr-prompts.png', 'Prompt Library'], ['qr-res.png', 'All resources']];
    const inner = '<div class="logo-box"><img src="assets/img/mitwpu-logo.png" alt="MIT World Peace University, Pune"></div>' +
      '<h1 class="serif a" style="position:absolute;left:70px;top:250px;font-size:60px;--d:200ms">Thank you · धन्यवाद</h1>' +
      '<p class="a" style="position:absolute;left:70px;top:350px;width:640px;font-size:21px;color:#eef5f5;--d:600ms">Everything from today stays online: missions, prompts, handouts<br><span style="font-size:17px;color:#cfe3e3">Dr. Sanket Salvi · MIT World Peace University, Pune · onlysanket.in</span></p>' +
      qrs.map(([f, l], i) => '<div class="a pop" style="position:absolute;left:' + (760 + i * 170) + 'px;top:230px;width:155px;background:#fff;border-radius:12px;padding:10px;text-align:center;--d:' + (900 + i * 300) + 'ms"><img src="' + IMG + f + '" alt="QR code: ' + l + '" style="width:135px;display:block"><div class="teal-t" style="font-weight:700;font-size:14px;margin-top:6px">' + l + '</div></div>').join('');
    return frame('dark', meta, inner);
  };

  V.feedback = (s, meta) => {
    const fb = [['Scan with your phone camera', 'Or type the link shown under the code', 'phone', TEAL], ['Two minutes is enough', 'What worked, and what to improve', 'clock', TEAL], ['Tell us what you will try first', 'Your answers shape the next workshop', 'comments', SAFF]];
    const inner = '<div class="dkc line a pop" style="left:0;top:0;width:440px;height:470px;border:2px solid #e07a2e;text-align:center;--d:200ms"><img src="' + IMG + 'qr-feedback.png" alt="QR code for the feedback form" style="width:380px"><div class="teal-t" style="font-weight:700;font-size:17px;margin-top:4px">forms.gle/pebCgLfMqLbBMBUa6</div></div>' +
      fb.map(([a, b, n, c], i) => '<div class="a" style="position:absolute;left:510px;top:' + (20 + i * 140) + 'px;width:650px;display:flex;gap:22px;align-items:center;--d:' + (600 + i * 350) + 'ms">' + circ(n, c, 84) + '<div><div style="font-size:24px;font-weight:700">' + a + '</div><div class="muted" style="font-size:18px;margin-top:4px">' + b + '</div></div></div>').join('');
    return frame('content', meta, inner, h(s.title), 'कृपया अपनी प्रतिक्रिया दें · 2 मिनट');
  };

  // generic fallbacks for any step without a specific visual
  V.concept = (s, meta) => {
    const pts = (s.points || []).map((p, i) => '<div class="a left" style="display:flex;gap:16px;align-items:flex-start;margin-bottom:22px;font-size:21px;--d:' + (250 + i * 300) + 'ms"><div class="numdot" style="width:40px;height:40px;font-size:17px;' + (i % 2 ? '' : 'background:#0f5c63') + '">' + (i + 1) + '</div><div>' + h(p) + '</div></div>').join('');
    return frame('content', meta, '<div style="position:absolute;inset:0">' + pts + '</div>', h(s.title), s.lead ? h(s.lead) : '');
  };
  V.reveal = (s, meta) => {
    const n = (s.items || []).length, w = Math.floor((1164 - (n - 1) * 20) / n);
    const inner = (s.items || []).map((it, i) => '<div class="dkc line reveal-x a" style="left:' + (i * (w + 20)) + 'px;top:0;width:' + w + 'px;height:470px;--d:' + (200 + i * 300) + 'ms"><div style="font-size:23px;font-weight:700" class="teal-t">' + h(it.front) + '</div><div class="hid" style="font-size:18px;margin-top:16px">' + h(it.back) + '</div><div class="tap" style="position:absolute;left:24px;bottom:18px">Tap ▸</div></div>').join('');
    const sl = frame('content', meta, inner, h(s.title)); bindReveals(sl); return sl;
  };

  function render(step, ctx, meta) {
    let key = step.visual || step.type;
    if (step.type === 'title') key = 'title';
    if (step.type === 'mission') key = 'mission';
    if (step.type === 'poll') key = 'poll';
    if (step.type === 'quiz' && !step.visual) key = 'quiz';
    if (step.type === 'finale' && !step.visual) key = 'growth';
    const fn = V[key] || V.concept;
    return fn(step, meta, ctx);
  }

  window.AISLDeck = { render };
})();
