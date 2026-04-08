/**
 * feishu-callback.mjs
 * GET /.netlify/functions/feishu-callback?code=xxx&state=xxx
 * → 验证 state → 换 user_access_token → 获取用户信息 → 写 session → 302 回首页
 */

import {
  getAppAccessToken,
  parseCookies,
  makeSessionCookie,
  redirectResponse
} from './_shared/feishu-utils.mjs';

export const handler = async (event) => {
  const { code, state } = event.queryStringParameters || {};
  const cookies = parseCookies(event.headers?.cookie || event.headers?.Cookie || '');
  const savedState = cookies['feishu_oauth_state'];

  // State 校验
  if (!state || state !== savedState) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      body: `<h2>登录失败</h2><p>OAuth state 不匹配，请重新登录。</p><a href="/growth-forms.html">返回</a>`
    };
  }

  if (!code) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      body: `<h2>登录取消</h2><p>未获取到授权码。</p><a href="/growth-forms.html">返回</a>`
    };
  }

  try {
    const appToken = await getAppAccessToken();

    // 用 code 换 user_access_token
    const tokenRes = await fetch('https://open.feishu.cn/open-apis/authen/v1/oidc/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${appToken}`
      },
      body: JSON.stringify({ grant_type: 'authorization_code', code })
    });
    const tokenData = await tokenRes.json();
    if (tokenData.code !== 0) throw new Error(`换 token 失败: ${tokenData.msg}`);

    const userAccessToken = tokenData.data?.access_token;

    // 获取用户信息
    const userRes = await fetch('https://open.feishu.cn/open-apis/authen/v1/user_info', {
      headers: { 'Authorization': `Bearer ${userAccessToken}` }
    });
    const userData = await userRes.json();
    if (userData.code !== 0) throw new Error(`获取用户信息失败: ${userData.msg}`);

    const user = {
      openId:  userData.data?.open_id,
      unionId: userData.data?.union_id,
      name:    userData.data?.name,
      avatar:  userData.data?.avatar_url,
      email:   userData.data?.enterprise_email || userData.data?.email
    };

    // 写 session cookie，清除 state cookie
    const sessionCookie = makeSessionCookie({ user, loginAt: Date.now() });
    const clearState    = 'feishu_oauth_state=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0';

    return redirectResponse('/growth-forms.html', {
      'Set-Cookie': [sessionCookie, clearState]
    });

  } catch (err) {
    console.error('[feishu-callback]', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      body: `<h2>登录失败</h2><p>${err.message}</p><a href="/growth-forms.html">返回</a>`
    };
  }
};
