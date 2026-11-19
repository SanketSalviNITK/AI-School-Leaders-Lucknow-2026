/* Interactive session player. One file renders every step type for both
   the participant view (session.html) and the projector view (presenter.html). */
(function () {
  'use strict';
  const A = window.AISL;
  const { t, el, UI, safeHTML } = A;

  function renderStep(step, ctx) {
    const R = renderers[step.type] || renderers.concept;
    const card = el('article', { class: 'step step-' + step.type });
    R(step, card, ctx);
    if (ctx.presenter && step.notes) {
      card.append(el('details', { class: 'pnotes' }, [el('summary', { text: 'Facilitator notes' }),
        el('ul', {}, [].concat(step.notes).map(x => el('li', { html: safeHTML(t(x)) })))]));
    }
    return card;
  }

  const renderers = {
    title(s, c) {
      c.append(el('p', { class: 'eyebrow', text: t(UI.sessions) + ' ' + (s.session || '') }));
      c.append(el('h1', { html: safeHTML(t(s.title)) }));
      if (s.subtitle) c.append(el('p', { class: 'lead', html: safeHTML(t(s.subtitle)) }));
    },

    concept(s, c) {
      c.append(el('h2', { html: safeHTML(t(s.title)) }));
      if (s.lead) c.append(el('p', { class: 'lead', html: safeHTML(t(s.lead)) }));
      if (s.points) c.append(el('ul', { class: 'points' }, s.points.map(p => el('li', { html: safeHTML(t(p)) }))));
      if (s.note) c.append(el('p', { class: 'note', html: safeHTML(t(s.note)) }));
    },

    reveal(s, c) {
      c.append(el('h2', { html: safeHTML(t(s.title)) }));
      const grid = el('div', { class: 'reveal-grid' });
      (s.items || []).forEach(it => {
        const b = el('button', { class: 'flip', type: 'button' }, [
          el('span', { class: 'front', html: safeHTML(t(it.front)) }),
          el('span', { class: 'back', html: safeHTML(t(it.back)) }),
          el('span', { class: 'hint', text: t(UI.tapReveal) })
        ]);
        b.addEventListener('click', () => b.classList.toggle('open'));
        grid.append(b);
      });
      c.append(grid);
    },

    poll(s, c, ctx) {
      c.append(el('p', { class: 'eyebrow', text: 'Poll' }));
      c.append(el('h2', { html: safeHTML(t(s.question)) }));
      if (ctx.presenter) { c.append(bars(s, ctx)); return; }
      const answered = A.store.get('poll.' + s.id, null);
      const list = el('div', { class: 'options' });
      s.options.forEach((o, i) => {
        const b = el('button', { class: 'option' + (answered === i ? ' chosen' : ''), type: 'button', html: safeHTML(t(o)) });
        b.addEventListener('click', async () => {
          if (A.store.get('poll.' + s.id, null) !== null) return;
          A.store.set('poll.' + s.id, i);
          list.querySelectorAll('.option').forEach(x => x.classList.remove('chosen'));
          b.classList.add('chosen');
          await A.send('poll', { session: ctx.session, item: s.id, value: String(i) });
          msg.textContent = t(UI.voted);
        });
        list.append(b);
      });
      const msg = el('p', { class: 'status', text: answered !== null ? t(UI.voted) : '' });
      c.append(list, msg);
    },

    quiz(s, c, ctx) {
      c.append(el('p', { class: 'eyebrow', text: 'Quiz' }));
      c.append(el('h2', { html: safeHTML(t(s.question)) }));
      const list = el('div', { class: 'options' });
      const out = el('p', { class: 'status' });
      s.options.forEach((o, i) => {
        const b = el('button', { class: 'option', type: 'button', html: safeHTML(t(o)) });
        b.addEventListener('click', () => {
          list.querySelectorAll('.option').forEach((x, j) => { x.classList.toggle('right', j === s.answer); x.disabled = true; });
          if (i !== s.answer) b.classList.add('wrong');
          out.innerHTML = '<b>' + t(i === s.answer ? UI.correct : UI.notQuite) + '</b> ' + safeHTML(t(s.explain));
          if (!ctx.presenter) A.send('quiz', { session: ctx.session, item: s.id, value: i === s.answer ? 'correct' : 'wrong' });
        });
        list.append(b);
      });
      c.append(list, out);
    },

    mission(s, c, ctx) {
      const doneKey = 'done.' + s.id;
      c.append(el('p', { class: 'eyebrow', text: t(UI.mission) + ' ' + (s.number || '') + ' · ' + (s.minutes || '') + ' ' + t(UI.minutes) + (s.tool ? ' · ' + s.tool : '') }));
      c.append(el('h2', { html: safeHTML(t(s.title)) }));
      if (s.scenario) c.append(el('p', { class: 'lead', html: safeHTML(t(s.scenario)) }));
      if (s.steps) c.append(el('ol', { class: 'msteps' }, s.steps.map(x => el('li', { html: safeHTML(t(x)) }))));
      if (s.prompt) {
        const pre = el('pre', { class: 'prompt' }); pre.textContent = t(s.prompt);
        const copy = el('button', { class: 'btn', type: 'button', text: t(UI.copy) });
        copy.addEventListener('click', async () => { if (await A.copyText(pre.textContent)) { copy.textContent = t(UI.copied); setTimeout(() => copy.textContent = t(UI.copy), 2000); } });
        const row = el('div', { class: 'row' }, [copy]);
        if (s.toolUrl) row.append(el('a', { class: 'btn ghost', href: s.toolUrl, target: '_blank', rel: 'noopener', text: t(UI.open) + ' ' + (s.tool || '') + ' ↗' }));
        c.append(pre, row);
      }
      if (s.sample) {
        const raw = t(s.sample.text);
        let sp;
        if (raw.includes('\t')) {            // tab-separated data: show as a table, copy as TSV (pastes into Sheets)
          const rows = raw.split('\n').map(r => r.split('\t'));
          sp = el('div', { class: 'sample-table' }, [el('table', {}, [
            el('thead', {}, [el('tr', {}, rows[0].map(h => el('th', { text: h })))]),
            el('tbody', {}, rows.slice(1).map(r => el('tr', {}, r.map(x => el('td', { text: x })))))
          ])]);
        } else { sp = el('pre', { class: 'prompt sample' }); sp.textContent = raw; }
        const sc = el('button', { class: 'btn ghost small', type: 'button', text: t(UI.copySample) });
        sc.addEventListener('click', async () => { if (await A.copyText(raw)) { sc.textContent = t(UI.copied); setTimeout(() => sc.textContent = t(UI.copySample), 2000); } });
        c.append(el('p', { class: 'eyebrow', style: 'margin-top:.8rem', text: t(s.sample.label) }), sp, el('div', { class: 'row' }, [sc]));
      }
      if (s.stretch) c.append(el('div', { class: 'box' }, [el('b', { text: t(UI.stretch) + ': ' }), el('span', { html: safeHTML(t(s.stretch)) })]));
      if (s.expected) c.append(el('div', { class: 'box' }, [el('b', { text: t(UI.expected) + ': ' }), el('span', { html: safeHTML(t(s.expected)) })]));
      if (s.check) c.append(el('div', { class: 'box warn' }, [el('b', { text: t(UI.check) + ': ' }), el('span', { html: safeHTML(t(s.check)) })]));
      if (s.minutes) c.append(timer(s.minutes));
      if (ctx.presenter) { c.append(doneCount(s, ctx)); return; }
      const done = el('button', { class: 'btn done' + (A.store.get(doneKey, false) ? ' is-done' : ''), type: 'button' });
      const paint = () => { done.textContent = A.store.get(doneKey, false) ? t(UI.isDone) : t(UI.done); };
      done.addEventListener('click', async () => {
        if (A.store.get(doneKey, false)) return;
        A.store.set(doneKey, true); done.classList.add('is-done'); paint();
        const r = await A.send('progress', { session: ctx.session, item: s.id, value: 'done' });
        if (r.queued) status.textContent = t(UI.offline);
        document.dispatchEvent(new CustomEvent('missiondone'));
      });
      const status = el('p', { class: 'status' });
      paint(); c.append(done, status);
    },

    finale(s, c) {
      c.classList.add('finale');
      c.append(el('p', { class: 'eyebrow', text: 'Pro' }));
      renderers.concept(s, c);
    }
  };

  function timer(minutes) {
    const wrap = el('div', { class: 'timer' });
    const face = el('span', { class: 'face', text: minutes + ':00' });
    const b = el('button', { class: 'btn ghost small', type: 'button', text: t(UI.timer) });
    let id = null;
    b.addEventListener('click', () => {
      if (id) { clearInterval(id); id = null; face.textContent = minutes + ':00'; b.textContent = t(UI.timer); return; }
      const end = Date.now() + minutes * 60000; b.textContent = '■';
      id = setInterval(() => {
        const left = Math.max(0, end - Date.now()), m = Math.floor(left / 60000), sec = Math.floor(left / 1000) % 60;
        face.textContent = m + ':' + String(sec).padStart(2, '0');
        if (!left) { clearInterval(id); id = null; wrap.classList.add('over'); b.textContent = t(UI.timer); }
      }, 500);
    });
    wrap.append(face, b); return wrap;
  }

  // Presenter widgets, filled by presenter.html's polling loop.
  function bars(s, ctx) {
    const box = el('div', { class: 'bars', 'data-poll': s.id });
    s.options.forEach((o, i) => box.append(el('div', { class: 'bar', 'data-i': i }, [el('span', { class: 'label', html: safeHTML(t(o)) }), el('span', { class: 'fill' }), el('span', { class: 'n', text: '0' })])));
    ctx.widgets.push(box); return box;
  }
  function doneCount(s, ctx) {
    const box = el('p', { class: 'donecount', 'data-mission': s.id, text: '0 done' });
    ctx.widgets.push(box); return box;
  }

  function updateWidgets(ctx, data) {
    if (!data || !data.ok) return;
    ctx.widgets.forEach(w => {
      if (w.dataset.poll) {
        const counts = (data.polls && data.polls[w.dataset.poll]) || {};
        const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
        w.querySelectorAll('.bar').forEach(bar => {
          const n = counts[bar.dataset.i] || 0;
          bar.querySelector('.n').textContent = n;
          bar.querySelector('.fill').style.width = Math.round(100 * n / total) + '%';
        });
      }
      if (w.dataset.mission) {
        const n = (data.missions && data.missions[w.dataset.mission]) || 0;
        w.textContent = n + ' / ' + (data.registered || 0) + ' done';
      }
    });
  }

  window.AISLPlayer = { renderStep, updateWidgets };
})();
