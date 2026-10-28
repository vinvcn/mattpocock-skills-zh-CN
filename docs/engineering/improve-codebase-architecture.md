## 它做什么

`improve-codebase-architecture` 扫描 codebase，寻找 **deepening opportunities**。这些是 shallow module（interface 几乎和它所隐藏的东西一样复杂）可以变成 deep module 的地方。它把它们写成一份自包含的 HTML report，然后就你选中的那一个 [grills](https://www.aihero.dev/ai-coding-dictionary/grilling) 你。

它从不改动代码。整个运行产出一场对话和一份位于 OS 临时目录里的 HTML 文件。refactor 由你稍后在独立的 [session](https://www.aihero.dev/ai-coding-dictionary/session) 里、经由正常的 build flow 完成。这使它成为一份 survey 而非 refactoring 工具，所以你可以在尚未准备好去动的 codebase 上运行它。

两道过滤阻止 report 沦为泛泛的清理建议。第一，每个候选项都必须通过 **deletion test**：如果移除这个 module，它的复杂性会移到一个更小的 interface 后面，还是摊散到调用者之间？只有前一种情况才配得上一张卡片。第二，除非你把它指向某个特定区域，否则它会先读取最近的 commit 历史，把扫描聚焦于经常变化的路径。对没人触碰的代码做 deepening，是一次永远不会回本的 refactor。

## 何时使用

你通过输入 `/improve-codebase-architecture` 调用它，[agent](https://www.aihero.dev/ai-coding-dictionary/agent) 不会自行取用它。

它不是 main build loop 中的一步。你定期运行它，用来排队更多改进 codebase 的工作。人们在四种情形下使用它：

| 情形 | 如何使用 |
| --- | --- |
| 常规维护 | 每隔几天，或一有空闲就运行它，免得结构在 feature 之间衰败。 |
| 大构建之前 | 把它指向 [spec](https://www.aihero.dev/ai-coding-dictionary/spec)，问"我们怎样才能让这次变更变得容易？"这是对它最有效的 prompt。 |
| Brownfield 审计 | 在一个巨大、缺乏结构或 [vibe-coded](https://www.aihero.dev/ai-coding-dictionary/vibe-coding) 的 repo 上运行它，弄清它处于什么形态。 |
| 遗留测试工作 | 在对着不可测试的代码写测试之前，用它找出缺失的 seams。 |

它容易与同类混淆的地方：

- 要设计一个你已经选定的 module，用 [codebase-design](https://aihero.dev/skills-codebase-design)。这个 skill 负责找出要处理的 module，`codebase-design` 才是你设计它的地方。
- 对于大到一次 session 装不下的整体 effort，用 [wayfinder](https://aihero.dev/skills-wayfinder)。
- 对于"这个具体的东西坏了"，用 [diagnosing-bugs](https://aihero.dev/skills-diagnosing-bugs)。当真正的发现是没有好 seam 可以锁住这个 bug 时，它会把你送回这里。

## 前置条件

运行它无需任何前置条件。如果 `GLOSSARY.md` 或 `docs/adr/` 中的 ADRs 存在，它会读取它们，并使用你领域自己的名词。于是一个候选项读起来是"加深 Order intake module"，而不是"重构 FooBarHandler"。

它在两个地方写入。report 进入 `<tmpdir>/architecture-review-<timestamp>.html`，位于 repo 之外。在 grilling 循环期间，它会向 `GLOSSARY.md` 添加或锐化术语，如果该文件不存在就创建它。它还会提议把一个被否决的候选项记录为 ADR，这样未来的运行就不会再建议它。

## Depth，以及搜寻它的报告

这个 skill 建立在一个观念上：**depth**。一个 deep module 把大量行为放在一个小而稳定的 interface 后面；一个 shallow module 则透过一个几乎和底下代码一样宽的 interface 暴露自己的实现。这份 report 寻找三种形态的浅薄：

- 纯粹为了可测试性而抽出的 pure functions，而真正的 bug 活在调用者使用它们的方式里（没有 **locality**）。
- 跨 **seams** 泄漏的 modules。
- 不打开五个文件就无法理解的概念。

对每一种，它都提出修复它的 deepening。

每个候选项都是一张卡片，包含涉及的文件、摩擦点、一份用平实的语言写成的解决方案、以 **locality** 和 **leverage** 表述的收益、一张 before/after 示意图，以及一个强度徽章。

| 徽章 | 对你意味着什么 |
| --- | --- |
| `Strong` | deletion test 清晰通过，摩擦也是真实的。认真对待这些。 |
| `Worth exploring` | 貌似合理的 deepening，但回报取决于代码下一步会走向哪里。 |
| `Speculative` | 为了完整性而收录。这些大多可以忽略。 |

report 以一条**首选推荐**收尾，也就是它会最先去做的那个候选项。然后 skill 停下来，问你想探索哪个候选项。到那一刻你还没有决定任何东西，也没有任何代码被改动。

## 选中一个之后会发生什么

当你选中一个候选项时，就会开启一场围绕它的 [grilling](https://aihero.dev/skills-grilling) session。它涵盖约束、seam 后面放着什么、哪些测试能存活、加深后的 interface 应该长什么样。那场 session 的输出是一个决策，而不是一个 diff。从那里开始走常规 flow：把决策带进 [to-spec](https://aihero.dev/skills-to-spec)，然后 [to-tickets](https://aihero.dev/skills-to-tickets)，然后 [implement](https://aihero.dev/skills-implement)。

## 常见问题

**它围绕一个想法 grill 了我一个小时，而不是给我看选项。我能关掉这个吗？**

可以。调用时就说清楚（"别 grill 我，只给我看 report"）。这是关于这个 skill 最常见的抱怨。一位用户原本喜欢它作为"获得透彻改进分析的便捷方式"，但在 grilling 循环被加入后，发现它"几乎不可用"。在他们的 sessions 里，它提出单一方案然后连问"十个或上百个问题"。设计意图是 report 先行，grilling 只在你选中的候选项上开始。但较弱的 [models](https://www.aihero.dev/ai-coding-dictionary/model) 会直接跳去就它们的第一个想法访谈你。那个 thread 里的结果因 model 而差异很大。这是一个 open issue，而这个 skill 还没有文档化的 no-grill 模式。

**report 打开是无样式的原始 HTML，没有任何示意图。发生了什么？**

report 从 CDN 加载 Tailwind 和 Mermaid，所以打开它时需要网络访问。如果有东西拦截了那些脚本，页面就会坏掉而不报任何错误。已上报的案例是一个要求 SRI hashes 的安全 hook。agent 加上了它们，但 CDN 提供给浏览器的字节与计算 hash 的那个 `curl` 得到的不同，于是浏览器拦截了脚本。离线和被锁定的环境也有同样的问题。agent 看不到这一点，因为它从不渲染页面。变通方案是要求内联 CSS 和手写的 SVG 示意图，而不是那套 CDN 方案。这是一个 open issue。

**它给了我十二个候选项。我在同一个 session 里逐个处理，还是开启一个新的？**

每个 session 用一个候选项。如果你在一场对话里逐个处理多个，report、grilling、domain-model 编辑和代码变更就会一下子全塞进 [context window](https://www.aihero.dev/ai-coding-dictionary/context-window)。report 只是一个临时文件，所以要携带候选项本身，而不是文件。挑一个、grill 它、把决策带进 `/to-spec`。把其余的变成你之后可以分别拾起的 [tickets](https://www.aihero.dev/ai-coding-dictionary/ticket)。把选中的改进放进一份 spec，而不是直接去实现。人们经常问这个问题，而 skill 本身没有为它记录任何工作流。

**我应该怎么 prompt 它？**

用你接下来要构建的东西来 prompt 它。如果一个大构建即将到来，把它指向 spec 并问"我们怎样才能让这次变更变得容易？"一次没有 prompt 的运行会自行寻找热点。这对常规维护没问题，但一个方向才能让 report 具有可操作性。

**它能在大型遗留 codebase 上工作吗？**

部分可以。它在缺乏一致结构的大型现有 codebase 上工作得很好，也是任何一次性结构搭建之后的推荐维护工具。但那些项目失控的用户报告它"有点帮助但仍然不太够"。一位拥有八年历史遗留 codebase 的开发者报告说，model 在其中原地打转，尽管同一个 skill 在一个整洁的 repo 上能产出清晰的图。针对那种情况还没有专门的 `/refactor` skill。如果 codebase 没有共享词汇，先运行 [grill-with-docs](https://aihero.dev/skills-grill-with-docs) 来建立一个。这通常会让这个 skill 的输出好得多。

**这和 `/codebase-design` 有什么不同？**

`/codebase-design` 是一份参考资料，而不是 session 驱动者。它提供词汇（module、interface、depth、seam、adapter、leverage、locality），而这个 skill 使用这些词汇。如果你把 `/codebase-design` 作为任务交给一个全新的 agent，它会以一种已知的方式失败：它没有自己的流程可循，于是 agent 会发明一个，重新探索代码，然后跑上非常久才来问你任何东西。运行这个 skill，让它去使用那个。

**它会不会告诉我 codebase 没问题？**

很少，所以开始之前就要知道这一点。这个 skill 的存在就是为了输出 findings，所以它倾向于产出候选项，而不是得出"没有什么不对"的结论。用强度徽章来校正这一点。如果一份 report 里每个候选项都是 `Speculative`，那就是这个 skill 什么都没找到。

**它在 Codex 或其他 harness 里能工作吗？**

部分可以。探索步骤直接指名 Claude Code 的 `Agent` 工具并带 `subagent_type=Explore`。一个没有该工具的 [harness](https://www.aihero.dev/ai-coding-dictionary/harness) 可能会跳过并行探索，而不是使用自己的等价物。skill 仍然会运行，只是扫描没那么彻底。有人提议过一个 harness-neutral 的重写，但尚未合并。

**我到底该怎么在 TypeScript 里实现 deep modules？**

skill 没有随附一个好答案。人们经常想要一份 `TYPESCRIPT.md`，为这些原则给出具体的文件和 module 布局，而它并不存在。skill 会告诉你 deepening 该放在哪里、seam 后面放着什么。你必须自己把它转译成 package 或目录结构。

## 它正常工作的标志

- 候选项用你领域的概念命名，而不是发明出来的类名：是"the Order intake module"，而不是"the FooBarHandler"。
- 候选项位于你最近编辑过的文件里，而不是 repo 中没人触碰的部分。
- 运行期间没有任何代码变更。唯一的新文件是你临时目录里的 HTML report。
- 它在 report 之后停下来，问你想要哪个候选项。它不会自行继续。
- 每张卡片都把回报解释为 locality 或 leverage，并说出哪些测试会变得更简单，而不是只说"这个更干净"。
- 当你以持久的理由否决一个候选项时，它会提议记录一条 ADR，这样下一次运行就不会再建议它。

## 它在整体中的位置

`improve-codebase-architecture` 是**定期维护**。你每隔几天运行一次，在任何链条之外，用来排队工作，而不是动手去做。它的邻居：

- [codebase-design](https://aihero.dev/skills-codebase-design) 拥有每个候选项都在使用的 depth-and-seam 词汇。
- [grilling](https://aihero.dev/skills-grilling) 在你选中一个候选项后走 decision tree。
- [domain-modeling](https://aihero.dev/skills-domain-modeling) 在你做出决策时保持 `GLOSSARY.md` 和 ADRs 处于最新状态。

它的产出是一个 idea，这个 idea 在 [grill-with-docs](https://aihero.dev/skills-grill-with-docs) 或 [to-spec](https://aihero.dev/skills-to-spec) 处重新进入 main build flow。它在 main flow 末尾的对口物是 [retro](https://aihero.dev/skills-retro)。这个 skill 改进 agent 身处其中的代码，`retro` 则在一次 build 之后改进它周围的环境（checks、standards、steering files）。至于哪种情形该用哪个 skill，[ask-matt](https://aihero.dev/skills-ask-matt) 是覆盖全集的 router。