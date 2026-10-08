## What it does

`handoff` 把你所处的对话压缩成一份 **handoff document**：一个写到你操作系统临时目录、而不是 workspace 里的 markdown 文件，一个新的 [agent](https://www.aihero.dev/ai-coding-dictionary/agent) 读完它就能接着干这份工作。

它买到的是**可移植性**，而不是压缩。这让这个 skill 比听起来更窄。只有当工作必须 *travel*（到一个新的 [harness](https://www.aihero.dev/ai-coding-dictionary/harness)、一个新的目录、一个同事，或者一个你想 fork 出去的 side task），你才需要一份文件。如果没有东西在 travel，你就不需要 handoff：留在当前 [session](https://www.aihero.dev/ai-coding-dictionary/session)、`/clear`、一个 [subagent](https://www.aihero.dev/ai-coding-dictionary/subagent) 和 `/compact` 就覆盖了普通的 phase 末尾情况，而且 `/compact` 比这个 skill 更常覆盖它。

## When to reach for it

你通过输入 `/handoff` 来调用它，agent 不会自行调用它。附上一句关于下一个 session 用途的说明，文档就会据此被写出。

四种情况就是全部触发点：

| 情况 | 为什么用文件 |
| --- | --- |
| 切换 harness（Claude → Codex） | 新的 harness 看不到旧的 [context](https://www.aihero.dev/ai-coding-dictionary/context) |
| 移动到不同的目录或 repo | prototype 目录是常见情况 |
| 把工作交给同事 | 他们需要一份能读的东西 |
| Fork 一个在 phase 中途发现的 side task | 你继续工作；第二个 agent 拿走那个 fork |

对于其他任何情况（相同的 harness、相同的目录、你已经完成 [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling) 并转向实施），`/compact` 才是选择。[ask-matt](https://aihero.dev/skills-ask-matt) 在 phase 边界上携带覆盖全部五个选项的有序 tree。

## Branching is the use people skip

这个 skill 的描述读起来像是 session 的恢复：写一份摘要、在这里结束、在那里恢复。这样读起来它像是一个更差的 `/compact`，所以被一带而过。Fork 的情况才是值得了解的。你**留在自己的 session 里**，把积累的 context 的一份副本交给一个并行工作的第二个 agent。

这正是经由 [prototype](https://aihero.dev/skills-prototype) 的绕行所利用的。你正深陷一场设计对话，遇到了一个只有运行代码才能解决的问题，而你不想把已经建立起来的 thread 花在查明它上。Hand off 到一个 prototype session，拿到答案，把答案交回来，并从原来的 thread 中引用它。两次跨越，一场活的对话，什么也不用重新解释。

在 phase 边界上，五个选项中的三个保留的东西各不相同：`/compact` 保留你的意图，`/clear` 什么都不保留，`/handoff` 保留这项工作移动的能力。

## What travels, and what doesn't

这份文档承载 live thread（进行着什么、为什么、下一步是什么），外加一个 **suggested skills** 小节，列出下一个 agent 应该调用什么。Secrets 在它被写出之前就被 redact。

它刻意不承载任何已经写下来的东西。Specs、plans、ADRs、issues、commits 和 diffs 都通过路径或 URL 引用，绝不复制。这保持文件小巧，也把已定型的细节保持在一个地方，而不是两个会漂移的地方。

## Common questions

**Handoff 还是 compact？**
只要没有东西在 travel，就用 `/compact`。停留在同一个任务上是 compact，而不是 handoff：相同的 harness、相同的目录，而且你需要保持在 loop 里，这正是 phase-boundary tree 大多数日子里落点所在。`/handoff` 的优势不是它摘要得更好；而是结果是一份你能带到 `/compact` 到不了的地方去的文件。

**那么 compact、clear 和 handoff 之间真正的区别是什么？**
是三种不同的东西在被保留。`/compact` 压缩这份 context，并让你在一个全新的 window 里继续，intent 存活。`/clear` 清空 window，从零开始；当你身后的一切都是可抛弃的时候这是正确的，反之则是一条单行道。`/handoff` 写出一份可移植的文件：工作在新地方继续存活。注意，三者都把 **[primary source](https://www.aihero.dev/ai-coding-dictionary/primary-source)**（发生过的对话）变成 **[secondary source](https://www.aihero.dev/ai-coding-dictionary/secondary-source)**（它的一份摘要）。只有继续是那个不变的做法，这正是它首先被排除的原因。

**我的 handoff 文件去哪了？**
临时目录，这是这个 skill 最常被报告的摩擦点：路径很长、因 OS 而异，而在 Windows 上 agent 有时要好几次尝试才能找到正确的那一个。在继续之前，让 agent 把路径报回来并保存它。Temp 是刻意的：一份 handoff 是过境文档，而不是你要维护的 artifact。它也不是耐久的，见下一个问题。

**我的 handoff 在 session 之间消失了。**
有些环境会在 session 之间清空 temp（Codex 是被报告的情况），而 `/private/tmp` 会在重启时消失。如果下一个 session 不会在一小时内开始，或者将在不同的 harness 下开始，就在文件被写出的那一刻自己把它复制到某个耐久的去处。这同样适用于文档*指向*的任何东西：一份引用 temp 中其他文件的 dispatch，是下一个 agent 无法跟进的 dispatch。

**我到底怎么把它交给下一个 agent？**
打开全新的 session，让它指向那个路径：读这个文件，然后继续。让 agent 指向文件，而不是把摘要粘贴进一条 shell 命令：一个包含反引号或 `$(...)` 的摘要，在被插值进 `claude "<summary>"` 时会被破坏，而常见的失败是静默截断而不是报错，所以新的 agent 会带着一份悄悄不完整的 brief 开始。

**这和 `/branch`、`--fork-session` 或内置的 `/handoff` 一样吗？**
类似，但不相同，而且 `/branch` 在这里并不是一个已发布的 skill，`/handoff` 才是规范名称。一个 fork 继承 context 的一份精确副本；这个 skill 产出一份针对所声明的下一个任务的*定向*压缩，保存在文件里。当 fork 可行时（同一台机器、同一个 harness、同一个目录），fork 的工作量更小。一旦目的地是 fork 到不了的地方，文件就赢了。

**什么时候某样东西反而该放进 `CLAUDE.md`？**
问问它在下个月是否依然成立。`CLAUDE.md` 是关于项目的常设 context，无论是否相关都会被加载进每个 session。一份 handoff 只关乎一项进行中的工作，一旦它落地就失效。反复需要重新解释的事实是 `CLAUDE.md` 的范畴；一项半成品的任务是 handoff 的范畴。

**它捕获的是 what，而不是 why。**
一个公允且反复出现的批评。有两件事有帮助。传递论据（告诉它下一个 session 是干什么的），这样与*那件事*相关的推理就会被保留，而不是被压平。还要留意 session 从未真正验证过的、自信的断言：「X 还没构建」、「Y 完成了」。下一个 agent 会把文档当作契约，不会重新检查它，所以一个被写成事实的信念会成为后续一切的错误前提。在把它交出去之前自己读一遍文档，并把任何你只是假设的东西降级。

**为什么它是一个 skill，而不是一条 slash command？**
两者都行；它们适合不同的情况。作为一个 skill，它通过与这里其他一切相同的 install path 发布与更新，这正是它可共享的原因：agent 不会自行触发它的约束是由它的 frontmatter 设定的，而不是由机制设定的。

## It's working if

- 文档只是对话的一小部分，而 specs、issues 和 diffs 以路径和 URL 的形式出现在其中，而不是被复制的文本。
- 你不需要打开原始 session 就能冷读它，并且知道接下来该做什么。
- 全新的 agent 开始工作，而不是让你重新解释 setup。
- 在 fork 的情况下，你回来时你的原始 session 仍原封不动地待在那里。
- suggested-skills 小节点名了你本来就会自己调用的那个 skill。
- 其中没有任何 key、token 或 password。

## Where it fits

`handoff` 是一个**随时可调用的 standalone**，它位于 sessions 之间的接缝处，而不是某条 build chain 内部，但它是窄窄一个，而诚实的图景是：在 phase 边界上，你用它会比用其他四个选项少得多。它最近的邻居是 [prototype](https://aihero.dev/skills-prototype)，因为 prototype 住在自己的目录里，而出出进进的往返正是这个 skill 所为之服务的跨越。当你处于一个边界、不确定是该 continue、clear、hand off、delegate 还是 compact 时，[ask-matt](https://aihero.dev/skills-ask-matt) 携带给那五个判序的 tree，并带你路由到该集合的其余部分。