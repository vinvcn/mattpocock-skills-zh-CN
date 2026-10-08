## What it does

`tdd` 用 test-first 的方式构建 feature 或修 bug：一个 failing test，然后刚好足够通过它的代码，再下一个 behavior。它承载着让这个 loop 产出值得保留的 tests 的那些标准：什么样的 test 是好 test、tests 放在哪里、mocks 是干嘛的，以及三个会悄悄毁掉一个 suite 的 anti-patterns。

它不会在你尚未认可 seam 的地方写任何 test。在任何 test 存在之前，它会说出它打算在其上测试的 public boundaries，并停下来等你确认，因为测试精力是有限的，而这就是你把精力花在关键路径而非每一个 edge case 上的地方。另一件要知道的事是：`tdd` 是一个 **reference**，而不是一个 driver。它持有这个 loop 的规则，而别的东西（你，或 [implement](https://aihero.dev/skills-implement)）运行应用这些规则的 [session](https://www.aihero.dev/ai-coding-dictionary/session)。

## When to reach for it

输入 `/tdd`，或者当任务合适时由 [agent](https://www.aihero.dev/ai-coding-dictionary/agent) 自动触发，test-first 地构建 feature 或修 bug，或者当你说 "red-green-refactor" 时。

当有具体 behavior 要构建、有 input 和可观察的 output，并且你希望 tests 能承受 refactor 时使用它。

| 你的处境 | 去哪里 |
| --- | --- |
| 一个有定义 inputs 和 outputs 的 behavior（business logic、request/response contract、transformation、validation） | `tdd` |
| behavior 还没钉住 | [to-spec](https://aihero.dev/skills-to-spec)，它也会在写任何代码之前商定 test seams |
| 问题真正关乎 interface 的形状，而不是 tests | [codebase-design](https://aihero.dev/skills-codebase-design) |
| 你有一份 [spec](https://www.aihero.dev/ai-coding-dictionary/spec) 或 [tickets](https://www.aihero.dev/ai-coding-dictionary/ticket)，并希望整个 build 替你运行 | [implement](https://aihero.dev/skills-implement)，它按 ticket 驱动 `tdd` |
| Config、wiring、glue、type annotations、直白的 CRUD delegation | 这里没有合适的，见下面的开放缺口 |

最后一行是一个真正的洞，而不是风格偏好。这个 skill 决定 seams *在哪里*；它内部没有任何东西决定一个 change 是否*值得*跑这个 loop。把它运行在一个没有独立真相来源可断言的变化上，你会得到一个重述 implementation 的 test，那个 skill 自己警告过的 tautological anti-pattern，从另一个方向抵达。它是 [issue #746](https://github.com/mattpocock/skills/issues/746)，而且是开放的。在它关闭之前，那个判断是你或你的 `CLAUDE.md` 的。

## Prerequisites

需要安装 [codebase-design](https://aihero.dev/skills-codebase-design)。`tdd` 过去自带 deep-module 和 interface-design 笔记；在 v1.0 中它们被删除，以支持共享 skill，现在 `tdd` 依靠它来获取 interface-design 词汇。没有别的，这个 skill 是 [stateless](https://www.aihero.dev/ai-coding-dictionary/stateless) 的，不写自己的任何文件。

## The loop, and the seam it runs at

有三个词承载这个 skill。

**Red-green.** 先写 failing test，然后只写足够通过它的代码。不要预判下一个之后的 test。没有 refactor 阶段：它在 2026 年 6 月被移除，因为 agents 实际上从不执行它，也因为 review 和 implementation 作为分开的 sessions 工作得更好。Refactoring 属于 [code-review](https://aihero.dev/skills-code-review)。

**Vertical slice.** 一个 seam、一个 test、一个最小实现，然后重复：第一个 cycle 是一颗 **tracer bullet**，证明一条单一路径 end-to-end 可用。反面是 horizontal slicing：先写所有 tests，再写所有代码。Bulk tests 验证*想象中的* behavior，它们检查事物的形状而不是用户做什么，并且在你理解 implementation 之前就把你承诺给一个 test 结构。

**Pre-agreed seam.** 一个 seam 是你观察 behavior 而不深入内部的 public boundary。规则是绝对的：不在未确认的 seam 上写 test。在完整 chain 中，seams 更早就被商定，在 [to-spec](https://aihero.dev/skills-to-spec) 期间："`/tdd` 被要求只在 pre-agreed test seams 上工作，`/code-review` 检查只用了已商定的 test seams。" 单独调用时，`tdd` 直接问你。

它被写来防止的三个 anti-patterns：

| Anti-pattern | 迹象 |
| --- | --- |
| Implementation-coupled | 当你重命名一个内部函数时 test 失败，尽管 behavior 没变。Mocked 内部协作者、断言的调用计数、用来验证而非 interface 的 database queries。 |
| Tautological | Expected value 用代码计算它的方式计算，所以 test 按构造就通过。Expected values 必须来自别的地方：一个已知正确的 literal、一个 worked example、spec。 |
| Horizontal slicing | 一批 tests 在任何 implementation 之前落地。 |

Mocks 只用于系统边界：外部 APIs、时间、随机性，有时是 filesystem 或 database。不是你自己的 modules。

## Common questions

**它为什么不 refactor？description 说 "red-green-refactor"。**

因为 refactor 步骤被移除了，而 description 没有。移除是刻意的：agents 实际上从不做它，而把 implementation 和 review 保持在分开的 sessions 里工作得更好。结果是否仍然算作严格的 TDD，比 loop 是否产出更好的代码更重要。触发短语和正文之间的不匹配已被提报为 [issue #589](https://github.com/mattpocock/skills/issues/589)，仍是开放的，所以 "red-green-refactor" 继续作为一个能触发这个 skill 的短语工作。你得到的是 red → green，而 refactoring 在 [code-review](https://aihero.dev/skills-code-review) 里。

**它让我选一个 test seam，而我完全不知道选哪个。**

这是这个 skill 上被报告最多的摩擦（[issue #607](https://github.com/mattpocock/skills/issues/607)）。提示只按名称列出候选 seams，对每个会抓到或错过什么都没说，所以你在标签之间做选择。还没有修复方案。实用的 workaround 是在回答之前问 agent 要利弊：component-level seam 会错过什么而 integration seam 能抓到，以及它慢多少。这也是为什么 chain 在 `to-spec` 中预先商定 seams，在那里你能看到整个 feature 而不是一个提示。

**它先写了 implementation 再写 test，尽管 skill 说 red first。**

这种事会发生。一个用户在这个问题上逼了 [model](https://www.aihero.dev/ai-coding-dictionary/model)，得到了一个异常诚实的回答："我知道 skill 说 '一次一个 test，看它因正确的原因失败'，我读过了。我只是默认了我的习惯。" 这个 skill 就是为与之共存而写的。没有任何指令能让 agent 100% 遵守，而更用力地逼这一点会以很小的收益限制 agent 的创造力，这个 loop 即使没有被严格遵循也值得运行，因为结果总体上仍然更好。如果对某个特定 slice 需要严格遵循，那就盯着运行，而不是相信 skill 会强制执行。

**它应该先写 browser 或 end-to-end tests 吗？**

通常不，而 skill 也不会阻止它。一个用户报告说 agent 先写了 Playwright test，然后烧了一个很长的 loop 重新运行它，并为一个还不存在的 feature 断定是 *test* 坏了。在你的 `CLAUDE.md` 中配置这个。Browser tests 慢到 red-green feedback loop 不再收回成本；在你的 repo 的 `CLAUDE.md` 中声明它们在 behavior 工作之后才写。

**`/tdd` 会取代 `/implement`，或课程里的 `/do-work` 吗？**

不会。`/tdd` 记录方法论；`/implement` 是一个很简单的 work→feedback→commit loop，是 `/do-work` 的直接替代。课程里单一的 `/do-work` 步骤现在被拆分到 `/implement`、`/tdd` 和 `/code-review`。如果你在问该对一个 ticket 运行哪一个，答案几乎总是 `/implement`。

**deep-modules 和 interface-design 的指导去哪了？**

在 v1.0 进入了 [codebase-design](https://aihero.dev/skills-codebase-design)，被泛化，让几个 skills 共享一个词汇。`refactoring.md` 同时离开；refactoring 现在是 [code-review](https://aihero.dev/skills-code-review) 的工作，那个 skill 携带 Fowler smell baseline。

**它知道我其他的 tickets 吗？**

不知道。对一个 ticket 运行时，它会乐意提议属于兄弟 ticket 的工作，因为它看不到 issue graph 的其余部分（[issue #129](https://github.com/mattpocock/skills/issues/129)）。Matt 的立场是这不关 `tdd` 的事。把 spec 与 ticket 一起传过去会有帮助；先在源头把 tickets 切成合适的大小更有帮助。

## It's working if

- 在任何 test 文件存在之前，它会停下来、说出它打算在其上测试的 seams，并等待。
- 一个 test 出现、变红、得到刚好足够通过的代码，然后才有下一个 test，而不是一批 tests 后跟一批代码。
- Test 名称读起来像 capabilities（"user can checkout with valid cart"），而不是 internals（"checkout calls paymentService.process"）。
- 断言中的 expected values 是你能追溯到 spec 的 literals，而不是按代码计算它们的方式重新计算的值。
- 重命名一个内部函数不会破坏 suite 中的任何东西。
- Mocks 只出现在外部边界（payment API、clock），永远不会围绕你自己的 modules。

## Where it fits

`tdd` 是 main chain 的 build 步骤内部的引擎，而不是它自己的一个步骤：

```txt
grill-with-docs → to-spec → to-tickets → implement → code-review → retro
```

[to-spec](https://aihero.dev/skills-to-spec) 预先商定 test seams，[implement](https://aihero.dev/skills-implement) 按 ticket 驱动 `tdd`，[code-review](https://aihero.dev/skills-code-review) 事后检查只用了已商定的 seams，并拥有 `tdd` 不再做的 refactoring。它的另一个邻居是 [codebase-design](https://aihero.dev/skills-codebase-design)，`tdd` 所说的 seam 和 deep-module 词汇的共享来源。你也可以单独使用它，只要有具体 behavior 要构建、又不在一个完整 spec 的推进中。当你不确定哪个 skill 适合你的处境时，[ask-matt](https://aihero.dev/skills-ask-matt) 会为你路由。