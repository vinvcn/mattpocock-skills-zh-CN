---
name: implement-spec
description: "实现一份 specification 中描述的代码变更。"
disable-model-invocation: true
---

你已经获得一份 spec。这份 spec 应该有与之关联的 tickets，说明如何实现它。

目标是在单个 branch 上创建一个实现完整 spec 的 PR。

tickets 不是步骤清单，而是一个 **task graph**，其中包含 blocking relationships。这意味着始终会有一组可以领取的 **frontier tickets**。

与 subagents 的通信应当简洁。主要通过 **context pointers** 通信：指向 spec、tickets、research notes 和之前的 commits。不要重复 pointers 已经提供的信息。

在可能的情况下，**implementer subagents** 应当在 background 中运行，以获得**最大并发度**。

## Steps

1. 阅读 spec 和 tickets。读到足以理解 task graph。

2. （可选）使用一个 **exploration subagent** 完成 tickets 所需的探索——相关的 codebase files 或 external documentation。确保 exploration subagent 能够保存文件；它应当把 Markdown notes 保存到 repo 外、所有后续 subagents 都能访问的目录。这样 **implementer subagents** 就能专注于实现，而不必重复探索。

3. 创建一个 branch 和一个 draft PR。PR 应标记为会关闭 spec issue 和 tickets。

4. 使用 **implementer subagents** 实现每个 ticket。每个 implementer subagent 都应在自己的 worktree 和 branch 上工作。

5. 每个 **implementer subagent** 完成后，使用一个 **merger subagent** 把它的工作合并到 PR branch。

6. 如果这改变了可用 tickets 的 **frontier**，就启动更多 **implementer subagents** 处理新的 tickets。这样 implementer subagents 可以继续工作。

7. 所有 tickets 完成后，在 PR branch 上运行 `/code-review`。在一个 implementer subagent 中修复 code review 提出的所有问题。

8. 将 PR 标记为 ready for review。

9. 清理所有 implementer subagent 的 worktrees。
