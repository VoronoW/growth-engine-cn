/**
 * feishu-table-map.mjs
 * panelId + subTableKey → 飞书多维表格 table_id 映射
 *
 * 所有 table_id 从 Netlify 环境变量读取，严禁写死
 *
 *   A3:  FEISHU_TABLE_A3_OBS, FEISHU_TABLE_A3_QA
 *   B4:  FEISHU_TABLE_B4_CORE, FEISHU_TABLE_B4_WINNER
 *   B5:  FEISHU_TABLE_B5_RULES
 *   B6:  FEISHU_TABLE_B6_ANALYSIS, FEISHU_TABLE_B6_SEEDS
 */

/* ─────────────────────────────────────────────
   子表映射：panelId → { subKey: envVarName }
   ───────────────────────────────────────────── */
const SUB_TABLE_MAP = {
  a3: {
    obs: 'FEISHU_TABLE_A3_OBS',
    qa:  'FEISHU_TABLE_A3_QA'
  },
  b4: {
    core:   'FEISHU_TABLE_B4_CORE',
    winner: 'FEISHU_TABLE_B4_WINNER'
  },
  b5: {
    rules:  'FEISHU_TABLE_B5_RULES'
  },
  b6: {
    analysis: 'FEISHU_TABLE_B6_ANALYSIS',
    seeds:    'FEISHU_TABLE_B6_SEEDS'
  }
};

/**
 * 获取单个子表的 table_id
 * @param {string} panelId  - 面板 ID，例如 'a1'
 * @param {string} subKey   - 子表 key，例如 'main'、'utm'，不传则取第一个
 */
export function getTableId(panelId, subKey) {
  const id = panelId?.toLowerCase();
  const subMap = SUB_TABLE_MAP[id];

  if (!subMap) throw new Error(`未知面板 ID: ${panelId}`);

  const key = subKey ?? Object.keys(subMap)[0];
  const envVar = subMap[key];
  if (!envVar) throw new Error(`面板 ${id.toUpperCase()} 没有子表 "${key}"`);

  const tableId = process.env[envVar];
  if (!tableId) throw new Error(`环境变量 ${envVar} 未配置，请在 Netlify 控制台中设置`);

  return tableId;
}

/**
 * 获取面板下所有子表的 table_id 映射
 * @returns { [subKey]: tableId }
 */
export function getAllTableIds(panelId) {
  const id = panelId?.toLowerCase();
  const subMap = SUB_TABLE_MAP[id];
  if (!subMap) throw new Error(`未知面板 ID: ${panelId}`);

  const result = {};
  for (const [key, envVar] of Object.entries(subMap)) {
    const val = process.env[envVar];
    if (val) result[key] = val;
  }
  if (Object.keys(result).length === 0) {
    throw new Error(`面板 ${id.toUpperCase()} 的所有子表均未配置环境变量`);
  }
  return result;
}

/* 面板中文名 */
export const PANEL_NAMES = {
  a3: 'A3 Pixel vs S2S 对比',
  b4: 'B4 素材沙盒测试',
  b5: 'B5 止损护航规则',
  b6: 'B6 用户画像标签包'
};
