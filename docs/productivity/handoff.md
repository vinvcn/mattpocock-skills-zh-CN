## 它做什么

`handoff` 把你所处的对话压缩成一份 **handoff document**：一个写到你操作系统临时目录、而不是 workspace 里的 markdown 文件，一个新的 [agent](https://www.aihero.dev/ai-coding-dictionary/agent) 读完它就能接着干这份工作。

它给你的是**可移植性**，而不是压缩，所以这个 skill 比听起来更窄。只有当工作必须 *travel*（到一个新的 [harness](https://www.aihero.dev/ai-coding-dictionary/harness)、一个新的目录、一个同事，或者一个你想 fork 出去的 side task），你才需要一份文件。如果没有东西在 travel，你就不需要 handoff。留在当前 [session](https://www.aihero.dev/ai-coding-dictionary/session)、`/clear`、一个 [subagent](https://www.aihero.dev/ai-coding-dictionary/subagent) 和 `/compact` 覆盖了普通的 phase 末尾情况，而且 `/compact` 比这个 skill 更常覆盖它。

## 何时使用

你通过输入 `/handoff` 来调用它，agent 不会自行调用它。附上一句关于下一个 session 用途的说明，skill 就会为这个用途写出这份文档。

触发点有四个，而且只有四个：

| 情况 | 为什么用文件 |
| --- | --- |
| 切换 harness（Claude → Codex） | 新的 harness 看不到旧的 [context](https://www.aihero.dev/ai-coding-dictionary/context) |
| 移动到不同的目录或 repo | prototype 目录是常见情况 |
| 把工作交给同事 | 他们需要一份能读的东西 |
| Fork 一个在 phase 中途发现的 side task | 你继续工作；第二个 agent 拿走那个 fork |

对于其他任何情况（相同的 harness、相同的目录、你已经完成 [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling) 并转向实施），就用 `/compact`。[ask-matt](https://aihero.dev/skills-ask-matt) 在 phase 边界上拥有覆盖全部五个选项的有序 tree。

## 分叉是人们最常跳过的用法

这个 skill 的描述读起来像是 session 的恢复：写一份摘要、在这里结束、在那里恢复。这样读起来它像是一个更差的 `/compact`，所以人们会跳过它。Fork 的情况才是值得了解的。你**留在自己的 session 里**，把积累的 context 的一份副本交给一个并行工作的第二个 agent。

这正是经由 [prototype](https://aihero.dev/skills-prototype) 的绕行所利用的。你正深陷一场设计对话，遇到了一个只有运行代码才能解决的问题，而你不想把已经建立起来的 thread 花在查明它上。Hand off 到一个 prototype session，拿到答案，把答案交回来，并从原来的 thread 中引用它。工作跨越两次，你原来的对话保持活跃，而你什么也不用重新解释。

在 phase 边界上，五个选项中的三个保留的东西各不相同：`/compact` 保留你的意图，`/clear` 什么都不保留，`/handoff` 保留这项工作移动的能力。

## 什么随行，什么不随行

这份文档承载 live thread（进行着什么、为什么、下一步是什么），外加一个 **suggested skills** 小节，列出下一个 agent 应该调用什么。skill 会在写出文件之前把 secrets redact。

它刻意不承载任何已经写下来的东西。文档通过路径或 URL 引用 specs、plans、ADRs、issues、commits 和 diffs，绝不复制。这保持文件小巧，也把已定型的细节保持在一个地方，而不是两份会各自漂移的副本。

## 常见问题

**Handoff 还是 compact？**
只要没有东西在 travel，就用 `/compact`。停留在同一个任务上是 compact，而不是 handoff。当 harness 和目录保持不变、而且你需要保持在 loop 里时，phase-boundary tree 大多数日子里都落在 `/compact`。`/handoff` 并不会摘要得更好。它的优势在于结果是一份你能带到 `/compact` 到不了的地方去的文件。

**那么 compact、clear 和 handoff 之间真正的区别是什么？**
三者各自保留不同的东西。`/compact` 压缩这份 context，并在一个全新的 window 里继续，所以 intent 得以存活。`/clear` 清空 window，从零开始。当你身后的一切都是可抛弃的时候，这是正确的；如果不是，你将无法撤销。`/handoff` 写出一份可移植的文件，所以工作能在移动到别处之后继续存活。三者都把 **[primary source](https://www.aihero.dev/ai-coding-dictionary/primary-source)**（发生过的对话）变成 **[secondary source](https://www.aihero.dev/ai-coding-dictionary/secondary-source)**（它的一份摘要）。只有继续是那个不变的做法，这正是你首先排除它的原因。

**我的 handoff 文件去哪了？**
它去临时目录，这是这个 skill 最常被报告的问题。skill 把它解析为 `$TMPDIR`，否则为 `/tmp`（Windows 上是 `%TEMP%`），但路径很长。在继续之前，让 agent 把路径报回来并保存它。Temp 是刻意的，因为一份 handoff 是一份在途文档，而不是你要维护的 artifact。Temp 也不耐久，下一个问题会解释这一点。

**我的 handoff 在 session 之间消失了。**
有些环境会在 session 之间清空 temp（Codex 是被报告的情况），而一次重启会清空 `/private/tmp`。如果下一个 session 不会在一小时内开始，或者将在不同的 harness 下开始，就在文件被写出的那一刻自己把它复制到某个耐久的去处。这同样适用于文档*指向*的任何东西：如果一份 dispatch 引用了 temp 中的其他文件，下一个 agent 就无法跟进它。

**我到底怎么把它交给下一个 agent？**
打开全新的 session，让它指向那个路径：读这个文件，然后继续。让 agent 指向文件，而不是把摘要粘贴进一条 shell 命令。当你把一个包含反引号或 `$(...)` 的摘要插值进 `claude "<summary>"` 时，shell 会把它破坏掉。常见的结果是静默截断而不是报错，所以新的 agent 会带着一份不完整的 brief 开始，而且没有任何东西会告诉你。

**这和 `/branch`、`--fork-session` 或内置的 `/handoff` 一样吗？**
它们类似，但不相同。`/branch` 在这里并不是一个已发布的 skill，`/handoff` 才是规范名称。一个 fork 继承 context 的一份精确副本；这个 skill 产出一份针对所声明的下一个任务的*定向*压缩，保存在文件里。当 fork 可行时（同一台机器、同一个 harness、同一个目录），fork 的工作量更小。当目的地是 fork 到不了的地方时，文件是更好的选择。

**什么时候某样东西反而该放进 `CLAUDE.md`？**
问问它在下个月是否依然成立。`CLAUDE.md` 是关于项目的常设 context，无论是否相关都会被加载进每个 session。一份 handoff 只关乎一项进行中的工作，一旦它落地就没有用了。如果你反复重新解释某个事实，它就该放进 `CLAUDE.md`。一项半成品的任务就该放进一份 handoff。

**它捕获的是 what，而不是 why。**
这是一个公允的批评，而且人们经常提出。有两件事有帮助。传递论据（告诉它下一个 session 是干什么的），这样 skill 就会保留与*那件事*相关的推理，而不是把它压平。还要留意 session 从未验证过的、自信的断言，比如「X 还没构建」或「Y 完成了」。下一个 agent 会信任文档，不会重新检查它，所以一个被写成事实的信念会成为后续一切的错误前提。在把它交出去之前自己读一遍文档，并把任何你只是假设的东西降级。

**为什么它是一个 skill，而不是一条 slash command？**
两者都行；它们适合不同的情况。作为一个 skill，它通过与这里其他一切相同的 install path 发布与更新，这使它可共享。是它的 frontmatter 而不是机制，阻止了 agent 自行触发它。

## 它正常工作的标志

- 文档只是对话的一小部分，而 specs、issues 和 diffs 以路径和 URL 的形式出现在其中，而不是被复制的文本。
- 你不需要打开原始 session 就能冷读它，并且知道接下来该做什么。
- 全新的 agent 开始工作，而不是让你重新解释 setup。
- 在 fork 的情况下，你回来时你的原始 session 保持不变。
- suggested-skills 小节点名了你本来就会自己调用的那个 skill。
- 其中没有任何 key、token 或 password。

## 它在整体中的位置

`handoff` 是一个**随时可调用的 standalone**。它工作在 sessions 之间，而不是某条 build chain 内部。它是窄窄一个，在 phase 边界上，你用它会比用其他四个选项少。它最近的邻居是 [prototype](https://aihero.dev/skills-prototype)，因为 prototype 住在自己的目录里，而出出进进的往返正是这个 skill 所服务的那一步。当你处于一个边界、不确定是该 continue、clear、hand off、delegate 还是 compact 时，[ask-matt](https://aihero.dev/skills-ask-matt) 拥有给那五个判序的 tree，并带你路由到该集合的其余部分。