import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const templatePath = path.join(distDir, 'index.html');
const sitemapPath = path.resolve('public/sitemap.xml');

if (!fs.existsSync(templatePath)) throw new Error('dist/index.html not found');
if (!fs.existsSync(sitemapPath)) throw new Error('public/sitemap.xml not found');

const template = fs.readFileSync(templatePath, 'utf8');
const source = [
  fs.readFileSync(path.resolve('src/data/tools-core.ts'), 'utf8'),
  fs.readFileSync(path.resolve('src/data/NEW_STUDY_AIDS.ts'), 'utf8')
].join('\n');

const esc = (value) => String(value)
  .replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function metadataFor(slug) {
  const block = source.match(new RegExp(`id: ['"]${slug.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}['"][\\s\\S]*?(?=\\n  },|\\n},)`));
  const text = block?.[0] || '';
  const title = text.match(/seoTitle:\s*['"]([^'"]+)['"]/)?.[1]
    || text.match(/name:\s*['"]([^'"]+)['"]/)?.[1]
    || `${slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} — Codepackr Study`;
  const description = text.match(/seoDescription:\s*['"]([^'"]+)['"]/)?.[1]
    || text.match(/description:\s*['"]([^'"]+)['"]/)?.[1]
    || `Free Codepackr Study tool for ${slug.split('-').join(' ')}. Private, fast, and browser-based.`;
  return { title, description };
}

const urls = [...fs.readFileSync(sitemapPath, 'utf8').matchAll(/<loc>https:\/\/study\.codepackr\.com\/([^<]*)<\/loc>/g)]
  .map(m => m[1].replace(/^\/+|\/+$/g, ''))
  .filter(Boolean);

const pages = ['home', ...urls];
for (const slug of pages) {
  const isHome = slug === 'home';
  const pathSlug = isHome ? '' : slug;
  const { title, description } = isHome
    ? { title: 'Codepackr Study — Student & Exam Tools', description: '100% client-side student and exam tools including GPA, citations, flashcards, converters, and study aids.' }
    : metadataFor(pathSlug);
  const canonical = `https://study.codepackr.com/${pathSlug}`;

  let html = template;
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${esc(title)}</title>`);
  html = html.replace(/<meta name="description" content="[^"]*"/i, `<meta name="description" content="${esc(description)}"`);
  html = html.replace(/<link rel="canonical" href="[^"]*"/i, `<link rel="canonical" href="${canonical}"`);
  html = html.replace(/<meta property="og:title" content="[^"]*"/i, `<meta property="og:title" content="${esc(title)}"`);
  html = html.replace(/<meta property="og:description" content="[^"]*"/i, `<meta property="og:description" content="${esc(description)}"`);
  html = html.replace(/<meta property="og:url" content="[^"]*"/i, `<meta property="og:url" content="${canonical}"`);
  html = html.replace(/<meta property="og:image:alt" content="[^"]*"/i, `<meta property="og:image:alt" content="${esc(title)}"`);
  html = html.replace(/<meta name="twitter:title" content="[^"]*"/i, `<meta name="twitter:title" content="${esc(title)}"`);
  html = html.replace(/<meta name="twitter:description" content="[^"]*"/i, `<meta name="twitter:description" content="${esc(description)}"`);
  html = html.replace(/<meta name="twitter:image:alt" content="[^"]*"/i, `<meta name="twitter:image:alt" content="${esc(title)}"`);

  const crawler = `<div id="root" data-codepackr-prerendered="true"><main style="max-width:900px;margin:40px auto;padding:20px;font-family:system-ui,sans-serif"><p style="color:#64748b">Codepackr Study</p><h1>${esc(title)}</h1><p>${esc(description)}</p><p>Free, browser-based study tools. Your inputs stay on your device.</p></main></div>`;
  html = html.replace(/<div id="root">[\\s\\S]*?<\/div>/i, crawler);

  if (isHome) {
    fs.writeFileSync(path.join(distDir, 'index.html'), html);
  } else {
    const dir = path.join(distDir, pathSlug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html);
    fs.writeFileSync(path.join(distDir, `${pathSlug}.html`), html);
  }
}
console.log(`Prerendered ${pages.length} Codepackr Study social-preview pages.`);
