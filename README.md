# 品牌出海加速器｜增长引擎验证舱（90天）

面向跨境品牌的咨询级增长官网前端项目，核心定位为“增长指挥舱”而非展示型落地页。

## 技术栈

- React + Vite + TypeScript
- React Router（含 `/onboarding` 多步入舱页）
- 适配 Netlify SPA 部署

## 页面结构

- `/`：官网主页
  - Hero
  - 核心风险诊断
  - 解决方案架构
  - 90天执行路径
  - 交付库
  - 适配客户
  - 运营模型对比
  - 价值框架
  - 最终行动召唤
  - 页脚
- `/onboarding`：签约客户多步入舱表单
  - 企业画像
  - 营收与渠道结构
  - 投放与归因状态
  - SKU与内容生产
  - 团队结构
  - 90天目标
  - 访问清单
  - 优先议题

## 本地开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## Netlify

- Build command: `npm run build`
- Publish directory: `dist`
- SPA 重写：`public/_redirects`
