# ZAPEX · 峥锐 — 品牌网站接手文档

> **写给 Codex 的交接说明**
> 这份文档描述的是当前已完成的网站原型状态（2026-04）。
> 所有页面共享一个 CSS 文件，结构稳定，可直接继续开发或移植到框架。

---

## 目录

1. [项目总览](#1-项目总览)
2. [文件结构（当前实际状态）](#2-文件结构)
3. [设计令牌 CSS 变量](#3-设计令牌)
4. [字体系统](#4-字体系统)
5. [页面结构地图](#5-页面结构地图)
6. [组件系统](#6-组件系统)
7. [CSS 关键规律与注意事项](#7-css-关键规律)
8. [品牌语调规则](#8-品牌语调规则)
9. [待完成事项](#9-待完成事项)
10. [明确禁止项](#10-明确禁止项)

---

## 1. 项目总览

**品牌名：** 峥锐 ZAPEX  
**定位：** 品牌出海增长系统（不是代运营，是增长系统重构）  
**目标用户：** 中国跨境大卖家、品牌出海决策者  
**核心信息：** 交付的不是建议，是能留在企业内部自运转的系统能力

### 品牌性格（四柱）
| 支柱 | 定义 |
|------|------|
| 战略判断 | 用系统框架表达，不说模糊感受 |
| 执行纪律 | 承诺可交付的具体成果，不夸大 |
| 冷静控制 | CTA 是受控的下一步，非销售施压 |
| 系统导向 | 用模块、引擎、架构等词，不用情绪词 |

### 技术栈
- **纯 HTML + 共享 CSS**（`preview-pages.css`）
- 无框架，无打包工具
- Google Fonts via `@import`（Manrope / Inter / JetBrains Mono）
- 所有页面 `<link rel="stylesheet" href="./preview-pages.css" />`

### 预览
```bash
npx serve -p 4321 .
# 访问 http://localhost:4321/homepage-overview.html
```

---

## 2. 文件结构

### 当前活跃的 5 个页面（全部基于 `preview-pages.css`）

```
growth-engine-cn-main/
│
├── preview-pages.css           ← 唯一共享样式表，所有 CSS 在此
│
├── homepage-overview.html      ← 品牌首页（8个区块）
├── system-and-modules.html     ← 系统与模块（3个区块）
├── delivery-and-cases.html     ← 交付与案例（5个区块）
├── contact-and-cta.html        ← 联系与 CTA（仅作 CTA 落地页）
├── assessment.html             ← 评估表（待接飞书表单）
│
├── assets/
│   └── qr-wechat.png           ← 峥锐品牌出海小助手 微信二维码
│
├── CODEX-HANDOFF.md            ← 本文件
├── STYLE-NOTES.md              ← 品牌简报（英文）
├── COMPONENT-RULES.md          ← 组件规则（英文）
└── design-manual.html          ← 设计系统手册（参考）
```

### 注意
- `contact-and-cta.html` 已从主导航中移除（不在 nav-links 里），但文件保留
- 所有 5 个页面的 `nav-cta`（"预约诊断"按钮）均指向 `assessment.html`
- 旧版 homepage（`homepage-preview-v4.html` 等）保留但不再使用

---

## 3. 设计令牌

**唯一来源：`preview-pages.css` `:root` 块**

```css
:root {
  /* ── PRIMARY ───────────────────────────────── */
  --p0:  #071f30;
  --p10: #0c4e77;   /* 主按钮、强调色 */
  --p20: #175d8a;   /* 按钮 hover */
  --p30: #2f6690;
  --p50: #7ea6c2;   /* module-num / module-tag 文字 */
  --p70: #d9e4ee;   /* icon 底色 */

  /* ── DARK SURFACES ─────────────────────────── */
  --s0:  #0b0d14;
  --s10: #1a1e2a;   /* Nav / Hero Dark / section-dark */
  --s20: #2d3142;   /* section-dark（深色区块背景）*/
  --s30: #3e445a;

  /* ── NEUTRAL SURFACES ──────────────────────── */
  --sf-lowest: #ffffff;
  --sf:        #fbf9f8;   /* body 默认背景 */
  --sf-low:    #f5f3f2;   /* section-soft 背景 */
  --sf-high:   #efedec;

  /* ── INK / ON-LIGHT ────────────────────────── */
  --ink:       #1b1c1b;
  --ink-muted: rgba(27, 28, 27, 0.66);
  --ink-quiet: rgba(27, 28, 27, 0.48);
  --ink-faint: rgba(27, 28, 27, 0.10);

  /* ── ON-DARK ───────────────────────────────── */
  --od:        #ffffff;
  --od-muted:  rgba(255, 255, 255, 0.72);
  --od-quiet:  rgba(255, 255, 255, 0.50);
  --od-faint:  rgba(255, 255, 255, 0.10);

  /* ── OUTLINE ───────────────────────────────── */
  --ol-strong: rgba(27, 28, 27, 0.10);   /* on-light 分割线 */
  --ol-dark:   rgba(255, 255, 255, 0.08); /* on-dark 分割线 */

  /* ── SHADOW ─────────────────────────────────  */
  --ambient: 0 24px 48px -12px rgba(27, 28, 27, 0.05);
  --lift:    0 10px 30px -12px rgba(27, 28, 27, 0.08);

  /* ── RADIUS ─────────────────────────────────  */
  --r-sm: 4px;
  --r-md: 6px;
  --r-lg: 8px;
  --r-xl: 12px;   /* 最大圆角，绝不超过 */

  /* ── TYPOGRAPHY ─────────────────────────────  */
  --ff-display: "Manrope", -apple-system, "PingFang SC", sans-serif;
  --ff-body:    "Inter",   -apple-system, "PingFang SC", sans-serif;
  --ff-mono:    "JetBrains Mono", ui-monospace, monospace;

  /* ── LAYOUT ─────────────────────────────────  */
  --max:     1120px;
  --gutter:  32px;
  --measure: 620px;
}
```

---

## 4. 字体系统

### 引入方式
```css
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700;900&family=JetBrains+Mono:wght@400;500&display=swap');
```

### 角色分配

| 变量 | 字体 | 用途 |
|------|------|------|
| `--ff-display` | Manrope | H1 / H2 / 模块卡片标题 / 数字展示 |
| `--ff-body` | Inter | 正文 / 导航 / 按钮 / Logo wordmark |
| `--ff-mono` | JetBrains Mono | 编号标签（MODULE · 01）/ 序列号 |

### 关键字号
```css
/* H1 Hero */
font-size: clamp(3.4rem, 6vw, 5.6rem);
line-height: 0.98;
letter-spacing: -0.04em;

/* H2 Section */
font-size: clamp(2.1rem, 4vw, 3.1rem);
line-height: 1.08;
letter-spacing: -0.03em;

/* 卡片标题 h3 */
font-size: 1.5rem;
letter-spacing: -0.02em;

/* Item heading */
font-size: 1.25rem;

/* Hero sub-text */
font-size: 1.0625rem;

/* Label（大写微标签）*/
font-size: 0.6875rem;
letter-spacing: 0.14em;

/* Module num（等宽）*/
font-size: 11px;
letter-spacing: 0.12em;
```

---

## 5. 页面结构地图

### 全站导航结构（所有 5 页相同）

```html
<div class="nav-wrap">
  <div class="shell nav">
    <a href="./homepage-overview.html" class="wordmark on-dark nav-wordmark">
      <span class="z">Z</span><span class="apex">APEX</span>
    </a>
    <nav class="nav-links">
      <a [class="current"] href="./homepage-overview.html">品牌首页</a>
      <a href="./system-and-modules.html">系统与模块</a>
      <a href="./delivery-and-cases.html">交付与案例</a>
      <a href="./assessment.html">评估表</a>
    </nav>
    <a class="nav-cta" href="./assessment.html">预约诊断</a>
  </div>
</div>
```

注意：`contact-and-cta.html` 已从导航中移除。`nav-cta` 统一指向 `assessment.html`。

---

### homepage-overview.html — 品牌首页（8 区块）

| # | 区块 | Class | 背景 | 说明 |
|---|------|-------|------|------|
| 0 | 网站 Banner | `.site-banner` | `--p10` 蓝 | "用12个月，建立企业用几年才能跑出来的品牌增长系统" |
| 1 | Nav | `.nav-wrap` | `rgba(26,30,42,0.94)` | 粘性导航 |
| 2 | Hero | `.hero.hero--dark` | `--s10` | 主标题 + 2个按钮 |
| 3 | 我们是谁 | `.section.section-soft` | `--sf-low` | 3张 `.card` grid-3 |
| 4 | 核心痛点 | `.section.section-light` | `--sf` | 6张 `.card` grid-3（PAIN POINT 01–06）|
| 5 | 两大核心模块 | `.section.section-dark` | `--s20` | 2张 `.module-card` grid-2 |
| 6 | 合作流程 | `.section.section-light` | `--sf` | `.panel > .timeline`（3步骤）|
| 7 | CTA | `.section.section-dark` | `--s20` | 标题 + 2个按钮 |
| 8 | Footer | `.site-footer` | `--s10` | QR码 + 地址 + 版权 |

---

### system-and-modules.html — 系统与模块（3 区块）

| # | 区块 | Class | 背景 | 说明 |
|---|------|-------|------|------|
| 1 | Hero | `.hero.hero--dark` | `--s10` | 标题 + 子文案 + 2按钮 |
| 2 | 两大核心模块 | `.section.section-dark` | `--s20` | 2张 `.module-card`（与首页同内容）|
| 3 | 工具体系 | `.section.section-dark` | `--s20` | 左文右卡（2个 module-card）|
| 4 | Footer | `.site-footer` | `--s10` | 同上 |

---

### delivery-and-cases.html — 交付与案例（5 区块）

| # | 区块 | Class | 背景 | 说明 |
|---|------|-------|------|------|
| 1 | Hero | `.hero` | `--sf` | 浅色 Hero |
| 2 | 7项核心交付 | `.section.section-soft` | `--sf-low` | 2列 `.panel` + item 08 spotlight |
| 3 | 三大品牌中台 | `.section.section-dark` | `--s20` | 3张 `.card` grid-3 |
| 4 | 合作流程 | `.section.section-soft` | `--sf-low` | `.panel > .timeline`（3步骤）|
| 5 | 差异化定位 + 创始团队 | `.section.section-light` | `--sf` | 3卡对比 + 2张创始人 `.panel` |
| 6 | Footer | `.site-footer` | `--s10` | 同上 |

**交付物分组结构（第2区块）：**
```html
<div class="grid-2">
  <!-- 战略与增长路径：items 01–03 -->
  <div class="panel">
    <h3>战略与增长路径</h3>
    <div class="deliverables">...</div>
  </div>
  <!-- 组织与资产沉淀：items 04–07 -->
  <div class="panel">
    <h3>组织与资产沉淀</h3>
    <div class="deliverables">...</div>
  </div>
</div>
<!-- Item 08 Spotlight -->
<article class="card spotlight" style="margin-top: 28px;">
  <div class="module-num">08</div>
  <h3>交付系统而非建议</h3>
  <p>...</p>
</article>
```

---

### contact-and-cta.html — 联系与 CTA

- 独立落地页，不在主导航内（文件保留备用）
- 结构：`.cta-wrap > .cta-frame`（左：文案 + 按钮；右：联系卡片 + QR）
- 有 `site-footer`

---

### assessment.html — 评估表

- Hero 使用 `.hero--compact`（减少高度）
- 主体区：`.feishu-frame` 容器（待接飞书表单 iframe）

```html
<section class="hero hero--compact">
  <div class="shell hero-inner">
    <span class="label">品牌诊断 / Assessment</span>
    <h1>增长系统准备度评估<br>先判断再行动</h1>
    <p class="hero-sub">...</p>
  </div>
</section>

<section class="section section-soft">
  <div class="shell">
    <div class="feishu-frame" id="feishu-form">
      <span class="label">品牌诊断评估表 / Diagnostic Assessment</span>
      <div class="feishu-frame-body">
        <!-- 上线后在此嵌入飞书表单 iframe -->
      </div>
    </div>
  </div>
</section>
```

---

## 6. 组件系统

所有组件 CSS 均在 `preview-pages.css`。以下是所有已用到的类名和用法。

---

### 6.1 Wordmark（Logo）

```html
<!-- 深色底用（Nav / 深色区块）-->
<a class="wordmark on-dark">
  <span class="z">Z</span><span class="apex">APEX</span>
</a>

<!-- 浅色底用 -->
<a class="wordmark on-light">
  <span class="z">Z</span><span class="apex">APEX</span>
</a>
```

规则：字体永远是 Inter，不可手绘；Z 字重 900，APEX 字重 500；深色底 Z=白色，APEX=50%白。

---

### 6.2 Label（微标签）

```html
<span class="label">品牌诊断 / Assessment</span>
<span class="label on-dark">核心模块 / Core Modules</span>
```

样式：JetBrains Mono 风格 · 0.6875rem · letter-spacing 0.14em · 全大写 · 前有蓝点 `::before`

---

### 6.3 按钮

```html
<a class="btn btn--primary">预约增长诊断</a>
<a class="btn btn--ghost-dark">进入系统结构</a>
<a class="btn btn--outlined">了解交付结构</a>
```

| Class | 用法场景 |
|-------|---------|
| `btn--primary` | 主要行动，深浅背景均可 |
| `btn--ghost-dark` | 次要行动，仅用于深色背景 |
| `btn--outlined` | 次要行动，仅用于浅色背景 |

---

### 6.4 Section 背景类

```html
<section class="section section-light">...</section>   <!-- --sf 浅米白 -->
<section class="section section-soft">...</section>    <!-- --sf-low 浅灰白 -->
<section class="section section-dark">...</section>    <!-- --s20 深蓝灰 -->
```

**交替规律（深浅必须不同）：** Hero → Soft → Light → Dark → Light → Dark ...

---

### 6.5 section-head（区块标题结构）

```html
<header class="section-head">
  <div>
    <span class="label [on-dark]">标签 / Label</span>
    <h2>主标题<br>换行</h2>
  </div>
  <p>右侧说明文字，最大宽度 420px</p>
</header>
```

两列布局：左侧标题，右侧说明，`margin-bottom: 72px`。

---

### 6.6 卡片类

**`.card`（通用卡片）：**
```html
<article class="card">
  <span class="module-num">PAIN POINT · 01</span>
  <h3>卡片标题</h3>
  <p class="text-measure">正文内容</p>
</article>
```

**`.panel`（大面板，通常含子内容）：**
```html
<div class="panel">
  <h3>面板标题</h3>
  <p>说明</p>
  <div class="deliverables">...</div>
</div>
```

**`.panel--dark`（深色面板）：**
```html
<div class="panel panel--dark">...</div>
```

**`.module-card`（深色背景专用模块卡）：**
```html
<article class="module-card">
  <div class="module-num">MODULE · 01</div>
  <h3>ZAPEX 品牌战略模块™</h3>
  <p>说明文字</p>
  <div class="module-tags">
    <span class="module-tag">品类切入分析</span>
  </div>
</article>
```

**`.card.spotlight`（深蓝 spotlight 卡 — 用于 item 08）：**
```html
<article class="card spotlight">
  <div style="font-family: var(--ff-mono); font-size: 11px; letter-spacing: 0.12em; color: rgba(255,255,255,0.48);">08</div>
  <h3>交付系统而非建议</h3>
  <p class="text-measure">...</p>
</article>
```

---

### 6.7 Deliverables（交付物列表）

```html
<div class="deliverables">
  <div class="deliverable">
    <div class="deliverable-num">01</div>
    <div class="stack">
      <h3 class="item-heading">定品牌战略</h3>
      <p>说明文字</p>
    </div>
  </div>
</div>
```

在浅色 `.panel` 内，border-top 用 `--ol-strong`（默认 `--ol-dark` 在浅背景看不见）。CSS 中已通过 `.panel:not(.panel--dark) .deliverable` 修正。

---

### 6.8 Timeline（合作流程）

```html
<div class="panel">
  <div class="timeline">
    <div class="timeline-item">
      <div class="timeline-aside">
        <span class="timeline-num">STEP · 01</span>
        <span class="timeline-days">30 分钟</span>
      </div>
      <div class="stack">
        <h3 class="item-heading">品牌诊断</h3>
        <p>说明...</p>
      </div>
    </div>
  </div>
</div>
```

---

### 6.9 Card List（卡片内列表）

```html
<ul class="card-list">
  <li>50+ 品牌咨询辅导项目验证</li>
  <li>覆盖 B2B、B2C、DTC 领域</li>
</ul>
```

每 `li` 有 `border-top: 1px solid --ol-strong`，第一项无线。

---

### 6.10 site-footer（全站统一 footer）

```html
<footer class="site-footer">
  <div class="shell">
    <div class="site-footer-inner">
      <div class="site-footer-brand">
        <div class="wordmark on-dark" style="font-size: 18px;">
          <span class="z">Z</span><span class="apex">APEX</span>
        </div>
        <p class="site-footer-desc">峥锐科技以品牌战略与增长系统双线协同...</p>
      </div>
      <div class="site-footer-contact">
        <div class="site-footer-qr-row">
          <div class="site-footer-qr">
            <img src="./assets/qr-wechat.png" alt="峥锐品牌出海小助手 微信二维码" />
          </div>
          <div class="site-footer-qr-info">
            <span class="identity-badge">
              <span class="identity-dot"></span>
              峥锐品牌出海小助手
            </span>
            <p class="site-footer-contact-value">通过微信扫码联系业务入口...</p>
          </div>
        </div>
        <div class="site-footer-contact-block">
          <span class="site-footer-contact-label">地址</span>
          <p class="site-footer-contact-value">深圳市龙华区龙华大道有品文化创意园4栋201-1</p>
        </div>
        <div class="site-footer-contact-block">
          <span class="site-footer-contact-label">联系</span>
          <p class="site-footer-contact-value">hello@zapex.io</p>
        </div>
      </div>
    </div>
    <div class="site-footer-meta">
      <span>© 2026 峥锐科技 · 深圳</span>
      <span>hello@zapex.io</span>
    </div>
  </div>
</footer>
```

QR 图片：`./assets/qr-wechat.png`（已存在）。  
`.site-footer-qr` 有白色 padding 背景（`rgba(255,255,255,0.92)` + 5px padding）确保 QR 可扫。

---

### 6.11 site-banner（首页顶部公告条）

```html
<div class="site-banner">
  <div class="shell site-banner-inner">
    <span class="site-banner-text">用12个月，建立企业用几年才能跑出来的品牌增长系统</span>
    <a href="./assessment.html" class="site-banner-cta">预约30分钟诊断 →</a>
  </div>
</div>
```

仅在 `homepage-overview.html` 使用，位于 nav 上方。

---

### 6.12 网格系统

```html
<div class="grid-2">...</div>   <!-- 两列 gap: 28px -->
<div class="grid-3">...</div>   <!-- 三列 gap: 28px -->
```

---

## 7. CSS 关键规律

### 7.1 中文换行控制

H1/H2 字号极大（`clamp(3.4rem, 6vw, 5.6rem)`），中文字符会在任意位置换行。  
对需要保持不断行的短语，用内联 `style="white-space: nowrap"`：

```html
<h1>我们交付的不是<span style="white-space: nowrap">流量动作</span><br>而是...</h1>
<h2>7 项具名交付<br>不是方法建议<br><span style="white-space: nowrap">是系统资产</span></h2>
```

已固定不换行的词组：流量动作 / 品牌出海加速器 / 完整结构 / 是系统资产 / 本质区别

### 7.2 深色区块内卡片

`.section-dark` 内的 `.card` / `.panel` 自动变为玻璃态：
```css
.section-dark .card,
.section-dark .panel {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--ol-dark);
  box-shadow: none;
}
```
所以 `.module-card` 专用于深色背景，`.card` 可用于任何背景（CSS 自动处理）。

### 7.3 浅色面板内的 deliverable 分割线

`.deliverable` 默认 border-top 是 `--ol-dark`（白色 8% 透明），在浅色 `.panel` 上不可见。  
已在 CSS 中修正：
```css
.panel:not(.panel--dark) .deliverable {
  border-top-color: var(--ol-strong);
}
.panel:not(.panel--dark) .deliverable-num {
  color: var(--p10);
}
```

### 7.4 item-heading 字号优先级

`.panel h3` 的 CSS 选择器特异性（0,1,1）高于 `.item-heading`（0,1,0），会覆盖。  
已修正：
```css
.panel .item-heading,
.card .item-heading {
  font-size: 1.25rem;
}
```

### 7.5 hero--compact

```css
.hero--compact {
  padding: 80px 0 72px;
}
```
仅用于 `assessment.html`，减少 hero 高度。

### 7.6 区块间不使用实线分割

相邻区块之间靠背景色差分区，**禁止**用 `<hr>` 或 `border-bottom: 1px solid` 分割区块。  
1px 线只用于卡片内行间（`.card-list li`、`.deliverable`）。

---

## 8. 品牌语调规则

### 标题写法
```
✅ 不是代运营，是增长系统重构
✅ 7 项具名交付，不是方法建议，是系统资产
✅ 先诊断，再决定是否进入系统合作
✅ 从诊断开始，不从承诺开始

❌ 帮你快速实现增长！
❌ 全方位助力品牌出海
❌ 颠覆传统，引领增长
❌ 赋能你的出海之路
```

### CTA 文案
```
✅ 预约增长诊断
✅ 进入系统结构
✅ 查看交付结构
✅ 预约诊断（Nav 简短版）

❌ 立即免费咨询！
❌ 获取专属方案
❌ 开始你的增长旅程
```

### 标点规则
- **标题不加句号（。）** — 已全局清除
- **标题不加感叹号（！）**
- **有需要换行的地方用 `<br>` 而非依赖自动换行**
- 正文可以有标点，但不加句尾句号（。）

### 词汇规范
| 禁用 | 改用 |
|------|------|
| 赋能 / 助力 / 破局 | 系统重构 / 架构层 / 执行路径 |
| 一站式 / 全方位 | 具体模块名（品牌战略模块 / 增长引擎）|
| 快速 / 立即 | 具体时间（30分钟 / 12个月）|
| 感叹号（！）| 不用标点或破折号 |

---

## 9. 待完成事项

### 9.1 飞书表单接入（最优先）

**位置：** `assessment.html` → `<div class="feishu-frame-body">` 内  
**操作：** 获取飞书表单 iframe embed 代码后，填入此处：

```html
<div class="feishu-frame-body">
  <!-- 替换为飞书表单 iframe，例如：-->
  <iframe src="https://..." width="100%" height="800" frameborder="0"></iframe>
</div>
```

`.feishu-frame-body` 已有 min-height 和 loading 样式，接入后会自适应。

### 9.2 品牌增长案例内容

`delivery-and-cases.html` 目前无实际案例数据（无客户背书区块）。  
如有案例，可在"差异化定位"区块下方新增 `.section.section-soft` 展示案例卡片。

### 9.3 移动端导航

当前 `nav-links` 在小屏会收缩，但无汉堡菜单。  
如需完整移动端支持，需在 `preview-pages.css` 添加 hamburger + overlay 逻辑。

### 9.4 contact-and-cta.html 归宿

此页面目前从主导航移除，但文件保留。  
可考虑：①删除文件 ②重定向到 `assessment.html` ③保留为辅助落地页。

---

## 10. 明确禁止项

### 视觉禁止

| 禁止 | 原因 |
|------|------|
| `border-radius > 12px` | 超过 `--r-xl` 侵蚀品牌权威感 |
| 区块间 `border: 1px solid` 或 `<hr>` | 用背景色差分区，不用实线 |
| 纯黑 `#000000` 作为文字色 | 用 `--ink`（#1b1c1b）|
| 渐变按钮 | 主按钮用纯色 `--p10` |
| 霓虹色、荧光色 | 非消费品，非 AI 产品 |
| Emoji 于正文 | 品牌形象不符 |
| 感叹号于标题 | 用 `<br>` 换行代替情绪渲染 |

### 技术禁止

| 禁止 | 原因 |
|------|------|
| 引入第三方 CSS 框架 | 会覆盖 token 结构 |
| 使用 `!important` | 破坏选择器优先级链 |
| 在重复元素上写内联 `style=""` | 除非 one-off layout override，否则加 class |
| `px` 定义 body 层级字号 | 用 `rem` / `clamp()` |
| 把标题末尾句号（。）加回来 | 已全局清除，保持一致 |

### Logo 禁止

- 不拉伸变形
- 不改变 Z/APEX 字体或字重
- 不描边（stroke）
- 不添加阴影
- 不在低对比背景上使用
- 不手绘重制（永远设置在 Inter 字体内）

---

*文档版本：v2.0 · 2026-04 · 峥锐 ZAPEX*  
*基于实际已完成页面状态整理，与 `preview-pages.css` + 5个 HTML 文件保持同步*
