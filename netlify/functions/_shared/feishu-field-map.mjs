/**
 * feishu-field-map.mjs
 * 前端字段名 → 飞书多维表格字段名映射
 *
 * A1 已实现；其余面板为 scaffold（空对象 = 透传原字段名）
 */

/* A1 — 已验证 */
const MAPS = {
  a1: {
    main: {
      '序号':          '序号',
      'SKU 名称':      'SKU名称',
      '投放平台':      '投放平台',
      '近30天销量':    '近30天销量',
      '广告花费(RMB)': '广告花费RMB',
      '平台ROAS':      '平台ROAS',
      '实际利润(RMB)': '实际利润RMB',
      '毛利率%':       '毛利率',
      '数据状态':      '数据状态'
    }
  },
  // Scaffold — 字段名直接透传，待后续补充具体映射
  a2: { utm: {}, naming: {} },
  a3: { obs: {}, qa: {} },
  a4: { main: {} },
  b2: { base: {}, hooks: {} },
  b3: { sku: {}, script: {} },
  b4: { core: {}, winner: {} },
  b5: { funnel: {}, rules: {} },
  b6: { analysis: {}, seeds: {} }
};

/**
 * 获取字段映射
 * @param {string} panelId
 * @param {string} [subKey] - 不传则取第一个子表
 */
export function getFieldMap(panelId, subKey) {
  const id = panelId?.toLowerCase();
  const panelMaps = MAPS[id];
  if (!panelMaps) return null;
  const key = subKey ?? Object.keys(panelMaps)[0];
  return panelMaps[key] ?? null;
}

/**
 * 将前端 records 按字段映射转换为飞书字段格式
 * 空对象 fieldMap = 透传（scaffold 面板直接用原字段名）
 */
export function applyFieldMap(records, fieldMap) {
  const isPassthrough = Object.keys(fieldMap).length === 0;
  return records.map(record => {
    const out = {};
    for (const [frontKey, val] of Object.entries(record)) {
      if (val === '' || val === null || val === undefined) continue;
      const feishuKey = isPassthrough ? frontKey : (fieldMap[frontKey] ?? frontKey);
      out[feishuKey] = val;
    }
    return out;
  });
}
