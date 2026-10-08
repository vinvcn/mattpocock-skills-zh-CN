---
name: wizard
description: 生成一个交互式 bash wizard，逐步引导人完成只有他们能执行的手动流程。用于 provisioning 基础设施、设置 credentials 或 CI secrets、走查不熟悉的第三方 dashboard，或运行一次性 migration 或 cutover。对于 agent 自己就能执行的步骤，不要调用它。
---

# Wizard

**wizard** 是一个 bash 脚本，它一步一步引导人完成一项手动流程：这类流程手动做很繁琐，每次重新向 AI 解释一遍也很繁琐。它会打开每个 URL，准确说明该点什么、该复制什么，捕获这些值，把它们写到该去的地方（`.env`、GitHub secrets），在每个阶段确认，并显示还剩多少个阶段。它可能用于配置第三方服务、运行一次性 migration，或把项目从一种状态迁移到另一种状态。

出色的 UX 已经由 [template.sh](template.sh) 解决：逐阶段的进度、confirmation gates、跨平台 URL 打开（含 WSL）、隐藏的 secret 输入、幂等的 `.env` upserts、`gh secret`/`gh variable` 写入，以及收尾 summary。**你的工作只是确定流程范围并编写它的各个 stage。** `STAGES` 标记之上的 library 在每个 wizard 中都完全相同；这种一致性正是重点：永远不要手动编辑它。

Wizard 默认是临时的：为单次运行而构建，保存到 scratch 或 `scripts/` 路径，任务完成后删除。只有当用户想要一条应留在 repo 中的可重复 setup 路径时，才 commit 它。

## 流程

### 1. 界定流程范围

梳理出人必须执行的每一个手动步骤，以及沿途捕获的每一个值。先读 repo，不要凭空发问：

- 对于 setup：`.env`、`.env.example`、`.env.*`、`README`、`docker-compose*`、framework config，以及 `.github/workflows/*`（每一处 `secrets.*` / `vars.*` 引用都是 wizard 必须产出的一个值）。
- 对于 migration 或 transition：当前状态、目标状态，以及两者之间不可逆的操作。

然后向用户展示有序的 stages 列表以及每个 stage 产出的值，并确认：他们可能增删或重新排序。

**Done when:** 每个 stage 都按顺序命名，并且对于每个捕获的值，你知道 (a) 人从哪里获取它，(b) 它写到哪里（`.env`、一个 GitHub secret、两者，或都不写；有些 stage 是纯操作），以及 (c) 它是 secret（隐藏输入）还是 public。

### 2. 描绘每个 stage 的路径

对于每个 stage，写出人遵循的精确路径：打开哪个 URL、在那里做什么、值在哪里显示、它填充哪个变量，例如 "Dashboard → Developers → API keys → Reveal test key → copy"。在你确实不知道当前 UI 或确切命令的地方，如实说明并询问用户或查阅文档：永远不要编造可能不存在的步骤。

**Done when:** 每个 stage 都能追溯到陌生人也能照做的具体指令。

### 3. 编写 wizard

把 `template.sh` 复制到目标路径。用每个步骤一个 `stage` 替换示例 stage，按依赖顺序排列。使用 library helpers（`stage`、`say`/`step`、`open_url`、`ask`/`ask_secret`、`write_env`、`set_secret`/`set_var`、`pause`/`confirm`），并把 `TOTAL_STAGES` 设为你编写的 stage 数量。

守住 template 设定的标准：在索取某个 URL 的值之前先打开它，对任何 secret 使用 `ask_secret`，对每个持久化的值使用 `write_env`，只对 CI 确实需要的值使用 `set_secret`，并在任何不可逆操作之前 `confirm`。每个 `stage` 都会清屏，因此只显示当前步骤：让一个 stage 只聚焦一项任务，这样人需要的内容就不会滚出视野。不要触碰标记之上的 library。

### 4. 验证并交接

- `bash -n <script>`；如果可用则运行 `shellcheck`。
- `chmod +x <script>`。
- 不要自己端到端运行它：它会打开浏览器并阻塞在人的输入上。改为静态追踪：step 1 中的每个值都被捕获并落到 step 1 所说的位置，并且每个 `set_secret` 名称都与 CI 中的某处 `secrets.*` 引用精确匹配。
- 告诉用户如何运行它。如果它是一条可重复的 setup 路径，就 commit 它并从 README 链接过去，让下一个人运行脚本而不是询问 AI。