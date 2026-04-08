/**
 * feishu-table-map.mjs
 * panelId + subTableKey → 飞书多维表格 table_id 映射
 *
 * 所有 table_id 从 Netlify 环境变量读取，严禁写死
 *
 * 完整 env var 清单（已在 Netlify 配置）：
 *   A1:  FEISHU_TABLE_A1
 *   A2:  FEISHU_TABLE_A2_UTM, FEISHU_TABLE_A2_NAMING
 *   A3:  FEISHU_TABLE_A3_OBS, FEISHU_TABLE_A3_QA
 *   A4:  FEISHU_TABLE_A4
 *   B2:  FEISHU_TABLE_B2_BASE, FEISHU_TABLE_B2_HOOKS
 *   B3:  FEISHU_TABLE_B3_SKU, FEISHU_TABLE_B3_SCRIPT
 *   B4:  FEISHU_TABLE_B4_CORE, FEISHU_TABLE_B4_WINNER
 *   B5:  FEISHU_TABLE_B5_FUNNEL, FEISHU_TABLE_B5_RULES
 *   B6:  FEISHU_TABLE_B6_ANALYSIS, FEISHU_TABLE_B6_SEEDS
 */

/* ─────────────────────────────────────────────
   子表映射：panelId → { subKey: envVarName }
   ───────────────────────────────────────────── */
const SUB_TABLE_MAP = {
  a1: {
    main: 'FEISHU_TABLE_A1'
  },
  a2: {
    utm:    'FEISHU_TABLE_A2_UTM',
    naming: 'FEISHU_TABLE_A2_NAMING'
  },
  a3: {
    obs: 'FEISHU_TABLE_A3_OBS',
    qa:  'FEISHU_TABLE_A3_QA'
  },
  a4: {
    main: 'FEISHU_TABLE_A4'
  },
  b2: {
    base:  'FEISHU_TABLE_B2_BASE',
    hooks: 'FEISHU_TABLE_B2_HOOKS'
  },
  b3: {
    sku:    'FEISHU_TABLE_B3_SKU',
    script: 'FEISHU_TABLE_B3_SCRIPT'
  },
  b4: {
    core:   'FEISHU_TABLE_B4_CORE',
    winner: 'FEISHU_TABLE_B4_WINNER'
  },
  b5: {
    funnel: 'FEISHU_TABLE_B5_FUNNEL',
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
  a1: 'A1 多平台数据清洗报告',
  a2: 'A2 UTM标签体系',
  a3: 'A3 Pixel vs S2S 对比',
  a4: 'A4 归因沙盘演习',
  b2: 'B2 品牌文案矩阵',
  b3: 'B3 SKU脚本矩阵',
  b4: 'B4 素材沙盒测试',
  b5: 'B5 投放策略矩阵',
  b6: 'B6 用户画像标签包'
};
