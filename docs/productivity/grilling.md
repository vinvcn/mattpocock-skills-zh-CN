## What it does

`grilling` 是那个让计划、decision 或 idea 在任何人采取行动之前接受 stress-test 的访谈循环。它把主题映射为一棵 **design tree**（每一个 decision 都分支成挂在它下面的 decisions），并一个分支一个分支地访谈你，直到没有任何东西被默默地当作理所当然。

它不会一次只问一个问题，也不会一次问完所有问题。每一 **round** 会问整条 **frontier**：所有前提已经落实的 decisions，仅此而已。如果两个问题其中一个依赖另一个，它们就永远不会出现在同一 round 里；一个取决于某个悬而未决答案的问题属于后面的 round。你的回答落实 decisions，frontier 向外移动，下一 round 就会问那些被解锁出来的问题。十三个问题通常落在三个 round 左右，而不是十三个。

## When to reach for it

输入 `/grilling`，或者当任务合适时 [agent](https://www.aihero.dev/ai-coding-dictionary/agent) 会自行调用它。它是 grilling 家族中唯一 model-invoked 的 [skill](https://www.aihero.dev/ai-coding-dictionary/skill)，这正是你很少直接输入它的原因：通常是一个你*确实*输入了的 skill 正在替你运行它。

直接输入 `/grilling` 得到的只是朴素的访谈，别无其他。当你想比这更多时：

| 你有什么 | 拿什么 |
| --- | --- |
| 你不在工作目录里 | [grill-me](https://aihero.dev/skills-grill-me)，同一个 [session](https://www.aihero.dev/ai-coding-dictionary/session)，只是这个名字 agent 永远不会自己触发 |
| 你在工作目录里 | [grill-with-docs](https://aihero.dev/skills-grill-with-docs)，同一个 session，并且它会边进行边写出 `GLOSSARY.md` 和 ADRs |
| 一个太大、一个 session 装不下的 effort | [wayfinder](https://aihero.dev/skills-wayfinder)，它绘制一张 map，并在 decision tickets 内部运行 grilling |
| 一个交谈无法解决、关于某物该如何呈现或感觉的问题 | [prototype](https://aihero.dev/skills-prototype)，构建一次性版本，然后回来 |
| 一个你自己的、需要访谈的 skill | 从它内部调用 `/grilling`，而不是另写一场访谈 |

## The round, the frontier, and who decides

三个想法撑起整个 skill。

**design tree** 是对主题的建模：decisions 下面挂着 decisions。**frontier** 是所有前提都已落实的 decisions 的集合：目前唯一可以被诚实问出的问题。**round** 是完整问出、也完整答出的一条 frontier。

在一个 round 内部，每个问题都有一个固定的形态：编号并在 `❓` 后面加上标题，然后是正文，再然后 agent 的推荐答案单独位于一行 `➡️` 上。这正是让一个 round 可以按编号回答（「1 同意，2 第二个选项，3 不同意，理由如下」）而不是把问题逐字复述回去。这个格式有一个已知的粗糙边缘：推荐有时会*反对*问题原本的措辞，所以同意推荐等于对问题回答「不同意」。当这种情况发生时，就回答推荐，并说明这一点。

设计的另一半是 facts 与 decisions 之间的分野。Facts 是 skill 自己的职责：当一条 frontier 问题需要某些 [environment](https://www.aihero.dev/ai-coding-dictionary/environment) 能落实的东西时，它会派一个 [sub-agent](https://www.aihero.dev/ai-coding-dictionary/subagent) 去查明，而不是问你。它不会为此阻塞，只有位于进行中的探索下游的问题才会等待。Decisions 是你的，它必须为它们等待。一个运行 `grilling` 却回答自己 decisions 的 agent 是破坏了 skill，而不是宽泛地解释它。session 在 frontier 为空时结束，而且在你确认已达成共同理解之前，它不会对你同意的东西采取行动。

诚实的局限：frontier 是 agent 的判断，而不是计算出来的图。它可能把两个问题放进同一个 round，之后才发现其中一个答案本应改变另一个。除了告诉它、从而在下一个 round 重新打开受影响的 branch 之外，没有别的防护。

## What lives here and what lives in the wrappers

本页讲的是机制。人们最常想要的东西，记录在上一层。

| 问题 | 在哪里被回答 |
| --- | --- |
| tree、frontier、rounds、问题格式、facts vs decisions | 这里 |
| 一个 session 应该持续多久、对一个你无法靠交谈回答的问题该怎么办、如何避免一路点头 | [grill-me](https://aihero.dev/skills-grill-me) |
| 什么会被写进 `GLOSSARY.md`、什么会成为 ADR | [grill-with-docs](https://aihero.dev/skills-grill-with-docs) |

## Common questions

**我能回到一次只问一个问题吗？**
可以，而且受众中有很大一部分就是这么做的。把这段加到你的全局 `CLAUDE.md` 里：

```
When grilling, ask one question at a time.
```

round-based 的默认设置确实存在争议。读得慢的实践者、用第二语言工作的人、或者把顺序格式当作专注脚手架的人，都报告一次一个的节奏对他们更好，而这个退出选项是受到支持的，而不是勉强容忍的。

**`/batch-grill-me` 去哪里了？**
进到了这个 skill 里。round-based 的提问曾短暂地作为一个独立的 skill 发布，然后并入了 `grilling` 本身，所以所有建立在那个 primitive 之上的东西（`grill-me`、`grill-with-docs`、`triage`、`wayfinder`）都立刻得到了它。没有需要安装的 `batch-grill-me`，也没有单独的顺序 skill；上面的那行 `CLAUDE.md` 就是回到一次一个的途径。

**一次问整个 round 必然会丢掉我早先的回答会引发的问题。不是吗？**
这是对 round 设计最常见的反对意见，而 frontier 就是答案：一个 round 只包含互不依赖的问题，所以一个 round 里的任何回答都不可能使该 round 里的另一个问题失效。回答仍然会重塑下游的一切：下一个 round 是被重新计算出来的，而不是预先写好的。你失去的东西比「一次问所有问题」所暗示的要小，又比什么都没有要大：见上面 frontier 的局限。

**它问完了问题，然后开始构建了。**
确认关卡恰恰为此而存在：当 frontier 清空时 skill 并没有结束，只有当你说理解已经共享时它才结束。更弱、更快的 [models](https://www.aihero.dev/ai-coding-dictionary/model) 仍然会破坏它，这在低 effort 或非 frontier 模型上最常被报告，它们会把「持续访谈直到共同理解」塌缩成几个问题加一份大纲。如果你的模型会这样，可靠的修复是在你自己的 `AGENTS.md` 或 `CLAUDE.md` 里加一行，告诉 agent 未经许可不要实施。

**它自己回答了问题，而不是问我。**
这是运行中的 bug，而不是预期的行为，这正是 facts 和 decisions 在 skill 文本中被分开的原因。它最常出现在另一个 skill 在 resolve-this-ticket 框架内运行 `grilling` 时，那里的外围任务看起来像允许它继续前进。同样的约束也是为什么没有 async 模式：人们曾要求一个读取 GitHub issue 并发布一份汇总 decision memo 的变体，而那是一个不同的 skill，因为一场无人回答的 grilling session 产出的是 agent 的意见，而不是你的。

**我能否限制问题的数量？**
不能，而且上限是被刻意排除在 scope 之外的。有些计划需要三个问题，有些需要五十个；一个固定的天花板要么截断了困难的情况，要么在简单的情况下显得随意。用平白的语言引导是预期的控制方式：告诉它收尾，或者停下来接受当前的计划。如果一场 session 运行得非常久，原因通常是 scope 太大；把工作拆开，分别 grill 那些块。

**我只安装了 `grill-me`，却什么也没发生。**
`grill-me` 是一行式的 skill，它的全部内容就是「运行一场 `/grilling` session」，所以它也需要这个 skill 被安装。`grill-with-docs` 也一样，它额外还需要 [domain-modeling](https://aihero.dev/skills-domain-modeling)。安装整套可以避免这个问题；选择性安装则意味着也要安装 primitives。

**`grill-with-docs` 运行了，但它从未加载 `grilling`。**
一个真实且未修复的粗糙边缘，在各种 [harnesses](https://www.aihero.dev/ai-coding-dictionary/harness) 和模型上都有报告：一个点名另一个 skill 的 skill 并不能可靠地让那个 skill 被加载，而 `grill-with-docs` 点名了两个。迹象是一场一次问完所有问题、不附带任何推荐的 session：那是模型在即兴发挥一场访谈，而不是在运行这一个。直接问 agent 它是否加载了 `grilling` 和 `domain-modeling`，通常能恢复。

## It's working if

- 一个 round 以编号列表的形式到来，每个问题都配有一条单独的 `➡️` 推荐行，而你能按编号回答整个 round。
- 一个 round 里没有任何问题需要该 round 中另一个问题先被回答。
- 后面的 rounds 会问第一个 round 问不出来的东西。
- 它会去查 facts（读取 files、派一个 sub-agent），而不是问你某件它本来就能查明白的事。
- 后台运行的 research 不会拖住 round；只有依赖它的那些问题才会等待。
- 它在最后停下来，请你确认理解已经共享，而不是开始工作。
- 问题数量保持在高位，而 round 数量保持在低位。

## Where it fits

`grilling` 是一个 **primitive**，而不是一个你排进日程的步骤：它是访谈技术的 single source of truth，放在一处，好让每个需要访谈的 skill 都去调用它，而不是各自发明一套。[grill-me](https://aihero.dev/skills-grill-me) 和 [grill-with-docs](https://aihero.dev/skills-grill-with-docs) 是它的两个 user-invoked 前门，而 `grill-with-docs` 是主 build chain 开始的地方，在 [to-spec](https://aihero.dev/skills-to-spec) 之前。[wayfinder](https://aihero.dev/skills-wayfinder) 运行它来解析 decision tickets，[triage](https://aihero.dev/skills-triage) 用它把一份含糊的报告 grill 成一份可用的报告，[improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) 用它来走一遍 tree，一旦你选定了一个要深化的候选。当你不确定哪个入口合适时，[ask-matt](https://aihero.dev/skills-ask-matt) 会为你引路。