# 上游贡献规则调研

调研日期：2026-11-24。

调研对象：[`mattpocock/skills`](https://github.com/mattpocock/skills) 的上游贡献政策。结论以当时核对的上游 `main` 为准，固定 commit 为 [`abeeaf95660ba9e8b7c753eb38f441ca707a8823`](https://github.com/mattpocock/skills/commit/abeeaf95660ba9e8b7c753eb38f441ca707a8823)，提交时间为 2026-11-19。本文件是有时点的调研记录，不是本仓库的贡献规则；本仓库规则见 [SCOPE.md](../../SCOPE.md) 和 [CONTRIBUTING.md](../../CONTRIBUTING.md)。

## 结论

1. 上游当前不接受外部新增 Skill 的提案或贡献，包括已经准备好的 fork 或分支。
2. 上游 PR 仅协作者可创建。外部贡献者对现有 Skill 的修复，应通过 issue 描述。
3. `CONTRIBUTING.md` 将新 Skill 想法导向 Discussions Ideas，但更具体的 `SCOPE.md`、`.out-of-scope/new-skills.md` 和 issue 表单明确关闭新 Skill 提案与贡献。可以交流想法不等于接受纳入。
4. 本仓库保留外部新 Skill PR 入口，采用上游的真实问题证据、范围评审和提交者负责原则，但不复制「PR 仅协作者可创建」的限制。
5. 本仓库也提供 Discussions Ideas 和 Q&A：只有想法时可先交流，已有真实场景和完整实现时可直接提交 PR。Discussion 不是前置审批，本仓库和上游的交流都不构成收录承诺。

## 明文贡献入口

| 请求类型 | 上游当前规定 |
| --- | --- |
| 现有 Skill 的 bug | 提交 Bug issue |
| 修改现有 Skill | 提交 Idea or feedback issue |
| 使用问题 | Discussions Q&A |
| 新 Skill 想法或捐赠 | `CONTRIBUTING.md` 指向 Discussions Ideas，但新 Skill 提案与贡献均关闭 |
| 新 harness 或 issue tracker 支持 | 先读 `.out-of-scope/`，再去 Discussions Ideas |

来源：[上游 `CONTRIBUTING.md` 第 3-15 行](https://github.com/mattpocock/skills/blob/abeeaf95660ba9e8b7c753eb38f441ca707a8823/CONTRIBUTING.md#L3-L15)。

其中第 15 行明确规定：

> “Pull requests are open to collaborators only, so describe the fix in an issue instead.”

[新 Skill 政策第 1-13 行](https://github.com/mattpocock/skills/blob/abeeaf95660ba9e8b7c753eb38f441ca707a8823/.out-of-scope/new-skills.md#L1-L13)则写明：

> “This repo does not take proposals or contributions for new skills, including ones that arrive with a ready branch or a fork.”

原因包括目录刻意保持小型、每个 Skill 都增加永久维护成本，以及能由现有 Skills 组合出的行为不再新增 Skill。上游鼓励作者自行通过 skills.sh 发布。

[上游 `SCOPE.md` 第 14-18 行](https://github.com/mattpocock/skills/blob/abeeaf95660ba9e8b7c753eb38f441ca707a8823/SCOPE.md#L14-L18)同样规定新 Skill 提案和贡献关闭。[Idea 表单第 8-13 行](https://github.com/mattpocock/skills/blob/abeeaf95660ba9e8b7c753eb38f441ca707a8823/.github/ISSUE_TEMPLATE/idea.yml#L8-L13)还明确写着不接受新 Skill，`misc/` 已冻结。

## 修改现有 Skill 的门槛

[上游 `SCOPE.md` 第 5-12 行](https://github.com/mattpocock/skills/blob/abeeaf95660ba9e8b7c753eb38f441ca707a8823/SCOPE.md#L5-L12)要求 Idea 或 feedback issue 同时满足：

1. **Observed failure**：来自真实 session 的故障，说明运行了什么、Skill 做了什么、原本期望什么。纯粹「这样会更好」的假设性改进不达标。
2. **Fits the philosophy**：不命中 `.out-of-scope/` 或历史拒绝事项，也不只是配置选项、特定 harness 分支或某个人工作流的微调。后者应留在自己的 `AGENTS.md`、`CLAUDE.md` 或 fork 中。

改动大小不影响门槛，点赞和 `+1` 也不算通过依据。

[Idea 表单第 14-44 行](https://github.com/mattpocock/skills/blob/abeeaf95660ba9e8b7c753eb38f441ca707a8823/.github/ISSUE_TEMPLATE/idea.yml#L14-L44)还要求已读 `SCOPE.md` 并检查 `.out-of-scope/`、一个 issue 只谈一个问题、搜索重复 issue、指明现有 Skill、描述真实失败 session 及其 harness 和 model，并只描述最小修改，不粘贴完整重写版 `SKILL.md`。

[Bug 模板](https://github.com/mattpocock/skills/blob/abeeaf95660ba9e8b7c753eb38f441ca707a8823/.github/ISSUE_TEMPLATE/bug.yml)还要求版本或 commit、harness 与版本、模型与 effort、复现和预期行为。

## AI 撰写 issue 的规则

[上游 `CONTRIBUTING.md` 第 17-25 行](https://github.com/mattpocock/skills/blob/abeeaf95660ba9e8b7c753eb38f441ca707a8823/CONTRIBUTING.md#L17-L25)允许 agent 协助，但提交者自己负责：

- 一个 issue 一个问题。
- 保持一屏以内的短文本。
- 复现步骤放在分析之前。
- 不粘贴完整 spec、计划或重写后的 `SKILL.md`。
- 不把上游仓库当成自己项目的 spec/ticket 提交处。

## Bucket 与注册规则

这些是上游的仓库维护规范，不是外部新 Skill 的投稿许可。

上游 `AGENTS.md` 是指向 `CLAUDE.md` 的符号链接。[上游 `CLAUDE.md` 第 1-9 行](https://github.com/mattpocock/skills/blob/abeeaf95660ba9e8b7c753eb38f441ca707a8823/CLAUDE.md#L1-L9)定义：

- `engineering/`：日常代码工作。
- `productivity/`：日常非代码工作流工具。
- `misc/`：保留但很少使用，不推广。
- `in-progress/`：公开 beta，欢迎反馈，但不随 plugin 发布。
- `deprecated/`：不再使用。

[`in-progress` README 第 1-9 行](https://github.com/mattpocock/skills/blob/abeeaf95660ba9e8b7c753eb38f441ca707a8823/skills/in-progress/README.md#L1-L9)补充 beta Skill 不进入 plugin 和顶层 README，没有 docs 页面，可以无预警修改或删除。它是维护者试验的位置，不是外部投稿的绕入口。

对于 `engineering/` 和 `productivity/` 中的 Skill，上游要求顶层 README、bucket README、`.claude-plugin/plugin.json` 和 `docs/<bucket>/<skill-name>.md` 同步更新，并检查 `ask-matt` 路由。非 promoted buckets 不进入顶层 README 或 plugin，也不创建 docs 页面。修改任一 manifest 后运行 `claude plugin validate . --strict`。来源：[上游 `CLAUDE.md` 第 9-21 行](https://github.com/mattpocock/skills/blob/abeeaf95660ba9e8b7c753eb38f441ca707a8823/CLAUDE.md#L9-L21)。

上游的 [marketplace manifest](https://github.com/mattpocock/skills/blob/abeeaf95660ba9e8b7c753eb38f441ca707a8823/.claude-plugin/marketplace.json) 只有一个 plugin，没有逐 Skill 注册项；逐 Skill 注册位于 [plugin.json](https://github.com/mattpocock/skills/blob/abeeaf95660ba9e8b7c753eb38f441ca707a8823/.claude-plugin/plugin.json#L21-L49)。

本仓库还维护 dsh 插件注册与测试，这属于本仓库自身要求，不应归到上游规则。

## 调用与 frontmatter

[上游 `.agents/invocation.md`](https://github.com/mattpocock/skills/blob/abeeaf95660ba9e8b7c753eb38f441ca707a8823/.agents/invocation.md) 定义：

- **User-invoked**：`SKILL.md` 设置 `disable-model-invocation: true`，`agents/openai.yaml` 设置 `policy.allow_implicit_invocation: false`，description 面向人。
- **Model-invoked**：省略 `disable-model-invocation` 和整个 `policy` block，description 面向模型并保留触发语句。
- User-invoked Skill 可以调用 model-invoked Skill，不能调用另一个 user-invoked Skill。

每个 Skill 的 `agents/openai.yaml` 按规范应包含 `interface.display_name` 和 `interface.short_description`，user-invoked 再加 policy，并与 frontmatter 保持同步。

上游 CI 对每个 PR 和 `main` push 执行 `npm ci && npm run check-frontmatter`：[check.yml](https://github.com/mattpocock/skills/blob/abeeaf95660ba9e8b7c753eb38f441ca707a8823/.github/workflows/check.yml)。[检查脚本第 19-44 行](https://github.com/mattpocock/skills/blob/abeeaf95660ba9e8b7c753eb38f441ca707a8823/scripts/check-frontmatter.mjs#L19-L44)验证 frontmatter、严格 YAML 解析、重复 key、非空 `name` 与 `description`。

未找到「每个 Skill 必须附自动化测试」的上游明文规则。上游当前自动检查主要是 frontmatter，不等于本仓库不需要运行自己的 dsh 测试。

## PR 实践与未明确的规则

上游没有 `.github/PULL_REQUEST_TEMPLATE`。近期 PR 通常采用 Summary、Evidence、Merge Danger，来自其 [`pr` Skill](https://github.com/mattpocock/skills/blob/abeeaf95660ba9e8b7c753eb38f441ca707a8823/skills/engineering/pr/SKILL.md#L12-L33)，但不应把它描述成外部贡献者必须遵守的 GitHub 模板。

上游维护者仍会新增 Skill，例如 [`software-factory` PR #1316](https://github.com/mattpocock/skills/pull/1316) 和 [`constrain` PR #1441](https://github.com/mattpocock/skills/pull/1441)，通常先放 `in-progress/`。这与外部新 Skill 投稿禁令不矛盾，未找到外部贡献者获得特例的流程。

外部新 Skill 的实际拒绝案例包括：

- [Issue #1166：完整的 `agent-chat-ux` fork 分支](https://github.com/mattpocock/skills/issues/1166)，仍以 not planned 关闭。
- [Issue #1051：完整 `/red-team` 分支](https://github.com/mattpocock/skills/issues/1051)，同样以 not planned 关闭，并建议作者自行发布。

这些案例与明文政策一致，但单独评论不等于普遍政策。

未找到以下明文规定：

- 英文-only、翻译或本地化贡献政策。
- 外部新 Skill 的例外申请流程或「先 Discussion 获批再 PR」机制。
- 统一 branch、commit、fork、PR title 规范。
- 正式 review 人数、审批 SLA、合并窗口或外部 maintainer 提名规则。
- CLA、DCO 或额外贡献者协议。

上游采用 [MIT License](https://github.com/mattpocock/skills/blob/abeeaf95660ba9e8b7c753eb38f441ca707a8823/LICENSE)。MIT 许可允许按许可证复制、修改和再发布，但不等于上游承诺接受贡献。

## 对本仓库的政策影响

- 本仓库开放外部新 Skill PR，不复制上游的 collaborators-only 限制。
- 本仓库开启 Discussions，提供 Ideas 和 Q&A 分类；只有想法时可先交流，也可以直接提交完整 PR，讨论不构成收录承诺。
- 沿用真实问题、可复用性、独立职责、维护成本和提交者负责等评审原则。
- 不要求贡献者先向上游提交 PR，也不承诺本仓库合并后上游会收录。
- 上游政策变化时，更新本文件与 [贡献指南](../../CONTRIBUTING.md) 中的摘要；链接上游 live 文档供贡献者核对最新规则。
