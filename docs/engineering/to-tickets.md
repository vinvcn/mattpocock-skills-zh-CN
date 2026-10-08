## 它做什么

`to-tickets` 拿一个 plan、一份 [spec](https://www.aihero.dev/ai-coding-dictionary/spec) 或你所在的 conversation，并把它拆成你 issue tracker 上的一组 **[tickets](https://www.aihero.dev/ai-coding-dictionary/ticket)**。每个 ticket 都声明它的 **blocking edges**（在它开始之前必须完成的其他 tickets）。

每个 ticket 都是一颗 **tracer bullet**：一条穿过 change 每一层（schema、API、UI、tests）的窄但完整的路径，可以在它落地的瞬间独立 demo。正是这个约束让它与明显的拆分工作的方式（一次切一层、最后再集成）行为不同。它还会把每个 ticket 定尺寸到适合单个全新的 [context window](https://www.aihero.dev/ai-coding-dictionary/context-window)，因为接手这个 ticket 的会是一个从没见过你 spec 的 [session](https://www.aihero.dev/ai-coding-dictionary/session)。

## 何时使用

你通过输入 `/to-tickets` 调用它，[agent](https://www.aihero.dev/ai-coding-dictionary/agent) 不会自行触发。

| 你在哪里 | 运行什么 |
| --- | --- |
| 你有一个 spec issue，且 build 横跨几个 sessions | `/to-tickets`，或 `/to-tickets #<spec_issue>` |
| plan 只在 conversation 里，从未写成文字 | `/to-tickets` 直接读取 thread，不需要 spec |
| 整个 change 适合一个 context window | [implement](https://aihero.dev/skills-implement)，跳过 tickets |
| 什么都没决定 | [grill-with-docs](https://aihero.dev/skills-grill-with-docs)，然后 [to-spec](https://aihero.dev/skills-to-spec) |
| 一张 [wayfinder](https://aihero.dev/skills-wayfinder) map 已 cleared | 先 [to-spec](https://aihero.dev/skills-to-spec) 折叠 map，然后 `/to-tickets` |

`to-tickets` 产出的 tickets 按构造就是 agent-ready 的。不要在它们上面运行 [triage](https://aihero.dev/skills-triage)：triage 是为从别人那里到达的工作准备的。

## 前置条件

`to-tickets` 发布到一个 tracker，所以 [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) 必须先为这个 repo 配置好一个，连同 triage-label vocabulary。任一类型都可以：像 GitHub 或 Linear 这样的真实 tracker，或 `.scratch/` 下的 local markdown 文件，后者开箱即受支持。

## Tracer bullets，而非分层

**Horizontal** slice 交付 change 的一个层。在每一层都落地之前什么都不能工作，而每个 ticket 的 acceptance criteria 不得不伸进另一个 ticket 拥有的工作里。**Vertical** slice（tracer bullet）一次性交付一条穿过所有层的薄路径，所以它可以单独验证，并拥有它评分的一切。

这是人们最常打破的规则，后果也有充分记录。一个团队运行了一个按层切分的 26-ticket stack（corpus、producer、aggregator、selector），并且每个关闭的 ticket 大约有二十次 agent 运行，其中约四分之三是返工。他们自己的事后复盘把每个失败类别都追溯到 horizontal slicing，而不是实现。

在发布任何东西之前有两件事发生。`to-tickets` 寻找 prefactoring（"make the change easy, then make the easy change"），并把那部分工作排在最前。然后它把拆分方案呈现为编号列表，并就此考问你：粒度对不对、blocking edges 是否真实、有没有什么该合并或拆分。在你批准之前没有任何东西到达 tracker，而那场质问正是你反驳的地方。

## 阻塞边

Edges 是这个 artifact 的重点。它们根据 tracker 有两种读法：

| Tracker | edges 在哪里 | 你如何处理它们 |
| --- | --- | --- |
| Local markdown | `.scratch/<feature>/issues/<NN>-<slug>.md` 下每个 ticket 一个文件里的文本，blockers-first 编号 | 从上到下，手工 |
| 真实 tracker（GitHub、Linear） | native blocking links，或 tracker 有 sub-issues 时用 sub-issues | 任何 blockers 已完成的 ticket 都位于 **frontier**，可以被领取 |

无论哪种方式，edges 都活在 ticket 里。介质只决定是否有东西能并行地作用于它们。`to-tickets` 产出 artifact；运行它（一次一个 session，或一个 fleet）是你的工作，而不是 skill 的。

## Wide refactor 的例外

有一种形状打破 tracer-bullet 规则。**Wide refactor** 是一个单一的机械性变更（重命名一个 column、重新定义一个共享 symbol 的类型），其 **blast radius** 扇形展开到整个 codebase，所以一次编辑破坏数千个 call sites，没有任何 vertical slice 能以 green 落地。

`to-tickets` 改以 **expand–contract** 来切分它：

- **Expand**：在旧形式旁添加新形式，这样什么都不破坏。
- **Migrate**：按 blast radius 定批（按 package、按 directory）迁移 call sites，每批一个 ticket，每个都被 expand 所 block。CI 保持 green，因为旧形式仍然存在。
- **Contract**：一旦没有调用者残留，删除旧形式，放在一个被每个 migrate 批 block 的 ticket 里。

凡是连 batches 都无法独自保持 green 的地方，它们共享一个 integration branch，全部 block 一个最终的 integrate-and-verify ticket。Green 只在那里被承诺。

## 常见问题

**它为一个三行改动产出了十二个 tickets。**
Over-decomposition 是这个 skill 上被报告最多的摩擦，而且在从业者之间一致：[model](https://www.aihero.dev/ai-coding-dictionary/model) 默认原子单元，丢了会让它们有意义的 grouping。质问步骤正是为此存在：要求它 merge，它会照做。更深层的回答是：tickets 有一个下限，如果整个 change 适合一个 context window，你根本不需要这个 skill。直接去 [implement](https://aihero.dev/skills-implement)。

**tickets 出来是按层分的：一个里全是 schema，另一个里全是 API。**
这是 vertical-slice 规则针对去写的那个失败，而 skill 有时仍然会产出它。在质问步骤用每个 ticket 一个问题来抓住它：它完成时我能 demo 什么？一个没有答案的 ticket 就是一个 horizontal slice。有些人为此在每个 ticket 里加一行 "demo path"，并报告说这会把 model 推向 vertical decomposition。

**在 GitHub 上 tickets 没有被创建为 spec issue 的 sub-issues。**
已知且未修复。它已在十几次运行和几个模型中被报告，[最完整地见 issue #554](https://github.com/mattpocock/skills/issues/554)，而且在 Codex 上比 Claude 上更糟。`gh` 从 v2.94 起原生支持这个：`gh issue create --parent <n>`，以及事后的 `gh issue edit <parent> --add-sub-issue <n>`。在 tracker template 优先使用这些之前，运行后自己接好父链接是可靠的做法。

**"Blocked by" 被写进了 issue body，而不是一个真正的 blocking link。**
同类问题，[报告于 issue #513](https://github.com/mattpocock/skills/issues/513)，那里的 agent 甚至断言 GitHub 根本没有 native blocking relationship。它有的：`gh issue create --blocked-by 12,15`。因为 blockers 先被发布，它们的编号在创建时总是可用的。Body 文本本来是给没有 native edge 的 trackers 的 fallback，而不是默认。

**本地 tickets 去哪了？v1.1 的 notes 说一个根层级的 `tickets.md`。**
是的，那是一个 bug：一个共享文件在并行 agents 写入它时也会竞争。本地模式现在按依赖顺序，在 `.scratch/<feature-slug>/issues/<NN>-<slug>.md` 下每个 ticket 写一个文件，匹配本地 tracker template 已经描述的布局。`NN` 前缀是一个真实的 ticket ID，所以 `/implement 03` 可以工作，而不是重打一个长标题。

**它读我的 spec 时一直截断。**
一份非常大的 spec 可能超过一个 tracker issue 能干净回传的大小，也没有本地副本可回退，agent 然后烧掉 [tool calls](https://www.aihero.dev/ai-coding-dictionary/tool-call) 重新抓取 chunks，永远到不了头。不要在 `/to-spec` 和 `/to-tickets` 之间 [clear](https://www.aihero.dev/ai-coding-dictionary/clearing) 或 [compact](https://www.aihero.dev/ai-coding-dictionary/compaction)。在同一个 context window 里运行它们，spec 就完全不必被抓回来。

**acceptance criteria 什么都评不了：有些在任何工作完成之前就通过了。**
Template 要求 criteria，却没说什么它们能否失败，所以这种事会发生。有三种形状反复出现：一个在 base commit 上就已经为真的 criterion、一个只能由另一个 ticket 拥有的工作满足的 criterion，以及一个重述请求而非从 artifact 推导的 criterion。Vertical slicing 阻止了其中大部分（一个交付了之前不存在 behavior 的 slice 按构造在 base commit 上就是 red 的），但这项检查值得手工做。对每个 criterion，说出能证明它为假的观察，并确认它在 implementer 起点的 commit 上失败。

**tickets 已发布。我实际上怎么运行它们？**
Skill 止步于 artifact，没有 auto-dispatch 模式。分派是手工的：看板、数出没有未完成 blockers 的 tickets、打开同样多的 agent sessions。每个全新 context 一个 ticket，在它们之间清理。要注意 [implement](https://aihero.dev/skills-implement) 完成时不会可靠地关闭或勾选 ticket，无论是在 GitHub 还是 local markdown 上，所以 ticket 的状态由你更新。

## 它正常工作的标志

- 每个 ticket 都有一个对 "它完成时我能 demo 什么？" 的回答，而且回答是 behavior，不是层。
- 在发布任何东西之前，列表作为编号列表带着每个上的 "Blocked by" 行返回给你。
- 顶部的 ticket 没有 blockers，可以立即开始。
- ticket body 里没有任何东西是文件路径或行号，除非是 prototype 产出的代码片段。
- 每个 ticket 读起来都像一个全新 session 能在你不在场的情况下完成的东西。
- Prefactoring，凡找到的，都在顺序的前面，而不是混进 feature tickets。

## 它在整体中的位置

`to-tickets` 是 main build chain 中的一个步骤：

```txt
grill-with-docs → to-spec → to-tickets → implement → code-review → retro
```

上游是 [to-spec](https://aihero.dev/skills-to-spec)，它交来一份已定稿的 spec 供你切片，把两者保持在一个不间断的 context window 里。下游是 [implement](https://aihero.dev/skills-implement)，它每个全新 session 构建一个 ticket，为 tests 驱动 [tdd](https://aihero.dev/skills-tdd)，并以 [code-review](https://aihero.dev/skills-code-review) 收尾。[implement-spec](https://aihero.dev/skills-implement-spec) 是另一条向下的路：它把同样的 blocking edges 读作一张任务图，在一条 integration branch 上并行构建每一个就绪的 ticket。当你不确定哪个 skill 或 flow 合适时，[ask-matt](https://aihero.dev/skills-ask-matt) 会为你路由。