import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const NOTION_VERSION = '2022-06-28';

function notionHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    'Notion-Version': NOTION_VERSION,
    'Content-Type': 'application/json',
  };
}

async function withRetry(task, { retries = 3, delayMs = 800 } = {}) {
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      return await task();
    } catch (error) {
      lastError = error;
      if (attempt === retries) break;
      await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
    }
  }

  throw lastError;
}

async function notionFetch(url, token, init = {}) {
  return withRetry(async () => {
    const response = await fetch(url, {
      ...init,
      headers: {
        ...notionHeaders(token),
        ...(init.headers || {}),
      },
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Notion request failed (${response.status}) ${url}\n${body}`);
    }

    return response.json();
  });
}

function plainToRichText(content = '') {
  if (!content) return [];
  return [{ type: 'text', text: { content } }];
}

function titleProperty(content = '') {
  return { title: plainToRichText(content) };
}

function richTextProperty(content = '') {
  return { rich_text: plainToRichText(content) };
}

function statusProperty(content = '') {
  return { select: content ? { name: content } : null };
}

function selectProperty(content = '') {
  return { select: content ? { name: content } : null };
}

function dateProperty(content = '') {
  return { date: content ? { start: content } : null };
}

function checkboxProperty(value = false) {
  return { checkbox: Boolean(value) };
}

function numberProperty(value = null) {
  return { number: value ?? null };
}

function peopleProperty() {
  return { people: [] };
}

function chunkText(input = '', size = 1800) {
  const chunks = [];
  let remaining = input.trim();
  while (remaining.length > size) {
    let cut = remaining.lastIndexOf('\n', size);
    if (cut < size * 0.5) cut = remaining.lastIndexOf(' ', size);
    if (cut < size * 0.5) cut = size;
    chunks.push(remaining.slice(0, cut).trim());
    remaining = remaining.slice(cut).trim();
  }
  if (remaining) chunks.push(remaining);
  return chunks;
}

function markdownToBlocks(markdown = '') {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let paragraph = [];
  let bullets = [];

  const flushParagraph = () => {
    const text = paragraph.join(' ').trim();
    if (text) {
      for (const chunk of chunkText(text)) {
        blocks.push({
          object: 'block',
          type: 'paragraph',
          paragraph: { rich_text: plainToRichText(chunk) },
        });
      }
    }
    paragraph = [];
  };

  const flushBullets = () => {
    for (const bullet of bullets) {
      for (const chunk of chunkText(bullet)) {
        blocks.push({
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: { rich_text: plainToRichText(chunk) },
        });
      }
    }
    bullets = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      flushBullets();
      continue;
    }
    if (line.startsWith('- ')) {
      flushParagraph();
      bullets.push(line.slice(2).trim());
      continue;
    }
    if (line.startsWith('### ')) {
      flushParagraph();
      flushBullets();
      blocks.push({ object: 'block', type: 'heading_3', heading_3: { rich_text: plainToRichText(line.slice(4).trim()) } });
      continue;
    }
    if (line.startsWith('## ')) {
      flushParagraph();
      flushBullets();
      blocks.push({ object: 'block', type: 'heading_2', heading_2: { rich_text: plainToRichText(line.slice(3).trim()) } });
      continue;
    }
    if (line.startsWith('# ')) {
      flushParagraph();
      flushBullets();
      blocks.push({ object: 'block', type: 'heading_1', heading_1: { rich_text: plainToRichText(line.slice(2).trim()) } });
      continue;
    }
    paragraph.push(line);
  }

  flushParagraph();
  flushBullets();
  return blocks;
}

function articleProperties(article) {
  return {
    标题: titleProperty(article.title),
    Slug: richTextProperty(article.slug),
    Status: statusProperty(article.status || '草稿'),
    发布日期: dateProperty(article.publishDate || ''),
    分类: selectProperty(article.category || ''),
    摘要: richTextProperty(article.summary || ''),
    作者: peopleProperty(),
    排序权重: numberProperty(article.sortWeight ?? 0),
    是否显示在首页: checkboxProperty(article.showOnHome),
    是否精选: checkboxProperty(article.featured),
    阅读时长: numberProperty(article.readTime ?? null),
    SEO标题: richTextProperty(article.seoTitle || ''),
    SEO描述: richTextProperty(article.seoDescription || ''),
  };
}

async function queryAllPages(token, databaseId) {
  let startCursor;
  const pages = [];
  do {
    const body = { page_size: 100 };
    if (startCursor) body.start_cursor = startCursor;
    const json = await notionFetch(`https://api.notion.com/v1/databases/${databaseId}/query`, token, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    pages.push(...(json.results || []));
    startCursor = json.has_more ? json.next_cursor : null;
  } while (startCursor);
  return pages;
}

function propertyPlainText(property) {
  if (!property) return '';
  if (property.rich_text) return property.rich_text.map((item) => item.plain_text || '').join('').trim();
  if (property.title) return property.title.map((item) => item.plain_text || '').join('').trim();
  return '';
}

function findExistingPage(pages, article) {
  return pages.find((page) => {
    const props = page.properties || {};
    return propertyPlainText(props.Slug) === article.slug || propertyPlainText(props['标题']) === article.title;
  });
}

async function replacePageContent(pageId, token, blocks) {
  const children = await notionFetch(`https://api.notion.com/v1/blocks/${pageId}/children?page_size=100`, token);
  for (const child of children.results || []) {
    await notionFetch(`https://api.notion.com/v1/blocks/${child.id}`, token, { method: 'DELETE' });
  }
  for (let i = 0; i < blocks.length; i += 100) {
    await notionFetch(`https://api.notion.com/v1/blocks/${pageId}/children`, token, {
      method: 'PATCH',
      body: JSON.stringify({ children: blocks.slice(i, i + 100) }),
    });
  }
}

async function createPage(databaseId, token, article) {
  return notionFetch('https://api.notion.com/v1/pages', token, {
    method: 'POST',
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties: articleProperties(article),
      children: markdownToBlocks(article.body || ''),
    }),
  });
}

async function updatePage(pageId, token, article) {
  await notionFetch(`https://api.notion.com/v1/pages/${pageId}`, token, {
    method: 'PATCH',
    body: JSON.stringify({ properties: articleProperties(article) }),
  });
  await replacePageContent(pageId, token, markdownToBlocks(article.body || ''));
}

async function loadArticlesFromDir(dir) {
  const files = (await readdir(dir)).filter((file) => file.endsWith('.json')).sort();
  const articles = [];
  for (const file of files) {
    const fullPath = path.join(dir, file);
    articles.push(JSON.parse(await readFile(fullPath, 'utf8')));
  }
  return articles;
}

export async function upsertArticlesToNotion({ token, databaseId, articles }) {
  const pages = await queryAllPages(token, databaseId);
  const results = [];
  for (const article of articles) {
    const existing = findExistingPage(pages, article);
    if (existing) {
      await updatePage(existing.id, token, article);
      results.push({ action: 'updated', title: article.title, id: existing.id, slug: article.slug });
    } else {
      const created = await createPage(databaseId, token, article);
      results.push({ action: 'created', title: article.title, id: created.id, slug: article.slug });
    }
  }
  return results;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const rootDir = path.resolve(path.dirname(process.argv[1]), '..');
  const draftsDir = process.argv[2]
    ? path.resolve(process.cwd(), process.argv[2])
    : path.join(rootDir, 'content', 'news-drafts');
  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!token || !databaseId) {
    console.error('NOTION_TOKEN or NOTION_DATABASE_ID missing');
    process.exit(1);
  }

  const articles = await loadArticlesFromDir(draftsDir);
  const results = await upsertArticlesToNotion({ token, databaseId, articles });
  console.log(JSON.stringify(results, null, 2));
}
