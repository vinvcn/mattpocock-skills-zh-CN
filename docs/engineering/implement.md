## 它做什么

`implement` 构建那些已经被决定好的工作。你把它指向一个 [ticket](https://www.aihero.dev/ai-coding-dictionary/ticket)、一份 [spec](https://www.aihero.dev/ai-coding-dictionary/spec)，或你在对话里刚刚达成的计划，它就写代码、在 seams 上驱动 [tdd](https://aihero.dev/skills-tdd)、边走边 typecheck、最后运行 [code-review](https://aihero.dev/skills-code-review)，并提交到当前 branch。

它从不重新打开计划。没有访谈、没有澄清轮、没有提出不同方案。上游敲定的任何东西就是输入，这个 skill 的全部工作就是把它变成一次 commit。这正是它区别于对一个全新的 [agent](https://www.aihero.dev/ai-coding-dictionary/agent) 输入"build this"的地方：后者会在构建的同时乐于重新设计这件工作。

## 何时使用

你通过输入 `/implement` 调用它，[agent](https://www.aihero.dev/ai-coding-dictionary/agent) 不会自行取用它。它带着 `disable-model-invocation: true` 发布，所以其他 skill 也不能调用它。无论 [ask-matt](https://aihero.dev/skills-ask-matt) 还是 [to-tickets](https://aihero.dev/skills-to-tickets) 说"然后每个 ticket 走 `/implement`"，那都是给你的指令，而不是 agent 会在未提示下自己去做的事。

工作当前住在哪里，决定了这是否是正确的 skill：

| 工作… | 该用哪个 |
| --- | --- |
| 是 tracker 上的一个 ticket | `/implement #42`，每次 [session](https://www.aihero.dev/ai-coding-dictionary/session) 一个 ticket，ticket 之间 [clearing](https://www.aihero.dev/ai-coding-dictionary/clearing) context |
| 是一份 spec，尚未拆分，而构建横跨多个 sessions | 先用 [to-tickets](https://aihero.dev/skills-to-tickets)，然后每个 ticket 走 `/implement` |
| 是一份 spec，而且构建很小 | 直接对着 spec 走 `/implement` |
| 只存在于你刚刚那场对话里，而且仍然很小 | 就在那里、在同一个 window 里走 `/implement` |
| 还没有写在任何地方 | [grill-with-docs](https://aihero.dev/skills-grill-with-docs)，如果没有 codebase 则用 [grill-me](https://aihero.dev/skills-grill-me) |
| 是一个你想 test-first 的具体行为，没有 spec | 直接 [tdd](https://aihero.dev/skills-tdd) |
| 已经构建好了，你想让它被检查 | 直接 [code-review](https://aihero.dev/skills-code-review) |

同一个 session 的情况值得点名，因为 skill 自己的第一行没有覆盖它。`SKILL.md` 说的是 "the spec or tickets"，这会怂恿 [model](https://www.aihero.dev/ai-coding-dictionary/model) 去找一个并不存在的文件。如果计划只活在对话线程里，调用时就说清楚。

## 前置条件

`implement` 提交到你当前所在的 branch。它不会创建分支，也不会问。开始之前确认你正处于你想要工作落在其上的 branch。

如果 tickets 来自 [to-tickets](https://aihero.dev/skills-to-tickets)，它们所在的 tracker 由 [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) 配置。`code-review` 读取同一配置，以便在收尾时找到源起 spec。

## 一次运行做什么

一次运行是五个节拍，按顺序：

1. 读取 ticket 或 spec，厘清 seams。
2. 在预先认可的 seams 上驱动 [tdd](https://aihero.dev/skills-tdd)，一次一个 red-green 切片。
3. 频繁 typecheck，边走边运行单个测试文件。
4. 最后把完整测试套件跑一遍。
5. 运行 [code-review](https://aihero.dev/skills-code-review)，然后提交到当前 branch。

一次运行覆盖一个 ticket。[to-tickets](https://aihero.dev/skills-to-tickets) 产出的 tickets 是 tracer-bullet 垂直切片，大小按装进一个全新的 [context window](https://www.aihero.dev/ai-coding-dictionary/context-window) 来定，所以预期的节奏是：清空 context、implement 一个 ticket、提交、再清空。每个 ticket 都是自包含的，这正是让上一个 ticket 的 context 可以丢弃的原因。

## 预先认可的 seams

这个 skill 赖以运行的观念是 **seam**：你在其上观察行为的公开边界，而不伸手进去。测试活在 seams 上。在写任何代码之前就认可一个 seam、并在其上工作，正是让测试保持持久的原因，因为底下的实现可以被重写，而测试不必跟着变动。

"pre-agreed" 这个词在做实打实的工作，它同时也是这个 skill 最薄弱的一个关节。`implement` 内部没有任何东西去认可 seams。`tdd` 才是发问的那个 skill，它拒绝在未经确认的 seam 上写测试。所以在实践中，认可要么发生在 spec 的上游，要么发生在运行的第一次对话里。如果哪里都没发生，前置条件就永远不会触发，运行会悄悄变成"就是把代码写了"。在 spec 中指名 seams 正是阻止这一点的方法。

## 常见问题

**它完成了，但我的 ticket 仍然是 open 的，验收标准也仍然未被勾选。**

正确，而且在意料之中。`implement` 没有完成步骤。它在 commit 处结束，从不触碰工作项；这在 GitHub Issues 和本地 markdown tracker 上都得到了确认，所以这不是 tracker 集成问题。它也不会对 `code-review` 产出的 findings 采取行动，更不会勾选源起 issue 上的 `- [ ]` 框。你自己去关闭 ticket 并核对标准。这在依赖链上咬得最狠，因为 `to-tickets` 把 frontier 定义为所有 blockers 都已关闭的 tickets。如果没有任何东西被关闭，就永远不会有什么东西变得可见地 unblocked。

**我可以一次指向我所有的 tickets，或者并行运行几个吗？**

用 `/implement` 不行：一次调用，一个 ticket。要在一次运行里构建一整份 spec，用 [implement-spec](https://aihero.dev/skills-implement-spec)，它把 tickets 扇出到 [subagents](https://www.aihero.dev/ai-coding-dictionary/subagent)，每个在自己单独的 worktree 里，横跨 ready frontier，并把它们合并到一条 integration branch 上。在同一个 checkout 里并排运行多个 `/implement` sessions，比"不受支持"更糟：一份现场报告描述了某个 session 里的 `git commit --amend` 落在另一个 session 的 commit 上、一条 stash 从 `refs/stash` 里消失、以及 commit 落到错误的 branch 上，全部发生在一个下午、横跨三个 issues。这些 sessions 共享同一个 working directory、同一个 index 和同一个 HEAD。Git worktrees 是社区的变通方案，而且注意 `refs/stash` 也跨 worktrees 共享，所以单靠 worktrees 并不能修复 stash 的情形。

**它可以开 pull request 而不是 commit 吗？**

不是内建的。它直接提交到当前 branch，这让几个人觉得太急切：代码在他们有机会验证它能工作之前就落地了。没有任何配置 flag，也没有 PR 模式。人们会在调用里覆盖它（"commit 到一个 branch 并开一个 PR"），或者通过编辑他们本地的那份 skill 副本来覆盖。而当 agent 真的去写 PR 时，[pr](https://aihero.dev/skills-pr) 会塑造它的正文。

**`code-review` 说它看不到我的变更。**

`code-review` 审查 `git diff <fixed-point>...HEAD`，那排除了 staged 和 working-tree 的变更。`implement` 在提交之前运行它，所以除非已经存在一个中间 commit，否则那个 diff 里就没有任何东西可审查。多人报告过这一点，而且双方都未修复。先 commit，再对着你分支出去的那个点做 review。

另外，有些人刻意完全不想要运行内的 review，因为一个审查自己刚写的代码的 agent 会偏向自己的方案。在一个全新的 session 里对着一个 fixed point 运行 [code-review](https://aihero.dev/skills-code-review) 是合法的替代方案，也正是那个 skill 把它的两个轴线放在独立的 sub-agents 里运行的原因。

**一个 ticket 烧掉了 150k tokens。我用错了吗？**

很可能是 ticket 太大，而不是 skill 被误用。一次运行要做 codebase 探索、每个 seam 一个 red-green 循环、一整套完整测试和一次 review，所以一个不平凡的 ticket 超过 100k [tokens](https://www.aihero.dev/ai-coding-dictionary/token) 是正常的，而不是某种东西坏掉的迹象。杠杆在上游：在 [to-tickets](https://aihero.dev/skills-to-tickets) 里把 tickets 调到合适大小，让每个都能装进一个全新的 window。如果单个 ticket 老是爆掉，就拆分它，而不是调高 [effort](https://www.aihero.dev/ai-coding-dictionary/effort) 级别。

**在一个全新 session 里跑 `/implement #2`，却处理了完全无关的东西。**

`#2` 会对照 agent 能看到的任何编号列表来解析，而在一个全新 session 里，那可能是一个 todo 文件、一个 checklist、或另一份工作列表，而不是配置好的 tracker。解析是自信式的，而不是 fail-closed 的，所以这个错误在它开始之前并不明显。传入完整引用（issue URL 或 `owner/repo#2`），并让它开始之前先跟你确认标题。

## 它正常工作的标志

- session 以读取 ticket 或 spec 并复述它将构建什么来开场，而不是问你该构建什么。
- 你能在 trace 里看到一次真实的 `/tdd` 调用，而不只是在 diff 里出现测试。
- Typecheck 和单个测试文件在运行期间反复执行，完整套件在临近结束时跑一次。
- 运行在你当前 branch 上到达一次 commit，而你无需提示它继续。
- diff 是一个 ticket 分量的变更：贯穿每一层的垂直切片，而不是几个 tickets 被扫成一堆。

## 它在整体中的位置

`implement` 是 main chain 的 build step：

```txt
grill-with-docs → to-spec → to-tickets → implement → code-review → retro
```

它的邻居是 [to-tickets](https://aihero.dev/skills-to-tickets)（产出它所消费的 tickets 并声明决定其顺序的 blocking edges）、[tdd](https://aihero.dev/skills-tdd)（它在每个 seam 上内部驱动它），以及 [code-review](https://aihero.dev/skills-code-review)（它在提交之前运行它）。它位于规划类 skills 的下游并信任它们。它不会重新验证交给它的东西的形状，所以一张结构糟糕的地图或一个横向分层的 ticket 会照原样被构建。

这份信任正是 [wayfinder](https://aihero.dev/skills-wayfinder) 在 [to-spec](https://aihero.dev/skills-to-spec) 处并入这条 chain、而不是把它的地图直接循环进 `implement` 的原因。只有当场得出 effort 确实很小时，才从一张地图直接去 `implement`。

当你不确定自己身处哪个 flow 时，[ask-matt](https://aihero.dev/skills-ask-matt) 是覆盖全集的 router。