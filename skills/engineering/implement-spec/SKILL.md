---
name: implement-spec
description: "在代码中实现 /to-spec 和 /to-tickets 的产出。"
disable-model-invocation: true
---

你已经获得一份 spec。这份 spec 应该有与之关联的 tickets，说明如何实现它。

Issue tracker 应当已经提供给你。如果没有，就告诉用户运行 `/setup-matt-pocock-skills`。

目标是在单个 **integration branch** 上实现整个 spec，并按 issue tracker 关闭工作的方式解决每一个 ticket。

tickets 不是步骤清单，而是一个 **task graph**，其中包含 blocking relationships。这意味着始终存在一个由可领取 tickets 组成的 **frontier**。

与 subagents 的通信应当简洁。主要通过 **context pointers** 通信：指向 spec、tickets、research notes 和之前的 commits。不要重复 pointers 已经提供的信息。

在可能的情况下，**implementer subagents** 应当在 background 中运行，以获得最大并发度。

## Steps

1. 阅读 spec 和 tickets，理解 task graph。

2. （可选）使用一个 **exploration subagent** 完成 tickets 所需的探索，即相关的 codebase files 或 external documentation。确保 exploration subagent 能够保存文件：它应当把 Markdown notes 保存到 repo 外、所有后续 subagents 都能访问的目录。这样 **implementer subagents** 就能专注于实现，而不必重复探索。

3. 创建 integration branch。如果 issue tracker 通过 PRs 关闭工作，或用户要求开 PR，就在第 5 步的首次合并之后打开一个 draft PR（不领先于 main 的 branch 无法开 PR），并标记它会关闭 spec 和 tickets。

4. 使用 **implementer subagents** 实现每个 ticket，每个 subagent 都在自己的 worktree 和 branch 上工作。每个 implementer subagent：
   - 开始前确认其 worktree 基于 integration branch，若不是则 reset 到它上面；
   - 调用 Skill 工具并指定 `tdd` 来构建 ticket；
   - 在报告完成前，把 integration branch 的 tip 合并进自己的 branch

5. 每个 **implementer subagent** 完成后，使用一个 **merger subagent** 把它的工作合并到 integration branch。

6. 如果这改变了可用 tickets 的 **frontier**，就启动更多 **implementer subagents** 处理新的 tickets。这样可以获得最大并发度。

7. 所有 tickets 完成后，在 integration branch 上调用 Skill 工具并指定 `code-review`。在单个 **implementer subagent** 中修复 code review 提出的所有问题。

8. 如果存在 draft PR，把它标记为 ready for review。否则，按 issue tracker 关闭工作的方式解决每个 ticket，并报告 integration branch。

9. 清理所有 **implementer subagent** 的 worktrees。
