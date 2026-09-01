# HollyDare 外贸 AI 助手

HollyDare 官方全系统 Codex 插件。插件通过统一远程 MCP 连接外贸平台，各业务系统按能力模块接入，当前覆盖产品线、MIC、获客与 CRM 操作。

## 让 Codex 帮你安装

把下面这段话完整复制到 Codex：

```text
请帮我安装或修复 HollyDare 外贸 AI 助手。

官方插件地址：
https://github.com/HollyDare/foreign-trade-ai-plugin

请完成以下操作：
1. 必须在运行 Codex Desktop 的这台电脑本地执行；如果当前 shell 在远程、SSH 或云端环境，停止安装并明确说明，不能宣称成功。
2. 使用当前 Codex Desktop 实际使用的 codex CLI，确认命令写入的是该 Desktop 正在读取的 Codex 配置目录。
3. 添加这个 Codex 插件 marketplace；如果 hollydare 已存在，运行 codex plugin marketplace upgrade hollydare --json 更新 Git 快照。
4. 如果插件已安装，移除旧的 foreign-trade-ai@hollydare 后重新安装 foreign-trade-ai@hollydare。
5. 确认安装版本和远程 MCP 地址。运行 codex plugin list --json，只有 foreign-trade-ai@hollydare 显示 installed=true、enabled=true、版本不低于 0.6.1+codex.20260901162924、authPolicy=ON_USE，且 .mcp.json 仍指向 https://hollydare.cloud/api/mcp，才算安装完成。
6. 安装完成后告诉我需要完全退出并重新打开 Codex 桌面应用，再新建一个 Codex 任务；首次使用时完成平台 OAuth 登录。
7. 不要向我索取平台密码、MIC 密码、API Key 或 Cookie，也不要索取 OAuth token。
```

## 命令行安装

```bash
codex plugin marketplace add HollyDare/foreign-trade-ai-plugin
codex plugin marketplace upgrade hollydare --json
codex plugin add foreign-trade-ai@hollydare
```

修复旧安装时，在更新 marketplace 后先执行 `codex plugin remove foreign-trade-ai@hollydare --json`，再重新安装。`codex plugin list --json` 必须显示插件已安装、已启用、版本不低于 `0.6.1+codex.20260901162924`，并且 `authPolicy` 为 `ON_USE`。

安装完成后完全退出并重新打开 Codex，再新建一个任务，使插件和 MCP 配置生效。首次使用平台能力时完成 OAuth 登录。

## 登录与邮箱协作

首次调用平台能力时，Codex 会打开平台 OAuth 登录页。使用自己的平台账号登录并授权即可。插件不读取 Codex 当前配置的 API Key，也不需要业务员提供平台密码、MIC 密码、Cookie 或令牌给 Codex。

插件不内置 Gmail 或 Outlook App，也不托管邮箱授权。需要邮件上下文或邮箱动作时，业务员可以在 Codex 中另行使用自己已授权的邮箱工具；邮箱工具负责读取或发送，HollyDare CRM MCP 只归档已经确认的邮件事实。插件不会把草稿误报为已发送。

首次技术验收只能使用测试人员控制的发件和收件邮箱。不得向获客候选或正式客户发送测试邮件，也不得为了邮箱测试把真实候选纳入生产 CRM。

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
- 预览获客候选的重复客户和字段冲突，并在明确确认后受控准入 CRM
- 搜索当前产品线的正式客户，并查看 Customer 360、联系人、来源、活动和负责人
- 查看本人或指定负责人的待跟进任务
- 在明确确认后记录客户活动、创建跟进任务或完成跟进任务
- 查看业务机会及其当前重点，并在明确确认后创建或更新机会
- 检查业务机会进入 ERP 销售订单前的就绪条件和缺失证据
- 管理样品申请、样品版本、客户反馈和寄样事实
- 管理核价单、版本化报价、报价发送事实和客户接受证据
- 按业务需要创建并确认 PI；PI 不是成交必经步骤
- 预览销售订单，并在单独确认后创建不可变的成交快照和追加变更记录
- 配合业务员另行授权的邮箱工具处理邮件，并把确认后的邮件事实归档到 CRM

远程 MCP 地址：`https://hollydare.cloud/api/mcp`

## 安全边界

- 插件只连接 HollyDare 官方远程 MCP，不内置 Gmail 或 Outlook App，也不保存邮箱 OAuth 凭据。
- 公司和当前产品线身份只来自平台 OAuth，不接受工具参数覆盖。
- 写操作必须先展示目标和影响，并由用户明确确认。
- 插件仓库不包含平台源码、账号、密码、API Key、Cookie、令牌或环境配置。
