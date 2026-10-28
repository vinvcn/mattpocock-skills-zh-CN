## 它做什么

`domain-modeling` 在你做设计的同时构建并打磨一个项目的 **ubiquitous language**。它挑战一个与 glossary 冲突的术语，在你用了一个含糊词的地方要求一个精确的词，并用一个具体场景检验一段关系，直到边界精确为止。

它是**主动**的纪律，不是被动的。任何 skill 都能读 `GLOSSARY.md` 借用它的词汇。这个 skill 用于你正在*改变*模型的时候，这正是它打断你的原因。它在你敲定一个术语的那一刻、在对话进行途中把它写进 `GLOSSARY.md`，而不是在结尾产出一份整洁的 glossary。结尾写下的 glossary 是一场 [session](https://www.aihero.dev/ai-coding-dictionary/session) 的摘要，而内联版本才是 session 的输出。

## 何时使用

输入 `/domain-modeling`，或者当任务契合时由 agent 自动调用。实际上，自动调用是 skill 最弱的部分。当 `grill-with-docs` 或 `wayfinder` 说加载它时，[models](https://www.aihero.dev/ai-coding-dictionary/model) 常常加载 `grilling` 而跳过这个。如果一场 [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling) 会话跑完，`GLOSSARY.md` 在结尾却没有变化，那就是发生了什么。按名字和另一个 skill 一起调用它。

当*词语*是问题时使用它：

| 处境 | 动作 |
| --- | --- |
| 两个人对 "cancellation" 的意思不同 | `domain-modeling`：挑出规范术语，把另一个列在 `_Avoid_` 之下 |
| "Account" 在三个文件里干三份工作 | `domain-modeling`：把它拆成 Customer 和 User |
| 你刚做了一个难以逆转的架构选择 | `domain-modeling`：它提供一份 ADR，如果这个选择过了那道门槛 |
| 问题出在 module 的*形状*（seam 放哪里、interface 有多深） | [codebase-design](https://aihero.dev/skills-codebase-design) |
| 你想在构建之前让整个计划被审问 | [grill-with-docs](https://aihero.dev/skills-grill-with-docs)，它在底下驱动这个 skill |
| 你想查一个词，而不是改它 | 没有。读 `GLOSSARY.md`。它是一个文件。 |

## 前置条件

开头什么都不需要。Skill 写入两个地方，两者都惰性创建：

- **`GLOSSARY.md`** 在 repo 根目录。Skill 在你敲定第一个术语时创建它。在根目录有 `GLOSSARY-MAP.md` 的 repo 里，术语进入地图指向的 per-context `GLOSSARY.md` 中。
- **`docs/adr/`**。Skill 用第一份过门槛的 ADR 创建它。

开始之前什么都不需要存在，skill 也不预先创建任何东西。

## 两份 artifact，两道门槛

Glossary 和 ADR 有不同的门槛。这个 skill 的大部分麻烦都来自把两者混为一谈。

| | `GLOSSARY.md` | `docs/adr/NNNN-slug.md` |
| --- | --- | --- |
| 持有 | 术语。某样东西*是*什么，用一两句话，被拒绝的同义词列在 `_Avoid_` 下 | 一个决策，用一到三句话：context、choice、reason |
| 写作门槛 | 一个含糊术语成了规范 | **全部三个**：难以逆转、没有上下文令人意外、是真正权衡的结果 |
| 何时写 | 内联，在术语被敲定的那一刻 | 提供，而非假定 |
| 从不持有 | Implementation details、一份 [spec](https://www.aihero.dev/ai-coding-dictionary/spec)、一个草稿本、一般的编程概念 | 本 session 做出的每一个选择的一本日记 |

错失 ADR 三个 test 中的任何一个就没有 ADR。一个容易逆转的决策只会被逆转；一个不令人意外的决策不是任何人的问题；一个没有真正替代的决策记录的是你做了显然的事。

`GLOSSARY.md` 规则最要紧，因为它是实践中会破的那条。**它是一份 glossary，别无其他。** 不加约束的话，models 会把「write to `GLOSSARY.md`」当作把你给出的每个答案都持久化的许可，文件就变成一份运行中的 spec，这是这个 skill 被报告最多的问题，横跨多个 models。

## 交叉引用，及其限度

当你陈述某样东西如何运作时，skill 会检查代码并指出任何矛盾。*「你的代码取消整个 Orders，但你刚说部分取消是可能的，哪个是对的？」*Skill 会让语言和代码达成一致，在它改变任何一方之前，大声地。

它的限度值得知道。它交叉引用**代码**和已提交的 `GLOSSARY.md` 与 ADRs，别无其他。它不搜索你的 issue tracker。如果你的团队曾为一次命名冲突争辩过、并在几个月前的一个已关闭 issue 里刻意解决了它，skill 会把它当作新事重新提出来。有一个[开放的请求](https://github.com/mattpocock/skills/issues/717)要修复它。在那之前，workaround 是把指令放进你自己的 `docs/agents/domain.md`，skills 已经会读取它。

## 常见问题

**我的 `GLOSSARY.md` 有 500 行。1000。3000。我该怎么办？**
这个体量是症状。病因是文件吸收了一直不属于 glossary 的 implementation detail 和决策。修复是一条直接指令：`/grill-with-docs make my GLOSSARY.md more concise and remove any implementation details from it`。拿它跑一份臃肿的文件，大部分会消失。只有在文件精简、且仍覆盖一个读者不会想同时持有的两个 domain 时，才用 `GLOSSARY-MAP.md` 来拆分。拆一份臃肿的文件只会给你几份臃肿的文件。Skill 在这里的指导还不足以在第一时间阻止这种增长，而追踪它的 issue 仍然开着。

**为什么是 `GLOSSARY.md` 而不是 `CONTEXT.md`？**
在 1.3.0 之前它叫 `CONTEXT.md`（以及 `CONTEXT-MAP.md`）。这个文件是一份 glossary，别无其他，所以 `GLOSSARY.md` 恰如其名，而且（正如一位读者所言）「with ai agents everything is [context](https://www.aihero.dev/ai-coding-dictionary/context)」。如果你的 repo 里还有一份 `CONTEXT.md`，重新运行 `/setup-matt-pocock-skills`：它会提议 `git mv` 这个文件并更新 `docs/agents/domain.md`。这套里的每个 skill 都在找 `GLOSSARY.md`，所以保留旧名字意味着给它们全部打补丁。

**`/ubiquitous-language` 去哪了？**
它被移除了，而且不是被废弃。它的工作移进了 `domain-modeling`，后者持续地维护整个 model，而不是从一场对话里倾倒一份 glossary。词汇强制现在更重要，而不是更轻。它在 grilling、triage 和 mapping 底下运行，而不是作为你得记得去做的一趟单独 pass。

**我如何为一个没有 glossary 的 codebase 拿到一份？**
明确地要它，而不是等它积累。`/grill-with-docs help me scaffold my existing repo with a GLOSSARY.md` 是有文档记录的 route。预期一场漫长的审问。一个用户报告在文件成形之前有超过 50 个问题。在 brownfield repo 上，偶然的使用构建 glossary 的速度太慢了。

**我能保留 domain model 并用我自己的 ADR 格式吗？**
今天不能干净地。Glossary 半和 ADR 半随附在一个 skill 里，所以一个有着既定 ADR 约定（不同模板、不同位置、不同命名）的团队会得到和它 house style 冲突的指令。当前的选项是本地复制 skill 编辑它，或者覆盖你 repo 自己的 agent docs 里的 ADR 约定。把两者拆开是一个[开放的请求](https://github.com/mattpocock/skills/issues/557)。

**一份 glossary 真的值回票价吗？它只是又一个要 review 的 artifact，而且会过时。**
有时它不值。DDD 越接近 implementation 就越没用：回报在上游，在命名和概念对齐上，不在 aggregates 和 layer 仪式上。同义词控制重要的地方是命名边界：module names、table names、status enums、issue titles、CLI commands。在普通散文里它重要得多得少。还有一个反对意见：领域术语压缩的是*已经共享它们的*人类之间的沟通，而 agent 对平实的语言描述反应也一样。在这个读法下，glossary 的价值是让你和你的 reviewers 与 agent 正在做的事保持对齐，而不是让 agent 变得更好。在一个一天构建上，跳过它。而一份未经 review、由 agent 撰写的 glossary 比没有更糟：它装满听上去自信的断言，后来的 sessions 会把它们当作真理。

**它能把我的含糊 prompt 变成领域语言吗？**
不能，而且没有计划做这样的 skill。一种你自己都不理解的领域语言，一旦写下来就是无意义的。这个 skill 在你有了理解之后强制精确，它不发明你没有的词汇。相关的陷阱是用领域词而不做建模。把正确的名词安在错误的概念上，产生读起来正确而实际不是的输出。

## 它正常工作的标志

- 它在你说到一半时打断你，问你想要两个东西中的哪一个，而不是挑一个继续。
- `GLOSSARY.md` 在对话**进行中**改变，而不是在结尾一阵爆发。
- 它拒绝为一件你明天能撤销的东西写 ADR，并说出三个 test 中哪一个失败了。
- 新条目用一两句话定义某样东西*是*什么，并在 `_Avoid_` 下点出你放弃的词。
- 当你的代码和你的句子不一致时，它把你的代码复述回给你。
- `GLOSSARY.md` 变短的频率和变长的频率一样高。

## 它在整体中的位置

`domain-modeling` 是一个 **model-invoked reference**，*位于*其他 skills 底下运行的频率，比它单独运行的频率更高。[grill-with-docs](https://aihero.dev/skills-grill-with-docs) 通过一场 grilling session 驱动它，[wayfinder](https://aihero.dev/skills-wayfinder) 在绘制地图时加载它，[triage](https://aihero.dev/skills-triage) 用它让 [tickets](https://www.aihero.dev/ai-coding-dictionary/ticket) 保持项目自己的措辞，而 [improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) 在决策落定时调用它。它最接近的同胞是 [codebase-design](https://aihero.dev/skills-codebase-design)。两者合起来是其他一切底下的词汇层，这一个针对 *domain*，那一个针对 module 的*形状*。它也可以直接够到，当你想得到这套纪律、却不必承诺通常会加载它的那个 skill 的步骤时。当你拿不准哪个 skill 契合时，[ask-matt](https://aihero.dev/skills-ask-matt) 会为你路由。