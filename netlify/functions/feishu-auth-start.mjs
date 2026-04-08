/**
 * feishu-auth-start.mjs
 * GET /.netlify/functions/feishu-auth-start
 * → 生成 state → 302 跳转飞书 OAuth 授权页
 */

import { generateState, makeStateCookie, redirectResponse } from './_shared/feishu-utils.mjs';

export const handler = async () => {
  const appId       = process.env.FEISHU_APP_ID;
  const redirectUri = process.env.FEISHU_REDIRECT_URI;

  if (!appId || !redirectUri) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      body: `<h2>配置错误</h2><p>请在 Netlify 控制台设置 FEISHU_APP_ID 和 FEISHU_REDIRECT_URI 环境变量。</p>`
    };
  }

  const state = generateState();
  const authUrl = new URL('https://open.feishu.cn/open-apis/authen/v1/authorize');
  authUrl.searchParams.set('app_id', appId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', 'contact:user.base:readonly');
  authUrl.searchParams.set('state', state);

  return redirectResponse(authUrl.toString(), {
    'Set-Cookie': makeStateCookie(state)
  });
};
