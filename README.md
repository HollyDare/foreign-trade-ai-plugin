# HollyDare 外贸 AI 助手

HollyDare 官方全系统 Codex 插件。插件通过统一远程 MCP 连接外贸平台，各业务系统按能力模块接入，当前覆盖产品线、MIC、获客与 CRM 操作。

## 让 Codex 帮你安装

把下面这段话完整复制到 Codex：

```text
请帮我安装 HollyDare 外贸 AI 助手。

官方插件地址：
https://github.com/HollyDare/foreign-trade-ai-plugin

请完成以下操作：
1. 添加这个 Codex 插件 marketplace。
2. 安装 foreign-trade-ai@hollydare。
3. 确认安装版本和远程 MCP 地址。
4. 安装完成后告诉我需要新建一个 Codex 任务。
5. 不要向我索取平台密码、MIC 密码、API Key 或 Cookie。
```

## 命令行安装

```bash
codex plugin marketplace add HollyDare/foreign-trade-ai-plugin
codex plugin add foreign-trade-ai@hollydare
```

安装完成后新建一个 Codex 任务，使插件和 MCP 配置生效。

## 登录

首次调用平台能力时，Codex 会打开平台 OAuth 登录页。使用自己的平台账号登录并授权即可。插件不读取 Codex 当前配置的 API Key，也不需要业务员提供平台密码、MIC 密码、Cookie 或令牌给 Codex。

## 已接入能力

- 查看当前公司、产品线、角色和 MIC 授权状态
- 查看当前公司的产品线，并在确认完整主数据后创建新产品线
- 查询可用于 MIC 上品的产品和规格
- 预览上品结果，并在业务员明确确认后创建自动发布任务
- 查看任务列表、任务详情和错误信息
- 在明确确认后控制任务或提交改版反馈
- 查看员工 MIC 授权状态，管理员可发送授权提醒
- 打开平台返回的 MIC 授权页、运营页和自动发布工作台
- 引导业务员把模糊问题整理成包含业务目标、实际情况、预期结果和可信系统证据的草稿
- 经业务员确认后提交到 `totoro-o/foreign-trade-ai-platform` GitHub Issues
- 查询本人提交的问题、处理状态和技术回复，并确认后追加补充说明
- 查看当前公司和产品线的获客 workspace、客户、来源批次和任务进度
- 在明确确认后初始化或修复获客 workspace
- 在明确确认后添加指定客户，并启动符合条件的优先客户深挖
- 搜索当前产品线的正式客户，并查看 Customer 360、联系人、来源、活动和负责人
- 查看本人或指定负责人的待跟进任务
- 在明确确认后记录客户活动、创建跟进任务或完成跟进任务
- 查看业务机会及其当前重点，并在明确确认后创建或更新机会
- 检查业务机会进入 ERP 销售订单前的就绪条件和缺失证据

远程 MCP 地址：`https://hollydare.cloud/api/mcp`

## 安全边界

- 插件只连接 HollyDare 官方远程 MCP。
- 公司和当前产品线身份只来自平台 OAuth，不接受工具参数覆盖。
- 写操作必须先展示目标和影响，并由用户明确确认。
- 插件仓库不包含平台源码、账号、密码、API Key、Cookie、令牌或环境配置。
