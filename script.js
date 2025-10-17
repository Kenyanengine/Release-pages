const releases = [
  {
    tag_name: "v2.1.0",
    name: "Bingwa Release v2.1.0",
    published_at: "2025-10-17T21:55:34Z",
    body: "Improvements:\n- Forwarding reliability increased\n- Minor UI polish\n\nNotes: Confirmed stable.",
    assets: [
      { name: "bingwa-toolkit-2.1.0.zip", size: 14234567, url: "#" },
      { name: "changelog-2.1.0.txt", size: 2345, url: "#" }
    ]
  },
  {
    tag_name: "v2.0.0",
    name: "Bingwa Major Release v2.0.0",
    published_at: "2025-09-03T12:10:00Z",
    body: "Major features:\n- New forwarding engine\n- Retry and pause logic\n\nBreaking changes: API keys moved to env.",
    assets: [
      { name: "bingwa-toolkit-2.0.0.zip", size: 17345678, url: "#" }
    ]
  },
  {
    tag_name: "v1.5.7",
    name: "Hotfix v1.5.7",
    published_at: "2025-07-02T08:22:00Z",
    body: "Hotfix: Fixed rare crash on forwarding.",
    assets: []
  }
];

// Demo counts (match screenshot style)
const demoCounts = {
  successful_confirmed: 0,
  successful_pending: 0,
  advanced: 0,
  forwarded: 0,
  second_attempt: 0,
  paused: 0,
  okoa: 0,
  unavailable_offers: 0,
  blacklisted: 0,
  errors: 0
};

function humanFileSize(bytes) {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B','KB','MB','GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
}

function renderBadges() {
  const container = document.getElementById('statusBadges');
  container.innerHTML = '';
  const mk = (cls, text) => {
    const el = document.createElement('div');
    el.className = `badge ${cls}`;
    el.textContent = text;
    return el;
  }
  container.appendChild(mk('good', `${demoCounts.successful_confirmed} successful(confirmed)`));
  container.appendChild(mk('good', `${demoCounts.successful_pending} successful(pending)`));
  container.appendChild(mk('good', `${demoCounts.advanced} advanced`));
  container.appendChild(mk('good', `${demoCounts.forwarded} forwarded`));
  container.appendChild(mk('warn', `${demoCounts.second_attempt} second attempt`));
  container.appendChild(mk('warn', `${demoCounts.paused} paused`));
  container.appendChild(mk('gray', `${demoCounts.okoa} okoa`));
  container.appendChild(mk('gray', `${demoCounts.unavailable_offers} unavailable offers`));
  container.appendChild(mk('bad', `${demoCounts.blacklisted} blacklisted`));
  container.appendChild(mk('bad', `${demoCounts.errors} errors`));
}

function renderReleases(list) {
  const grid = document.getElementById('releasesGrid');
  grid.innerHTML = '';
  list.forEach(rel => {
    const card = document.createElement('article');
    card.className = 'card';

    const meta = document.createElement('div');
    meta.className = 'meta';
    const tag = document.createElement('div'); tag.className = 'tag'; tag.textContent = rel.tag_name || rel.name || 'untagged';
    const date = document.createElement('div'); date.className = 'meta-date'; date.textContent = rel.published_at ? new Date(rel.published_at).toLocaleString() : 'Draft';
    meta.appendChild(tag); meta.appendChild(date);

    const title = document.createElement('h3'); title.textContent = rel.name || rel.tag_name || 'Release';
    const body = document.createElement('p'); body.innerHTML = rel.body ? rel.body.replace(/\n/g,'<br>') : '<em>No description</em>';

    const assetsWrap = document.createElement('div'); assetsWrap.className = 'assets';
    if (rel.assets && rel.assets.length) {
      rel.assets.forEach(a => {
        const asset = document.createElement('div'); asset.className = 'asset';
        const left = document.createElement('a'); left.href = a.url; left.target = '_blank'; left.rel='noopener noreferrer';
        left.textContent = `${a.name} • ${humanFileSize(a.size)}`;
        const dl = document.createElement('a'); dl.className = 'downloadBtn'; dl.href = a.url; dl.textContent = 'Download';
        asset.appendChild(left); asset.appendChild(dl);
        assetsWrap.appendChild(asset);
      });
    } else {
      const empty = document.createElement('div'); empty.className = 'asset'; empty.innerHTML = '<div style="color:#9fb4c9">No files attached to this release</div>';
      assetsWrap.appendChild(empty);
    }

    card.appendChild(meta); card.appendChild(title); card.appendChild(body); card.appendChild(assetsWrap);
    grid.appendChild(card);
  });
}

function initDemo() {
  renderBadges();
  renderReleases(releases);

  // search filtering
  const search = document.getElementById('search');
  search.addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    if (!q) return renderReleases(releases);
    const filtered = releases.filter(r => {
      const hay = `${r.tag_name} ${r.name} ${r.body}`.toLowerCase();
      return hay.includes(q);
    });
    renderReleases(filtered);
  });
}

document.addEventListener('DOMContentLoaded', initDemo);
