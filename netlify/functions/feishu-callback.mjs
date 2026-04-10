import crypto from 'crypto';

const FEISHU_APP_ID = process.env.FEISHU_APP_ID;
const FEISHU_APP_SECRET = process.env.FEISHU_APP_SECRET;
const SESSION_SECRET =
  process.env.FEISHU_SESSION_SECRET ||
  process.env.SESSION_SECRET ||
  'growth-engine-default-secret';

function parseCookies(cookieHeader) {
  const result = {};
  if (!cookieHeader) return result;
  for (const pair of cookieHeader.split(';')) {
    const idx = pair.indexOf('=');
    if (idx < 0) continue;
    const key = pair.slice(0, idx).trim();
    const val = pair.slice(idx + 1).trim();
    if (key) result[key] = val;
  }
  return result;
}

function createSession(user) {
  const payload = JSON.stringify({
    user,
    exp: Date.now() + 24 * 60 * 60 * 1000,
  });
  const encoded = Buffer.from(payload, 'utf8').toString('base64url');
  const sig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(encoded)
    .digest('base64url');
  return `${encoded}.${sig}`;
}

export const handler = async (event) => {
  const params = event.queryStringParameters || {};
  const { code, state } = params;

  const cookies = parseCookies(
    event.headers?.cookie || event.headers?.Cookie || ''
  );
  const savedState = cookies.feishu_state;

  const clearStateCookie = 'feishu_state=; Path=/; HttpOnly; Max-Age=0';

  if (!code) {
    return {
      statusCode: 302,
      headers: { Location: '/growth-forms.html?error=no_code' },
      multiValueHeaders: { 'Set-Cookie': [clearStateCookie] },
    };
  }

  if (!state || !savedState || state !== savedState) {
    return {
      statusCode: 302,
      headers: { Location: '/growth-forms.html?error=state_mismatch' },
      multiValueHeaders: { 'Set-Cookie': [clearStateCookie] },
    };
  }

  try {
    // 1. Get app_access_token
    const appTokenRes = await fetch(
      'https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          app_id: FEISHU_APP_ID,
          app_secret: FEISHU_APP_SECRET,
        }),
      }
    );
    const appTokenData = await appTokenRes.json();
    const appAccessToken = appTokenData.app_access_token;

    if (!appAccessToken) {
      console.error('app_access_token error:', JSON.stringify(appTokenData));
      return {
        statusCode: 302,
        headers: { Location: '/growth-forms.html?error=app_token_failed' },
        multiValueHeaders: { 'Set-Cookie': [clearStateCookie] },
      };
    }

    // 2. Exchange code for user_access_token
    const userTokenRes = await fetch(
      'https://open.feishu.cn/open-apis/authen/v1/oidc/access_token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${appAccessToken}`,
        },
        body: JSON.stringify({ grant_type: 'authorization_code', code }),
      }
    );
    const userTokenData = await userTokenRes.json();
    const userAccessToken = userTokenData.data?.access_token;

    if (!userAccessToken) {
      console.error('user_access_token error:', JSON.stringify(userTokenData));
      return {
        statusCode: 302,
        headers: { Location: '/growth-forms.html?error=user_token_failed' },
        multiValueHeaders: { 'Set-Cookie': [clearStateCookie] },
      };
    }

    // 3. Get user info
    const userInfoRes = await fetch(
      'https://open.feishu.cn/open-apis/authen/v1/user_info',
      { headers: { Authorization: `Bearer ${userAccessToken}` } }
    );
    const userInfoData = await userInfoRes.json();
    const user = {
      name: userInfoData.data?.name || userInfoData.data?.en_name || 'User',
      openId: userInfoData.data?.open_id || '',
      avatar: userInfoData.data?.avatar_url || '',
    };

    const sessionValue = createSession(user);

    return {
      statusCode: 302,
      headers: { Location: '/growth-forms.html' },
      multiValueHeaders: {
        'Set-Cookie': [
          `feishu_session=${sessionValue}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`,
          clearStateCookie,
        ],
      },
    };
  } catch (err) {
    console.error('Callback error:', err);
    return {
      statusCode: 302,
      headers: { Location: '/growth-forms.html?error=callback_error' },
      multiValueHeaders: { 'Set-Cookie': [clearStateCookie] },
    };
  }
};
