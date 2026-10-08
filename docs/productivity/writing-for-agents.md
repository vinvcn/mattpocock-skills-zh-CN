## 它做什么

`writing-for-agents` 是你撰写 agent 会读的文档时对照的参考：一个 skill、一份 `AGENTS.md` / `CLAUDE.md`、一份 [spec](https://www.aihero.dev/ai-coding-dictionary/spec)、一个 runtime prompt、一份 README，任何 [agent](https://www.aihero.dev/ai-coding-dictionary/agent) 会读的文档。打包方式不同；写作本身不变：同样的杠杆让每一份都变得可预测，所以 agent 每次运行都走同样的 _process_，而不是产出同样的 output。

它的默认动作是删除，而不是解释。让一个 agent 为另一个 agent 写指令，它会花大部分字数来解释 [model](https://www.aihero.dev/ai-coding-dictionary/model) 已经知道的东西，其中每一行都是 **no-op**，付了 [context](https://www.aihero.dev/ai-coding-dictionary/context) 却改变不了任何行为。这份参考就是找出它们的透镜，这也是为什么它在一份你已经拥有的文档上，至少同在一份空白文件上一样经常派上用场。

它直到 v1.1 还叫 `writing-great-skills`。这次改名追上了它底下一直以来的样子：它几乎没有任何部分是 skill 专属的。那些只有 skill 专属的机制（frontmatter、model- 与 user-invoked 的选择、router skills）被披露到一个链接的 `SKILL-MECHANICS.md`，只有当眼前这份文档是 skill 时你才会去读它。

## 何时使用

输入 `/writing-for-agents`，或者当你在创建或编辑一个 skill、修改 `AGENTS.md` 或 `CLAUDE.md` 时，agent 会自行调用它。

对于 agent 会读的其他一切，你手动去用它：你的 docs、specs 和 [tickets](https://www.aihero.dev/ai-coding-dictionary/ticket)、system 与 [AFK](https://www.aihero.dev/ai-coding-dictionary/afk) prompts。检验标准只有一个问题（agent 会读这个吗？），文档是怎么到它面前的并不重要，无论是一个 pointer 点名了它、一个人把它粘进去，还是它只是躺在 repo 里。要首先搞清楚一个 codebase 实际包含什么，用 [grill-with-docs](https://aihero.dev/skills-grill-with-docs)，这份参考管的是文档读起来如何，而不是它知道什么。

## 两种 load

整份参考所围绕的核心理念，是每一份 document 和 pointer 都会支出的两个预算：

- **Context load**：始终加载的材料对 agent 窗口的代价：一行 `AGENTS.md`、一个 skill description、任何每一 [turn](https://www.aihero.dev/ai-coding-dictionary/turn) 都待在 context 里、无论是否触发的东西。
- **Cognitive load**：对你的代价：存在哪些 documents，以及何时拿起哪一个。你是索引。这不是一个要去最小化的代价：它是人类 agency 的代价。

一旦你用这两种 load 思考，大多数写作决策（拆或不拆、inline 还是 disclose、point 还是 push）都变成同一笔在不同地方做出的交易。

## 杠杆

- **[Context pointers](https://www.aihero.dev/ai-coding-dictionary/context-pointer)**：留在 context 里的 reference，它点名了 context 之外的材料，并编码何时去触达它。一个 skill description 和一行点名的 `AGENTS.md` 是同一个对象；pointer 的_措辞_，而不是它的目标，决定 agent 触达它时有多可靠。
- **Information hierarchy**：从 in-file step、到 in-file reference、再到 pointer 背后的 disclosed reference 的阶梯。**[Progressive disclosure](https://www.aihero.dev/ai-coding-dictionary/progressive-disclosure)** 是沿这级阶梯下移的动作，好让顶层保持清晰。
- **Completion criteria**：每个 step 的 done-condition 的清晰度和要求，以及这个要求驱动的 **legwork**；对抗 **premature completion** 的防线。
- **Leading words**：一个已经在 model 预训练里的紧凑概念（_tight_、_red_、_tracer bullet_），agent 在运行 document 时用它思考。它锚定两次：正文中锚定 execution，pointer 中锚定 invocation。
- **Pruning**：single source of truth、relevance，以及逐句应用的 no-op test，对抗 **duplication**、**sediment** 和 **sprawl**。

## 常见问题

**`/writing-great-skills` 去哪了？**
就是这一个 skill，在 v1.1 改的名。实践者们早在名字跟上之前，就已经把它指向 `AGENTS.md`、docs、specs、tickets 和 runtime prompts；结构、leading words 和 pruning 被证明是任何 agent 会读的文本的技艺。没有别名，用新名字重新安装。

**"Writing for agents"：所以是 agent 来写？**
反过来。你是作者；agent 是读者。这正是这种文体的全部难点：你在为一个已经什么都读过的读者写作，所以解释是浪费，而精确是全部工作。

**我不能直接让 agent 替我写吗？**
你可以，而且它会产出一份啰嗦的东西。放任不管时，model 会解释它已经知道的东西，而且它不会自行应用 no-op test 或抓取一个 leading word。把参考用在草稿上：一次 review pass 正是它大部分价值落地的地方。

**我让 agent 精简一份 document，它却把功能剪没了。**
被告知要"streamline"的 agent 会为长度而优化，因为长度是它们看得见的东西。no-op test 是行为性的，不是审美性的：删掉那一行，然后问 agent 的行为是否改变了。当一个句子失败时，删除整个句子，而不是从它里面修剪几个词，而如果对它有分歧，通过运行 document 来解决，而不是靠争论。

**我怎么知道它什么时候算完成？**
当它跑得通，而且你再也找不到 duplication、sediment 或 no-ops 的时候。这里没有自动化 eval；检查方式是手动运行，加上把 failure-mode 词汇当作诊断工具。当一份 document 行为异常时，那套词汇同时也是修理工具：先命名 failure mode，然后修那个。

**这应该放在 `CLAUDE.md` 里还是别处？**
问问你想付哪种 load。`CLAUDE.md` 无条件地加载进每一 [session](https://www.aihero.dev/ai-coding-dictionary/session)；pointer 背后的材料直到它触发之前，只花 pointer 那一行自己的成本。任何只在十个 context 里才适用一次的东西，另外九次都在付 context load。

**我需要为每一个新 model 重写文档吗？**
多半不用，而且对单个 model 的过度拟合本身就是个陷阱。为新 model 更新通常只是又一次 no-op pass，而不是一通重写。

**我的 skill 只在它取材的那个确切任务上有效。**
常见路线（先做一次，然后让 agent 把它写成 skill）对那一次运行过度索引，产出的 exemplars 太具体了。把那次运行当作证据，然后刻意地抽象：剥掉属于那个 repo 和那些文件的东西，为这一类任务写作。

**英语不是我的母语。我会损失 leading-word 的优势吗？**
不会：找出那个用最少 [tokens](https://www.aihero.dev/ai-coding-dictionary/token) 塞进最多 behavior 的词，是这份参考替你做的活。这正是它存在的意义之一。

## 它正常工作的标志

- document 随着变得更好而越来越短，而且你惊讶于剩下的竟然这么少。
- 你能指着一个 leading word，看着它在不止一个地方干活。
- 没有任何东西以任何形式被陈述两遍。duplication 是"某份 document 从未被测试过"最可靠的信号。
- 只有某个 branch 需要的 reference 待在 pointer 背后，而不是主文件里。

## 它在整体中的位置

这是一份随时可调的 standalone reference。它位于整个集合之下，而不是任何单个 skill 旁边：这里的每个 skill 都是照着它写出来的，而其他 skills 留下的 documents（一份 `GLOSSARY.md` 及其 ADRs、一份 spec、一张 ticket）正是每当 agent 不得不读它们时它所管辖的文本。它唯一的直接调用者是 [retro](https://aihero.dev/skills-retro)，后者在提出任何 steering file 或 skill 之前会先加载它。当你不确定哪个 skill 或流程适合某项任务时，[ask-matt](https://aihero.dev/skills-ask-matt) 会带你在整个集合上路由。