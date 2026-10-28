## 它做什么

`ask-matt` 是本仓库 skills 的 router。你描述当前处境（一个不知如何开始的 idea、一堆 incoming bug reports、一场已经持续很久的 [session](https://www.aihero.dev/ai-coding-dictionary/session)），它就会指出契合的 skill 或 skill 序列，以及该序列中人类决策所处的位置。

它负责推荐，然后停下。它不 grill、不写 [spec](https://www.aihero.dev/ai-coding-dictionary/spec)、不打开文件、也不触发它刚点名的 skill；你拿回来的是下一步该输入什么，然后由你去输入它。它同时也是这套 skills 的手写地图，而不是对你已安装内容的扫描，所以它不会把你路由到你自己的 skills 或其他作者的 skills 上。

## 何时使用

你通过输入 `/ask-matt` 调用它，agent 不会自行取用它。

| 你的处境 | router 返回什么 |
| --- | --- |
| 你有一个 idea，却不知从何开始 | Main flow 的头部，以及这个 build 是否小到可以跳过 spec |
| Bugs 和 requests 从别人那里到来 | [triage](https://aihero.dev/skills-triage) 的 on-ramp，以及为什么你自己生成的 [tickets](https://www.aihero.dev/ai-coding-dictionary/ticket) 不属于它 |
| 两个 skills 看起来可以互换 | 两者之间的分界线，而它通常是一个具体的 test，而非口味问题。[grill-me](https://aihero.dev/skills-grill-me) 和 [grill-with-docs](https://aihero.dev/skills-grill-with-docs) 取决于你是否身处工作目录中；[grill-with-docs](https://aihero.dev/skills-grill-with-docs) 和 [wayfinder](https://aihero.dev/skills-wayfinder) 则取决于这份 effort 是否装得进一次 session |
| 一场漫长的 session，以及一个关于 [context](https://www.aihero.dev/ai-coding-dictionary/context) 的决策 | 在某个 phase 边界上，对五个选项的排好序的树 |
| 你已经选定了一个 skill | 没什么有用的。直接调用那个 skill。 |

## 前置条件

Router 只点名 skills，它不安装它们。它指向的一切都必须已安装，推荐才具有可操作性，而且它只认识本仓库中那些已推广的 skills。

依赖 tracker 的 routes（triage、`to-spec`、`to-tickets`、`implement`）假设 [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) 已经在仓库中配置好了一个 issue tracker。哪怕那一步还没发生，router 也会推荐它们。

## Flow，而非 skill

这个 skill 的主打词是 **flow**，一条穿*过*多个 skills 的路径，而不是单个 skill。当你报出你的处境时，router 会把你放到某个 flow 的某一步上。这与「这就是匹配你关键字的 skill」是不同的答案。一共有五种 route，skill 本身对它们有完整的描述：

- **Main flow**，从 idea 到发布。Grill、spec、tickets、implement（一次一个 ticket，或者用 [implement-spec](https://aihero.dev/skills-implement-spec) 把整张任务图并行推进）、review，然后是 [retro](https://aihero.dev/skills-retro)，它把这次 build 学到的东西回馈进 agent 的环境。其中有两个分支。一个是 prototype 绕行，用于一个疑问需要可运行的代码来敲定时。另一个是 spec-and-tickets 的拆分，它只有在 build 跨越不止一次 session 时，才值回它的成本。
- **On-ramps**，用于某种产生工作、随后并入 main flow 的处境：incoming bug reports、某个坏掉的东西、或一份太过模糊、大到一次 session 装不下的 effort。
- **Codebase health**，保养而非 feature 工作。[improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) 巡视代码寻找 deepening 机会，它找到的每一个都作为一个 idea 重新进入 main flow。
- **Standalones**，游离于所有 flow 之外，由你单独取用：prototype、questionnaire、一次 research 运行。
- **底下一层 vocabulary**，即当问题出在词语而非流程时，其他 skills 会引入的两个参考。

## 阶段边界

这个 skill 的另一个关键想法是 **phase boundary**。一个 phase 是 session 内的一块工作（[grilling](https://www.aihero.dev/ai-coding-dictionary/grilling)、implementation、QA），而其中两个 phase 之间的边界，是「我该怎么处理这份 context？」这个问题唯一归属的地方。Phase 中间没有什么可决定的：继续，或者把剩下的拆给 [subagents](https://www.aihero.dev/ai-coding-dictionary/subagent)。

| 选项 | 何时采用 |
| --- | --- |
| **Continue** | 下一个 phase 想要这一个的原样内容，或者你还有 [smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone) 可用。它是唯一能保持 session 作为 [primary source](https://www.aihero.dev/ai-coding-dictionary/primary-source) 的动作，所以先把它排除掉 |
| **`/clear`** | 身后的一切都是可丢弃的。最便宜的选项，而且如果你错了，就无法撤回 |
| **[handoff](https://aihero.dev/skills-handoff)** | 有东西必须移动：一个新的 [harness](https://www.aihero.dev/ai-coding-dictionary/harness)、一个新目录、一位同事、一个在 phase 中途 fork 出来的 side task |
| **Subagent** | 任务被足够紧地限定范围，可以让你 [离开键盘](https://www.aihero.dev/ai-coding-dictionary/afk) 运行 |
| **`/compact`** | 以上皆非。它是默认项，而这棵树常常在这里终止 |

人们经常弄错其中两个，这正是 router 给出顺序、而不只是列表的原因。`/handoff` 看起来像是在 context windows 之间移动的通用方式，但它不是。它给你的只有可移植性。`/compact` 是这棵树里的最后一个选项，而非第一个，因为它上方的四个选项每一个都更便宜或更精确。

## 常见问题

**难道没有一张按正确顺序排列的 skills 列表吗？**

人们一直在 README 里要这么一张列表。这个 skill 就是那张列表。一张静态表格会写出 `wayfinder → to-spec → to-tickets → implement → code-review → retro`，而对大多数处境来说它都是错的。重要的部分是那些分支：有没有 codebase，build 是否跨越多场 session，交谈能否敲定这个疑问。代价在于 router 靠手维护，所以会滞后于仓库。`/grilling` 在 router 点名它之前很久就已发布。

**它告诉我一半的 skills 没安装。**

这是一个已知的 bug，而且没有修复。Router 让你路由经过的大多数 skills 都设置了 `disable-model-invocation: true`，这意味着 harness 会把它们从注入到 agent context 的 skill 列表中排除。Agent 认为那张列表是穷尽的，于是报告它们缺失。在一次被报告的会话里，它判定整个 spec-and-tickets flow 不存在，转而路由到光秃秃的 `/grilling` 和 `/tdd`。插件的二十七个 skills 中有十六个携带这个 flag，所以这是常见情况而非边缘情况。它们已经安装了。照常输入那个 slash command，或者检查 `.claude-plugin/plugin.json`，那才是「有什么存在」的权威。

**它描述了一个 skill 的行为，而那个 skill 并不那么做。**

这同样是一个真实的 bug，同样没有修复。Router 依据自己对每个 skill 的一行摘要来作答，而不是依据 skill 本身。一次详细报告在同一场会话里追到了三个实例，其中有一个是仅凭「把这条 thread 变成一份 spec」这条摘要就建议跳过 [to-spec](https://aihero.dev/skills-to-spec)。Router 从未打开过 `to-spec/SKILL.md`。在每个实例里，它都只在用户推回去之后才验证，而且从不主动为之。那里跳过 `to-spec` 代价是一次真实存在的 seam 检查，而产出的 tickets 也低估了工作量。当 router 对另一个 skill 说出某件你会照着行动的事时，先让它打开那个 `SKILL.md`。同样的原则适用于地图完全没有覆盖的问题，比如是否使用 [plan mode](https://www.aihero.dev/ai-coding-dictionary/agent-mode)：那个答案是 [model](https://www.aihero.dev/ai-coding-dictionary/model) 的推断，而不是在这里写下来的东西。

**为什么是散文，而不是一份编号的清单？**

这是一个合理的抱怨。有一个 open issue 提出，大部分路由是确定性的，而叙事让扫描变得困难。没有任何东西阻止你索要压缩形式：「直接给我序列」就能拿到序列。散文承载的是条件那部分：分支、哪里期望人类决策、以及在步骤之间该在哪里 clear 或 compact。一份扁平的清单会恰好丢掉这些。

**它能路由到我自己的 skills 或另一个作者的 skills 上吗？**

不能。有三份独立的提案要求做一个读取你本地 `skills/` 目录、并从已安装内容中推荐的 router。`ask-matt` 不是那个东西。它是对某一套 skills 的地图，靠手维护，而且对你写的或从别处安装的 skills 一无所知。

**它让我编辑一个 SKILL.md。**

这条建议常常是对的，但那次编辑很少能持久。有人问它如何让 [implement](https://aihero.dev/skills-implement) 关闭 tickets，得到的建议是给 skill 加一行，随即就看到了问题：`npx skills update` 会覆盖这个文件，而 plugin 安装是只读的。把常驻行为放进你自己的 `CLAUDE.md` 或 `AGENTS.md`，或者在你调用时说出来。在 prompt 里做的改动能在更新之后存活下来。人们用这种方式把 flow 指向 Linear 而不是 GitHub，或者问它哪些 open tickets 可以并行运行。

**它点名了一个我没有的 skill，或者漏掉了一个我有的。**

在假设它消失了之前，先查一下 changelog 里的改名。`writing-great-skills` 变成了 [writing-for-agents](https://aihero.dev/skills-writing-for-agents)、没有 alias，`to-prd` 变成了 [to-spec](https://aihero.dev/skills-to-spec)，而 `pathfinder` 变成了 [wayfinder](https://aihero.dev/skills-wayfinder)。有四个 skills 被直接退役，并入吸收它们的 skills：`ubiquitous-language`、`design-an-interface`、`qa` 和 `request-refactor-plan`。如果它漏掉了一个你有的 skill，那就是 router 自身的滞后，上文已有描述。

## 它正常工作的标志

- 它最后点名该输入什么，然后就此停下，而不是自己开始干活。
- 它给出的 route 提到了在哪里 clear 或 compact context，以及哪里期望你 review，而不只是一串 skill 名字。
- 在两个 skills 相近之处，它说明是哪一个，以及为什么另一个对你来说是错的。
- 它关于另一个 skill 行为的所有断言，都显示在 trace 里是它读取了那个 skill 的 `SKILL.md`。
- 你在它交回的东西里认出了自己的处境，而不是最接近的通用场景。

## 它在整体中的位置

`ask-matt` 是一个 **standalone router**，悬于整套 skills 之上。它从不处于某条 chain 中的一步。它指向每一条 chain，而其他 docs 页面都回链到它，这样它们谁都不用重画这张图。从这里你最常落到 [grill-with-docs](https://aihero.dev/skills-grill-with-docs)（main flow 的头部）或 [triage](https://aihero.dev/skills-triage)（那份「到达的工作」而非「你开始的工作」的 on-ramp）。

它是它所描述 skills 之上的一个 [secondary source](https://www.aihero.dev/ai-coding-dictionary/secondary-source)。当 router 和某个 `SKILL.md` 冲突时，`SKILL.md` 是对的。