## 它做什么

`to-tickets` 把计划、[规格说明](https://www.aihero.dev/ai-coding-dictionary/spec)（spec）或当前对话拆成 issue tracker 上的一组 **[实现任务](https://www.aihero.dev/ai-coding-dictionary/ticket)**，并标明每项任务开始前必须完成的其他任务。

每项任务都是一个 **垂直切片（vertical slice，也称 tracer bullet）**：用一条窄而完整的路径贯穿本次变更涉及的各层（schema、API、UI、tests），完成时就能独立演示或验证。它不同于按技术分层拆分、最后再集成的方式。每项任务还应能在一个全新的[上下文窗口](https://www.aihero.dev/ai-coding-dictionary/context-window)内完成，因为接手它的可能是一个从未见过此前讨论的[新会话](https://www.aihero.dev/ai-coding-dictionary/session)。

## 何时使用

输入 `/to-tickets` 调用它，[agent](https://www.aihero.dev/ai-coding-dictionary/agent) 不会自行触发。

| 你的情况 | 运行什么 |
| --- | --- |
| 已有 spec issue，实现工作横跨多个会话 | `/to-tickets`，或 `/to-tickets #<spec_issue>` |
| 计划只在对话中，尚未写成文档 | `/to-tickets` 会直接读取当前对话，不需要另有 spec |
| 整个变更可在一个上下文窗口内完成 | 使用 [implement](https://aihero.dev/skills-implement)，无需拆分任务 |
| 方案尚未决定 | 先用 [grill-with-docs](https://aihero.dev/skills-grill-with-docs)，再用 [to-spec](https://aihero.dev/skills-to-spec) |
| [wayfinder](https://aihero.dev/skills-wayfinder) 地图中的决策都已完成 | 先用 [to-spec](https://aihero.dev/skills-to-spec) 汇总地图中的决策，再运行 `/to-tickets` |

这些任务生成时就已经包含 agent 接手所需的信息，不要再对它们运行 [triage](https://aihero.dev/skills-triage)。triage 用于处理外部提交的 issue。

## 前置条件

`to-tickets` 会把任务发布到 tracker，因此必须先通过 [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) 为当前 repo 配置 tracker 和 triage 标签。可以使用 GitHub 或 Linear 等真实 tracker，也可以使用 `.scratch/` 下的本地 Markdown 文件，后者无需额外设置即可工作。

## 垂直切片，而非技术分层

**水平切片**只交付变更的一个技术层。所有层完成之前，功能无法工作，而且一项任务的验收标准不得不依赖另一项任务的工作。**垂直切片**则一次交付一条贯穿所有层的窄路径，因此可以单独验证，验收范围也都在这项任务之内。

按技术分层拆分是最常见的错误。一个团队曾按层拆出 26 项任务，结果每关闭一项任务大约需要运行 agent 20 次，其中约四分之三是在返工。他们的事后复盘把各类失败都追溯到水平拆分，而不是实现本身。

发布之前，`to-tickets` 会先寻找前置重构的机会，也就是“先把改动变简单，再完成这个简单的改动”，并把这部分工作排在最前。然后，它把拆分方案列成编号清单，请你确认：粒度是否合适、前置依赖是否真实、是否需要合并或拆分。你批准之前不会向 tracker 发布任何内容，这轮确认就是提出异议和调整方案的地方。

## 任务之间的依赖

依赖关系是拆分结果的重点。记录方式取决于 tracker：

| Tracker | 依赖记在哪里 | 如何处理任务 |
| --- | --- | --- |
| 本地 Markdown | `.scratch/<feature>/issues/<NN>-<slug>.md` 下每项任务一个文件，用文本记录前置任务，按依赖顺序编号 | 从上到下手动处理 |
| 真实 tracker（GitHub、Linear） | 原生依赖链接；tracker 支持时使用 sub-issues | 前置任务全部完成后，即可认领该任务 |

无论哪种形式，依赖关系都记录在任务中。tracker 决定能否利用这些关系并行安排工作。`to-tickets` 只负责生成和发布任务，如何运行它们，例如逐个会话处理或并行处理，由你决定。

## 大范围重构的例外

大范围重构不遵循垂直切片规则。它是一个影响整个代码库的机械性变更，例如重命名数据库列或修改共享符号的类型。一次编辑可能破坏数千个调用位置，任何垂直切片都无法独立保持 CI 通过。

`to-tickets` 会改用 **扩展、迁移、收缩（expand–contract）** 的顺序：

- **扩展（Expand）**：在旧形式旁添加新形式，保持现有功能正常。
- **迁移（Migrate）**：按影响范围（如 package、directory）分批迁移调用位置，每批一项任务，并依赖扩展任务。旧形式仍然存在，因此每批 CI 都应通过。
- **收缩（Contract）**：确认没有调用方残留后，用最后一项任务删除旧形式，并让它依赖所有迁移任务。

如果单独批次也无法保证 CI 通过，就让它们共享集成分支，并增加最后的集成验证任务，依赖前面所有任务。此时只要求最终任务完成后 CI 通过。

## 常见问题

**它为一个三行改动拆出了十二项任务。**

过度拆分是这个 skill 最常见的问题。[模型](https://www.aihero.dev/ai-coding-dictionary/model)可能默认追求过细的原子单元，却丢失任务之间应有的分组。在确认阶段要求它合并任务即可。任务数量也有下限：如果整个变更能在一个上下文窗口内完成，就不需要这个 skill，直接使用 [implement](https://aihero.dev/skills-implement)。

**拆出来的任务按技术分层：一项全是 schema，另一项全是 API。**

这正是垂直切片规则要避免的问题，但模型仍可能这样拆。在确认阶段，对每项任务问一句：“它完成时，我能演示什么？”无法回答的任务就是水平切片。有些人会在每项任务中加一行“演示路径”，这能促使模型按垂直切片拆分。

**GitHub 上没有把任务创建为 spec issue 的 sub-issues。**

这个问题曾在十几次运行和多个模型中出现，[最完整的报告见 issue #554](https://github.com/mattpocock/skills/issues/554)。现已修复：`to-tickets` 会把每项任务创建为来源 issue 的 sub-issue，GitHub tracker 模板也给出了命令（`gh issue create --parent <n>`，`gh` 2.94+）。重新运行 [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills)，即可刷新旧版的 `docs/agents/issue-tracker.md`。

**“Blocked by” 被写进了 issue 正文，而不是真正的依赖链接。**

同类问题[见 issue #513](https://github.com/mattpocock/skills/issues/513)。其中的 agent 甚至断言 GitHub 没有原生依赖关系，但实际可以使用 `gh issue create --blocked-by 12,15`。这个 skill 会先发布前置任务，因此创建后续任务时总能拿到它们的编号。只有 tracker 不支持原生依赖关系时，才回退到正文中的 “Blocked by”；已经设置原生关系时，任务模板会省略 `## Blocked by`。

**本地任务文件去哪了？v1.1 的说明提到根目录的 `tickets.md`。**

那是旧版的问题。共享文件还会让多个 agent 并行写入时发生竞争。现在，本地模式会按依赖顺序，在 `.scratch/<feature-slug>/issues/<NN>-<slug>.md` 下为每项任务写一个文件，与本地 tracker 模板描述的布局一致。`NN` 前缀就是实际任务编号，因此可以直接使用 `/implement 03`，不必重取长标题。

**它读取我的 spec 时一直截断。**

特别大的 spec 可能无法通过一次 tracker issue 查询完整取回，本地又没有副本，agent 只能通过多次[工具调用](https://www.aihero.dev/ai-coding-dictionary/tool-call)分段抓取。不要在 `/to-spec` 和 `/to-tickets` 之间[清空](https://www.aihero.dev/ai-coding-dictionary/clearing)或[压缩](https://www.aihero.dev/ai-coding-dictionary/compaction)上下文。在同一个上下文窗口内运行它们，agent 就不必重新抓取 spec。

**验收标准无法区分任务是否完成，有些在工作开始前就已经通过。**

模板要求写验收标准，但模型仍可能写出无法失效的标准。常见情况有三种：在起始 commit 上就已经成立、必须依靠另一项任务才能成立，或者只是复述需求而没有描述可验证的结果。垂直切片能避免其中大部分问题，因为交付新行为的任务在起始 commit 上本来就应该无法通过验收。仍建议手动检查每条标准：说出什么观察结果能证明它不成立，并确认这个失败在实现者起点的 commit 上确实可以复现。

**任务已经发布，接下来怎么运行？**

这个 skill 只生成任务，不会自动分派。你需要手动查看哪些任务没有未完成的前置任务，再打开相应数量的 agent 会话。每个任务使用全新的上下文，任务之间清理上下文。无论在 GitHub 还是本地 Markdown 中，[implement](https://aihero.dev/skills-implement) 完成时都不会可靠地关闭任务或勾选验收项，因此需要你更新任务状态。

## 它正常工作的标志

- 每项任务都能回答“完成时我能演示什么”，而且答案是用户行为，不是某个技术层。
- 发布之前，你会收到编号清单，每项任务都标明 “Blocked by”。
- 清单顶部的任务没有前置任务，可以立即开始。
- 任务正文不包含文件路径或行号，除非是 prototype 产出的代码片段。
- 一个全新会话只读任务内容，就能在你不在场的情况下独立完成它。
- 找到的前置重构都排在功能任务之前。

## 它在整体中的位置

`to-tickets` 是主要构建流程中的一步：

```txt
grill-with-docs → to-spec → to-tickets → implement → code-review → retro
```

上游的 [to-spec](https://aihero.dev/skills-to-spec) 提供已定稿的 spec。两者应保持在同一个上下文窗口内，中间不要清空上下文。下游的 [implement](https://aihero.dev/skills-implement) 在新会话中每次完成一项任务，通过 [tdd](https://aihero.dev/skills-tdd) 编写测试，并以 [code-review](https://aihero.dev/skills-code-review) 收尾。[implement-spec](https://aihero.dev/skills-implement-spec) 是另一种后续方式：它把同样的依赖关系读成任务图，在一条集成分支上并行构建所有已经就绪的任务。不确定该用哪个 skill 或流程时，让 [ask-matt](https://aihero.dev/skills-ask-matt) 帮你选择。
