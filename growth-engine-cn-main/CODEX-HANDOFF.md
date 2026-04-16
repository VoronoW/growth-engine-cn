# ZAPEX · 峥锐 — Growth OS · Codex 系统交接文档

> **交接说明** — 本文档是将整套 ZAPEX 品牌出海增长系统 UI/UX 移交给 Codex 的完整技术规范。
> 包含设计令牌、组件模式、页面结构、排版规则、交互规范和语调准则。
> 所有代码直接可用，无需翻译。

---

## 目录

1. [项目总览](#1-项目总览)
2. [文件结构](#2-文件结构)
3. [设计令牌 — CSS 自定义属性](#3-设计令牌)
4. [字体系统](#4-字体系统)
5. [色彩系统](#5-色彩系统)
6. [布局与间距](#6-布局与间距)
7. [Logo / 品牌标识规则](#7-logo--品牌标识规则)
8. [组件目录](#8-组件目录)
9. [首页区块结构](#9-首页区块结构)
10. [响应式断点](#10-响应式断点)
11. [交互与动效规范](#11-交互与动效规范)
12. [品牌语调规则](#12-品牌语调规则)
13. [明确禁止项](#13-明确禁止项)

---

## 1. 项目总览

**品牌名：** 峥锐 ZAPEX  
**定位：** 品牌出海增长操作系统（不是代运营，是增长系统重构）  
**核心标语：** 为跨境品牌装一台增长引擎  
**交付模型：** 90 天内把可被复用的增长体系交到客户团队手里  

### 品牌性格
- 战略判断 · 执行纪律 · 冷静控制 · 系统导向
- 面向决策者，非追逐趋势的创业者
- CTA 语言：受控的下一步，非销售施压

### 技术选型
- 纯 HTML + CSS（无框架、无打包工具）
- 所有样式写在 `<style>` 标签内
- Google Fonts via `@import` (Manrope / Inter / JetBrains Mono)

---

## 2. 文件结构

```
growth-engine-cn-main/
├── homepage-preview-v4.html   ← 主页 · 当前最新版 (v4)
├── design-manual.html          ← 设计系统手册 · 单一 Source of Truth
├── logo-guidebook.html         ← Logo 使用规范
├── growth-forms.html           ← 表单页
├── STYLE-NOTES.md              ← 品牌简报
├── CODEX-HANDOFF.md            ← 本文件
└── .claude/launch.json         ← 预览服务器配置 (npx serve -p 4321 .)
```

**预览服务器：**
```bash
npx serve -p 4321 .
# 访问 http://localhost:4321/homepage-preview-v4.html
```

---

## 3. 设计令牌

以下是完整的 CSS `:root` 令牌块，所有页面共享此规范。

```css
:root {
  /* ── PRIMARY — OS engine / navigation anchor ─────────── */
  --p0:  #071f30;
  --p10: #0c4e77;   /* PRIMARY — 主按钮、强调色、链接 */
  --p20: #175d8a;
  --p30: #2f6690;   /* primary-container · hero 装饰 */
  --p40: #4a7fa5;
  --p50: #7ea6c2;   /* module tag 文字 */
  --p60: #b0c8db;
  --p70: #d9e4ee;   /* icon 底色 */

  /* ── SECONDARY / DARK SURFACES ───────────────────────── */
  --s0:  #0b0d14;
  --s10: #1a1e2a;   /* Nav 深色 · CTA 区 · exec-card header */
  --s20: #2d3142;   /* 深色区块背景（Modules 区）*/
  --s30: #3e445a;
  --s40: #5a5d70;
  --s50: #7c7f8f;
  --s60: #a5a8b5;
  --s70: #cfd1d9;

  /* ── NEUTRAL SURFACES ────────────────────────────────── */
  --sf-lowest: #ffffff;
  --sf:        #fbf9f8;   /* body 默认背景 */
  --sf-low:    #f5f3f2;   /* 浅交替区块 (Positioning / Metrics) */
  --sf-high:   #efedec;
  --sf-highest:#e4e2e1;
  --sf-dim:    #dbdad9;

  /* ── INK / ON-LIGHT ──────────────────────────────────── */
  --ink:       #1b1c1b;               /* 主文字 — 绝不用纯黑 */
  --ink-muted: rgba(27, 28, 27, 0.64);
  --ink-quiet: rgba(27, 28, 27, 0.44);
  --ink-faint: rgba(27, 28, 27, 0.12);

  /* ── ON-DARK ─────────────────────────────────────────── */
  --od:       #ffffff;
  --od-muted: rgba(255, 255, 255, 0.72);
  --od-quiet: rgba(255, 255, 255, 0.48);
  --od-faint: rgba(255, 255, 255, 0.16);

  /* ── OUTLINE / GHOST ─────────────────────────────────── */
  --ol-variant: rgba(193, 199, 207, 0.15);
  --ol-strong:  rgba(27, 28, 27, 0.10);   /* on-light 分割线 */
  --ol-dark:    rgba(255, 255, 255, 0.08); /* on-dark 分割线 */

  /* ── ELEVATION ───────────────────────────────────────── */
  --ambient: 0 24px 48px -12px rgba(27, 28, 27, 0.05);
  --lift:    0 4px 16px -4px rgba(27, 28, 27, 0.08);

  /* ── RADIUS ──────────────────────────────────────────── */
  --r-xs: 2px;
  --r-sm: 4px;    /* tag / badge */
  --r-md: 6px;    /* 按钮 */
  --r-lg: 8px;    /* icon 底色 / 小卡片 */
  --r-xl: 12px;   /* 卡片 / 对话框 — MAX，超过此值侵蚀品牌权威感 */

  /* ── TYPOGRAPHY ──────────────────────────────────────── */
  --ff-display: 'Manrope', -apple-system, 'PingFang SC', sans-serif;
  --ff-body:    'Inter', -apple-system, 'PingFang SC', sans-serif;
  --ff-mono:    'JetBrains Mono', ui-monospace, monospace;

  /* ── LAYOUT ──────────────────────────────────────────── */
  --max:    1120px;
  --gutter: 32px;
}
```

---

## 4. 字体系统

### Google Fonts 引入
```css
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');
```

### 字体角色分配

| 角色 | 字体 | 用途 |
|------|------|------|
| Display | Manrope | H1 / H2 / Hero 标题 / 数字展示 |
| Body | Inter | 正文 / 标签 / 导航 / Logo |
| Mono | JetBrains Mono | 编号 / 日期 / 版本标签 / 代码 |

### 字号规范

```css
/* Display — Manrope */
font-size: clamp(3rem, 6vw, 5.25rem);   /* Hero H1 */
font-size: 2.5rem;                        /* Section H2 */
font-size: 2.25rem;                       /* Section H2 (子区块) */
font-size: 1.75rem;                       /* 数字展示 (traction strip) */
font-size: 1.5rem;                        /* 模块卡片标题 */
font-size: 1.25rem;                       /* 卡片标题 */
font-size: 1.125rem;                      /* 小卡片标题 */
font-size: 1.0625rem;                     /* hero-sub / 正文大 */

/* Body — Inter */
font-size: 0.9375rem;   /* body-md (默认) */
font-size: 0.875rem;    /* body-sm */
font-size: 0.8125rem;   /* caption */
font-size: 0.75rem;     /* footer / 小标注 */
font-size: 0.6875rem;   /* 微标签 (LABEL) */
font-size: 13px;        /* Nav 链接 */

/* Mono — JetBrains Mono */
font-size: 12px;   /* 版本号 / 序列号 */
font-size: 11px;   /* 模块编号 */
font-size: 10px;   /* 极小标注 */
```

### 字重规范

```css
font-weight: 900;   /* Logo Z / 极强调 */
font-weight: 700;   /* H1 / 封面标题 / 数字展示 */
font-weight: 600;   /* H2 / 卡片标题 / 导航 CTA */
font-weight: 500;   /* Logo APEX / 正文强调 */
font-weight: 400;   /* 正文 */
```

### Letter-spacing 规范

```css
letter-spacing: -0.04em;   /* Hero H1 */
letter-spacing: -0.03em;   /* Section H2 / 数字 */
letter-spacing: -0.02em;   /* 卡片标题 */
letter-spacing: -0.01em;   /* 小标题 / 正文标题 */
letter-spacing: 0.12em;    /* 微标签 (大写) */
letter-spacing: 0.14em;    /* LABEL 类 */
letter-spacing: 0.16em;    /* 最强调微标签 */
```

---

## 5. 色彩系统

### 主色系使用规则

| Token | Hex | 用途 |
|-------|-----|------|
| `--p10` | `#0c4e77` | 主按钮 bg / H1 em 强调 / 数字 delta / 链接 |
| `--p20` | `#175d8a` | 按钮 hover 态 |
| `--p30` | `#2f6690` | hero 背景渐变装饰 / 图片锚点 |
| `--p40` | `#4a7fa5` | input focus border / 引言文字色 |
| `--p50` | `#7ea6c2` | module-num 文字 / module-tag 文字 |
| `--p60` | `#b0c8db` | featured card icon stroke |
| `--p70` | `#d9e4ee` | trust-card-icon 背景 |

### 深色面用色规则

| Token | Hex | 用途 |
|-------|-----|------|
| `--s10` | `#1a1e2a` | Nav / CTA 区背景 / exec-card header |
| `--s20` | `#2d3142` | Modules 区深色背景 |

### 中性面轮换逻辑（区块交替）

```
Nav    → --s10  (#1a1e2a)  深
Hero   → --sf   (#fbf9f8)  浅
Pos    → --sf-low (#f5f3f2) 浅变
Modules→ --s20  (#2d3142)  深
Exec   → --sf   (#fbf9f8)  浅
Metrics→ --sf-low (#f5f3f2) 浅变
CTA    → --s10  (#1a1e2a)  深
```

**规则：相邻区块背景不能相同。深浅交替产生分区，禁用 1px 实线分割线于区块之间。**

---

## 6. 布局与间距

### 容器

```css
.shell {
  max-width: var(--max);   /* 1120px */
  margin: 0 auto;
  padding: 0 var(--gutter); /* 0 32px */
}
```

### 区块内边距

```css
padding: 112px 0;   /* 标准区块 */
padding: 136px 0 160px;  /* Hero (更大呼吸感) */
padding: 120px 0 0;      /* CTA 区 (底部由 footer-bar 决定) */
```

### 网格规范

```css
/* 2 列 */
grid-template-columns: repeat(2, 1fr);        /* 对等两列 */
grid-template-columns: 1fr 1.1fr;             /* 执行路径 - 左文右卡 */
grid-template-columns: 1fr 1fr;               /* 区块标题 */

/* 3 列 */
grid-template-columns: 1.1fr 1fr 1fr;         /* 信任卡片网格 (first 略宽) */
grid-template-columns: repeat(3, 1fr);         /* 数据网格 */

/* 模块网格 */
grid-template-columns: repeat(2, 1fr);  gap: 16px;  /* Modules 2x2 */

/* 数据卡 */
grid-template-columns: 1.2fr 1fr;  gap: 20px;  /* Metrics */
```

### 间距节奏（基于 8px 网格）

```
8px  → icon 内边距 / 小间隔
12px → 细节间隔
16px → 模块卡片内 gap / 标签行 gap
20px → 卡片间 gap / 信息组 gap
24px → 卡片内 gap / 小节距
28px → 卡片 padding-top/bottom
32px → 卡片 padding / exec-card body padding
36px → 卡片 padding (较大卡片)
40px → hero-traction gap / 大项间距
48px → 封面元数据 margin-bottom
52px → hero CTA 下方 traction 间距
56px → section-head margin-bottom / 大布局 gap
64px → section-head margin-bottom (positioning)
80px → CTA 内两列 gap
96px → CTA padding-bottom (for footer-bar)
112px → 标准区块 padding
```

---

## 7. Logo / 品牌标识规则

### HTML 结构（所有使用场景通用）

```html
<!-- 深色底（Nav / CTA / 深色背景） -->
<a href="#" class="wordmark on-dark">
  <span class="z">Z</span><span class="apex">APEX</span>
</a>

<!-- 浅色底（管理后台 / 打印）-->
<a href="#" class="wordmark on-light">
  <span class="z">Z</span><span class="apex">APEX</span>
</a>
```

### 完整 CSS

```css
.wordmark {
  font-family: var(--ff-body);   /* Inter — 不可手绘 */
  font-weight: 500;
  letter-spacing: -0.08em;
  text-transform: uppercase;
  line-height: 1;
  display: inline-flex;
  align-items: baseline;
  user-select: none;
}
.wordmark .z    { font-weight: 900; letter-spacing: -0.06em; }
.wordmark .apex { font-weight: 500; letter-spacing: -0.06em; }

/* 深色底 */
.wordmark.on-dark .z    { color: var(--od);       }   /* #ffffff */
.wordmark.on-dark .apex { color: var(--od-quiet); }   /* rgba(255,255,255,0.48) */

/* 浅色底 */
.wordmark.on-light .z    { color: var(--ink);       }  /* #1b1c1b */
.wordmark.on-light .apex { color: var(--ink-quiet); }  /* rgba(27,28,27,0.44) */
```

### Logo 规则摘要

| 规则 | 值 |
|------|----|
| 字体 | Inter（仅此字体，禁止手绘重制）|
| Z / APEX 字号 | 相同（禁止 Z 大、APEX 小）|
| Z 字重 | 900 |
| APEX 字重 | 500 |
| 字间距 | `-0.08em` (wordmark) / `-0.06em` (Z & APEX spans) |
| 大小写 | 全大写 |
| 最小尺寸 | 数字 ≥ 20px height；导航 = 20px |
| 颜色 | 深色底：Z=白色，APEX=48%白；浅色底：Z=ink，APEX=44%ink |

### 禁用行为

- 不拉伸变形
- 不改变比例
- 不描边（stroke）
- 不添加阴影
- 不旋转
- 不在低对比背景（< 4.5:1）上使用

---

## 8. 组件目录

### 8.1 导航（Nav）

```html
<div class="nav-wrap">
  <div class="shell nav">
    <a href="#" class="wordmark on-dark nav-wordmark">
      <span class="z">Z</span><span class="apex">APEX</span>
    </a>
    <nav class="nav-links">
      <a href="#positioning">系统定位</a>
      <a href="#modules">核心模块</a>
      <a href="#execution">执行路径</a>
      <a href="#metrics">增长案例</a>
    </nav>
    <a href="#cta" class="nav-cta">预约诊断</a>
  </div>
</div>
```

```css
.nav-wrap {
  position: sticky; top: 0; z-index: 50;
  background: rgba(26, 30, 42, 0.94);
  backdrop-filter: saturate(180%) blur(20px);
  border-bottom: 1px solid var(--ol-dark);
}
.nav { height: 56px; display: flex; align-items: center; justify-content: space-between; }
.nav-wordmark { font-size: 20px; }
.nav-links a {
  padding: 7px 13px; font-size: 13px; font-weight: 500;
  color: var(--od-quiet); border-radius: var(--r-lg);
  transition: color 0.14s, background 0.14s;
}
.nav-links a:hover { color: var(--od); background: var(--od-faint); }
.nav-cta {
  display: inline-flex; align-items: center;
  height: 36px; padding: 0 18px;
  font-size: 13px; font-weight: 600;
  color: var(--od); background: var(--p10);
  border-radius: var(--r-md);
  transition: background 0.14s;
}
.nav-cta:hover { background: var(--p20); }
```

---

### 8.2 按钮系统

```html
<!-- 主按钮 (on dark sections) -->
<a class="btn btn--inverted btn--lg">预约增长诊断</a>

<!-- 次要按钮 (on light sections) -->
<a class="btn btn--outlined btn--lg">了解核心模块</a>

<!-- 深色幽灵按钮 -->
<a class="btn btn--ghost-dark">暂不了解</a>
```

```css
.btn {
  display: inline-flex; align-items: center; justify-content: center;
  height: 44px; padding: 0 22px;
  font-family: var(--ff-body); font-size: 0.9375rem; font-weight: 500;
  letter-spacing: -0.01em; border-radius: var(--r-md);
  border: 1px solid transparent; cursor: pointer;
  transition: background 0.14s, color 0.14s, border-color 0.14s;
  white-space: nowrap;
}
.btn--primary  { background: var(--p10);  color: var(--od); border-color: var(--p10); }
.btn--primary:hover { background: var(--p20); border-color: var(--p20); }
.btn--inverted { background: var(--s10);  color: var(--od); border-color: var(--s10); }
.btn--inverted:hover { background: var(--s20); border-color: var(--s20); }
.btn--outlined { background: transparent; color: var(--ink); border-color: var(--ol-strong); }
.btn--outlined:hover { background: var(--sf-high); }
.btn--ghost-dark { background: transparent; color: var(--od-muted); border-color: var(--ol-dark); }
.btn--ghost-dark:hover { color: var(--od); background: var(--od-faint); }
/* 尺寸修饰符 */
.btn--sm { height: 36px; padding: 0 16px; font-size: 0.8125rem; }
.btn--lg { height: 52px; padding: 0 32px; font-size: 1rem; }
```

---

### 8.3 微标签（Label / Class Label）

```html
<span class="label">GROWTH MODULE · 01</span>
<span class="label label--primary">增长诊断</span>
<span class="label label--on-dark">SYSTEM LAYER</span>
```

```css
.label {
  font-family: var(--ff-body); font-size: 0.6875rem;
  font-weight: 700; letter-spacing: 0.14em;
  text-transform: uppercase; color: var(--ink-quiet);
}
.label--primary { color: var(--p10); }
.label--on-dark  { color: var(--od-quiet); }
```

---

### 8.4 信任卡片（Trust Card）

```html
<div class="trust-grid">
  <!-- 特色卡（深色，占位更大） -->
  <div class="trust-card featured">
    <div class="label label--on-dark">核心立场</div>
    <div class="trust-card-icon">
      <svg ...></svg>
    </div>
    <h3>增长能力必须内生于组织</h3>
    <p>...</p>
    <div class="quote">"不是外包执行，是系统移植"</div>
  </div>
  <!-- 普通卡 -->
  <div class="trust-card">
    <div class="trust-card-icon"><svg ...></svg></div>
    <h3>...</h3>
    <p>...</p>
  </div>
</div>
```

```css
.trust-grid { display: grid; grid-template-columns: 1.1fr 1fr 1fr; gap: 20px; }
.trust-card {
  background: var(--sf-lowest); border-radius: var(--r-xl);
  padding: 36px 32px; box-shadow: var(--ambient);
  display: flex; flex-direction: column; gap: 20px;
}
.trust-card.featured { background: var(--s10); color: var(--od); }
.trust-card-icon {
  width: 40px; height: 40px; background: var(--p70);
  border-radius: var(--r-lg); display: flex; align-items: center; justify-content: center;
}
```

---

### 8.5 模块卡片（Module Card — 深色背景）

```html
<div class="modules-grid">
  <div class="module-card">
    <span class="module-num">MODULE · 01</span>
    <h3>增长诊断系统</h3>
    <p>...</p>
    <div class="module-tags">
      <span class="module-tag">渠道分析</span>
      <span class="module-tag">归因建模</span>
    </div>
  </div>
</div>
```

```css
.modules-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.module-card {
  background: rgba(255,255,255,0.05); border: 1px solid var(--ol-dark);
  border-radius: var(--r-xl); padding: 36px 32px;
  display: flex; flex-direction: column; gap: 16px;
  position: relative; overflow: hidden;
  transition: background 0.2s;
}
.module-card:hover { background: rgba(255,255,255,0.08); }
.module-card::after {
  content: ''; position: absolute; bottom: -40px; right: -40px;
  width: 160px; height: 160px; border-radius: var(--r-xl);
  background: radial-gradient(circle, rgba(47,102,144,0.18), transparent 70%);
  pointer-events: none;
}
.module-num { font-family: var(--ff-mono); font-size: 11px; letter-spacing: 0.12em; color: var(--p50); }
.module-tag {
  font-size: 0.6875rem; font-weight: 600; letter-spacing: 0.10em;
  text-transform: uppercase; color: var(--p50);
  background: rgba(47,102,144,0.15); padding: 4px 10px; border-radius: var(--r-sm);
}
```

---

### 8.6 执行步骤 + 交付卡（Execution Section）

```html
<div class="exec-layout">
  <!-- 左：步骤列表 -->
  <div class="exec-copy">
    <h2>90 天建成一台增长引擎</h2>
    <p>...</p>
    <div class="exec-steps">
      <div class="exec-step">
        <div class="step-num">
          <span class="n">01</span>
          <span class="days mono">D1–30</span>
        </div>
        <div>
          <h4>增长诊断</h4>
          <p>...</p>
        </div>
      </div>
    </div>
  </div>
  <!-- 右：交付物卡 -->
  <div class="exec-card">
    <div class="exec-card-head">
      <h3>交付物清单</h3>
      <span class="label label--on-dark">5 项核心交付</span>
    </div>
    <div class="exec-card-body">
      <div class="deliverable">
        <span class="d-num">01</span>
        <div>
          <h5>增长诊断报告</h5>
          <p>...</p>
        </div>
      </div>
    </div>
  </div>
</div>
```

---

### 8.7 数据卡片（Growth Card）

```html
<div class="metrics-grid">
  <div class="growth-card">
    <div class="growth-card-head">
      <span class="card-title">核心增长指标</span>
      <span class="label">DTC 品牌 · 2024</span>
    </div>
    <div class="growth-card-body">
      <div class="growth-metric">
        <div class="k">GMV 规模</div>
        <div class="v">$12.4M</div>
        <div class="delta">↑ vs 启动前</div>
      </div>
    </div>
  </div>
</div>
```

```css
.growth-card { background: var(--sf-lowest); border-radius: var(--r-xl); overflow: hidden; box-shadow: var(--ambient); }
.growth-metric .v {
  font-family: var(--ff-display); font-variant-numeric: tabular-nums;
  font-weight: 700; font-size: 2rem; letter-spacing: -0.03em; color: var(--ink);
}
.growth-metric .delta { font-family: var(--ff-mono); font-size: 0.75rem; color: var(--p10); }
```

---

### 8.8 CTA 区表单卡

```html
<section class="section-cta" id="cta">
  <div class="shell cta-inner">
    <div class="cta-copy">
      <h2>准备好为品牌装一台增长引擎了吗？</h2>
      <p>...</p>
      <div class="cta-actions">
        <a href="mailto:..." class="btn btn--primary btn--lg">直接发邮件</a>
      </div>
    </div>
    <div class="cta-card">
      <h4>预约增长诊断</h4>
      <p>...</p>
      <div class="cta-input-row">
        <input type="text" class="cta-input" placeholder="你的品牌名称">
        <button class="btn btn--primary">提交</button>
      </div>
    </div>
  </div>
  <div class="shell footer-bar">
    <a class="wordmark on-dark" style="font-size:16px">
      <span class="z">Z</span><span class="apex">APEX</span>
    </a>
    <span>© 2024 峥锐 ZAPEX · 品牌出海增长系统</span>
    <span>hello@zapex.io</span>
  </div>
</section>
```

---

### 8.9 分隔线（Inline 1px — 仅用于卡片内行间，禁用于区块间）

```css
/* 正确用法：卡片内行间分隔 */
.exec-step {
  background-image: linear-gradient(var(--ol-strong), var(--ol-strong));
  background-size: 100% 1px;
  background-repeat: no-repeat;
  background-position: 0 0;
}
.exec-step:first-child { background-image: none; } /* 首行无线 */

/* ❌ 禁止：区块间 <hr> 或 border-bottom: 1px solid */
```

---

## 9. 首页区块结构

### 完整区块地图

| # | ID | Class | 背景 | 主要内容 |
|---|-----|-------|------|---------|
| 0 | — | `.nav-wrap` | `rgba(26,30,42,0.94)` + blur | Logo · Nav links · CTA 按钮 |
| 1 | — | `.hero` | `--sf` (#fbf9f8) | H1 · Eyebrow · Sub · 按钮组 · Traction strip |
| 2 | `#positioning` | `.section-positioning` | `--sf-low` | Section head · Trust grid (3列) |
| 3 | `#modules` | `.section-modules` | `--s20` | Modules head · 4 卡片 2×2 |
| 4 | `#execution` | `.section-execution` | `--sf` | 90d exec steps · Deliverable card |
| 5 | `#metrics` | `.section-metrics` | `--sf-low` | Growth card · Case card |
| 6 | `#cta` | `.section-cta` | `--s10` | CTA copy · Form card · Footer bar |

### Hero 子结构

```
.hero
  └── .shell.hero-inner
        ├── .hero-eyebrow (pill badge)
        ├── h1 (含 em 蓝色强调)
        ├── .hero-sub (副标题)
        ├── .hero-actions (按钮组)
        └── .hero-traction (指标条：4 数字 + 3 分隔线)
```

### Modules 内容（4 模块固定名称）

| 编号 | 中文名 | 说明 |
|------|--------|------|
| MODULE · 01 | 增长诊断系统 | 渠道分析、归因建模、转化漏斗诊断 |
| MODULE · 02 | 渠道架构层 | 选品逻辑、市场矩阵、渠道配比 |
| MODULE · 03 | 付费获客引擎 | Meta / Google / TikTok 全链路 |
| MODULE · 04 | 数据归因体系 | 多触点归因、LTV 建模、CAC 优化 |

---

## 10. 响应式断点

```css
/* 平板及以下 (≤960px) */
@media (max-width: 960px) {
  .nav-links { display: none; }         /* 隐藏 nav 链接 */
  .hero h1 { font-size: clamp(2.5rem, 8vw, 3.5rem); }
  /* 所有多列网格 → 单列 */
  .section-head,
  .modules-head,
  .trust-grid,
  .modules-grid,
  .exec-layout,
  .metrics-grid,
  .cta-inner { grid-template-columns: 1fr; gap: 32px; }
  .trust-card.featured { order: -1; }  /* featured 卡提前 */
  .modules-head p { text-align: left; }
  .hero-traction { gap: 24px; }
  .traction-sep { display: none; }
}

/* 手机 (≤560px) */
@media (max-width: 560px) {
  .hero { padding: 96px 0 112px; }
  .hero-traction-item .num { font-size: 1.375rem; }
  .growth-card-body { grid-template-columns: 1fr; gap: 20px; }
  .growth-metric { border-left: none; border-top: 1px solid var(--ol-strong); padding: 16px 0 0; }
  .growth-metric:first-child { border-top: none; padding-top: 0; }
}
```

---

## 11. 交互与动效规范

### Transition 标准

```css
/* 快速状态切换 (hover) */
transition: background 0.14s, color 0.14s, border-color 0.14s;

/* 模块卡片（稍慢，有质感）*/
transition: background 0.2s;

/* 输入框 focus */
transition: border-color 0.14s;
```

### Hover 状态规则

| 元素 | 默认 | Hover |
|------|------|-------|
| Nav link | `od-quiet` | `od` + `od-faint` bg |
| Nav CTA | `p10` bg | `p20` bg |
| .btn--primary | `p10` | `p20` |
| .btn--inverted | `s10` | `s20` |
| .btn--outlined | transparent | `sf-high` bg |
| .module-card | `rgba(white,0.05)` | `rgba(white,0.08)` |
| .cta-input:focus | `ol-dark` border | `p40` border |

### 卡片装饰渐变（Module Card）

```css
/* 每张模块卡右下角隐藏渐变光晕 */
.module-card::after {
  content: ''; position: absolute; bottom: -40px; right: -40px;
  width: 160px; height: 160px;
  border-radius: var(--r-xl);
  background: radial-gradient(circle, rgba(47,102,144,0.18), transparent 70%);
  pointer-events: none;
}
```

### Hero 背景渐变

```css
.hero::before {
  background:
    radial-gradient(ellipse at 60% 0%, rgba(47,102,144,0.10), transparent 52%),
    radial-gradient(ellipse at 15% 100%, rgba(12,78,119,0.06), transparent 48%);
}
```

### 全局设置

```css
html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
body { font-feature-settings: "cv01","ss03","cv11"; }
```

---

## 12. 品牌语调规则

### 四大语调支柱

| 支柱 | 定义 | 写这样 | 不写这样 |
|------|------|--------|---------|
| 战略判断 | 用系统框架表达，不说模糊感受 | "渠道矩阵缺乏归因闭环" | "感觉渠道不太好" |
| 执行纪律 | 承诺可交付的具体成果，不夸大 | "90 天内交付 5 项核心文档" | "快速帮你实现增长" |
| 冷静控制 | CTA 是受控的下一步，不是紧迫推销 | "预约增长诊断" | "限时！马上抢占名额！" |
| 系统导向 | 用模块、引擎、架构等词，不用情绪词 | "增长操作系统重构" | "赋能你的出海之路" |

### CTA 文案规范

```
✅ 预约增长诊断      ← 受控动作
✅ 了解核心模块      ← 探索邀请
✅ 预约诊断          ← Nav CTA (极简)
❌ 立即免费咨询！    ← 销售施压
❌ 获取专属方案      ← 模糊承诺
❌ 开始你的增长旅程  ← 消费品语气
```

### 区块标题规范

```
✅ 不是代运营，是增长系统重构
✅ 为跨境品牌装一台增长引擎
✅ 90 天建成一台增长引擎
✅ 系统能力，交给你的团队

❌ 我们帮你做得更好！
❌ 全方位助力品牌出海
❌ 颠覆传统，引领增长
```

---

## 13. 明确禁止项

### 视觉禁止

| 禁止 | 原因 |
|------|------|
| 区块间用 `border: 1px solid` | 破坏 tonal-surface 层次感，用背景色差分区 |
| 卡片 `border-radius > 12px` | 超过 `--r-xl` 侵蚀品牌权威感 |
| 纯黑 `#000000` 作为文字色 | 用 `--ink` (#1b1c1b) |
| `box-shadow` 超过 2 层 | 只用 `--ambient` 或 `--lift`，不叠加 |
| 渐变按钮 | 主按钮用纯色 `--p10` |
| 霓虹色、荧光色 | 非 AI 产品，非消费品 |
| `border-radius: 50%` 于主要卡片 | 仅允许于 icon 底色、eyebrow-dot |
| Emoji 于正文 | 品牌形象不符 |

### 技术禁止

| 禁止 | 原因 |
|------|------|
| 引入第三方 CSS 框架 | 系统为手工 token，框架会覆盖 |
| 使用 `!important` | 破坏 token 优先级结构 |
| 内联 `style=""` 于重复元素 | 用 CSS class |
| `px` 定义字号（body 层级） | 用 `rem` / `em` / `clamp()` |
| 区块间 `<hr>` 分隔线 | 用背景色交替代替 |

### 内容禁止

| 禁止 | 替代 |
|------|------|
| 感叹号于标题 | 句号或破折号 |
| "赋能" / "助力" / "破局" | "系统重构" / "架构层" / "执行路径" |
| "一站式" / "全方位" | 具体模块名 |
| 英文标题混中文正文（不一致）| 统一语言层级 |

---

## 附录 A — 字体 HTML head 完整引入

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');
</style>
```

## 附录 B — 最小可用 Reset

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
body {
  font-family: var(--ff-body);
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--ink);
  background: var(--sf);
  font-feature-settings: "cv01","ss03","cv11";
}
a { color: inherit; text-decoration: none; }
img { display: block; max-width: 100%; }
ul { list-style: none; padding: 0; }
```

## 附录 C — 页面模板骨架

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ZAPEX · 峥锐 — [页面名]</title>
  <style>
    /* 1. Google Fonts @import */
    /* 2. :root tokens */
    /* 3. Reset */
    /* 4. Utilities (.shell, .label, .wordmark) */
    /* 5. Component styles */
    /* 6. Responsive @media */
  </style>
</head>
<body>
  <!-- NAV -->
  <div class="nav-wrap">...</div>

  <!-- SECTIONS (light/dark alternating) -->
  <section class="hero">...</section>
  <section class="section-positioning" id="positioning">...</section>
  <section class="section-modules" id="modules">...</section>
  <section class="section-execution" id="execution">...</section>
  <section class="section-metrics" id="metrics">...</section>
  <section class="section-cta" id="cta">...</section>
</body>
</html>
```

---

*文档版本：v1.0 · 2024-04 · 峥锐 ZAPEX Growth OS*  
*维护：每次新增页面或组件后同步更新本文档*
