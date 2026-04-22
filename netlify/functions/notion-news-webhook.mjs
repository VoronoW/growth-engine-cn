import crypto from 'crypto';

function normalizeId(value) {
  return String(value || '').replace(/-/g, '');
}

function extractRelevantIds(payload) {
  const ids = new Set();

  const push = (value) => {
    const normalized = normalizeId(value);
    if (normalized) ids.add(normalized);
  };

  const visit = (node) => {
    if (!node || typeof node !== 'object') return;

    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }

    for (const [key, value] of Object.entries(node)) {
      if (key === 'id' || key.endsWith('_id')) {
        push(value);
      }
      visit(value);
    }
  };

  visit(payload);
  return ids;
}

function isRelevantToDatabase(payload, databaseId) {
  if (!databaseId) return true;
  const normalizedDatabaseId = normalizeId(databaseId);
  return extractRelevantIds(payload).has(normalizedDatabaseId);
}

function verifySignature(rawBody, signatureHeader, secret) {
  if (!signatureHeader || !secret) return true;
  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signatureHeader, 'utf8'),
      Buffer.from(expected, 'utf8')
    );
  } catch {
    return false;
  }
}

async function triggerBuild(buildHookUrl) {
  const response = await fetch(buildHookUrl, { method: 'POST' });
  const text = await response.text();
  return {
    ok: response.ok,
    status: response.status,
    body: text,
  };
}

export const handler = async (event) => {
  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ok: true,
        message: 'Notion webhook endpoint is online.',
      }),
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const rawBody = event.body || '{}';
  let payload;

  try {
    payload = JSON.parse(rawBody);
  } catch {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    };
  }

  const verificationToken =
    payload?.verification_token ||
    payload?.verificationToken ||
    payload?.verification_code ||
    null;

  if (verificationToken) {
    console.log(`[notion-news-webhook] verification token: ${verificationToken}`);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ok: true,
        verificationToken,
        message:
          'Verification token received. Copy this token into the Notion webhook verification dialog.',
      }),
    };
  }

  const signatureHeader =
    event.headers?.['x-notion-signature'] ||
    event.headers?.['X-Notion-Signature'] ||
    event.headers?.['notion-signature'] ||
    event.headers?.['Notion-Signature'] ||
    '';
  const signingSecret = process.env.NOTION_WEBHOOK_SIGNING_SECRET || '';

  if (!verifySignature(rawBody, signatureHeader, signingSecret)) {
    console.warn('[notion-news-webhook] signature verification failed');
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid webhook signature' }),
    };
  }

  const databaseId = process.env.NOTION_DATABASE_ID || '';
  if (!isRelevantToDatabase(payload, databaseId)) {
    return {
      statusCode: 202,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ok: true,
        skipped: true,
        reason: 'Webhook event not related to the configured news database.',
      }),
    };
  }

  const buildHookUrl = process.env.NETLIFY_BUILD_HOOK_URL || '';
  if (!buildHookUrl) {
    return {
      statusCode: 503,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'NETLIFY_BUILD_HOOK_URL is not configured.',
      }),
    };
  }

  try {
    const result = await triggerBuild(buildHookUrl);
    if (!result.ok) {
      console.error('[notion-news-webhook] build hook failed', result.status, result.body);
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'Netlify build hook failed.',
          status: result.status,
        }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ok: true,
        triggered: true,
        message: 'Netlify rebuild triggered from Notion webhook.',
      }),
    };
  } catch (error) {
    console.error('[notion-news-webhook] trigger error', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Failed to trigger Netlify rebuild.',
      }),
    };
  }
};
