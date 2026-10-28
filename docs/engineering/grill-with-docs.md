## 它做什么

`grill-with-docs` 围绕一个计划或设计访谈你，直到你与 [agent](https://www.aihero.dev/ai-coding-dictionary/agent) 对它达成共同的理解为止，并在进行的同时把词汇和那些艰难的决策写进你的 repo。它就是 [grill-me](https://aihero.dev/skills-grill-me) 所运行的那场同款访谈（一轮问题，然后等待，再下一轮），只不过指向的是一个 codebase。

它是 **[stateful](https://www.aihero.dev/ai-coding-dictionary/stateful)** 的。其他每一个 grilling skill 都会把 [session](https://www.aihero.dev/ai-coding-dictionary/session) 留在你的脑子里；这一个则在磁盘上留下文件。一个术语敲定时，skill 立刻把它写进 `GLOSSARY.md`，而不是攒到末尾批量写。一个决策通过三道门时，skill 就把它写成一条 ADR。这正是全部的区别，也是人们使用这个 skill 时遇到的大部分麻烦的原因。这些 artifact 是真实 repo 里的真实文件，所以它们可能在你预期时缺失，也可能在不止一个人写它们时发生漂移。

## 何时使用

你通过输入 `/grill-with-docs` 来调用它，agent 不会自行取用它。

在一次变更的开端、身处 repo 之中、计划仍然模糊、事物的措辞尚未敲定时，使用它。它是 single-session 工具。你想要哪个 grilling skill，取决于你面前是什么：

| 你拥有什么 | 该用哪个 |
| --- | --- |
| 你根本不在任何 working directory 里 | [grill-me](https://aihero.dev/skills-grill-me) |
| 一个 repo，以及一个你可以在一次 session 内敲定的变更 | `grill-with-docs` |
| 一项大到一次 session 装不下的 effort（一个 greenfield 构建、一个大型 feature） | [wayfinder](https://aihero.dev/skills-wayfinder) |
| 一个完全没有 domain docs 的 repo，也没有任何特定 feature 在脑中 | `grill-with-docs`，瞄准 repo 本身而不是某次变更 |
| 一个被卡在别人脑内知识上的决策 | [to-questionnaire](https://aihero.dev/skills-to-questionnaire) |

与 wayfinder 的分界归结为 session 数量：`/grill-with-docs` 用于 single-session 规划，`/wayfinder` 用于 multi-session 规划。

## 前置条件

这个 skill 会写入你的 repo，所以你需要身处可以安全写入的地方。已敲定的术语进入根目录的一份 `GLOSSARY.md` glossary；或者，如果根目录的 `GLOSSARY-MAP.md` 把 repo 标记为 multi-context，则进入相关 context 的 `GLOSSARY.md`。决策进入 `docs/adr/`。Skill 只在需要它们时才创建两者。在第一个术语或决策敲定之前什么都不存在，所以你无需预先搭建任何东西。

它还需要另外两个 skill 在场，因为它自己的 `SKILL.md` 只有一行，把工作委托给它们。[grilling](https://aihero.dev/skills-grilling) 提供访谈，[domain-modeling](https://aihero.dev/skills-domain-modeling) 提供书写。单独安装 `grill-with-docs` 只会得到一个无法工作的 skill。

## 留下的书面记录

一次 session 会产出三样东西，而且它们并不对等。

| 什么被敲定了 | 它落在哪里 |
| --- | --- |
| 一个术语（项目自己用来指代某物的词） | `GLOSSARY.md`，内联写入，在敲定的那一刻 |
| 一个难以逆转、没有上下文就会令人意外、并且是真正权衡的决策 | `docs/adr/` 之下的一条 ADR |
| 你决定的其他一切 | 对话里，仅此而已 |

第三行才是那个会坑到人的行。`GLOSSARY.md` 只是一份 glossary。它不含实现细节、不含 [spec](https://www.aihero.dev/ai-coding-dictionary/spec)、也不含随手笔记。一份 ADR 需要同时满足全部三道条件，所以大多数决策都不够格，大多数 session 也产不出任何 ADR。一场 session 换来一份更锐利的 glossary 和零 ADR，正是按设计工作，但这意味着你达成共识的大部分，只存在于你达成它的那个 [context window](https://www.aihero.dev/ai-coding-dictionary/context-window) 里。把那同一场对话交给 [to-spec](https://aihero.dev/skills-to-spec)，而不是把它 [clearing](https://www.aihero.dev/ai-coding-dictionary/clearing) 掉。

glossary 是主要产出。这个 skill 构建的是 domain language：项目自己的词，一次性达成共识，这样你、agent 和你的同事就不必再重新推导它们。并非所有人都同意这能换来 agent 的性能。最强烈的反对意见是，一个术语和它用平实的语言写出的展开式对 [model](https://www.aihero.dev/ai-coding-dictionary/model) 来说得到同样的结果，而这套词汇主要是缩短共享它的那些人类之间的沟通。在这个观点下 glossary 仍然有价值，只是价值归给了人类。

## 常见问题

**我应该用这个还是 `/wayfinder`？**
由范围决定。凡是你能在一次 session 内敲定的，就用这个；当 effort 大到一次装不下时用 [wayfinder](https://aihero.dev/skills-wayfinder)，它会先把工作绘制成一张决策 [tickets](https://www.aihero.dev/ai-coding-dictionary/ticket) 地图。Wayfinder 更慢也更密集，在一个范围清晰的 feature 上取用它是常见的错误。它并不取代这个 skill，而且它能为了地图中适合一场 grilling 的部分而开启一场 grilling session。

**它跑过了，但没有出现 `GLOSSARY.md`，也没有出现 ADR。**
有两个已知原因。第一个是没有东西够格。ADR 需要同时通过三道门，而一场关于没有任何新词汇的变更的 session，没有东西可写。第二个是一个真实的 bug。当这个 skill 运行在另一个编排层内部时（一个 spec-driven-development wrapper、一个 multi-agent framework、一条把它当作别人 pipeline 中某一步来调用的规则），用户报告文件写入那一半静默地不发生，而访谈照常进行。这个 bug 已被上报且未修复。如果你身处那种配置，在相信 session 的输出之前先检查 working directory。

**它一次性把所有问题都问了，没有任何推荐，也从未提到 `GLOSSARY.md`。**
那是这个 skill 没能加载它的两个依赖。因为 `SKILL.md` 是一行委托，一个没有拾起 [grilling](https://aihero.dev/skills-grilling) 和 [domain-modeling](https://aihero.dev/skills-domain-modeling) 的 agent 会去猜 grilling 是什么意思，于是你一次收到所有问题，毫无结构。部分加载更令人困惑（`grilling` 加载了、`domain-modeling` 没有），于是你得到一场很好的访谈，却没有书面痕迹。它发生的频率取决于 model 和 [effort](https://www.aihero.dev/ai-coding-dictionary/effort) 级别，也是这个 skill 被报告最多的问题。如果你怀疑这一点，直接问 agent 它加载了哪些 skills。

**我其他那些决策都去哪了？**
只进了对话。这是对这个 skill 最严重的公开抱怨。Glossary 不是 spec，大多数回答不配获得 ADR，也没有任何记录把每个已敲定的回答关联到 spec、ticket 和 test。后面的步骤会把精确的答案（排序保证、否定式需求、数值默认值）软化成更弱的口语化表述，结果看起来完整，却漏掉了你实际决定的东西。当下，保留 session，把它直接喂给 [to-spec](https://aihero.dev/skills-to-spec)。然后拿 spec 对照你自己的回答重新读一遍，而不是假设它已经捕获了它们。

**我可以把它指向一个完全没有文档的现有 repo 吗？**
可以。对于一个没有 ADR、没有 domain language、也没有设计原则的 codebase，这正是正确的 skill：调用它并说"帮我把我的 repo 写成文档"。用户经常把它与 [improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) 配对，用于构建或修复一份 `GLOSSARY.md`。要做好引导它的准备。它会阅读代码并就它发现的东西问你，而由你来决定 codebase 里已有的那些词当中哪些是对的。

**session 结束时我该做什么？**
这个 skill 的收尾消息往往是开放式的，这是一个已知的问题。在 main flow 中，答案是在同一场对话里走 [to-spec](https://aihero.dev/skills-to-spec)。如果这次变更小到可以立即构建，那就直接去 [implement](https://aihero.dev/skills-implement)。

**为什么它叫这个名字？**
没有人对这个名字满意。有一个未决的提议，把它改名为 `grill-domain-model`，这个名字更准确地描述了它的行为。这件事没有任何进展。如果改名真的落地，文档页面会随之移动，URL 也会改变。

## 它正常工作的标志

- `GLOSSARY.md` 在 session *期间*一个术语一个术语地变化，而不是在末尾一次性出现。
- glossary 读起来是纯粹的词汇（你项目自己的词配上紧凑的定义），不含任何实现细节或类 spec 的叙述。
- codebase 能回答的问题，通过阅读 codebase 来回答，而不是来问你。
- 你得到的 ADR 很少或没有，而得到的那些，正是一旦不得不重新争论就会让你恼火的决策。
- 它会质疑你使用的一个词，因为你现有的 glossary 对它的定义不同。

## 它在整体中的位置

`grill-with-docs` 是 main build chain 的开头：

```txt
grill-with-docs → to-spec → to-tickets → implement → code-review → retro
```

它排在一切被写成 spec 之前。它产出共同的理解和敲定的词汇，[to-spec](https://aihero.dev/skills-to-spec) 随后无需重新访谈你就将其合成为 spec。它亲近的邻居是 [grill-me](https://aihero.dev/skills-grill-me)（同一场访谈但不带 repo、不带文件）以及 [domain-modeling](https://aihero.dev/skills-domain-modeling)（它所驱动的那套 glossary-and-ADR 纪律）；两者都用 [grilling](https://aihero.dev/skills-grilling) 原语来做访谈。在它上游，[wayfinder](https://aihero.dev/skills-wayfinder) 绘制大到一次 session 装不下的 efforts，并能把地图的一部分交还给它。当你不确定哪个 skill 或 flow 契合时，[ask-matt](https://aihero.dev/skills-ask-matt) 会为你路由。
