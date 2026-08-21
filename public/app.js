/*
 * Renders the link buttons from links.json.
 *
 * You almost certainly do not need to edit this file. To change what
 * appears on the page, edit public/links.json. See EDITING-LINKS.md.
 *
 * No build step, no dependencies. The browser runs this as-is.
 */

// Bump the query string so phones do not serve a stale cached copy.
const LINKS_URL = 'links.json?v=' + Date.now();

/** A link with no real URL yet renders as a non-clickable "Coming soon". */
function isPlaceholder(url) {
  return !url || url === '#';
}

function setText(root, selector, value) {
  const el = root.querySelector(selector);
  if (!el) return;
  if (value) {
    el.textContent = value;
  } else {
    el.remove(); // Drop empty subtitles rather than leaving blank space.
  }
}

function buildButton(template, link) {
  const node = template.content.cloneNode(true);
  const anchor = node.querySelector('a');

  setText(node, '[data-title]', link.title);
  setText(node, '[data-subtitle]', link.subtitle);

  if (isPlaceholder(link.url)) {
    // Keep the row visible so the page never looks broken mid-setup,
    // but make it inert and obviously unfinished.
    anchor.removeAttribute('href');
    anchor.setAttribute('aria-disabled', 'true');
    anchor.classList.add('is-placeholder');
  } else {
    anchor.href = link.url;
    // Only leave the tab for offsite destinations.
    if (/^https?:/i.test(link.url)) {
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
    }
  }

  return node;
}

async function render() {
  const container = document.getElementById('links');
  const template = document.getElementById('link-template');

  if (!container || !template) {
    console.error('Missing #links or #link-template. See the structure contract in index.html.');
    return;
  }

  let data;
  try {
    const res = await fetch(LINKS_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    data = await res.json();
  } catch (err) {
    console.error('Could not load links.json:', err);
    container.innerHTML =
      '<p class="notice">Links are temporarily unavailable. ' +
      'Visit <a href="https://marriott.byu.edu">marriott.byu.edu</a>.</p>';
    return;
  }

  // Header and footer text, if links.json supplies them.
  if (data.title) {
    document.title = data.title;
    document.querySelectorAll('[data-page-title]')
      .forEach(el => { el.textContent = data.title; });
  }
  if (data.tagline) {
    document.querySelectorAll('[data-tagline]')
      .forEach(el => { el.textContent = data.tagline; });
  }
  if (data.footer && data.footer.text) {
    document.querySelectorAll('[data-footer]')
      .forEach(el => { el.textContent = data.footer.text; });
  }

  // Hidden links stay in the file so they are easy to switch back on.
  const visible = (data.links || []).filter(link => link.enabled !== false);

  const fragment = document.createDocumentFragment();
  visible.forEach(link => fragment.appendChild(buildButton(template, link)));
  container.appendChild(fragment);
}

render();
