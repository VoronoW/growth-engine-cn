# Netlify 迁移清单

本项目准备迁移到新的 Netlify 账号时，先按本文档重建站点配置与环境变量。

## 1. Netlify 基本构建设置

- Repository: `https://github.com/VoronoW/growth-engine-cn.git`
- Branch to deploy: `main`
- Base directory: 留空
- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions`

`netlify.toml` 当前配置：

```toml
[build]
  command = "npm run build"
  publish = "dist"

[functions]
  directory = "netlify/functions"
```

## 2. 必填环境变量

以下变量需要在新 Netlify 站点的 `Production` 环境中补齐。

### 2.1 飞书 OAuth / 登录

| 变量名 | 是否必填 | 用途 | 备注 |
|---|---|---|---|
| `FEISHU_APP_ID` | 是 | 飞书应用 App ID | 客户工作台登录、表单提交 |
| `FEISHU_APP_SECRET` | 是 | 飞书应用 App Secret | 客户工作台登录、表单提交 |
| `FEISHU_REDIRECT_URI` | 是 | 飞书 OAuth 回调地址 | 格式：`https://你的域名/.netlify/functions/feishu-callback` |
| `FEISHU_SESSION_SECRET` | 是 | 登录态签名密钥 | 自定义长随机字符串 |

说明：
- 代码里也兼容 `SESSION_SECRET`，但现在统一建议只配 `FEISHU_SESSION_SECRET`。
- 如果同时存在，优先读取 `FEISHU_SESSION_SECRET`。

### 2.2 飞书多维表格主配置

| 变量名 | 是否必填 | 用途 | 备注 |
|---|---|---|---|
| `FEISHU_APP_TOKEN` | 是 | 多维表格 App Token | 从飞书多维表格 URL 的 `/base/` 后获取 |
| `FEISHU_TABLE_ASSESSMENT` | 是 | 公开评估表写入表 ID | 当前主表：`出海品牌评估表_主表` |

### 2.3 客户工作台子表 table_id

如果新站点还要保留“客户工作台 -> 飞书写入”功能，下面这些也都要一起配置：

| 面板 | 变量名 |
|---|---|
| A1 | `FEISHU_TABLE_A1` |
| A2 | `FEISHU_TABLE_A2_UTM` |
| A2 | `FEISHU_TABLE_A2_NAMING` |
| A3 | `FEISHU_TABLE_A3_OBS` |
| A3 | `FEISHU_TABLE_A3_QA` |
| A4 | `FEISHU_TABLE_A4` |
| B2 | `FEISHU_TABLE_B2_BASE` |
| B2 | `FEISHU_TABLE_B2_HOOKS` |
| B3 | `FEISHU_TABLE_B3_SKU` |
| B3 | `FEISHU_TABLE_B3_SCRIPT` |
| B4 | `FEISHU_TABLE_B4_CORE` |
| B4 | `FEISHU_TABLE_B4_WINNER` |
| B5 | `FEISHU_TABLE_B5_FUNNEL` |
| B5 | `FEISHU_TABLE_B5_RULES` |
| B6 | `FEISHU_TABLE_B6_ANALYSIS` |
| B6 | `FEISHU_TABLE_B6_SEEDS` |

## 3. 可直接导入的变量模板

把下面内容复制到 Netlify 环境变量后台，逐项填值即可：

```bash
FEISHU_APP_ID=
FEISHU_APP_SECRET=
FEISHU_REDIRECT_URI=
FEISHU_SESSION_SECRET=
FEISHU_APP_TOKEN=
FEISHU_TABLE_ASSESSMENT=
FEISHU_TABLE_A1=
FEISHU_TABLE_A2_UTM=
FEISHU_TABLE_A2_NAMING=
FEISHU_TABLE_A3_OBS=
FEISHU_TABLE_A3_QA=
FEISHU_TABLE_A4=
FEISHU_TABLE_B2_BASE=
FEISHU_TABLE_B2_HOOKS=
FEISHU_TABLE_B3_SKU=
FEISHU_TABLE_B3_SCRIPT=
FEISHU_TABLE_B4_CORE=
FEISHU_TABLE_B4_WINNER=
FEISHU_TABLE_B5_FUNNEL=
FEISHU_TABLE_B5_RULES=
FEISHU_TABLE_B6_ANALYSIS=
FEISHU_TABLE_B6_SEEDS=
```

## 4. 变量值从哪里拿

- `FEISHU_APP_ID` / `FEISHU_APP_SECRET`
  - 飞书开放平台 -> 对应应用 -> 凭证与基础信息
- `FEISHU_REDIRECT_URI`
  - 新 Netlify 生产域名 + `/.netlify/functions/feishu-callback`
- `FEISHU_SESSION_SECRET`
  - 新建一个随机长字符串即可，不需要和旧站一致
- `FEISHU_APP_TOKEN`
  - 飞书多维表格 URL 中 `/base/` 后那段
- `FEISHU_TABLE_*`
  - 对应数据表右上角 `...` -> `API` -> 复制 `table_id`

## 5. 上线后要验证的功能

迁移完成后至少测试这 4 项：

1. 首页分页能否跳转到：
   - `系统与模块`
   - `交付与案例`
   - `评估表`
2. `assessment-v2.html` 提交后是否成功写入 `FEISHU_TABLE_ASSESSMENT`
3. `growth-forms.html` 是否能正常飞书登录
4. 客户工作台任意一个子表提交是否写入正确 `FEISHU_TABLE_*`

## 6. 当前阻塞点

本机当前 `npx netlify status` 返回：

```text
Not logged in. Please log in to see project status.
```

所以我现在已经把迁移所需变量全部整理好了，但要真正把站点发到新的 Netlify 账号，还需要先在这台机器上完成一次新的 Netlify 登录。
