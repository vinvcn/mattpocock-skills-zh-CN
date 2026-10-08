## What it does

`code-review` 沿两条轴线 review `HEAD` 与你点名的一个固定点（一个 commit、一个 branch、一个 tag、`main`、`HEAD~5`）之间的 diff。**Standards** 问的是代码是否符合本仓库写代码的方式。**Spec** 问的是代码是否做了来源 issue 或 [spec](https://www.aihero.dev/ai-coding-dictionary/spec) 所要求的事。每条轴线都在各自的 [sub-agent](https://www.aihero.dev/ai-coding-dictionary/subagent) 中运行，这样谁也不会看到对方的推理。

两条轴线从不合并、也从不重新排序。报告以*每条轴线*的最严重问题收尾，并拒绝在它们之间点名一个单独的赢家，因为一个变更可能通过一条轴线却在另一条上失败：一段遵循了每一条约定、却实现了错误东西的代码通过 Standards 却败给 Spec；一段完全按 [ticket](https://www.aihero.dev/ai-coding-dictionary/ticket) 要求去做、却破坏了仓库约定的代码则相反。一个混合的裁决会让通过的那条轴线掩盖失败的那条。

## When to reach for it

输入 `/code-review`，或者当你要求 review 一个 branch、一个 PR、进行中的改动，或任何「since X」的内容时，由 agent 自动调用。

| 你的处境 | 指向 |
| --- | --- |
| 存在一个 diff，你想知道它是否*构建得对* *并且*是正确的东西 | `code-review` |
| 你想在 diff 里猎杀 bugs（null paths、races、off-by-one） | Claude Code 自己的内置 review，而不是这一个（见下面的命名冲突） |
| 什么都还没写，你想让它 test-first 地写出来 | [tdd](https://aihero.dev/skills-tdd) |
| 一整份 spec 需要被构建，review 包括在内 | [implement](https://aihero.dev/skills-implement)，它自己会调用这个 skill |
| 是整个 codebase 漂移了，而不是一个 diff | [improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) |
| 某个东西坏了，而你不知道为什么 | [diagnosing-bugs](https://aihero.dev/skills-diagnosing-bugs) |

你必须提供那个固定点。如果你没有提供，skill 会要求你提供一个，而不是猜测；然后它在生成任何东西之前会检查 ref 能解析、diff 非空，所以一个打错的 branch 名字会在你面前失败，而不是在两个 sub-agents 内部失败。

## Prerequisites

Standards 轴线不需要任何东西。它读取仓库记录的任何东西（`CODING_STANDARDS.md`、`CONTRIBUTING.md` 等），而当仓库什么也没记录时，回退到一个内置的 baseline。

Spec 轴线需要一份 spec 存在且可找到。它按这个顺序查找：

1. Commit messages 里的 issue references（`#123`、`Closes #45`、一个 GitLab `!67`），通过 `docs/agents/issue-tracker.md` 获取。
2. 你作为 argument 传入的一条路径。
3. `docs/`、`specs/` 或 `.scratch/` 下与 branch 或 feature 名字匹配的一份 spec 文件。
4. 问你。

第 1 步依赖 `docs/agents/issue-tracker.md`，它由 [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) 写入。没有它，如果你递给它一条路径，这条轴线仍然能工作。如果完全没有 spec，Spec 的 sub-agent 会被跳过，报告会说 "no spec available"，而不是编造需求。

## The two axes

| | Standards | Spec |
| --- | --- | --- |
| 问题 | 构建得对吗？ | 是正确的东西吗？ |
| 读取 | 仓库有文档记录的标准，外加 smell baseline | 来源 issue 或 spec |
| 报告 | 有文档记录的违规（可能很难），以及 smells（总是判断） | 缺失或部分实现的需求、scope creep、被错误实现的需求 |
| 每条 finding 引用 | 标准文件和规则，或点名 smell 加上 hunk | spec 的那一行 |

一个不了解你标准的通用 review skill，正是这个设计要避免的东西：它会标记你 codebase 里刻意的部分，却错过你 codebase 真正依赖的不变量。所以仓库自己的文档是 Standards 轴线上的 [primary source](https://www.aihero.dev/ai-coding-dictionary/primary-source)，而且 **repo 总是覆盖之**。

**Smell baseline** 是它底下的地板：来自《Refactoring》第 3 章的十二个 Fowler code smells：Mysterious Name、Duplicated Code、Feature Envy、Data Clumps、Primitive Obsession、Repeated Switches、Shotgun Surgery、Divergent Change、Speculative Generality、Message Chains、Middle Man、Refused Bequest。每一个都是一个带标签的启发式（「possible Feature Envy」），绝不是一条硬性违规，而且每一个都表述为 *它是什么* → *如何修复*，所以一条 finding 自带一个动作抵达，而不是自带一份抱怨。你的 linter 已经强制执行的任何东西，两条轴线都会跳过。

## Common questions

**它和 Claude Code 自己的 `/code-review` 冲突。我该怎么办？**

这是这个 skill 被报告最多的一个问题，而且没有修复。Claude Code 自带自己的 `/code-review`，它做的是不同的事：它在 diff 里猎杀 bugs，而这一个检查 spec 合规和仓库标准。安装这个库意味着其中一个会赢，而哪个赢取决于你如何安装。通过 plugin marketplace 安装时，一切都被别名到 `mattpocock-skills:` 前缀之下，内置的那个在非限定名字下就变得难以够到；通过普通 skills 安装时，本地文件会赢，这个 skill 遮蔽内置的。一个干净的答案是彻底移除 Claude Code 的内置 skills：一次巨大的 [context](https://www.aihero.dev/ai-coding-dictionary/context) 节省，而且冲突不再要紧。遮蔽本身按理说是 Claude Code [harness](https://www.aihero.dev/ai-coding-dictionary/harness) 的一个 bug（skill 作者本应可以随心所欲地给 skill 起名），所以另一个答案是重命名本地副本。编辑 frontmatter 或重命名目录会被 `npx skills update` 撤销；用户报告的可持久 workaround 是把 skill fork 到一个新名字，并把 `code-review` 从受管集合中剔除，记下你 fork 自哪个 commit，以便你能手动重新同步。

**它的 sub-agents 一直再次调用 `/code-review`，然后生成更多 agents。**

一个已知的 open bug，被多个人、并且在一个以上的 harness 里复现。Standards 和 Spec 的 prompts 没有禁止委托，所以一个 sub-agent 可以重新发现这个 skill 并再次扇出：一份报告达到了 50 多个 agents。人们在自己的 fork 上应用的修复，是给两个 sub-agent brief 各追加一行：「Do not invoke `/code-review` or spawn additional agents: perform this review directly.」有些人倾向于在 harness 层面处理，这样每个 skill 都继承这个保护。两者都还没有进入已发布的 skill。如果你无人值守地运行它，注意 agent 数量。

**我应该在写代码的那场 [session](https://www.aihero.dev/ai-coding-dictionary/session) 里运行它吗？**

最好用一场新的。正如一位读者所言：「Same context reviewing itself isn't review, it's confirmation bias with a slash command.」写作 session 里的 reviewing agent 持有塑造了代码的每一个假设，而这恰恰是一位独立 reviewer 不会拥有的 context。这也是为什么人们请求 [implement](https://aihero.dev/skills-implement) 不要带内置 review 步骤：它在刚写出 diff 的那场 session 里运行 review。从一场干净的 session 你自己调用 `/code-review` 才是诚实版本。

**每个 ticket 之后，还是最后来一次？**

两者都行，skill 不会替你决定。逐 ticket 让每个 diff 足够小，使 Spec 轴线有一个清晰的 spec 可以核对，这是 `implement` 使用的模式。批量到 branch 末尾则能抓住 ticket 之间逐 ticket 通过各自漏掉的交互。如果你不确定，逐 ticket review，并针对 branch 点跑一次最终 pass。

**我能信任这些 findings 吗？**

不检查就不行。Sub-agent 的输出是假设，不是证据：一个团队报告过十几处破坏性变更被基于散文的 review 放行。Skill 逐字或轻度清洗地合并两份报告，而不是对照文件重新验证每条断言，所以一条 finding 可能引用错误的位置或夸大影响。在照它行动之前，先读每条 finding 上的引用。每条 finding 都必须携带一个引用（一条 standards 规则、一个 smell 加其 hunk、或一行 spec），正是这一点让这一切可以被核查。

**为什么我每次运行它都会发现新问题？**

因为修复会制造新的表面，也因为 Standards 轴线的判断那半部分在两次运行之间不确定。一位读者直白地描述了那个循环：「/code-review and /improve-code-architecture always find new stuff every time. I implement fixes, rerun these skills, and again and again.」没有收敛保证。把一次 pass 当作一份线索清单，对背后有被引用规则的那些采取行动，然后停止，不要循环运行它直到它干净回来，因为它不会。

**它会 review 我未提交的工作吗？**

不会。它 diff `<fixed-point>...HEAD`，三点式，从 merge-base 度量，排除了 staged 和 working-tree 变更。如果 `implement` 没有做 interim commit，那么即将被提交的工作对 review 是不可见的。先 commit，再 review，然后 amend 或追加一个 fixup。

## It's working if

- 它在任何 sub-agent 生成之前，就拒绝在坏的 ref 或空 diff 上开始。
- 报告以 `## Standards` 和 `## Spec` 下的两个独立区块抵达，而不是一个合并的列表。
- 每条 Standards finding 都点名你仓库某个文件中的一条规则，或十二个 smells 之一，并引用 hunk；每条 Spec finding 都引用 spec 的一行。
- 收尾总结给出每条轴线的最大问题，并拒绝挑出一个整体赢家。
- 没有 spec 可用时，Spec 区块会说明这一点，而不是列出它从代码推断出的需求。

## Where it fits

`code-review` 是 build chain 靠近尾部的 review 步骤（`grill-with-docs → to-spec → to-tickets → implement → code-review → retro`），也能在你指向它的任何 branch 或 PR 上独立运行。

- [implement](https://aihero.dev/skills-implement) 是最接近的邻居：它驱动构建，并在提交前把此 skill 作为自己的收尾 review 调用。[implement-spec](https://aihero.dev/skills-implement-spec) 则在整条 integration branch 上一次性做同样的事。
- [retro](https://aihero.dev/skills-retro) 排在它之后并调校它：当一场 session 显示 review 漏掉了某一类错误时，`retro` 会提出 Standards 轴线随后读取的那条 check 或 `CODING_STANDARDS.md` 规则。
- [pr](https://aihero.dev/skills-pr) 在 review 过的工作推上去之后撰写 pull request 的正文。
- [to-spec](https://aihero.dev/skills-to-spec) 和 [to-tickets](https://aihero.dev/skills-to-tickets) 产出 Spec 轴线所要核对的那份文档；一份含糊的 spec 会让那条轴线也含糊。
- [improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) 是整个 codebase 的对口物：这个 skill 只看一个 diff。

当你不确定这个处境想要哪个 skill 时，[ask-matt](https://aihero.dev/skills-ask-matt) 会跨整套路由。