const API_URL = 'https://api.jikan.moe/v4/seasons/2011/fall?sfw';

async function fetchAnimes() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  const json = await res.json();
  return json.data || [];
}

function sanitize(text) {
  const d = document.createElement('div');
  d.textContent = text ?? '';
  return d.innerHTML;
}

function renderRow(anime, index) {
  const tr = document.createElement('tr');
  tr.style.animationDelay = `${index * 30}ms`;


  const titleEn = anime.title_english || '';
  const titleJp = anime.title || '';
  const tdTitle = document.createElement('td');
  tdTitle.className = 'title';
  tdTitle.innerHTML = `${sanitize(titleEn) || '<em style="color:var(--muted);font-style:italic;font-size:11px">Sin título en inglés</em>'}
    ${titleJp ? `<span>${sanitize(titleJp)}</span>` : ''}`;


  const tdSynopsis = document.createElement('td');
  tdSynopsis.className = 'synopsis';
  tdSynopsis.innerHTML = anime.synopsis
    ? `<div class="synopsis-text">${sanitize(anime.synopsis)}</div>`
    : `<span style="color:var(--border);font-size:11px;font-style:italic">Sin sinopsis disponible</span>`;


  const tdYear = document.createElement('td');
  tdYear.className = 'year';
  tdYear.textContent = anime.year ?? '—';


  const tdImage = document.createElement('td');
  tdImage.className = 'image';
  const imgUrl = anime.images?.jpg?.image_url || anime.images?.webp?.image_url || '';
  if (imgUrl) {
    const img = document.createElement('img');
    img.src = imgUrl;
    img.alt = titleEn || titleJp || 'Anime';
    img.loading = 'lazy';
    tdImage.appendChild(img);
  } else {
    tdImage.innerHTML = `<div class="no-img">🎌</div>`;
  }


  const tdEp = document.createElement('td');
  tdEp.className = 'episodes';
  tdEp.innerHTML = anime.episodes != null
    ? anime.episodes
    : `<span class="ep-null">N/A</span>`;

  tr.append(tdTitle, tdSynopsis, tdYear, tdImage, tdEp);
  return tr;
}

async function init() {
  const loader       = document.getElementById('loader');
  const errorBox     = document.getElementById('error-box');
  const tableWrapper = document.getElementById('table-wrapper');
  const tbody        = document.getElementById('anime-tbody');
  const countBadge   = document.getElementById('count-badge');

  try {
    const animes = await fetchAnimes();
    loader.style.display = 'none';

    if (!animes.length) {
      errorBox.style.display = 'block';
      errorBox.textContent = 'La API no devolvió resultados.';
      return;
    }

    animes.forEach((anime, i) => tbody.appendChild(renderRow(anime, i)));

    countBadge.textContent = `${animes.length} títulos`;
    countBadge.style.opacity = '1';
    tableWrapper.style.display = 'block';

  } catch (err) {
    loader.style.display = 'none';
    errorBox.style.display = 'block';
    errorBox.textContent = `Error al consumir la API: ${err.message}`;
  }
}

init();