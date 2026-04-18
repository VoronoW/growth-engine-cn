# ZAPEX 网站 v2 改版 · 完整接手文档

**峥锐 ZAPEX · 品牌出海加速器**
核心定位：*不是代运营，是增长系统重构*
本文档版本：v2.0 · 编制日期：2026-04-19

---

## 目录

1. [项目背景与改版动机](#一项目背景与改版动机)
2. [设计语言与参照标杆](#二设计语言与参照标杆)
3. [设计 Token 总览](#三设计-token-总览)
4. [组件系统全景](#四组件系统全景)
5. [页面清单与结构](#五页面清单与结构)
6. [文件组织与命名规则](#六文件组织与命名规则)
7. [导航系统](#七导航系统)
8. [页脚系统](#八页脚系统)
9. [后端集成：Netlify + 飞书](#九后端集成netlify--飞书)
10. [资产管理](#十资产管理)
11. [构建与分发流程](#十一构建与分发流程)
12. [本地预览与开发](#十二本地预览与开发)
13. [修改历史 · 关键决策](#十三修改历史--关键决策)
14. [已知问题与待办](#十四已知问题与待办)
15. [参考文档索引](#十五参考文档索引)
16. [常用脚本速查](#十六常用脚本速查)

---

## 一、项目背景与改版动机

### 1.1 产品定位

ZAPEX 是一家面向跨境出海品牌的**增长系统重构服务商**。与传统代运营公司的本质区别：

- 不是接单执行，而是为客户搭建**可验证、可复制、可沉淀**的品牌增长系统
- 交付物不是报告或建议，而是 SOP、模板、中台工具、操盘纪律
- 客户决策层：跨境大卖家 CEO / 品牌负责人 / 增长负责人

### 1.2 旧版问题

旧版（`homepage-overview.html` / `system-and-modules.html` / `delivery-and-cases.html` / `assessment.html`）问题：

- 视觉风格偏传统 SaaS，难以传达"顾问级判断"
- 字体层级不够克制，过多色彩和装饰削弱了战略感
- 页面节奏缺乏轻重缓急，无法支撑"每个 section 回答一个高管问题"的叙事
- 与 McKinsey/BCG/Stripe/Linear/Snowflake 等对标标杆相比显得业余

### 1.3 v2 改版目标

做一套同时满足以下三者的设计系统：

| 维度 | 对标 | 吸收点 |
|------|------|--------|
| 咨询公司感 | McKinsey, BCG, Bain | 编号 section、声明式标题、克制色彩 |
| 科技公司感 | Stripe, Linear, Vercel | 大字号 hero、monospace 标签、hairline 线条 |
| 数据系统感 | Snowflake, Palantir | 模块化组件、矩阵化数据展示、操作层语言 |

最终三个词形容：**Editorial + Technical + Data-Forward**。

---

## 二、设计语言与参照标杆

### 2.1 视觉原则（按优先级）

1. **Calm authority** > loud persuasion — 安静权威，不靠感叹号说服
2. **System clarity** > decorative flourish — 系统清晰，不靠装饰
3. **Modular decision surfaces** > marketing sections — 模块像决策面板，不像营销板块
4. **Conversion awareness** without salesy urgency — 转化有感但不催单
5. **Premium finish** without luxury theatrics — 精致但不奢华做作

### 2.2 三种文字角色（不多不少）

- **Strategic headline** — Manrope display，大字号，声明式
- **Explanatory body** — Inter，中密度，权威但不压抑
- **Operational label** — JetBrains Mono，小号，全大写，`letter-spacing: 0.14em`

### 2.3 语气守则

- 不用感叹号
- 不用营销套话（"打造""赋能""一站式"等）
- 不堆叠价值主张（每个 section 一个主张）
- 用"运营层"动词（定方向 / 建体系 / 落执行 / 验证 / 放大 / 复制）

### 2.4 视觉标志物（一眼可认）

- 编号 `00`–`06` 出现在每个 section 顶部（monospace）
- 180px 宽的固定左栏放置 meta 标签
- hairline 1px 分隔线（`--line` 或 `--line-dark`）替代 shadow
- `em` 标签被重写为品牌蓝色强调字（`.hero-display em`）
- ZAPEX wordmark 固定使用双色结构：Z 为品牌蓝粗体、APEX 为 40% 白

---

## 三、设计 Token 总览

**核心文件**：`zapex-system.css`（1065 行，全部 token 在 `:root` 块中，约 15–90 行）

### 3.1 颜色

```css
/* 品牌蓝 */
--brand:        #1a4fff   /* 主品牌，CTA / 强调 */
--brand-deep:   #0f3ab8   /* hover / pressed */
--brand-hover:  #3d6bff   /* 深底上的强调字色 */
--brand-soft:   #e5ebff   /* 浅色底块 */
--brand-tint:   rgba(26, 79, 255, 0.08)  /* hover 底色 */

/* 深底色家族 */
--slate-0: #05080f   --slate: #0b1120   --slate-1: #111827
--slate-2: #1a2332   --slate-3: #2a3445

/* 浅底色家族 */
--paper-0: #ffffff   --paper: #fbf9f8   --paper-1: #f5f3f2
--paper-2: #efedec   --paper-3: #e4e2e1

/* 文字色（on-light） */
--ink: #0a0f1a   --ink-80 / 60 / 40 / 20  (rgba)

/* 文字色（on-dark） */
--od: #ffffff    --od-80 / 60 / 40 / 20   (rgba)

/* 分隔线 */
--line / --line-soft           (on-light)
--line-dark / --line-dark-soft (on-dark)
```

### 3.2 字体家族

```css
--ff-display: 'Manrope', -apple-system, 'PingFang SC', sans-serif
--ff-body:    'Inter',   -apple-system, 'PingFang SC', sans-serif
--ff-mono:    'JetBrains Mono', ui-monospace, monospace
```

Google Fonts 通过 CSS 顶部 `@import` 引入，不依赖 HTML `<link>`。

### 3.3 字号梯度（9 档）

```
--t-mono  11px   mono meta label
--t-xs    12px   kicker
--t-sm    13px   small body
--t-base  15px   body 默认
--t-lead  17px   lead paragraph
--t-md    20px   h4
--t-lg    26px   h3
--t-xl    36px   h2
--t-2xl   56px   section display
--t-3xl   84px   hero display
--t-4xl   clamp(72, 10vw, 132)px   mega wordmark（footer）
```

### 3.4 间距（4px 基准，12 档）

```
s-1=4  s-2=8  s-3=12  s-4=16  s-5=24  s-6=32
s-7=48 s-8=64 s-9=96 s-10=128 s-11=180 s-12=220
```

### 3.5 圆角 / 布局 / 动效

```css
--r-sm 2 / --r-md 4 / --r-lg 6 / --r-xl 10
--max 1280 / --max-wide 1440 / --gutter 40
--ease cubic-bezier(.2,0,0,1) / --dur-fast 120 / --dur 200 / --dur-slow 400
```

---

## 四、组件系统全景

`zapex-system.css` 包含 190+ 个选择器，按职能分为 8 组：

### 4.1 骨架与布局

| 类名 | 作用 |
|------|------|
| `.shell` | 主内容容器，max-width: 1280px，padding 40px |
| `.shell--wide` | 宽容器，max-width: 1440px |

### 4.2 顶部元素

| 类名 | 作用 |
|------|------|
| `.meta-bar` | 页面顶部 mono 状态条（VERSION · DATE · LOCALE 等） |
| `.meta-bar-item` | 条内单元，支持 `.dot` 品牌色点 |
| `.site-nav` | 主导航 sticky 容器 |
| `.site-nav-inner` | 导航内部 flex 布局 |
| `.site-nav-left / right` | 左右两块 |
| `.site-nav-links` | 文字链接组（带编号前缀） |
| `.site-nav-link` | 单个链接，支持 `.is-current` 高亮 |
| `.site-nav-link .idx` | 编号前缀（`01 / 02 / 03`） |

### 4.3 Wordmark（品牌字标）

| 类名 | 作用 |
|------|------|
| `.wordmark` | 完整版：`Z` + `APEX`（带字距、粗细、色差） |
| `.wordmark--nav` | 22px 导航用 |
| `.wordmark--foot` | 20px 页脚用 |
| `.wordmark--mega` | clamp(6rem, 18vw, 16rem) 页脚巨型 |
| `.wordmark.on-dark` | 深色背景变体（APEX 用 `--od-40`） |
| `.zapex-word` | 行内紧凑版：标题内嵌 ZAPEX 时使用 |

### 4.4 按钮与药丸

| 类名 | 作用 |
|------|------|
| `.pill` | 基础药丸按钮（导航用） |
| `.pill--primary` | 品牌蓝填充药丸 |
| `.pill--stacked` | 双行药丸（主标签 + mono 副标签） |
| `.btn` | 基础按钮 + `.arrow` 箭头 hover 平移 |
| `.btn--primary` | 品牌蓝填充 |
| `.btn--solid-ink` | 深墨填充 |
| `.btn--outline` | 描边按钮 |
| `.btn--ghost-dark` | 深底透明按钮 |

### 4.5 Section 骨架

| 类名 | 作用 |
|------|------|
| `.section` | 通用 section 容器，默认 `padding: var(--s-10) 0` |
| `.section--paper / paper-1 / paper-2` | 浅底三档 |
| `.section--dark` | 深底，自动切换 `.section-idx/-kicker/-lead/.hr-line` 色 |
| `.section--brand` | 品牌蓝填充 section |
| `.section--compact` | 紧凑变体（`--s-9 0`） |
| `.section-head` | 180px / 1fr 双栏 section 标头 |
| `.section-idx` | mono 编号（`00 / 01 / 02`） |
| `.section-kicker` | 小标签（`BRAND · CHAPTER 01` 风格） |
| `.section-title` | h2 主标题，使用 Manrope |
| `.section-lead` | lead 正文段 |

### 4.6 Hero

| 类名 | 作用 |
|------|------|
| `.hero` / `.hero--dark` | 首屏容器（浅/深） |
| `.hero-grid` | 双栏布局（标签区 + 主内容区） |
| `.hero-idx / .hero-kicker` | 编号 + 标签 |
| `.hero-display` | 84px 巨型标题，`em` 标签品牌蓝强调 |
| `.hero-body / .hero-lead` | 正文段落 |
| `.hero-actions` | CTA 按钮组 |
| `.hero::before` | 背景装饰伪元素（可用于 grain / gradient） |

### 4.7 数据展示组件

| 类名 | 作用 |
|------|------|
| `.matrix` / `.matrix-cell` | 矩阵化数据格（hover 品牌蓝淡底） |
| `.matrix-idx / -title / -body / -head` | 矩阵内部层次 |
| `.method` / `.method-step` | 步骤流程（编号 + 标题 + body） |
| `.method-num / -title / -body` | 步骤内部 |
| `.metrics-xl / .metric-xl-value` | 大号指标数字块 |
| `.feature-grid / .feature` | 特性卡片 |
| `.case-row / .case-list` | 案例列表 |
| `.quote-block / .quote-text` | 引言块（带 mono 引号角标） |
| `.ticker / .ticker-track` | 横向滚动跑马灯 |

### 4.8 CTA 与页脚

| 类名 | 作用 |
|------|------|
| `.cta-band` | 大型 CTA 条幅（通常 section 末尾） |
| `.cta-band-title / -grid / -actions / -note` | 内部结构 |
| `.site-foot` | 深底页脚容器 |
| `.foot-top` | 页脚顶部大声明（当前已从 homepage 移除） |
| `.foot-columns / .foot-col` | 四列导航 |
| `.foot-col-head` | 列标题（mono） |
| `.foot-qr / .foot-qr-row` | QR 码块 |
| `.foot-meta / .foot-meta-left / -right` | 版权 + 备案等 meta |
| `.foot-signature` | 签名行 |
| `.foot-statement` | 大声明段 |
| `.foot-actions` | 底部 CTA 组 |

### 4.9 辅助类

| 类名 | 作用 |
|------|------|
| `.mono` | 强制 JetBrains Mono |
| `.muted` | 透明 60% |
| `.accent` | 品牌色强调 |
| `.hr-line` | 1px 分隔线 |
| `.hidden-sm` | 小屏隐藏 |

---

## 五、页面清单与结构

### 5.1 v2 正式页面（上线用）

| 文件 | 页面 | 行数 | Section 数 |
|------|------|------|-----------|
| `homepage-v2.html` | 品牌首页 | 持续演进 | 1 hero + 6 section + CTA |
| `system-and-modules-v2.html` | 系统与模块 | 持续演进 | 1 hero + 5 section + CTA |
| `delivery-and-cases-v2.html` | 交付与案例 | 持续演进 | 1 hero + 5 section + CTA |
| `assessment-v2.html` | 品牌诊断评估 | 持续演进 | 1 hero + 6 区块表单 |
| `privacy.html` | 隐私政策 | 新增 | 1 hero + 4 section |
| `terms.html` | 使用条款 | 新增 | 1 hero + 4 section |

### 5.2 Homepage 结构（6 section）

| # | Section 标题 | 主要组件 |
|---|-------------|----------|
| 00 | Hero：我们交付的是 / 可验证 复制 沉淀的 / **品牌增长系统** | `.hero-display` + `.pill` |
| 01 | 峥锐 ZAPEX / 品牌出海加速器 | `.section--paper` + 品牌简介 |
| 02 | 90% 的跨境大卖家 / 为什么做不出品牌？ | `.section--paper-1` + 问题列表 |
| 03 | 品牌战略 + 增长引擎 / 两大模块构成完整交付 | `.section--dark` + `.matrix` |
| 04 | 先诊断 / 再决定是否进入系统合作 | `.section--paper` + `.method` |
| 05 | [ 数据看板 / 等内容补充 ] | `.section--dark` + `.metrics-xl`（占位） |
| 06 | 信任标志 / 合作品牌 | `.section--paper-2` + `.ticker` |
| -- | CTA 条幅 + 页脚 | `.cta-band` + `.site-foot` |

### 5.3 System & Modules 结构（5 section）

```
Hero: 两大模块定义 ZAPEX 的交付结构
01 · 品牌战略 + 增长引擎 / 两大模块构成完整交付  [dark]
02 · 定方向 · 建体系 · 落执行（品牌战略模块详述）  [paper]
03 · 验证 · 放大 · 复制（增长引擎模块详述）       [paper-1]
04 · 完整的品牌中台 / 工具体系                     [dark]
05 · 10 套 SOP · 30+ 模板 / 团队拿着就能用         [paper]
-- CTA + 页脚
```

### 5.4 Delivery & Cases 结构（5 section）

```
Hero: 不是一份报告 / 是搭建品牌增长的 / 完整结构
01 · 7 项具名交付 / 不是方法建议 / 是系统资产        [paper]
02 · 三大品牌中台 / 让企业不再依赖外部                [dark]
03 · 先诊断 / 再决定是否进入系统合作                   [paper-1]
04 · 我们和其他公司的 / 本质区别（VS 对比矩阵）       [paper]
05 · 双模块双负责人 / 品牌 + 增长并行操盘（团队）     [paper-1]
-- CTA + 页脚
```

### 5.5 Assessment 结构

```
Hero: 增长系统评估 / 先判断，再行动
顶部横幅（重申判断逻辑）
双栏布局：
  左栏 280px —— 评估步骤导引（.assess-rail-list）
  右栏 1fr   —— 表单本体（.assess-form，2px 品牌色顶线）
表单区块：
  生意基本面
  增长结构
  产品与竞争
  品牌资产
  痛点与意愿
  联系方式
关键字段：
  月销售额 / 综合净利润率 / SKU数量 / Top 3 SKU销售占比
  主要销售平台 / 当前增长主要来源 / 广告费用占销售额比例
  老客户复购情况 / 产品相对竞品的最大差别 / 品牌化投入意愿
  姓名 / 微信/WhatsApp / 邮箱 / 方便联系时间段
提交：POST /.netlify/functions/feishu-assessment
```

### 5.6 历史版本归档（保留作为对照 / 备份）

- `archive/v1/index.html` — 旧版归档入口
- `archive/v1/homepage-overview.html` — 品牌首页旧版
- `archive/v1/system-and-modules.html` — 系统与模块旧版
- `archive/v1/delivery-and-cases.html` — 交付与案例旧版
- `archive/v1/assessment.html` — 评估表旧版
- `archive/v1/contact-and-cta.html` — 旧版 CTA 页
- `archive/v1/growth-forms.html` — 保留旧版客户工作台入口链接

### 5.7 不动的功能页（当前线上继续沿用）

- `growth-forms.html` — 客户工作台（飞书 Embed，功能页，**不迁移**）

---

## 六、文件组织与命名规则

### 6.1 目录结构

```
growth-engine-cn-main/
├── HANDOVER.md                          ← 本文档
├── README.md / AGENTS.md / DESIGN.md / STYLE-NOTES.md / COMPONENT-RULES.md
├── CODEX-HANDOFF.md                     ← 前一版接手文档（已过时）
├── feishu-tables-spec.md                ← 飞书字段规范
│
├── zapex-system.css                     ← 核心设计系统（1065 行）
├── zapex-system-mobile.css              ← 移动端补丁
├── styles.css / preview-pages.css       ← 旧版样式（保留）
│
├── homepage-v2.html                     ← v2 源文件（外链 CSS）
├── homepage-v2-standalone.html          ← 打包版（内联 CSS）
├── system-and-modules-v2.html
├── system-and-modules-v2-standalone.html
├── delivery-and-cases-v2.html
├── delivery-and-cases-v2-standalone.html
├── assessment-v2.html
├── assessment-v2-standalone.html
├── privacy.html                         ← 新版 Privacy 页面
├── terms.html                           ← 新版 Terms 页面
├── v2-preview.html                      ← 4 页 iframe 聚合预览
│
├── archive/
│   └── v1/
│       ├── index.html                   ← 旧版归档入口
│       ├── homepage-overview.html
│       ├── system-and-modules.html
│       ├── delivery-and-cases.html
│       ├── assessment.html
│       ├── contact-and-cta.html
│       ├── growth-forms.html
│       ├── preview-pages.css
│       └── assets/
│
├── logo-guidebook.html                  ← Logo 规范手册（独立）
├── design-manual.html                   ← 设计系统可视化
├── template-v2.html / template-v2-mobile.html  ← 空白模板
├── homepage-preview-*.html              ← 历史预览版（保留作为迭代记录）
│
├── assets/
│   ├── qr-wechat.png                    ← 原始微信二维码（含文字）
│   └── qr-wechat-crop.png               ← 裁剪版（纯码，v2 引用）
│
├── netlify/
│   ├── functions/
│   │   ├── _shared/feishu-utils.mjs
│   │   ├── feishu-assessment.mjs        ← 评估表提交（公开）
│   │   ├── feishu-auth-start.mjs        ← 客户工作台登录
│   │   ├── feishu-callback.mjs
│   │   ├── feishu-session.mjs
│   │   └── feishu-submit.mjs
│   └── state.json
├── netlify.toml
│
├── growth-forms.html                    ← 客户工作台（不迁移）
├── assessment.html / homepage-overview.html    ← 根目录旧版源文件（保留）
├── system-and-modules.html / delivery-and-cases.html
├── contact-and-cta.html / button-reference.html
├── index.html                           ← 当前线上入口，重定向到 homepage-v2.html
└── scripts/build-static-site.mjs        ← 静态站打包脚本
```

### 6.2 命名规则

| 后缀 / 前缀 | 含义 |
|-------------|------|
| `*-v2.html` | 新版源文件（外链 `./zapex-system.css`） |
| `*-v2-standalone.html` | 打包版（CSS 已内联，可独立分发） |
| `*-preview*.html` | 历史预览迭代（保留作为参考） |
| `homepage-preview-claude-v2.html` | Claude 设计迭代的另一个方向版本 |
| `template-v2.html` | 空白骨架，用于新建页面 |

### 6.3 Standalone 与源文件的关系

**唯一差别**：
```diff
- <link rel="stylesheet" href="./zapex-system.css" />
+ <style>… 完整 1065 行 CSS 内联 …</style>
```

源文件用于开发（改 CSS 即时反映 4 个页面），standalone 用于分发（单文件可截图、可发邮件、可直接交付）。

**铁律**：standalone **永远不手动编辑**，每次改 source 或 CSS 后用脚本重新生成（见第十一节）。

---

## 七、导航系统

### 7.1 当前导航结构（所有 v2 页面一致）

```html
<header class="site-nav">
  <div class="shell site-nav-inner">
    <div class="site-nav-left">
      <a class="wordmark wordmark--nav on-dark" href="./homepage-v2.html">
        <span class="z">Z</span><span class="apex">APEX</span>
      </a>
    </div>
    <nav class="site-nav-links">
      <a class="site-nav-link" href="./homepage-v2.html">
        <span class="idx">01</span>品牌首页
      </a>
      <a class="site-nav-link" href="./system-and-modules-v2.html">
        <span class="idx">02</span>系统与模块
      </a>
      <a class="site-nav-link" href="./delivery-and-cases-v2.html">
        <span class="idx">03</span>交付与案例
      </a>
      <a class="site-nav-link" href="./assessment-v2.html">
        <span class="idx">04</span>品牌诊断
      </a>
    </nav>
    <div class="site-nav-right">
      <a class="pill pill--stacked" href="./growth-forms.html" target="_blank">
        <span class="pill-stack">
          <span class="pill-main">客户工作台</span>
          <span class="pill-sub">飞书入口</span>
        </span>
      </a>
    </div>
  </div>
</header>
```

### 7.2 关键规则

- 当前页面链接加 `.is-current` 类，底部 2px 品牌蓝线
- 客户工作台按钮用 `.pill--stacked`，主标签 13px / 副标签 9px mono
- 导航高度 56px，sticky，深色背景 `var(--slate)`
- 链接编号前缀用 mono 字体，低对比度

---

## 八、页脚系统

### 8.1 当前页脚结构

```
site-foot (深底 --slate)
  ├── 联系区块（QR + 地址 + 邮箱）
  ├── 四列导航
  │     ├── 产品（首页 / 系统 / 交付 / 诊断）
  │     ├── 关于
  │     ├── 联系
  │     └── 合规
  ├── foot-meta（版权 + 备案 + mono 时间戳）
  └── 巨型 wordmark（`.wordmark--mega`，溢出底边）
```

### 8.2 QR 块规则

```css
.foot-qr {
  width: 140px; height: 140px;
  background: var(--od);   /* 白底 */
  padding: 6px;            /* 留出微边距 */
  display: grid;
  place-items: center;
  /* ❌ 无 border-radius，保持纯正方形 */
}
.foot-qr img {
  width: 100%; height: 100%;
  object-fit: contain;
}
```

- 引用的图片为 `./assets/qr-wechat-crop.png`（600×600 纯码）
- 移动端缩小为 100×100

### 8.3 已移除的元素（历史调整）

- ~~`.foot-top` 大声明区~~（重复品牌 statement，已删）
- ~~QR 旁边的 badge + description~~（冗余，已删）
- ~~meta-bar 中的 SHANGHAI~~（精简）

---

## 九、后端集成：Netlify + 飞书

### 9.1 Netlify 配置

**`netlify.toml`**：
```toml
[build]
  command = "npm run build"
  publish = "dist"
[functions]
  directory = "netlify/functions"
```

### 9.2 Functions 清单

| 函数 | 路径 | 用途 |
|------|------|------|
| `feishu-assessment.mjs` | `POST /.netlify/functions/feishu-assessment` | 评估表公开提交（无需登录） |
| `feishu-auth-start.mjs` | OAuth 启动 | 客户工作台登录 |
| `feishu-callback.mjs` | OAuth 回调 | 客户工作台登录 |
| `feishu-session.mjs` | 会话校验 | 客户工作台 |
| `feishu-submit.mjs` | 客户工作台表单提交 | 登录后才能提交 |
| `_shared/feishu-utils.mjs` | 通用工具（token 获取等） | 被所有函数 import |

### 9.3 环境变量清单（Netlify Dashboard）

| 变量名 | 说明 | 用在 |
|--------|------|------|
| `FEISHU_APP_ID` | 飞书应用 App ID | 全部 |
| `FEISHU_APP_SECRET` | 飞书应用 App Secret | 全部 |
| `FEISHU_APP_TOKEN` | 多维表格 App Token（URL `/base/` 后） | 全部 |
| `FEISHU_TABLE_ASSESSMENT` | 评估表 table_id | feishu-assessment |
| （客户工作台所需的其他 table_id） | 见 `feishu-tables-spec.md` | feishu-submit |

### 9.4 评估表字段映射

`feishu-assessment.mjs` 的字段白名单必须与飞书多维表格列名**逐字**一致：

```
提交来源
月销售额 / 综合净利润率 / SKU数量 / Top 3 SKU销售占比
主要销售平台 / 其他平台说明
当前增长主要来源 / 广告费用占销售额比例 / 老客户复购情况
产品相对竞品的最大差别 / 产品定价相对竞品 / 用户购买主要原因
现有品牌资产 / 是否有专人负责品牌/内容/社媒
当前最头疼的问题 / 对品牌升级的主要担心 / 品牌化投入意愿
姓名 / 微信/WhatsApp / 邮箱 / 方便联系时间段
```

前端字段 → 白名单映射发生在 `assessment-v2.html` 提交逻辑中；函数会默认补 `提交来源 = 官网表单`。

### 9.5 CORS

评估函数支持 `OPTIONS` 预检：
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: Content-Type
Access-Control-Allow-Methods: POST, OPTIONS
```

---

## 十、资产管理

### 10.1 QR 二维码（WeChat）

| 文件 | 尺寸 | 用途 |
|------|------|------|
| `assets/qr-wechat.png` | 1056×1441 | 原始图，含顶部"峥锐品牌出海小助手 · 库克群岛"+ 底部"扫一扫上面的二维码图案，加我为朋友" |
| `assets/qr-wechat-crop.png` | 600×600 | 自动裁剪版，**仅保留二维码图案**，所有 v2 页面统一引用 |

**自动裁剪脚本**（见第十六节）会根据深色像素密度定位二维码主体并裁成方形。如更换 QR 图片，只需替换原图并重跑脚本。

### 10.2 字体

所有字体通过 Google Fonts CSS `@import` 加载，**不在本地**。三个字重范围：
- Manrope: 300–800
- Inter: 300–900
- JetBrains Mono: 400–600

### 10.3 图像

目前 v2 页面只有 QR 一张图。其他视觉元素（分隔线、hero 背景、矩阵格、跑马灯）均为纯 CSS 实现，无依赖。

---

## 十一、构建与分发流程

### 11.1 开发流程

```
1. 编辑 zapex-system.css 或某个 *-v2.html
2. 浏览器刷新直接看效果（源文件用外链 CSS）
3. 如涉及评估表 → 同步检查 `netlify/functions/feishu-assessment.mjs`
4. 满意后 → 运行静态构建脚本（会自动重生 standalone + 打包 dist）
4. git add + commit
```

### 11.2 静态构建脚本

```bash
npm run build
```

### 11.3 Netlify 部署

- 推送到 Git 仓库后自动部署
- 评估表的环境变量必须在 Netlify Dashboard 设置
- `npm run build` 现在由 `scripts/build-static-site.mjs` 驱动
- 构建产物输出到 `dist/`，包含：
  - 4 个新版 v2 页面
  - 4 个 standalone 页面
  - `privacy.html` / `terms.html`
  - `growth-forms.html`
  - `archive/v1/*`
  - `assets/`、`zapex-system.css`、`zapex-system-mobile.css`
  - `_redirects`

---

## 十二、本地预览与开发

### 十二.1 单页预览

直接用浏览器打开任一 `*-v2.html` 即可（`file://` 协议也能跑，字体 / CSS 都是 CDN 或同目录）。

### 十二.2 多页聚合预览

打开 `v2-preview.html` — 顶部有 4 个 tab（品牌首页 / 系统 / 交付 / 评估）+ 1 个外跳 tab（客户工作台）。tab 切换通过 iframe src 替换，URL hash 同步（可 deep-link 到 `v2-preview.html#system-and-modules-v2`）。

### 十二.3 起本地服务器（推荐用于测试 Netlify functions）

```bash
npx netlify dev
# 或
npm run dev -- --host 127.0.0.1 --port 4173
```

---

## 十三、修改历史 · 关键决策

### 13.1 v2 改版总览

| 阶段 | 内容 |
|------|------|
| 第 1 阶段 | 建立 `zapex-system.css` 设计系统（1065 行） |
| 第 2 阶段 | 迁移首页 → `homepage-v2.html` |
| 第 3 阶段 | 迁移系统与模块 → `system-and-modules-v2.html` |
| 第 4 阶段 | 迁移交付与案例 → `delivery-and-cases-v2.html` |
| 第 5 阶段 | 迁移评估表 → `assessment-v2.html`（保留 Netlify 提交逻辑） |
| 第 6 阶段 | 确认客户工作台不迁移（保留 `growth-forms.html` 原样） |
| 第 7 阶段 | 建立 `v2-preview.html` iframe 聚合预览 |
| 第 8 阶段 | 应用 PDF《改版 1.0.1》修改清单 |
| 第 9 阶段 | 三项 refinement：首页 hero 三行、交付 01 三行、QR 自动裁剪 |
| 第 10 阶段 | 写 `logo-guidebook.html` Logo 规范手册 |
| 第 11 阶段 | 新评估表接入飞书主表字段、保留 `growth-forms.html` 登录后页面 |
| 第 12 阶段 | 新增 `privacy.html` / `terms.html` 并统一新版页脚合规链接 |
| 第 13 阶段 | 建立 `archive/v1` 历史版归档，避免新版覆盖旧版 |
| 第 14 阶段 | 新增 `scripts/build-static-site.mjs`，让 Netlify 直接发布新版静态站 |
| 第 15 阶段 | 更新本接手文档 |

### 13.2 关键决策记录

**为什么 Homepage hero 改成三行？**
从"我们交付的是 可验证·可复制·可沉淀的品牌增长系统"改为三行结构，去掉了"可复制""可沉淀"前缀，让视觉更干净、节奏更强：
```
我们交付的是
可验证 复制 沉淀的
品牌增长系统   ← em 品牌蓝
```

**为什么交付首 section 标题是三行？**
"7 项具名交付 / 不是方法建议 / 是系统资产"三行节奏比两行更有仪式感，强化"交付即资产"的主张。

**为什么 QR 要裁剪？**
原图四周有文字（"峥锐品牌出海小助手 · 库克群岛"），在页脚显得杂乱。用 PIL 按像素密度自动定位 QR 主体并裁成方形，保持页脚干净。

**为什么 Pill 改为双行？**
导航右侧"客户工作台"需要与其他导航链接形成视觉区分，同时副标签"飞书入口"降低用户对"要不要登录"的困惑。

**为什么保留 `growth-forms.html` 不动？**
客户工作台是嵌入飞书的功能页，不是营销页，没有改版价值，也有破坏飞书 Embed 的风险。

**为什么生成 standalone 文件？**
营销场景下，单文件 HTML 可以发邮件、上传截图工具、给客户做预览，不依赖服务器路径。

---

## 十四、已知问题与待办

### 14.1 已完成 ✅

- [x] 4 个核心 v2 页面迁移
- [x] Standalone 单文件打包
- [x] `v2-preview.html` 聚合预览
- [x] QR 自动裁剪（`qr-wechat-crop.png`）
- [x] Logo 规范手册（`logo-guidebook.html`）
- [x] PDF 改版 1.0.1 全部修改
- [x] 三项 refinement（hero 三行 × 2 + QR 裁剪）
- [x] `assessment-v2.html` 已切换为新版 6 区块评估表，并提交到 `feishu-assessment.mjs`
- [x] `privacy.html` / `terms.html` 已建立，新版页脚合规链接已接通
- [x] `growth-forms.html` 保持原有飞书登录后工作台，不做 UI 改版
- [x] `archive/v1` 历史前端归档已建立
- [x] `index.html` 已切到新版首页 `homepage-v2.html`
- [x] `npm run build` 已改为静态产物构建并输出 `dist/`

### 14.2 待确认 ⏳

- [ ] **飞书字段对齐**：`feishu-assessment.mjs` 白名单与飞书多维表格实际列名需上线前校对一次。
- [ ] **URL 路由**：上线域名上的路径结构（`/system-and-modules-v2.html` vs `/system-and-modules/`）需规划。建议 Netlify redirects 做 v2 路径映射。
- [ ] **`preview-claude-v2.html` 是否弃用**：历史迭代产物，决定保留或删除。
- [ ] **Netlify 登录态**：本机 CLI 当前未登录，若要手动触发 deploy 需先完成 `netlify login` 或配置 token。

### 14.3 可选优化 💡

- [ ] 移动端 < 375px 的细节排版再过一遍
- [ ] `section--dark` 的 hero 背景加一层 grain 纹理（`.hero::before`）
- [ ] 页脚巨型 wordmark 溢出底边在小屏上是否贴边美观
- [ ] Assessment 表单的实时校验与错误态
- [ ] 所有 v2 页面的 OG / Twitter Card meta 补齐

---

## 十五、参考文档索引

### 15.1 品牌与设计

| 文件 | 内容 |
|------|------|
| `DESIGN.md` | 设计系统总原则（视觉 / 布局 / 排版 / 色彩 / 组件 / CTA / 导航 / 交互） |
| `STYLE-NOTES.md` | 品牌语调与区分信号（consulting-grade / 不做什么） |
| `COMPONENT-RULES.md` | 组件规则（按钮 / 卡片 / 导航 / Hero / 表单 / 表格 / 空状态） |
| `design-manual.html` | 设计 Token 可视化手册（浏览器打开） |
| `logo-guidebook.html` | Logo 使用规范（11 节，颜色 / 字距 / 保护区 / 应用场景 / 禁忌） |

### 15.2 后端与数据

| 文件 | 内容 |
|------|------|
| `feishu-tables-spec.md` | 飞书多维表格字段规范 |
| `netlify/functions/*.mjs` | 所有后端函数（带注释） |

### 15.3 过渡 / 历史

| 文件 | 状态 |
|------|------|
| `AGENTS.md` | AI 协作者指引（Codex / Claude） |
| `CODEX-HANDOFF.md` | 前一版接手文档（建议保留作为迭代记录） |
| `HOMEPAGE-PREVIEW.md` | 首页预览迭代说明 |
| `README.md` | 项目总览 |

---

## 十六、常用脚本速查

### 16.1 构建新版静态站

```bash
npm run build
```

### 16.2 重新裁剪 QR 码

```python
from PIL import Image
import numpy as np

img = Image.open('assets/qr-wechat.png').convert('L')
arr = np.array(img)
dark = arr < 128
h, w = arr.shape

# 基于行/列深色密度定位 QR 主体
row_d = dark.sum(axis=1) / w
col_d = dark.sum(axis=0) / h

# 手工（当前图参数）：
cx, cy = 520, 760
size   = 820

img_color = Image.open('assets/qr-wechat.png')
left, top = cx - size//2, cy - size//2
cropped = img_color.crop((left, top, left+size, top+size))
cropped = cropped.resize((600, 600), Image.LANCZOS)
cropped.save('assets/qr-wechat-crop.png')
```

### 16.3 快速统计修改

```bash
# 各页面行数
wc -l homepage-v2.html system-and-modules-v2.html delivery-and-cases-v2.html assessment-v2.html

# CSS 组件总数
grep -c '^\.\w' zapex-system.css

# 所有 section 标题
grep 'section-title' *-v2.html | grep -o '>[^<]*<' | head -20
```

### 16.4 Netlify 本地调试

```bash
# 启动静态页开发服务
npm run dev -- --host 127.0.0.1 --port 4173

# 启动 functions 本地服务（需要 Netlify CLI 可用）
npx netlify dev

# 访问
open http://127.0.0.1:4173/homepage-v2.html
```

### 16.5 Git 历史查阅

```bash
# 最近 20 次提交
git log --oneline -20

# v2 相关提交
git log --oneline --all -- '*-v2.html'

# 查看某次 CSS 改动
git log -p -- zapex-system.css | head -100
```

---

**文档终。**
若需更新本文档，直接编辑 `HANDOVER.md`，每次重大改版后回头更新"十三 · 修改历史"一节即可。
