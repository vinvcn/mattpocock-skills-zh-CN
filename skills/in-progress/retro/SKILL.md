---
name: retro
description: "对一次 coding session 做 retrospective。"
disable-model-invocation: true
---

用户要求做一次 **retrospective**。你要针对 coding agent 的 **environment** 提出改进建议，以改善未来的运行结果。

## Steps

1. 调用 Skill 工具并指定 `writing-for-agents`，获取写作风格指南。

2. 阅读用户指定 session 的 primary sources。这可能意味着在本机搜索 session logs。如果用户没有指定 session，默认使用当前 session。

3. 在以下类别中寻找改进候选项。

- **Navigation**：agent 找到正确 files 有多容易？files 之间是否存在隐藏依赖？navigation pointer 能否让定位更容易？当 agent 花了很长时间才找到某段信息时使用。
- **Automated checks**：是否有 automated checks 可以捕获 agent 犯的错误？例如 linting、typing、tests 或 filesystem linters。当 agent 犯了本来可以被 automated check 捕获的错误时使用。
- **Coding standards**：是否应该给 **reviewer agent** 一条新规则来执行？是否应该删除或澄清现有规则？当 reviewer agent 没有发现一个错误时使用。
- **Global AGENTS.md**：是否有 steering instructions 应该移到 coding standards 或 automated checks？当 repo 或用户 global scope 中的 AGENTS.md 特别庞大时使用。
- **Tool economy**：agent 是否进行了可以简化的昂贵 tool calls？是否有特别消耗 tokens 的自定义 tooling（CLI、MCP 等）？当 agent 进行昂贵 tool call 时使用。
- **No-ops**：steering files 中是否有不改变 agent 行为的 instructions？当 steering files 庞大且难以维护时使用。
- **Information access**：是否有机会让 agent 获得更多信息？例如把 dev server logs tee 出来，或提供对 third-party services 的 read-only access。当关键的信息对 agent 不可用时使用。

4. 按严重程度顺序向用户呈现这些候选项。

## Reference

### Implementation vs Review

记住，所有工作都经过两个阶段：implementation 和 review。implementation agent 承受最大的 **context pressure**，负责探索、编写代码和调试失败。

review agent 承受最小的 context pressure——它收到的是 diff，因此不需要探索。它通常也不需要编写代码或调试。

因此，review agent 应负责施加 coding standards，而不是 implementation agent。

### Files

你可以访问 repo 中的几个 files：

- `CLAUDE.md`/`AGENTS.md`：这些 files 会被推入在此 repo 工作的任何 agent 的 context window。应当极其节制地使用，通常只放指向其他 files 的 navigation pointers。
- `CODING_STANDARDS.md`：这个 file 在 review 时读取，而不是 implementation 时读取。如果 standards file 超过 1,000 行，应当在其中加入指向 docs folders 的 **navigation pointers**。
- Docs：把 docs 当作 reference files，由其他 files 通过 pointers 指向。写新 docs 前先查找已有 docs。
