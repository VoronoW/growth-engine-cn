/**
 * feishu-session.mjs
 * GET /.netlify/functions/feishu-session
 * → 返回当前登录状态与用户信息
 */

import { getSessionFromEvent, jsonResponse } from './_shared/feishu-utils.mjs';

export const handler = async (event) => {
  // OPTIONS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' }, body: '' };
  }

  const session = getSessionFromEvent(event);
  if (!session?.user) {
    return jsonResponse(200, { loggedIn: false });
  }

  return jsonResponse(200, {
    loggedIn: true,
    user: {
      name:   session.user.name,
      email:  session.user.email,
      avatar: session.user.avatar
    }
  });
};
