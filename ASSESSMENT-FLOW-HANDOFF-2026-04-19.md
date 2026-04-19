# 评估页改版接手文档

更新时间：2026-04-19
项目目录：`/Users/johnnyfish/growth-engine-cn-local/growth-engine-cn-release`

## 1. 本次任务范围

这份接手文档只覆盖一个动作：

- 将评估页从“整页直接展示问卷”改为：
  - 独立评估页入口
  - 中段内容解释区
  - 强 CTA 按钮
  - 点击按钮后打开全屏 modal
  - modal 内为完整问卷
  - 提交成功后切换为二维码完成态
- 同时把首页和系统页所有相关 CTA 统一指向这个新版评估页

本轮**不包含**：

- 其他首页内容改版
- 系统与模块页内容大改
- 交付与案例页删除或重构
- footer 地址/电话/公众号二维码增强

## 2. 当前结论

最终采用的是：

- 保留独立评估页：
  - `assessment-v2.html`
- 官网其他页面所有 CTA 统一跳这个独立页
- 评估页内部再用 modal 承载详细问卷
- 后端提交链路保持原样：
  - `/.netlify/functions/feishu-assessment`

也就是说，现在既满足：

1. 客户可拿单一链接直接进入评估页
2. 官网流量也能进入同一套评估流程
3. 所有数据继续统一进飞书后台

## 3. 已完成的改动

### 3.1 评估页结构已重构

文件：

- `/Users/johnnyfish/growth-engine-cn-local/growth-engine-cn-release/assessment-v2.html`

已完成内容：

1. 保留 hero 顶部首屏
2. 删除 hero 下方原来那条红圈小字
3. 中段加入：
   - `90% 的跨境大卖家为什么做不出品牌？`
   - 6 个痛点卡片
4. 新增强 CTA 区：
   - `如果您也有这样的问题，现在就填表`
   - 按钮文案：`填写品牌咨询评估表`
5. 点击 CTA 后打开全屏 modal
6. modal 顶部标题：
   - `填写详细信息，方便我们向您发送诊断报告`
7. modal 内保留完整问卷字段
8. 提交成功后，不再显示普通 success message
9. 改为显示二维码完成态，主文案：
   - `扫码添加小助手，立刻预约30分钟品牌咨询诊断`

### 3.2 后端提交逻辑未改

文件未动：

- `/Users/johnnyfish/growth-engine-cn-local/growth-engine-cn-release/netlify/functions/feishu-assessment.mjs`

保持不变的内容：

1. 继续 POST 到：
   - `/.netlify/functions/feishu-assessment`
2. 字段名不变
3. 字段白名单不变
4. 飞书字段映射不变
5. `提交来源` 仍然写：
   - `官网表单`

### 3.3 首页与系统页 CTA 已统一

文件：

- `/Users/johnnyfish/growth-engine-cn-local/growth-engine-cn-release/homepage-v2.html`
- `/Users/johnnyfish/growth-engine-cn-local/growth-engine-cn-release/system-and-modules-v2.html`

已完成内容：

1. 所有主要 CTA 统一指向：
   - `./assessment-v2.html`
2. 文案统一改为：
   - `预约品牌咨询评估`

## 4. 已验证结果

已完成这些验证：

1. `npm run build` 通过
2. `assessment-v2-standalone.html` 已重新生成
3. `dist/assessment-v2.html` 已包含：
   - modal 结构
   - CTA 按钮
   - 成功态二维码文案
4. 代码层检查通过：
   - `id="open-assessment-modal"` 存在
   - `id="assessment-modal"` 存在
   - `id="close-assessment-modal"` 存在
   - `id="success-panel"` 存在
   - `/.netlify/functions/feishu-assessment` 提交链路存在
   - 手机端全屏 modal 样式存在
   - `body.modal-open` 滚动锁存在

## 5. 当前涉及文件

已经修改的文件：

- `/Users/johnnyfish/growth-engine-cn-local/growth-engine-cn-release/assessment-v2.html`
- `/Users/johnnyfish/growth-engine-cn-local/growth-engine-cn-release/homepage-v2.html`
- `/Users/johnnyfish/growth-engine-cn-local/growth-engine-cn-release/system-and-modules-v2.html`

构建后同步影响：

- `/Users/johnnyfish/growth-engine-cn-local/growth-engine-cn-release/assessment-v2-standalone.html`
- `/Users/johnnyfish/growth-engine-cn-local/growth-engine-cn-release/dist/assessment-v2.html`
- `/Users/johnnyfish/growth-engine-cn-local/growth-engine-cn-release/dist/homepage-v2.html`
- `/Users/johnnyfish/growth-engine-cn-local/growth-engine-cn-release/dist/system-and-modules-v2.html`

## 6. 当前还没做的事

这一块如果下个对话继续，可以从这里接：

1. 浏览器层实际点测
   - 桌面端打开 `assessment-v2.html`
   - 点击 CTA 是否正常弹出 modal
   - modal 是否可关闭
   - 提交后是否正常显示二维码成功态

2. 手机尺寸点测
   - modal 是否真正全屏
   - 页面是否锁定背景滚动
   - 表单是否可上下滚动
   - 提交按钮是否在手机上可用

3. 真机/线上提交流程验证
   - 提交后是否真实进入飞书主表

4. 如需要，再部署到 Netlify

## 7. 现在最适合的下一步

如果新对话继续这个动作，建议顺序是：

1. 先做浏览器层桌面 + 手机交互检查
2. 再做一次真实提交测试
3. 如果都正常，再部署

## 8. 一句话交接

评估页已经完成“独立页面 + 内容解释区 + CTA + 全屏 modal 问卷 + 二维码完成态”的代码改造，首页和系统页的入口也已经统一到这个新版评估页；下一步主要是浏览器点测、移动端检查和最终部署。
