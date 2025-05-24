const reader = document.getElementById('reader');
const navButtons = document.querySelectorAll('#main-nav button');
const basePath = '/book';

async function loadMarkdownPage(page) {
  const url = `${basePath}/${page}.md`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Page not found');
    const md = await res.text();
    return md;
  } catch (e) {
    return `# 404 - Page not found\nContent for "${page}" does not exist.`;
  }
}

function renderMarkdown(md) {
  let html = marked.parse(md);
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  tempDiv.querySelectorAll('a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith(basePath)) {
      link.addEventListener('click', e => {
        e.preventDefault();
        const page = href.replace(basePath + '/', '');
        navigateTo(page);
      });
    }
  });
  reader.innerHTML = '';
  reader.appendChild(tempDiv);
}

async function navigateTo(page, addToHistory = true) {
  const md = await loadMarkdownPage(page);
  renderMarkdown(md);
  navButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === page);
  });
  if (addToHistory) {
    history.pushState({ page }, '', `${basePath}/${page}`);
  }
  let bg;
  switch (page) {
    case 'timeline': bg = 'linear-gradient(45deg, #0a0a0a, #001122)'; break;
    case 'events': bg = 'linear-gradient(45deg, #0a0a0a, #220011)'; break;
    case 'groups': bg = 'linear-gradient(45deg, #0a0a0a, #112200)'; break;
    case 'bases': bg = 'linear-gradient(45deg, #0a0a0a, #112244)'; break;
    case 'players': bg = 'linear-gradient(45deg, #0a0a0a, #441122)'; break;
    default: bg = 'linear-gradient(45deg, #0a0a0a, #0f1a3d)';
  }
  document.querySelector('main').style.background = bg;
}

navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    navigateTo(btn.dataset.page);
  });
});

window.addEventListener('popstate', e => {
  const state = e.state;
  if (state && state.page) {
    navigateTo(state.page, false);
  } else {
    navigateTo('timeline', false);
  }
});

function initialLoad() {
  const path = window.location.pathname;
  if (path.startsWith(basePath)) {
    const page = path.replace(basePath + '/', '') || 'timeline';
    navigateTo(page, false);
  } else {
    navigateTo('timeline', false);
  }
}

initialLoad();
