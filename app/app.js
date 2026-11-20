// Leonida Trophy Guide: an offline GTA VI trophy tracker.
// State lives only in this browser (localStorage); nothing is uploaded.
// Trophy data is loaded from data/trophies.json next to this file.

const KEY = 'leonida-trophy-guide-v1';
const REVEAL_KEY = 'leonida-trophy-guide-revealed-v1';
const params = new URLSearchParams(location.search);

const listEl = document.getElementById('trophyList');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const progressByGrade = document.getElementById('progressByGrade');
const countText = document.getElementById('countText');
const emptyText = document.getElementById('emptyText');
const searchEl = document.getElementById('search');
const gradeEl = document.getElementById('gradeFilter');
const kindEl = document.getElementById('kindFilter');
const hideEarnedEl = document.getElementById('hideEarned');
const spoilerEl = document.getElementById('spoilerSafe');

let earned = new Set(load(KEY));
let revealed = new Set(load(REVEAL_KEY));
let doc = null;

function load(key) {
  try {
    const v = JSON.parse(localStorage.getItem(key) ?? '[]');
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
function save() {
  localStorage.setItem(KEY, JSON.stringify([...earned]));
  localStorage.setItem(REVEAL_KEY, JSON.stringify([...revealed]));
}

// Demo progress for screenshots only: ?demo=1 ticks a fixed set of trophies.
if (params.get('demo') === '1' && earned.size === 0) {
  earned = new Set([
    'Just Like Paradise', 'Paradise Lost', 'Trust', 'Break the Bank',
    'Road to Rehabilitation', 'Whip It Good', 'Stick Fiddler',
    'Baited My Tackle', 'Master of None', 'Treat Yo Self',
    'On the Spot', 'Positive Mental Attitude',
  ]);
  save();
}

const resp = await fetch('data/trophies.json');
doc = await resp.json();
const sourcesByKey = Object.fromEntries(doc.sources.map((s) => [s.key, s]));

function sourceLinks(keys) {
  return keys
    .map((k) => {
      const s = sourcesByKey[k];
      return s ? `<a href="${s.url}" target="_blank" rel="noopener">${s.name}</a>` : k;
    })
    .join(', ');
}

function renderRoadmap() {
  const wrap = document.getElementById('roadmapPhases');
  wrap.replaceChildren();
  for (const p of doc.roadmap) {
    const div = document.createElement('div');
    div.className = 'phase';
    const h = document.createElement('h3');
    h.textContent = `Phase ${p.phase}: ${p.title}`;
    const ol = document.createElement('ol');
    for (const step of p.steps) {
      const li = document.createElement('li');
      li.textContent = step;
      ol.append(li);
    }
    div.append(h, ol);
    wrap.append(div);
  }
}

function renderSources() {
  const ul = document.getElementById('sourceList');
  ul.replaceChildren();
  for (const s of doc.sources) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = s.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = s.name;
    li.append(a, document.createTextNode(` — ${s.note}`));
    ul.append(li);
  }
}

function gradeLabel(t) {
  return t.grade.charAt(0).toUpperCase() + t.grade.slice(1);
}

function cardFor(t) {
  const card = document.createElement('article');
  card.className = 'card';
  card.dataset.name = t.name;
  const isEarned = earned.has(t.name);
  if (isEarned) card.classList.add('earned');

  const top = document.createElement('div');
  top.className = 'card-top';
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = isEarned;
  box.setAttribute('aria-label', `Mark ${t.name} as earned`);
  box.addEventListener('change', () => {
    if (box.checked) earned.add(t.name);
    else earned.delete(t.name);
    save();
    render();
  });
  top.append(box);

  const body = document.createElement('div');
  body.className = 'card-body';

  const head = document.createElement('div');
  head.className = 'card-head';
  const name = document.createElement('h3');
  name.className = 'trophy-name';
  const grade = document.createElement('span');
  grade.className = `badge ${t.grade}`;
  grade.textContent = gradeLabel(t);
  const kind = document.createElement('span');
  kind.className = 'tag';
  kind.textContent = t.kind;
  head.append(name, grade, kind);
  if (t.missable) {
    const m = document.createElement('span');
    m.className = 'tag missable';
    m.textContent = 'Possibly missable';
    head.append(m);
  }
  if (t.status !== 'confirmed') {
    const s = document.createElement('span');
    s.className = `tag status-${t.status}`;
    s.textContent = t.status === 'reported' ? 'Method reported, not confirmed' : 'Method unconfirmed';
    head.append(s);
  }

  const masked = spoilerEl.checked && t.story && !isEarned && !revealed.has(t.name);
  if (masked) {
    name.textContent = 'Story trophy — hidden to avoid spoilers';
    const mask = document.createElement('p');
    mask.className = 'spoiler-mask';
    mask.textContent = 'This is a story trophy. Tick it as earned, or reveal it, to see its name and guide.';
    const reveal = document.createElement('button');
    reveal.type = 'button';
    reveal.className = 'reveal-btn';
    reveal.textContent = 'Reveal this trophy';
    reveal.addEventListener('click', () => {
      revealed.add(t.name);
      save();
      render();
    });
    mask.append(reveal);
    body.append(head, mask);
  } else {
    name.textContent = t.name;
    const quote = document.createElement('blockquote');
    quote.textContent = t.description;
    const guide = document.createElement('p');
    guide.className = 'guide';
    guide.textContent = t.guide;
    body.append(head, quote, guide);
    if (t.missable && t.missableNote) {
      const note = document.createElement('p');
      note.className = 'missable-note';
      note.textContent = `⚠ ${t.missableNote}`;
      body.append(note);
    }
    const src = document.createElement('p');
    src.className = 'sources';
    src.innerHTML = `Sources: ${sourceLinks(t.sources)}`;
    body.append(src);
  }
  top.append(body);
  card.append(top);
  return card;
}

function matches(t) {
  const q = searchEl.value.trim().toLowerCase();
  if (gradeEl.value !== 'all' && t.grade !== gradeEl.value) return false;
  if (kindEl.value !== 'all' && t.kind !== kindEl.value) return false;
  if (hideEarnedEl.checked && earned.has(t.name)) return false;
  if (q) {
    const hay = `${t.name} ${t.description} ${t.guide} ${t.kind}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

function render() {
  const shown = doc.trophies.filter(matches);
  listEl.replaceChildren();
  for (const t of shown) listEl.append(cardFor(t));
  emptyText.hidden = shown.length > 0;
  countText.textContent = `Showing ${shown.length} of ${doc.trophies.length} trophies`;
  const byGrade = {};
  for (const t of doc.trophies) {
    if (earned.has(t.name)) byGrade[t.grade] = (byGrade[t.grade] ?? 0) + 1;
  }
  const total = doc.trophies.length;
  progressText.textContent = `${earned.size} of ${total} earned — ${Math.round((earned.size / total) * 100)}% to the platinum`;
  progressFill.style.width = `${(earned.size / total) * 100}%`;
  progressByGrade.textContent = ['platinum', 'gold', 'silver', 'bronze']
    .map((g) => {
      const n = doc.trophies.filter((t) => t.grade === g).length;
      return `${gradeLabel({ grade: g })} ${byGrade[g] ?? 0}/${n}`;
    })
    .join(' · ');
  document.getElementById('listHeading').textContent =
    earned.size === total ? 'All 55 trophies — Vice Got a Price! is yours' : 'All 55 trophies';
}

document.getElementById('exportBtn').addEventListener('click', () => {
  const payload = {
    game: doc.game,
    exported: new Date().toISOString(),
    earned: [...earned].sort(),
  };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});

document.getElementById('importInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const names = Array.isArray(data) ? data : data.earned;
    if (!Array.isArray(names)) throw new Error('no earned list');
    const known = new Set(doc.trophies.map((t) => t.name));
    earned = new Set(names.filter((n) => known.has(n)));
    save();
    render();
  } catch {
    alert('That file is not a trophy-progress export from this guide.');
  }
  e.target.value = '';
});

document.getElementById('resetBtn').addEventListener('click', () => {
  if (!confirm('Clear every tick? This cannot be undone.')) return;
  earned = new Set();
  revealed = new Set();
  save();
  render();
});

for (const el of [searchEl, gradeEl, kindEl, hideEarnedEl, spoilerEl]) {
  el.addEventListener('input', render);
  el.addEventListener('change', render);
}

renderRoadmap();
renderSources();
render();

// Screenshot presets (?shot=…): stage a fixed view for each screenshot.
// The filter bar is sticky, so scroll with an offset that clears it.
const shot = params.get('shot');
const stickyOffset = 170;
if (shot === 'roadmap') {
  window.scrollTo(0, document.getElementById('roadmap').offsetTop - stickyOffset);
} else if (shot === 'missable') {
  kindEl.value = 'activity';
  searchEl.value = 'Positive Mental Attitude';
  render();
  const card = listEl.querySelector('.card');
  if (card) window.scrollTo(0, card.offsetTop - stickyOffset);
} else if (shot === 'checklist') {
  window.scrollTo(0, document.getElementById('listSection').offsetTop - stickyOffset);
} else if (shot === 'cover') {
  window.scrollTo(0, 0);
}
