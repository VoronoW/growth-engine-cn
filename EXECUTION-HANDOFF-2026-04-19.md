# 网站改版执行接手文档

更新时间：2026-04-19
项目目录：`/Users/johnnyfish/growth-engine-cn-local/growth-engine-cn-release`

## 1. 当前项目状态

- 新 Netlify 站点已完成迁移并上线。
- 当前线上站点：
  - `https://genuine-torte-6d81a2.netlify.app`
- 最新生产部署：
  - `69e46e3f4d6330697693e373`
- 旧 Netlify 站点：
  - `beautiful-horse-283acd`
- 新站点已迁移旧站核心飞书环境变量。
- 本次任务的改版依据来自：
  - `/Users/johnnyfish/Downloads/网站修改建议(1).pdf`

## 2. 已完成的基础工作

- 首页、系统页、评估页、交付页、隐私页、条款页均已存在 v2 静态版本。
- 手机版导航已经修过一轮，当前手机和电脑共用同一个网址。
- 新站环境变量已从旧站迁移，飞书登录和工作台相关核心变量已补齐。
- 评估表飞书主表已连接到：
  - `FEISHU_TABLE_ASSESSMENT = tblecgZZJkqQYoim`

## 3. 本轮改版来源摘要

PDF《网站修改建议(1).pdf》共 10 页，核心要求如下：

### 品牌首页

1. 首屏 LOGO 改成“中文 + 英文标准版式”
2. 主文案改成：
   - `峥锐 ZAPEX 品牌出海加速器`
   - `为中国出海品牌 构建全球增长引擎`
3. “品牌战略 + 增长引擎双驱动”字要更大
4. 评估按钮文案改为：
   - `预约品牌咨询评估`
5. 首页大标题改成：
   - `用12个月，建立企业用几年才能跑出来的品牌增长系统`
6. 在对应位置新增“使命 / 定位 / 价值”板块
   - 排版可改
   - 文字内容不能改
7. 在“90%的跨境卖家为什么做不出品牌”之前新增板块：
   - 标题：`品牌战略 + 增长引擎 双驱动`
   - 副标题：`品牌战略定方向 + 增长引擎验证落地 → 战略定了 + 跑通了 + 能复制 + 增长可放大`
8. 首页原“90%的卖家做不出品牌”删掉，移到二级页
9. 首页新增：
   - `为什么选择峥锐 ZAPEX`
10. “如何开展合作”那组流程图要保留内容，但重做网页 UI
11. 流程模块下方按钮改为：
   - `立刻预约品牌化诊断`
12. 该按钮应跳转到品牌评估/咨询入口

### 系统与模块页

1. 主标题改成：
   - `品牌战略 + 增长引擎双驱动`
2. 副标题改成：
   - `只有品牌战略没有增长引擎，只是一堆无法落地的PPT。`
   - `只有增长引擎没有战略，只能买流量建立不了品牌资产。`
3. 删除重复表达
4. 在“双驱动”板块下新增价值板块：
   - 标题：`峥锐ZAPEX不是一次性项目，而是交付“品牌大脑”和“增长引擎”，搭建出海品牌完整的增长结构`
   - 副标题：`通过战略咨询+增长陪跑+系统工具交付，让企业具备不依赖外部的品牌增长能力`
5. 下方三组价值内容按 PDF 原文保留
6. 第 7 页圈出的两处“多余表达”需要删除

### 交付与案例页

1. 整页删掉
2. 当前流程图搬到首页
3. 流程图文案不能改
4. UI 可以重新设计成网页风格

### 评估表页

1. 顶部第一块不动
2. 下方改放“为什么90%的跨境卖家做不出品牌”内容
3. 再下方新增显眼 CTA：
   - `如果您也有这样的问题，点击按钮填表，获取免费的品牌建设现状分析报告`
4. 评估表不要直接展示在网页上
5. 改成点击按钮后弹出表单
6. 表单抬头改为：
   - `填写详细信息，方便我们向您发送诊断报告`
7. 提交成功后弹出小助手二维码
8. 配文改为：
   - `扫码添加小助手，立刻预约30分钟品牌咨询诊断`
9. 红圈那行字删除

### 页脚 / 联系方式

1. 增加文案：
   - `扫码添加小助手，立刻预约30分钟品牌咨询诊断`
2. 地址修正为：
   - `优品文化创意园`
3. 增加客服电话：
   - `13316492740`
4. 新增公众号二维码区
5. 二维码旁文案：
   - `关注公众号，获取品牌出海案例深度解析、市场分析报告等免费工具`

## 4. 对应施工文件

### 主要会改的文件

- `/Users/johnnyfish/growth-engine-cn-local/growth-engine-cn-release/homepage-v2.html`
- `/Users/johnnyfish/growth-engine-cn-local/growth-engine-cn-release/system-and-modules-v2.html`
- `/Users/johnnyfish/growth-engine-cn-local/growth-engine-cn-release/delivery-and-cases-v2.html`
- `/Users/johnnyfish/growth-engine-cn-local/growth-engine-cn-release/assessment-v2.html`
- `/Users/johnnyfish/growth-engine-cn-local/growth-engine-cn-release/zapex-system.css`

### 可能同步的小范围文件

- `/Users/johnnyfish/growth-engine-cn-local/growth-engine-cn-release/privacy.html`
- `/Users/johnnyfish/growth-engine-cn-local/growth-engine-cn-release/terms.html`
- `/Users/johnnyfish/growth-engine-cn-local/growth-engine-cn-release/scripts/build-static-site.mjs`

## 5. 推荐施工顺序

1. 先改首页结构
   - 首屏
   - 使命/定位/价值
   - 双驱动
   - 为什么选择 ZAPEX
   - 合作流程迁入
2. 再改系统与模块页
   - 主标题和副标题
   - 新增价值板块
   - 删除重复表达
3. 再改评估页
   - 中段改成问题内容
   - 表单改按钮 + 弹窗
   - 提交成功态改二维码
4. 再处理交付页
   - 删除或降级为极简页
5. 最后统一 footer / 联系方式 / 二维码
6. 跑构建
   - `npm run build`
7. 发布到 Netlify

## 6. 目前待确认事项

这几个点还需要用户拍板：

1. `系统与模块页` 第 7 页“这两个地方删掉”
   - 目前理解为删掉两张模块卡上的重复解释文案
   - 但不确定是否连标题也删

2. `交付与案例` 导航如何处理
   - 方案 A：直接删除导航入口
   - 方案 B：保留入口但跳到首页流程锚点
   - 方案 C：保留一个极简独立页，只放流程图

3. `评估页` 触发方式
   - 方案 A：保留独立 `assessment-v2.html` 页面，但页面里是按钮 + 弹窗问卷
   - 方案 B：首页点击 CTA 直接弹窗，不再强调独立评估页

4. 素材缺口
   - 公众号二维码图片还没给
   - 若小助手二维码要更换，也还没给新图

5. “使命 / 定位 / 价值”那一页
   - 文字按 PDF 理解应完全照搬
   - 施工前最好再次核对一次最终原文

## 7. 当前已知素材

- PDF 修改意见：
  - `/Users/johnnyfish/Downloads/网站修改建议(1).pdf`
- PDF 转图临时文件：
  - `/tmp/site_pdf_pages/page-01.png` 到 `page-10.png`
- 总览图：
  - `/tmp/site_pdf_pages/contact-sheet.png`

## 8. 当前结论

下一个对话接手后，最合适的动作不是先写代码，而是先让用户确认 3 个结构决策：

1. 交付与案例导航怎么处理
2. 评估页是保留独立页还是首页直接弹窗
3. 系统页第 7 页圈出的两处，删“说明文案”还是“整块标题”

只要这 3 个点确认完，就可以直接进入施工。
