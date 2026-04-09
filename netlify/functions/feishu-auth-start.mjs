/**
 * feishu-auth-start.mjs
 * GET /.netlify/functions/feishu-auth-start
 * → 生成 state → 302 跳转飞书 OAuth 授权页
 */

const FEISHU_APP_ID = process.env.FEISHU_APP_ID;
const REDIRECT_URI = process.env.FEISHU_REDIRECT_URI || 'https://growth-engine-cn.netlify.app/.netlify/functions/feishu-callback';

export const handler = async () => {
  if (!FEISHU_APP_ID) {
    return {
      statusCode: 500,
      body: 'FEISHU_APP_ID not configured',
    };
  }

  const state =
    Math.random().toString(36).substring(2) + Date.now().toString(36);

  const authUrl =
    `https://open.feishu.cn/open-apis/authen/v1/index` +
    `?app_id=${encodeURIComponent(FEISHU_APP_ID)}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&state=${encodeURIComponent(state)}`;

  return {
    statusCode: 302,
    headers: {
      Location: authUrl,
      'Set-Cookie': `feishu_state=${state}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600`,
    },
  };
};
