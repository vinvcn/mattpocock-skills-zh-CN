## 它做什么

`codebase-design` 修正你用来设计 module 的那些词：**module**、**interface**、**depth**、**seam**、**adapter**、**leverage**、**locality**。它精确定义每一个，禁用那些松散的替代词（"component"、"service"、"API"、"boundary"），并陈述由它们推出的那几条原则。

它是一个参考，而不是一套流程。没有要运行的 loop，不产出 artifact，也没有它会问你一个问题的 checkpoint。每个触及设计的其他 skill 都借用它的词汇；单独使用时，它把语言交给你然后停下。这是你在调用它之前要知道的那件事，因为一个没有流程、没有停止规则的 skill，如果你把一场 [session](https://www.aihero.dev/ai-coding-dictionary/session) 指向它说「go」，就会即兴编一个，见下面的问题。

## 何时使用

输入 `/codebase-design`，或者当设计任务契合时由 agent 自动调用。

当你已经知道你在重新设计哪段代码、需要思考它的形状时使用它：seam 该放在哪里、interface 能缩到多小、一次 extraction 是否值回票价。它也是你为解决「某个词是什么意思」的争论而取用的东西。

有几个 skills 与它相近。你想要哪一个，取决于实际的问题是什么：

| 问题 | 这个 skill |
|---|---|
| 单个 module 的形状（它的 interface、它的 seam、它的 depth） | `codebase-design` |
| *领域的词*："account" 意味着三件事，两个人对 "cancellation" 的意思不同 | [domain-modeling](https://aihero.dev/skills-domain-modeling) |
| 你还不知道要重新设计*哪个* module | [improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture)：那份找出候选的 survey |
| 你想让设计被辩驳，而不只是被命名 | [grilling](https://aihero.dev/skills-grilling) |
| 有一份具体的 behavior 要构建，你想要能在重构中存活的 tests | [tdd](https://aihero.dev/skills-tdd) |

## 词汇

Glossary 就是这个 skill。每个术语都对照其他术语来定义，而且每个都带着它所替换的词。

| 术语 | 它的意思 | 不要说 |
|---|---|---|
| **Module** | 任何有 interface 和 implementation 的东西。刻意与规模无关：一个函数、一个类、一个 package、一个跨越 tier 的 slice。 | unit、component、service |
| **Interface** | 一个 caller 为正确使用它而必须知道的每件事：类型签名，外加 invariants、ordering constraints、error modes、required config、性能特征。 | API、signature |
| **Depth** | Interface 处的 leverage：一个 caller 或 test 每学习一单位 interface 就能驱动的行为量。**Deep**：大量行为藏在一个小 interface 后面。**Shallow**：interface 几乎和 implementation 一样复杂。 | 无 |
| **Seam** | Michael Feathers 的术语：一个无需在那里编辑就能改变行为的地方。它是某条 interface 的*位置*，而把它放在哪里是它自己的决策，独立于它背后放什么。 | boundary |
| **Adapter** | 在一条 seam 处满足某条 interface 的一件具体东西。点名一个角色，而非一种实体：一个 in-memory fake 和一个 Postgres repo 都是 adapters。 | 无 |
| **Leverage** | Callers 从 depth 得到的东西：每学习一单位 interface 获得更多能力。 | 无 |
| **Locality** | Maintainers 从 depth 得到的东西：变更、bugs 和验证集中在一个地方。修一次，处处都修。 | 无 |

Depth 刻意*不*被定义为 implementation 行数对 interface 行数的比值，那是 Ousterhout 自己的定义。这个度量奖励的是给 implementation 灌水。这里改用 depth-as-leverage。

## 四条原则

- **Depth 是 interface 的属性，不是 implementation 的。** 一个 deep module 内部可以由小的、可替换的部件构建而成。它们只是不暴露给 callers。一个 module 可以有自己的、它的 tests 会用的 internal seams，以及 interface 处的一条 external seam。
- **Deletion test。** 想象删掉这个 module。如果复杂性消失了，它只是一个 pass-through。如果它在 N 个 callers 中重新出现，那它就是在挣它的口粮。
- **Interface 就是 test surface。** Callers 和 tests 跨越同一条 seam。如果你想*越过* interface 去测试，那 module 的形状就错了。
- **一个 adapter 意味着一条假设性的 seam。两个 adapters 意味着一条真实的。** 在确实有东西跨越它变化之前，不要切开 seam。单 adapter 的 seam 只是 indirection。

两份支持文件走得更远，而且 skill 按需读取它们，而不是开头就读。[DEEPENING.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/codebase-design/DEEPENING.md) 对候选的依赖做分类（in-process、local-substitutable、remote-but-owned、true-external），因为类别决定了加深后的 module 如何跨其 seam 被测试。[DESIGN-IT-TWICE.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/codebase-design/DESIGN-IT-TWICE.md) 启动并行的 [sub-agents](https://www.aihero.dev/ai-coding-dictionary/subagent)，为同一个 module 产出三个或更多截然不同的 interface，然后在 depth、locality 和 seam placement 上比较它们。

## 常见问题

**我到底如何在 TypeScript 里构建一个 deep module？**

这是关于这个 skill 被问得最多的一个问题，而 skill 并不回答它。它定义了一个 deep module *是*什么；它不说什么阻止一条 stray import 越过 interface 触达。Issue [#458](https://github.com/mattpocock/skills/issues/458) 说得直白：「let's say we're happy with the interface, it hides the details, etc. But how do we enforce it? I think without linting or clear guardrails, humans and LLMs alike will start making it messy over time.」在那条 thread 里 Matt 的回答是三个选项：把它包进一个 class 或 IIFE，并接受 class 变得巨大；把它做成 monorepo 里的一个 package，并接受 monorepo 工具链；或者用一个像 [dependency-cruiser](https://github.com/sverweij/dependency-cruiser) 这样的 linter 来禁止绕过 interface 的 imports。他曾另外把 Effect 称为最好的机制，dependency-cruiser 次之。仓库的 `in-progress/` bucket 里有一个 `setup-ts-deep-modules` skill，它铺开一份 `src/packages/<name>/index.ts` 约定，但它是没有 docs 页面的 beta-channel skill，而且它没有随附发布的 lint rule。

**我把一场 session 指向它，它烧掉了 100k [tokens](https://www.aihero.dev/ai-coding-dictionary/token) 去重新设计我从没问过的东西。**

已知，并作为 [issue #449](https://github.com/mattpocock/skills/issues/449) 提交。这个 skill 是 model-invoked 的，把自己描述为词汇，但其中没有任何东西硬性阻止 agent 把它当作一个可运行的流程。被嘱咐「resume in /codebase-design and drive the open decisions」后，一个 agent 去抓它能找到的最行动形状的内容（`DESIGN-IT-TWICE.md` 里的并行 sub-agents），重新探索了一场以前 session 已经映射过的代码，跑了很远才问任何东西。一个 driver skill 拥有的护栏（checkpoints、一次一个问题、不自推进）在这里一个都不存在，因为一个参考没有它们。Workaround 是点名一个 driver skill，让这个坐在它底下：`/grill-with-docs`、`/improve-codebase-architecture` 或 `/tdd`，以 `codebase-design` 作为词汇。Issue 是开着的。

**`design-an-interface` 去哪了？有没有一个 `/interface-design` skill？**

`design-an-interface` 被移除并吸收进这个 skill。什么都没丢：它的「design it twice」技巧（并行 sub-agents 生成截然不同的设计，源自 Ousterhout）作为 `DESIGN-IT-TWICE.md` 在这里随附发布。另外，有几个人要求一个专门的 `/interface-design` skill，用于 deep-module/thin-interface 哲学；那套哲学已经在这里了，而且没有计划单独的 skill。如果你原本是来找这两个名字之一的，这一页就是了。

**这难道不是一种文件结构约定（文件夹、barrel files、feature slices）？**

不是，而且 skill 在反复遭到反对之下一直坚持这条线。[Issue #95](https://github.com/mattpocock/skills/issues/95) 提出把一种形式化的 fractal-tree 文件结构作为 deep modules 的具体实现；答复是两者正交：「deep modules are about the design of the interface and accessing through a strict interface, no matter what the file system looks like. It seems perfectly possible that you could have shallow modules with this approach.」#458 里也出现了同样的话：「I think you might be tying the concept of modules too closely to the file system. The file system can certainly be a useful hint to the shape of modules, but there's no need to use the file system in the construction of deep modules.」Glossary 刻意把 **module** 定义为与规模无关。

**`tdd` 真的用这套词汇吗？**

它现在用了。很长一段时间它没有。曾经住在 `tdd` 里的内联 deep-module 笔记在 v1.0 中被移除，以支持这个共享 skill，但替换它们的指针从未被加上，所以 `tdd` 为自己定义了 "seam"，且不引用任何东西。这个缺口已经合上：指针现在在 skill 里，在 interface 的形状是公开问题、而非 tests 是公开问题时被够到。`tdd` 仍然拥有作为你*测试*所在的边界的 "seam"；这个 skill 拥有它背后的 module 形状。

**Design-it-twice 模式在 Claude Code 之外能工作吗？**

不能干净地工作。`DESIGN-IT-TWICE.md` 说「spawn 3+ sub-agents in parallel using the Agent tool」，这是 Claude Code 用 Claude Code 的名字称呼的 [tool](https://www.aihero.dev/ai-coding-dictionary/tool)。仓库为其他 [harnesses](https://www.aihero.dev/ai-coding-dictionary/harness)（包括 Codex）随附发布元数据，而那些可能不会在同一个名字下暴露任何东西，所以并行设计阶段比 skill 的元数据所暗示的更不可移植。在 [issue #564](https://github.com/mattpocock/skills/issues/564) 中追踪，开着。

**我能往 glossary 里加我自己的概念吗（connascence、module secrets、[progressive disclosure](https://www.aihero.dev/ai-coding-dictionary/progressive-disclosure)）？**

人们恰恰提议过这些。[Issue #180](https://github.com/mattpocock/skills/issues/180) 把 Parnas 的 module secrets 和 Page-Jones 的 connascence 作为一层命名，用于*什么*正在跨 seam 泄漏，并附带一份可用的 diff；[issue #303](https://github.com/mattpocock/skills/issues/303) 提议在 implementation 内部做 progressive disclosure，这样在 public interface 处 deep 的 module 底下就不是一块无差别的平板。两者都开着、未合并。随附发布的 glossary 刻意很小，而它保持小的原因在 skill 本身里说明了：语言一致是全部要点，而一个没人一致使用的术语比没有术语更糟。

## 它正常工作的标志

- 设计对话不再产出 "component"、"service" 和 "boundary" 这些词，开始产出 "module"、"interface" 和 "seam"。
- 有人能指着一次拟议的 extraction，不支支吾吾地说出它是否通过 deletion test。
- 一条拟议的 seam 会带来点名的第二个 adapter，而不只是第一个。
- 对 interface 的讨论涵盖 invariants、ordering 和 error modes，而不只是类型签名。
- 调用它不会启动一场 session。如果 agent 仅凭 `/codebase-design` 就开始读文件、提议 refactors，那它就把参考当成了 driver。

## 它在整体中的位置

`codebase-design` 是一个 **随时可调用的 standalone**，是 engineering skills 底下的词汇层，而不是任何 chain 中的一步。它最接近的邻居是 [domain-modeling](https://aihero.dev/skills-domain-modeling)，即针对*问题域*的词而非 module 形状的平行参考：两者通常一起被需要，因为把 deep module 命名得好两者都需要。[improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) 是另一个：它调查 codebase 寻找 deepening 候选，并用这份 glossary 写出每一个，所以它找到 module，而这个 skill 是你设计它的工作台。当你拿不准哪个 skill 或 flow 契合时，[ask-matt](https://aihero.dev/skills-ask-matt) 会为你路由。