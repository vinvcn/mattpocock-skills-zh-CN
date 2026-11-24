# 新 Skill 提案与贡献：历史政策与当前例外

本文件保留上游 `mattpocock/skills` 的历史政策记录，避免把上游规则误读为本仓库当前的投稿规则。

## 上游历史政策

上游目前不接受新 Skill 的提案或贡献，包括那些自带现成 branch 或 fork 的内容。上游认为 catalog 应刻意保持小型，每个 Skill 都会增加与其他 Skills、docs 页面、`ask-matt` 路由和 plugin manifest 同步的永久维护成本。如果行为可以由现有 Skills 组合出来，上游不会为它新增 Skill。

上游的原文政策见 [`.out-of-scope/new-skills.md`](https://github.com/mattpocock/skills/blob/main/.out-of-scope/new-skills.md)，贡献入口见上游 [贡献指南](https://github.com/mattpocock/skills/blob/main/CONTRIBUTING.md)。

## 本仓库当前例外

本仓库独立接受新的软件工程 Skill PR，但必须通过 [SCOPE.md](../SCOPE.md) 的评审门槛：真实问题、可复用、职责清晰、适合独立存在且可维护。

本仓库不把「新 Skill」本身作为拒绝理由，也不要求先获得 Discussion 批准。以下情况仍不属于收录范围：

- 只更换名称或重复现有能力。
- 可以用现有 Skills 简单组合，且没有独立维护价值。
- 只适用于单一项目、私有服务或个人工作流。
- 缺少真实使用场景、完成条件或验证证据。
- 通过 `in-progress/` 绕过评审。

上游是否收录由上游独立决定。本仓库合入不代表上游认可或收录。

## 上游历史拒绝案例

以下来自上游的 issue 用于说明其政策实践，不是本仓库的投稿记录：

- [#101](https://github.com/mattpocock/skills/issues/101): "Any skill to iteratively build CONTEXT.md (and ADRs) for a brownfield codebase?"
- [#414](https://github.com/mattpocock/skills/issues/414): "Add a `handoff-to-pro` skill for generating one-shot prompts for external frontier chat models"
- [#727](https://github.com/mattpocock/skills/issues/727): "new skill - teach pr"
- [#1051](https://github.com/mattpocock/skills/issues/1051): "Contribution ready: /red-team, the optional pre-implementation spec review from #633"
- [#1166](https://github.com/mattpocock/skills/issues/1166): "Skill proposal: agent-chat-ux for productivity (branch ready on fork)"
