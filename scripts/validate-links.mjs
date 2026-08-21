/*
 * Validates public/links.json before it can reach the live site.
 *
 * Runs automatically on every push and pull request (see
 * .github/workflows/validate-links.yml). Run it yourself with:
 *
 *   node scripts/validate-links.mjs
 *
 * No dependencies. Node 18 or newer.
 */

import { readFileSync } from 'node:fs';

const FILE = 'public/links.json';
const errors = [];
const warnings = [];

// ---- Parse -----------------------------------------------------------

let raw;
try {
  raw = readFileSync(FILE, 'utf8');
} catch {
  console.error(`Could not read ${FILE}. Is it missing?`);
  process.exit(1);
}

let data;
try {
  data = JSON.parse(raw);
} catch (err) {
  console.error(`\n${FILE} is not valid JSON.\n`);
  console.error(err.message);
  console.error(
    '\nUsual causes: a missing comma between entries, a trailing comma after' +
    '\nthe last entry, or a missing quote mark. Paste the file into' +
    '\nhttps://jsonlint.com to see exactly where.\n'
  );
  process.exit(1);
}

// ---- Shape -----------------------------------------------------------

if (!Array.isArray(data.links)) {
  errors.push('The top-level "links" key is missing, or is not a list.');
}

const links = Array.isArray(data.links) ? data.links : [];

links.forEach((link, i) => {
  const where = `links[${i}]${link?.title ? ` ("${link.title}")` : ''}`;

  if (typeof link !== 'object' || link === null) {
    errors.push(`${where} is not an object.`);
    return;
  }

  if (!link.title || typeof link.title !== 'string') {
    errors.push(`${where} needs a non-empty "title".`);
  } else if (link.title.length > 40) {
    warnings.push(`${where} title is ${link.title.length} chars; over ~40 wraps awkwardly on a phone.`);
  }

  if (link.subtitle && link.subtitle.length > 70) {
    warnings.push(`${where} subtitle is ${link.subtitle.length} chars; over ~70 wraps awkwardly.`);
  }

  if (typeof link.url !== 'string') {
    errors.push(`${where} needs a "url" (use "#" if it is not ready yet).`);
  } else if (link.url !== '#' && !/^(https?:\/\/|mailto:|tel:|\/)/i.test(link.url)) {
    errors.push(
      `${where} has url "${link.url}", which will not work. ` +
      'Use a full address starting with https://'
    );
  }

  if ('enabled' in link && typeof link.enabled !== 'boolean') {
    errors.push(`${where} has "enabled": ${JSON.stringify(link.enabled)}; it must be true or false, with no quotes.`);
  }

  const known = new Set(['title', 'subtitle', 'url', 'enabled', 'note']);
  Object.keys(link)
    .filter(k => !known.has(k))
    .forEach(k => warnings.push(`${where} has an unrecognized key "${k}"; it will be ignored.`));
});

const visible = links.filter(l => l && l.enabled !== false);
if (links.length && visible.length === 0) {
  errors.push('Every link is disabled, so the page would render empty.');
}
if (visible.length > 8) {
  warnings.push(`${visible.length} links are visible. Over about 8 means scrolling on a phone, which defeats the point.`);
}

const placeholders = visible.filter(l => !l.url || l.url === '#');
if (placeholders.length) {
  warnings.push(
    `${placeholders.length} visible link(s) still have "#" as the URL and will ` +
    `render as "coming soon": ${placeholders.map(l => l.title).join(', ')}`
  );
}

// ---- Report ----------------------------------------------------------

warnings.forEach(w => console.warn(`  warning: ${w}`));

if (errors.length) {
  console.error(`\n${FILE} has ${errors.length} problem(s):\n`);
  errors.forEach(e => console.error(`  error: ${e}`));
  console.error('\nThe site was not updated. Fix these and push again.\n');
  process.exit(1);
}

console.log(`\nOK. ${visible.length} link(s) will show on the page.`);
if (warnings.length) console.log(`${warnings.length} warning(s) above are safe to ignore if intentional.`);
