import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const NOTION_VERSION = '2022-06-28';

function richTextPlain(richText = []) {
  return richText.map((item) => item.plain_text || '').join('').trim();
}

function slugify(input = '') {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');
}

function notionHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    'Notion-Version': NOTION_VERSION,
    'Content-Type': 'application/json',
  };
}

async function notionFetch(url, token, init = {}) {
  const response = await fetch(url, {
    ...init,
    headers: {
      ...notionHeaders(token),
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Notion request failed (${response.status}) ${url}\n${errorBody}`);
  }

  return response.json();
}

function getFileExtension(url, contentType = '') {
  const fromUrl = path.extname(new URL(url).pathname);
  if (fromUrl) return fromUrl.toLowerCase();

  if (contentType.includes('png')) return '.png';
  if (contentType.includes('jpeg') || contentType.includes('jpg')) return '.jpg';
  if (contentType.includes('webp')) return '.webp';
  if (contentType.includes('gif')) return '.gif';
  return '.bin';
}

async function downloadAsset(url, targetDir, targetBaseName) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download asset (${response.status}) ${url}`);
  }

  const contentType = response.headers.get('content-type') || '';
  const ext = getFileExtension(url, contentType);
  const fileName = `${targetBaseName}${ext}`;
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(path.join(targetDir, fileName), buffer);
  return `./assets/notion-news/${fileName}`;
}

function renderRichText(richText = []) {
  return richText
    .map((item) => {
      const text = item.plain_text || '';
      if (!text) return '';

      let html = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br/>');

      if (item.annotations?.code) html = `<code>${html}</code>`;
      if (item.annotations?.bold) html = `<strong>${html}</strong>`;
      if (item.annotations?.italic) html = `<em>${html}</em>`;
      if (item.annotations?.strikethrough) html = `<s>${html}</s>`;
      if (item.annotations?.underline) html = `<u>${html}</u>`;
      if (item.href) html = `<a href="${item.href}" target="_blank" rel="noreferrer">${html}</a>`;
      return html;
    })
    .join('');
}

function escapeHtml(text = '') {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function fetchBlockChildren(blockId, token) {
  const blocks = [];
  let cursor;

  do {
    const url = new URL(`https://api.notion.com/v1/blocks/${blockId}/children`);
    url.searchParams.set('page_size', '100');
    if (cursor) url.searchParams.set('start_cursor', cursor);

    const json = await notionFetch(url.toString(), token);
    blocks.push(...(json.results || []));
    cursor = json.has_more ? json.next_cursor : null;
  } while (cursor);

  return blocks;
}

async function blocksToHtml(blocks, token, assetDir, assetBase) {
  const html = [];
  let listMode = null;

  async function flushList() {
    if (listMode) {
      html.push(`</${listMode}>`);
      listMode = null;
    }
  }

  for (const block of blocks) {
    const value = block[block.type] || {};
    const rich = value.rich_text || [];
    const text = renderRichText(rich);

    if (block.type === 'bulleted_list_item') {
      if (listMode !== 'ul') {
        await flushList();
        html.push('<ul>');
        listMode = 'ul';
      }
      html.push(`<li>${text}</li>`);
      continue;
    }

    if (block.type === 'numbered_list_item') {
      if (listMode !== 'ol') {
        await flushList();
        html.push('<ol>');
        listMode = 'ol';
      }
      html.push(`<li>${text}</li>`);
      continue;
    }

    await flushList();

    switch (block.type) {
      case 'heading_1':
        html.push(`<h1>${text}</h1>`);
        break;
      case 'heading_2':
        html.push(`<h2>${text}</h2>`);
        break;
      case 'heading_3':
        html.push(`<h3>${text}</h3>`);
        break;
      case 'paragraph':
        if (text) html.push(`<p>${text}</p>`);
        break;
      case 'quote':
        html.push(`<blockquote>${text}</blockquote>`);
        break;
      case 'callout':
        html.push(`<aside class="news-callout">${text}</aside>`);
        break;
      case 'divider':
        html.push('<hr/>');
        break;
      case 'image': {
        const src = value.type === 'external' ? value.external?.url : value.file?.url;
        if (src) {
          const localSrc = value.type === 'file'
            ? await downloadAsset(src, assetDir, `${assetBase}-${block.id.slice(0, 8)}`)
            : src;
          const caption = renderRichText(value.caption || []);
          html.push(
            `<figure><img src="${localSrc}" alt="${escapeHtml(caption || 'article image')}" />${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`,
          );
        }
        break;
      }
      default:
        break;
    }
  }

  await flushList();
  return html.join('\n');
}

function pageTemplate(article) {
  const metaDescription = escapeHtml(article.seoDescription || article.summary || '');
  const title = escapeHtml(article.seoTitle || article.title);
  const category = escapeHtml(article.category || '新闻');
  const author = escapeHtml(article.author || 'ZAPEX 编辑部');
  const date = escapeHtml(article.dateLabel || '');
  const readTime = article.readTime ? `${article.readTime} 分钟阅读` : '';
  const coverHtml = article.cover ? `<div class="article-hero-cover"><img src="${article.cover}" alt="${escapeHtml(article.title)}" /></div>` : '';

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${metaDescription}" />
  <link rel="stylesheet" href="../zapex-system.css" />
  <style>
    .article-shell { max-width: 980px; margin: 0 auto; padding: var(--s-8) var(--s-5) var(--s-9); }
    .article-topbar { margin-bottom: var(--s-7); }
    .article-back { font-family: var(--ff-mono); font-size: var(--t-mono); letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-60); text-decoration: none; }
    .article-back:hover { color: var(--brand); }
    .article-meta { display:flex; flex-wrap:wrap; gap: var(--s-3); font-family: var(--ff-mono); font-size: var(--t-mono); color: var(--ink-60); letter-spacing: 0.08em; margin-bottom: var(--s-4); text-transform: uppercase; }
    .article-title { font-family: var(--ff-display); font-size: clamp(2.2rem, 5vw, 4.4rem); line-height: 1.06; letter-spacing: -0.04em; margin: 0 0 var(--s-5); }
    .article-summary { font-size: var(--t-lead); line-height: 1.7; color: var(--ink-80); margin-bottom: var(--s-6); }
    .article-hero-cover { margin-bottom: var(--s-7); border: 1px solid var(--line); background: var(--surface); overflow: hidden; }
    .article-hero-cover img { display:block; width:100%; height:auto; }
    .article-body { font-size: 18px; line-height: 1.9; color: var(--ink); }
    .article-body h1, .article-body h2, .article-body h3 { font-family: var(--ff-display); line-height: 1.18; letter-spacing: -0.03em; margin: var(--s-7) 0 var(--s-4); }
    .article-body h1 { font-size: 2.4rem; }
    .article-body h2 { font-size: 1.9rem; }
    .article-body h3 { font-size: 1.4rem; }
    .article-body p, .article-body ul, .article-body ol, .article-body blockquote, .article-body figure, .article-body hr { margin: 0 0 var(--s-5); }
    .article-body ul, .article-body ol { padding-left: 1.5em; }
    .article-body blockquote { padding-left: var(--s-5); border-left: 2px solid var(--brand); color: var(--ink-80); }
    .article-body figure img { max-width: 100%; border: 1px solid var(--line); }
    .article-body figcaption { margin-top: var(--s-2); font-size: var(--t-sm); color: var(--ink-60); }
    .news-callout { padding: var(--s-4) var(--s-5); background: rgba(26,79,255,0.05); border: 1px solid rgba(26,79,255,0.12); }
    @media (max-width: 640px) {
      .article-shell {
        padding: var(--s-6) var(--s-4) var(--s-8);
      }
      .article-topbar {
        margin-bottom: var(--s-5);
      }
      .article-title {
        font-size: clamp(1.35rem, 8vw, 1.8rem);
        line-height: 1.2;
      }
      .article-summary {
        font-size: var(--t-sm);
        line-height: 1.72;
      }
      .article-body {
        font-size: 13px;
        line-height: 1.82;
      }
      .article-body h1 {
        font-size: 1.35rem;
      }
      .article-body h2 {
        font-size: 1.12rem;
      }
      .article-body h3 {
        font-size: 1rem;
      }
      .article-body blockquote,
      .news-callout {
        padding-left: var(--s-4);
        padding-right: var(--s-4);
      }
    }
  </style>
</head>
<body>
  <div class="site-nav">
    <div class="shell shell--wide">
      <div class="site-nav-inner">
        <div class="site-nav-left">
          <a href="../homepage-v2.html" class="wordmark wordmark--nav">
            <span class="cn">崢銳</span><span class="wordmark-en"><span class="z">Z</span><span class="apex">APEX</span></span>
          </a>
        </div>
        <nav class="site-nav-links">
          <a class="site-nav-link" href="../homepage-v2.html"><span class="idx">01</span>品牌首页</a>
          <a class="site-nav-link" href="../system-and-modules-v2.html"><span class="idx">02</span>系统与模块</a>
          <a class="site-nav-link is-current" href="../news-and-cases-v2.html"><span class="idx">03</span>新闻&案例</a>
          <a class="site-nav-link" href="../assessment-v2.html"><span class="idx">04</span>评估表</a>
        </nav>
        <div class="site-nav-right">
          <a class="pill pill--stacked" href="../growth-forms.html"><span class="dot"></span><span class="pill-stack"><span class="pill-main">客户工作台</span><span class="pill-sub">飞书入口</span></span></a>
          <a class="pill pill--primary" href="../assessment-v2.html">预约品牌咨询评估 <span class="arrow">→</span></a>
        </div>
      </div>
    </div>
  </div>

  <main class="article-shell">
    <div class="article-topbar">
      <a class="article-back" href="../news-and-cases-v2.html">← 返回新闻列表</a>
    </div>
    <div class="article-meta">
      <span>${category}</span>
      ${date ? `<span>${date}</span>` : ''}
      <span>${author}</span>
      ${readTime ? `<span>${readTime}</span>` : ''}
    </div>
    <h1 class="article-title">${escapeHtml(article.title)}</h1>
    ${article.summary ? `<p class="article-summary">${escapeHtml(article.summary)}</p>` : ''}
    ${coverHtml}
    <article class="article-body">
      ${article.bodyHtml || '<p>正文暂未填写。</p>'}
    </article>
  </main>
</body>
</html>`;
}

function toDateLabel(dateString) {
  if (!dateString) return '';
  return dateString.replaceAll('-', '.');
}

function getSelectName(property) {
  return property?.select?.name || '';
}

function getStatusName(property) {
  return property?.status?.name || property?.select?.name || '';
}

function getFiles(property) {
  return property?.files || [];
}

async function fetchPublishedArticles(token, databaseId, assetDir) {
  const query = await notionFetch(`https://api.notion.com/v1/databases/${databaseId}/query`, token, {
    method: 'POST',
    body: JSON.stringify({
      page_size: 100,
      sorts: [
        { property: '发布日期', direction: 'descending' },
        { property: '排序权重', direction: 'descending' },
      ],
    }),
  });

  const articles = [];
  for (const page of query.results || []) {
    const props = page.properties || {};
    const title = richTextPlain(props['标题']?.title);
    if (!title) continue;
    const status = getStatusName(props.Status);
    if (status !== '已发布') continue;

    const slug = slugify(richTextPlain(props.Slug?.rich_text) || title);
    const files = getFiles(props['封面图']);
    let cover = null;
    if (files[0]) {
      const file = files[0];
      const url = file.type === 'external' ? file.external?.url : file.file?.url;
      if (url) {
        cover = file.type === 'file'
          ? await downloadAsset(url, assetDir, `${slug}-cover`)
          : url;
      }
    }

    const blocks = await fetchBlockChildren(page.id, token);
    const bodyHtml = await blocksToHtml(blocks, token, assetDir, `${slug}-block`);

    articles.push({
      id: page.id,
      title,
      slug,
      status,
      date: props['发布日期']?.date?.start || '',
      dateLabel: toDateLabel(props['发布日期']?.date?.start || ''),
      category: getSelectName(props['分类']),
      summary: richTextPlain(props['摘要']?.rich_text),
      author: props['作者']?.people?.map((person) => person.name).join(', ') || '',
      featured: Boolean(props['是否精选']?.checkbox),
      showOnHome: Boolean(props['是否显示在首页']?.checkbox),
      sortWeight: props['排序权重']?.number ?? 0,
      readTime: props['阅读时长']?.number ?? null,
      seoTitle: richTextPlain(props['SEO标题']?.rich_text),
      seoDescription: richTextPlain(props['SEO描述']?.rich_text),
      cover,
      notionUrl: page.url,
      bodyHtml,
    });
  }

  return articles;
}

function buildPayload(articles) {
  const featured = articles.find((article) => article.featured) || articles[0] || null;
  const nonFeatured = articles.filter((article) => !featured || article.slug !== featured.slug);
  const articleCards = nonFeatured.length ? nonFeatured : articles.slice(0, 6);

  const counts = articles.reduce((acc, article) => {
    const key = article.category || '未分类';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return {
    generatedAt: new Date().toISOString(),
    total: articles.length,
    filters: [
      { key: '全部', label: '全部', count: articles.length },
      ...Object.entries(counts).map(([key, count]) => ({ key, label: key, count })),
    ],
    featured,
    articles: articleCards,
    ticker: articles.slice(0, 6),
  };
}

export default async function syncNotionNews({ rootDir }) {
  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!token || !databaseId) {
    console.warn('[notion-news] NOTION_TOKEN or NOTION_DATABASE_ID missing, skipping Notion sync.');
    return false;
  }

  const dataDir = path.join(rootDir, 'data');
  const newsDir = path.join(rootDir, 'news');
  const assetDir = path.join(rootDir, 'assets', 'notion-news');

  await mkdir(dataDir, { recursive: true });
  await mkdir(assetDir, { recursive: true });
  await rm(newsDir, { recursive: true, force: true });
  await mkdir(newsDir, { recursive: true });

  const articles = await fetchPublishedArticles(token, databaseId, assetDir);
  const payload = buildPayload(articles);

  await writeFile(path.join(dataDir, 'notion-news.json'), JSON.stringify(payload, null, 2), 'utf8');

  for (const article of articles) {
    await writeFile(path.join(newsDir, `${article.slug}.html`), pageTemplate(article), 'utf8');
  }

  console.log(`[notion-news] synced ${articles.length} published articles`);
  return true;
}
