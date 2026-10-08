## What it does

`implement-spec` 拿一份 [spec](https://www.aihero.dev/ai-coding-dictionary/spec) 和它的 [tickets](https://www.aihero.dev/ai-coding-dictionary/ticket)，在一次运行里把整件事落地。负责编排的 [agent](https://www.aihero.dev/ai-coding-dictionary/agent) 把每个 ticket 交给一个在独立 git worktree 里工作的 implementer [subagent](https://www.aihero.dev/ai-coding-dictionary/subagent)，把每个完成的 branch 合并进一条单一的 **integration branch**，对结果运行 [code-review](https://aihero.dev/skills-code-review)，并 resolve 这些 tickets。

它把 tickets 读成一张 **task graph**，而不是一份列表。Blocking edges 决定什么可以开始，所以在任意时刻都存在一条 **frontier**，由所有 blockers 都已落地的 tickets 组成，而 frontier 上的每个 ticket 都在同时运行。这就是它与把 tickets 一个一个做过去的区别：定节奏的是这张图的形状，而不是它们在 tracker 上的顺序。

## When to reach for it

你通过输入 `/implement-spec` 来调用它，agent 不会自行取用它。

| 你的情况 | 该用哪个 |
| --- | --- |
| 一份已拆成带 blocking edges 的 tickets 的 spec，你想在一次运行里全部落地 | `/implement-spec` |
| 一次一个 ticket，在你自己的 [context window](https://www.aihero.dev/ai-coding-dictionary/context-window) 里，ticket 之间 [clearing](https://www.aihero.dev/ai-coding-dictionary/clearing) | [implement](https://aihero.dev/skills-implement) |
| 一份还没拆成 tickets 的 spec | 先走 [to-tickets](https://aihero.dev/skills-to-tickets) |
| 一小块没有什么真正图状结构的工作 | 直接 [implement](https://aihero.dev/skills-implement) |

## Prerequisites

- **一个 issue tracker。**这个 skill 从 [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) 配置的 tracker 读取 tickets，也在其上 resolve 它们。如果一个都没配置，它会停下来让你先运行那个 skill，而不是靠猜。
- **带着 blocking edges 的 tickets**，正如 [to-tickets](https://aihero.dev/skills-to-tickets) 写出来的那样。没有 edges，这张图就是平的，每个 ticket 都会同时开始。
- **一个能在后台运行 subagents、并给每一个一个 git worktree 的 [harness](https://www.aihero.dev/ai-coding-dictionary/harness)。**并发正是重点；一个一次只跑一个 subagent 的 harness 会得到一个更慢的 `implement`。

## The integration branch

所有东西都落在一条 branch 上。每个 implementer：

1. 开始之前确认自己的 worktree 基于 integration branch，
2. 用 [tdd](https://aihero.dev/skills-tdd) 构建它的 ticket，一次一个 red-green 切片，
3. 报告完成之前，把 integration branch 的 tip 合并进自己的 branch，这样落地它就是一次 fast-forward。

到底开不开 pull request，由 tracker 说了算。如果你的 tracker 通过 PR 关闭工作，或者你主动要一个，那么第一次 merge 之后会打开一个 draft PR，并在最后标记为 ready。否则这次运行就停在 integration branch 上，每个 ticket 都按你的 tracker 关闭工作的方式被 resolve，这在对一个本地 markdown tracker 的工作中完全可以离线完成。

Implementers 通过 [context pointers](https://www.aihero.dev/ai-coding-dictionary/context-pointer)（spec、ticket、共享的探索笔记、更早的 commits）与 orchestrator 沟通，而不是粘贴摘要，这让每个 subagent 的 prompt 保持很小，也让 orchestrator 的 window 空出来留给那张图。

## Common questions

**这和我自己对每个 ticket 跑 `/implement` 有什么区别？**

这正是这个 skill 存在要回答的问题。在它发布之前，人们不断搭建自己的版本，一位用户把这种渴望说得非常准确：他们想要"subagents 去 implement 那些 tickets"，而不是"当一份 spec 可能包含超过 5 个 tickets 时，还得一个个新建 session、告诉它们每次 implement 一个 ticket"。用 `implement` 时你是 dispatcher：每个 ticket 一个 [session](https://www.aihero.dev/ai-coding-dictionary/session)，中间 clearing，而且要靠你自己追踪哪些 tickets 已经 unblocked。`implement-spec` 把这份活交给一个负责编排的 session。代价是你不再在每份 ticket 的工作落地时逐一读它；你最后审查的是 integration branch。要开始一次运行，清空 context，输入 `/implement-spec` 并带上指向 spec 的 pointer（issue 编号或文件路径）。对没有真正图状结构的小改动，跳过它，直接用 `implement`。

**它需要 GitHub 吗？我希望它停在 branch 上。**

不，现在不需要了。一位喜欢 in-progress 版本的用户抱怨的正是这一点："它最后会创建一个 PR，这需要一个像 GitHub 这样的在线仓库。我希望它能离线做同样的工作，停在所有工作都合并进去的那条 branch 上。"现在的目标就是 integration branch。只有当配置的 tracker 通过 PR 关闭工作、或者你主动要求一个时才会开 PR，所以在本地 markdown tracker 上，这次运行以每个 ticket 都被 resolve、工作合并到 branch 上收尾。

**它的 review 和 fix 循环跑了几个小时，或者不停地去"修"那些还没构建的 tickets。**

两者都源于 `code-review` 跑到了这个 skill 给它留的那一个槽位之外。它把代码对照整份 spec 来审查，所以只有每个 ticket 都落地之后才有意义；在运行中途跑它，每个还没构建的 ticket 都会被读成一个失败，agent 会动手去构建它，而这又触发一次 review。在最后，这个 skill 运行一次 `code-review`，并把所有 findings 发给一个 fix subagent，但它还没有说明那次 fix 之后什么时候该停。一位用户报告了一个五 ticket 的功能："review 和 fix 的循环大概花了四个小时"。如果你看到第二轮宽泛的 review 开始了，就告诉它针对已修复的 findings 运行聚焦检查，然后停下。预期第一轮 review 会发现真问题：这次运行的产出是一份草稿，由 review 来完成，而不是可以直接发布的成品。

**它像 implement 那样驱动 tdd 吗？**

现在会了，虽然一开始不会。运行 in-progress 版本的用户注意到"implementer subagents 不继承 `/tdd` 指令"，于是 red-green 在从一个 ticket 扩大到一整份 spec 的那一刻就掉线了。现在每个 implementer 都用 `tdd` 构建它的 ticket。不过仍然没有 `implement` session 里那种交互式认可 seams 的步骤，所以如果你想固定 seams，就在 spec 或 tickets 里指名它们。

**两个并行运行的 implementers 在同一个文件上撞车了，或者给同一个东西起了不同的名字。**

Worktrees 不消除冲突；它们把冲突推迟到 merge 时。一条从 ticket 文字写出来的 blocking edge，是对每个 ticket 会碰哪些文件的猜测，而两个"处在 codebase 不同部分"的 tickets 仍然共享一个 message catalogue、一个 config registry 或一个 type。每个 implementer 只看到自己的 ticket 和共享笔记，从来看不到对方进行中的工作，所以一位用户的 web 和 mobile tickets 给同一个字符串分别添加了 `blockedSince` 和 `blockedOn`。当两个 frontier tickets 碰到同一个共享表面时，要么在它们之间加一条 blocking edge 让它们先后运行，要么让探索笔记固定每个 ticket 添加的确切名字。

**被阻塞的 tickets 永远不开始，即使它的 blocker 已经 merge 了。**

GitHub 上的一个已知粗糙边缘。tracker 的 blocked-by 计数只在 blocker *关闭*时才下降，而 tickets 通常在 PR merge 时才关闭，那已经是运行的尾声了。tracker 是起始图的正确来源，但在运行中途是一个过时的来源。告诉 orchestrator 自己追踪哪些 tickets 已经 merge 进了 integration branch，并据此计算 frontier。

**它会取代 Sandcastle 或某个 AFK 脚本吗？**

不会。人们这么问，是因为这些 skills 现在伸进了实现："Sandcastle 还重要吗？你的 skills 现在似乎也能处理实现了。"`implement-spec` 让一个 agent 在一个 harness session 内部负责编排，这不需要基础设施，也让你可以旁观和掌舵。对真正 [AFK](https://www.aihero.dev/ai-coding-dictionary/afk) 的工作，一个确定性循环（[Sandcastle](https://github.com/mattpocock/sandcastle)、一个 shell 脚本、一个 CI job）更快、更便宜也更可靠，因为编排的任何部分都不会跑偏。

**一个 ticket 的关键测试在它的 worktree 里被跳过了，而它报告 green。**

一个 worktree 只装 git 追踪的东西。读取 gitignored fixtures、本地数据库或凭据的测试，可能会在那里悄悄跳过自己。对一个验证依赖未追踪材料的 ticket，告诉 orchestrator 改在主 checkout 里运行它。

## It's working if

- 只要图允许，就有几个 implementers 在同时运行，而不是一个接一个。
- 一个 ticket 在它最后一个 blocker 落到 integration branch 上的那一刻就开始，而不是等整次运行结束。
- 每个 ticket 的 trace 都显示 `tdd` 在运行，代码之前先有一个失败的测试。
- 合并进 integration branch 的都是 fast-forward，而不是冲突解决。
- 运行在一条 branch 上收尾，每个 ticket 都被 resolve，而 PR 只在你的 tracker 需要时才存在。

## Where it fits

`implement-spec` 是 main chain 的 build step，是"每个 ticket 跑一次 [implement](https://aihero.dev/skills-implement)"的并行替代方案：

```txt
grill-with-docs → to-spec → to-tickets → implement-spec → retro
```

它的邻居是 [to-tickets](https://aihero.dev/skills-to-tickets)，它声明的 blocking edges 被读成一张 task graph；以及 [code-review](https://aihero.dev/skills-code-review)，它在收尾前对 integration branch 运行。当你不确定自己身处哪个 flow 时，[ask-matt](https://aihero.dev/skills-ask-matt) 是覆盖全集的 router。
