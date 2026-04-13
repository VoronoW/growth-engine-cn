/**
 * feishu-field-map.mjs
 * 前端字段名 → 飞书多维表格字段名映射
 *
 * 当前 env / table mapping 已全部对齐正式 Feishu 表结构
 */

const MAPS = {
  a1: {
    main: {
      '序号': '序号',
      'SKU 名称': 'SKU 名称',
      '投放平台': '投放平台',
      '近30天销量': '近30天销量',
      '广告花费(RMB)': '广告花费(RMB)',
      '平台ROAS': '平台ROAS',
      '实际利润(RMB)': '实际利润(RMB)',
      '毛利率%': '毛利率%',
      '数据状态': '数据状态'
    }
  },
  a2: {
    utm: {
      '#': '#',
      '原始落地页 URL': '原始落地页 URL',
      'utm_source': 'utm_source',
      'utm_medium': 'utm_medium',
      'utm_campaign': 'utm_campaign',
      'utm_content': 'utm_content',
      '最终投放 URL（自动生成）': '最终投放 URL（自动生成）'
    },
    naming: {
      '层级': '层级',
      '命名格式': '命名格式',
      '客户填写示例': '客户填写示例'
    }
  },
  a3: {
    obs: {
      '日期': '观测日期',
      '平台': '平台',
      'Pixel接收量(A)': 'Pixel接收量',
      'S2S接收量(B)': 'S2S接收量',
      '去重后总量(C)': '去重后总量',
      '真实订单数': '真实订单数',
      '补足率(C/A-1)%': '补足率',
      '备注': '备注'
    },
    qa: {
      '验收项': '验收项',
      '状态': '状态',
      'EMQ分数/备注': 'EMQ分数/备注'
    }
  },
  a4: {
    main: {
      '路径#': '路径#',
      '用户触达路径描述': '用户触达路径描述',
      'Last Click归因': 'Last Click归因',
      'DDA数据驱动归因': 'DDA数据驱动归因',
      'GA4记录': 'GA4记录',
      '偏差值%': '偏差值%',
      '结算口径确认': '结算口径确认'
    }
  },
  b2: {
    base: {
      '维度': '维度',
      '内容填写': '内容填写'
    },
    hooks: {
      '编号': '编号',
      '受众痛点': '受众痛点',
      '文案框架': '文案框架',
      '具体文案示例': '具体文案示例',
      '行动号召(CTA)': '行动号召(CTA)',
      'Hook情绪类型': 'Hook情绪类型'
    }
  },
  b3: {
    sku: {
      'SKU ID': 'SKU ID',
      '产品名称': '产品名称',
      'SKU阵营': 'SKU阵营',
      '毛利率%': '毛利率%',
      '月销量': '月销量',
      '客单价$': '客单价$',
      '核心卖点（1句话）': '核心卖点（1句话）',
      '脚本优先级': '脚本优先级'
    },
    script: {
      '脚本ID': '脚本ID',
      'SKU ID': 'SKU ID',
      '脚本框架': '脚本框架',
      '脚本内容(Hook+展开+CTA)': '脚本内容(Hook+展开+CTA)',
      '目标情绪': '目标情绪',
      '视频时长': '视频时长',
      '制作状态': '制作状态',
      '投测优先级': '投测优先级'
    }
  },
  b4: {
    core: {
      '素材ID': '素材ID',
      '脚本框架': '脚本框架',
      '3s停留率TS%': '三秒停留率',
      '15s完播率Hold%': '完播率',
      '链接CTR%': 'CTR',
      'CVR%': 'CVR',
      'CPM($)': 'CPM',
      'CPC($)': 'CPC',
      '曝光量': '曝光量',
      '结论Action': '结论'
    },
    winner: {
      '维度': '维度',
      '观察记录': '观察记录'
    }
  },
  b5: {
    funnel: {
      '漏斗层级': '漏斗层级',
      '战术目标': '战术目标',
      '受众选择': '受众选择',
      '素材应用': '素材应用',
      '预算占比%': '预算占比%',
      '日预算(RMB)': '日预算(RMB)',
      '核心监控指标': '核心监控指标'
    },
    rules: {
      '规则类型': '规则类型',
      '触发条件': '触发条件',
      '执行动作': '执行动作',
      '适用账户': '适用账户'
    }
  },
  b6: {
    analysis: {
      '分析维度': '分析维度',
      '核心特征': '核心特征',
      '占比%': '占比',
      '投放建议': '投放建议'
    },
    seeds: {
      '标签包': '标签包',
      '用户定义': '用户定义',
      '数量（人）': '用户数量',
      '导入状态': '导入状态'
    }
  }
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
