## 它做什么

`to-spec` 把你刚刚进行的 conversation 变成一份 **[spec](https://www.aihero.dev/ai-coding-dictionary/spec)**，并作为单个 issue 发布到你的 issue tracker。

它不会访谈你。当你调用它时，决定已经完成，所以它综合的是已知的内容（来自 thread、来自 codebase、来自你的 `GLOSSARY.md` 和 ADRs），而不是开启一轮新问题。Spec 是已经做出的决定的记录，而不是做出新决定的地方。

## 何时使用

你通过输入 `/to-spec` 调用它，[agent](https://www.aihero.dev/ai-coding-dictionary/agent) 不会自行触发。

当一个 build 对单个 agent [session](https://www.aihero.dev/ai-coding-dictionary/session) 来说太大、必须能撑过被拆分成几个 session 时，就使用它。这就是全部触发条件：

| 你在哪里 | 运行什么 |
| --- | --- |
| 你还什么都没决定 | 先 [grill-with-docs](https://aihero.dev/skills-grill-with-docs) |
| 已决定，且工作适合单个 [context window](https://www.aihero.dev/ai-coding-dictionary/context-window) | [implement](https://aihero.dev/skills-implement)，跳过 spec |
| 已决定，且工作横跨几个 sessions | `/to-spec`，然后 [to-tickets](https://aihero.dev/skills-to-tickets) |
| 一张 [wayfinder](https://aihero.dev/skills-wayfinder) map 已 cleared | `/to-spec #<map_issue>` |

## 前置条件

`to-spec` 把 spec 作为 issue 发布，所以 [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) 必须先为这个 repo 配置好一个 tracker 和 triage-label vocabulary。任一类型都可以：像 GitHub 这样的真实 tracker，或 `.scratch/` 下的 local markdown 文件，后者开箱即受支持。

## Spec 是一份决策记录

Spec 之所以存在，是因为 context windows 会结束。你在 [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling) 期间安定下来的所有东西（解决方案的形状、你争论过的选择、你刻意拒绝的）都在一个即将被清空的 conversation 里。Spec 就是那个幸存下来的东西。

所以它不验证任何东西，也不决定任何东西。它捕获的是已决定的内容，用你自己项目的词汇，让一个全新的 session 能在你不重新解释的情况下接手工作。Spec 断言的任何你从未真正说过的东西，都是一个缺陷。

## 先定 seams，再写正文

在写一个字之前，`to-spec` 会勾勒 feature 将被测试的 **seams**，并和你核对。它优先选择已经存在的 seams 而非新建，并尽可能取最高的 seam：一个 change 的理想数量是一。

那些已商定的 seams 随后会传播。[tdd](https://aihero.dev/skills-tdd) 只在 pre-agreed seams 上工作，而 [code-review](https://aihero.dev/skills-code-review) 会对照 spec 审查 diff，所以一个没人商定的 seam 会显示为一条 review finding。这个绑定是间接的（它通过这份文档传播），这正是为什么 seam 对话值得在这里认真对待，而不是把它顺延到 implementation。

## 常见问题

**`/to-prd` 去哪了？**
它就是本 skill，在 v1.1 中改名。"Spec" 现在是唯一的贯穿术语，旧的 `to-prd` slug 已死，用新名字重新安装。取代旧词汇的那一对是 *spec* 和 *tickets*：spec 是目的地和固定它的决定，[tickets](https://www.aihero.dev/ai-coding-dictionary/ticket) 是到达那里的执行步骤。如果你 pivot，删除未完成的 tickets，保留 spec。

**为什么 spec 会带 `ready-for-agent` label？我不想让 agent 基于它实现。**
这个 label 的意思是 "不再需要进一步 triage"：这份文档完整到 agent 可以据此工作。它是一个 input 称号，不是一份 work order。但如果你运行轮询 `ready-for-agent` 的 [AFK](https://www.aihero.dev/ai-coding-dictionary/afk) agents，那个区别对它们不可见，它们会乐于一次运行就构建整个 spec，而不是领取 ticket slices。这是这个 skill 上被报告最多的粗糙边缘。在它改变之前，在你的 AFK agent 的 prompt 里显式排除父 spec，或者在 `/to-tickets` 运行后去掉这个 label。

**为什么不直接从 grilling 到 `/to-tickets`，跳过 spec？**
通常你应该这么做：spec 只在 multi-session 工作上才赢得它的步骤。它值得的地方在于：tickets 是一次性的、spec 不是：每个 ticket 为一个全新的 context window 定尺寸并被删除或关闭，而 spec 作为承载它们背后推理的唯一地方留下来。在 single-session change 上这买不到任何东西，而且你付了一个额外 synthesis 步骤，其中 [model](https://www.aihero.dev/ai-coding-dictionary/model) 可能漂移。走 grilling → `/implement`。

**我刚完成一张 wayfinder map。我喂给它什么？**
主 map issue（`/to-spec #<map_issue>`），而不是个别的 decision tickets。[wayfinder](https://aihero.dev/skills-wayfinder) 产出的是 decisions 而非 deliverables，散布在一张 map 里；`to-spec` 是把它们折叠成一份可构建文档的步骤。把 map 直接 loop 进 `/implement` 会丢掉那个折叠。

**spec 是给我 review 的，还是只给 agent 的？**
主要是给 agent 的，而且读起来就是那样：完整、密集、参考资料多。值得你过目的部分是 seams 和 out-of-scope 小节，因为那是错误决定最容易抓到、也最贵到事后才发现的两个地方。从头读一遍是人们对它真实的抱怨，也没有 summary 模式：诚实的回答是，如果 spec 让你意外，那是 grilling 太浅，而不是 spec 太长。

**一旦 tickets 开始，我该让 spec 保持冻结，还是让 agent 重写它？**
没有什么能让它保持同步，所以实际上它是你在那一刻所知道内容的快照，并且在 implementation 第一次教你某些东西时就会过时。一旦工作落地，就把它当作一次性的。被设计来活得比它更长的 artifact 是你的 `GLOSSARY.md` 和你的 ADRs：如果 implementation 期间学到的东西值得留存，它属于那里，而不是一份被编辑过的 spec。

**我的工作是一个 refactor 或 module boundary，而不是 feature。模板合适吗？**
不太合适，这是一个已知限制。模板重度依赖 user stories，这对架构工作来说是一个错误的形状：你最终会围绕那些真正关乎 interfaces 和 invariants 的决定，写出没人要求的 stories。改为依靠 implementation-decisions 和 testing-decisions 小节，并让持久的架构决定通过 [grill-with-docs](https://aihero.dev/skills-grill-with-docs) 作为 ADRs 落地，而不是试图让 spec 承载它们。

**它会在 tracker 里检查相关工作，或引用它尊重的 ADRs 吗？**
两者都不。它读取并尊重覆盖它触碰区域的 ADRs，但不会链接它们，也不会在起草前搜索 tracker 里重叠的 issues，所以一份 spec 会悄悄重复别人已经提交的工作。如果这个区域很忙，先自己搜索 tracker。

**`/to-tickets` 读不了我的 spec，它一直截断。**
非常大的 specs 可能超过一个 tracker issue 能干净回传的大小，也没有本地副本可回退。修复是 context hygiene：不要在 `/to-spec` 和 `/to-tickets` 之间 [clear](https://www.aihero.dev/ai-coding-dictionary/clearing) 或 [compact](https://www.aihero.dev/ai-coding-dictionary/compaction)。在同一个 window 里运行它们，spec 就完全不必被重新抓取。

## 它正常工作的标志

- 它开始写，而不是问你一轮新问题。
- 它在写之前把 seams 摆给你，并提出它能脱身的最少数量。
- 它用你项目的名词返回，而不是通用的 product-management 样板。
- 其中每个决定都是你记得做出过的。没有为了填满某个小节而发明的东西。
- Out-of-scope 小节里有真实的东西：你拒绝的那些通常是页面上最有用的几行。

## 它在整体中的位置

`to-spec` 是 main build chain 中的一个步骤，而且只在它的 multi-session 分支上：

```txt
grill-with-docs → to-spec → to-tickets → implement → code-review → retro
```

它上游的邻居是 [grill-with-docs](https://aihero.dev/skills-grill-with-docs)，它做本 skill 只负责记录的 deciding，以及 [wayfinder](https://aihero.dev/skills-wayfinder)，其完成的 map 正好在这里并入 chain。下游，[to-tickets](https://aihero.dev/skills-to-tickets) 把 spec 切成 [implement](https://aihero.dev/skills-implement) 要构建的 tracer-bullet tickets。当你不确定哪个 skill 或 flow 合适时，[ask-matt](https://aihero.dev/skills-ask-matt) 会为你路由。