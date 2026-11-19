# AI for School Leaders 2026 — Lucknow

Interactive, mobile-first workshop platform for the **Capacity Building Workshop for School Leaders 2026**
(Barabanki & Bahraich Sahodaya School Complexes, Lucknow), facilitated by Dr. Sanket Salvi.

It replaces static slides: principals follow each session on their phones (theory steps, polls, quizzes,
hands-on Gemini missions with copy-ready prompts and a **Mark done** button), while the facilitator runs the
same content on the projector with live poll results and mission counts. Google Sheets is the database.

Live site (GitHub Pages): `https://sanketsalvinitk.github.io/AI-School-Leaders-Lucknow-2026/`
Linked from: `https://onlysanket.in/consulting.html` → Workshops.

## Structure

```
index.html          Welcome, agenda, registration (with consent), session links
session.html?s=N    Participant player for session N (1–3)
presenter.html?s=N  Projector view: big type, arrow keys, live polls and mission counts
resources.html      Links and handouts (data/resources.json)
feedback.html       Feedback + optional "work with us" interests
assets/css/style.css
assets/js/core.js   Language (English/हिंदी), storage, data loading, backend calls, offline queue
assets/js/player.js Renders step types: title, concept, reveal, poll, quiz, mission, finale
data/workshop.json  Title, schedule, apiUrl, School Command Sheet link
data/sessionN.json  Session content (all text editable; any text can be {"en": "...", "hi": "..."})
apps-script/Code.gs Google Apps Script backend (bound to the workshop Google Sheet)
```

## Setup

1. **GitHub Pages:** Settings → Pages → Deploy from a branch → `main` / root.
2. **Backend (once):**
   1. Create a Google Sheet named *AI School Leaders 2026 — Workshop Data*.
   2. Extensions → Apps Script → paste `apps-script/Code.gs` → Save.
   3. Deploy → New deployment → Web app → Execute as **Me**, Who has access **Anyone** → Deploy, authorise.
   4. Copy the Web app URL into `data/workshop.json` → `apiUrl`, commit.
   The tabs (Registrations, Progress, Polls, Quiz, Feedback) are created on first use.
3. **School Command Sheet:** put its "make a copy" link (`.../copy`) in `commandSheetCopyUrl`.

Without `apiUrl` the site still works; progress is kept on each phone and sent once the URL is set.

## Editing content

Edit `data/session1.json` etc. Step types:

| type | fields |
| --- | --- |
| `title` | `title`, `subtitle` |
| `concept` | `title`, `lead`, `points[]`, `note` |
| `reveal` | `title`, `items[]` of `{front, back}` |
| `poll` | `id`, `question`, `options[]` |
| `quiz` | `id`, `question`, `options[]`, `answer` (index), `explain` |
| `mission` | `id`, `number`, `minutes`, `tool`, `toolUrl`, `title`, `scenario`, `steps[]`, `prompt`, `expected`, `check` |
| `finale` | same as `concept` |

Only `<b>`, `<i>`, `<em>`, `<strong>`, `<br>` are allowed inside text.

## Privacy

- Registration needs explicit consent; only name, school, role, district and an optional WhatsApp number are stored.
- No student data is collected anywhere. Mission prompts tell participants never to paste student names, marks, Aadhaar or APAAR data into AI tools.
- The public stats endpoint returns counts only.
- Delete the Registrations tab after the follow-up period, or on request.

## Run locally

```bash
python3 -m http.server 8000   # then open http://localhost:8000/
```

## Reusing for the next workshop

Use this repo as a template, then change `data/*.json` and the README title. No code changes needed.
