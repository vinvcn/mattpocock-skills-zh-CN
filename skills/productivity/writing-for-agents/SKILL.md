---
name: writing-for-agents
description: 为 agent 编写文档。适用于创建或编辑 skills，或修改 AGENTS.md 或 CLAUDE.md 时。
---

为 agent 消费的任何文档提供参考：一个 skill、一个 `AGENTS.md` / `CLAUDE.md`、一个经 pointer 触达的文档。包装方式不同；写作本身并无不同：同样的杠杆让每一份都变得可预测：agent 每次运行都采取相同的 _process_，而不是产出相同的 output。

当你写的文档是 skill 时，阅读 [`SKILL-MECHANICS.md`](SKILL-MECHANICS.md) 了解 frontmatter、invocation 选择以及 router skills。

## Context pointers

**context pointer** 是 agent context 中持有的一个 reference，它命名某个 context 之外的材料，并对触达它的条件进行编码。某个 skill 的 description 就是其一；`AGENTS.md` 中命名某个文档的一行是同一个对象。决定 agent 何时以及多可靠地触达材料的，是指针的 _措辞_，而不是它的目标。一个必须是目标的、却由措辞薄弱的 pointer 承载的内容，是一个 variance bug：先打磨措辞，只有打磨失败时才内联该材料。

一个 pointer 做两件事：说明材料是什么，并列出应触发触达它的 **branches**（一个 branch 是文档处理的一个独立情形，所以不同的 runs 会沿不同的路径穿过它）。一个始终加载的 pointer 的每个词都会在每一轮付出成本，所以它比正文更该被大力修剪：

- **把 leading word 放到最前面**：pointer 是它做触发工作的地方。
- **每个 branch 一个 trigger。** 如果同义词只是重命名单一 branch，那就是同一个 branch 写了两遍；合并它们，只保留真正不同的 branches。
- **删掉正文已经承载的 identity。**

## 两种 load

你添加的每个文档和 pointer 都会花掉两个预算之一：

- **Context load**：始终加载的材料对 agent window 的成本：一行 `AGENTS.md`、一个 skill description、任何每轮都躺在 context 里的东西，无论是否触发都要花 tokens 和注意力。
- **Cognitive load**：对人类的成本：存在哪些文档、何时伸手去取每一份。人类就是 index。这不是要最小化的成本，它是 human agency 的代价；把它花在人的判断起作用的地方，在它不起作用的地方移除它。

只能通过 pointer 触达的材料，以该 pointer 自己那一行为代价逃过 context load；完全没有 pointer 的材料则完全由 cognitive load 承载。

## 信息层级

一个文档由两类内容构成：**steps**（agent 执行的有序动作）和 **reference**（按需查阅的定义、规则、事实），它们自由混合：全是 steps（一份菜谱）、全是 reference（一次 review 的规则、本 skill），或两者都有。核心决策是每块内容放在 **information hierarchy** 的哪个位置，一个按 agent 需要材料的即时程度排序的 ladder：

1. **In-file step**（primary tier）：agent 按顺序做什么。
2. **In-file reference**：按需查阅。通常是一个合法的 flat peer-set（一次 review 的所有规则都在一个 rung 上），这是合理的安排，不是坏味道。
3. **Disclosed reference**：推到独立文件中，经 context pointer 触达，只在 pointer 触发时加载。既涵盖同一文件夹里的 sibling 文件，也涵盖存在于任何地方、任何文档都能指向的完全 external reference。

把太少内容下放会让顶层膨胀；把太多内容下放会隐藏 agent 实际需要的材料。那种张力就是整个决策。

**Progressive disclosure** 是沿 ladder 下移的动作（移出主文件、放到一个 pointer 后面），让顶层保持清晰。它主要不是 token 优化：它是 hierarchy 被保护的方式。Branching 是最干净的 disclosure 测试：内联每个 branch 都需要的内容，只把部分 branches 触达的内容放到 pointer 后面。当一个文档有 steps 时，本应被 disclose 的 in-file reference 会把它们埋起来，把关注它们变成掷硬币，这是一个 variance 杠杆，而不只是可读性杠杆。

**Co-location** 是文件内的伴随动作：ladder 决定一块内容 _下移多远_，co-location 决定它一旦到了那里 _什么在它旁边_。把一个概念的定义、规则和 caveats 放在同一个 heading 下，而不是散落各处，这样读一部分时它的邻居也随之而来。检验标准：文档应该读起来像专门写给 agent 的 documentation：分组的材料读起来就是这样；散落的材料不是。（它与 duplication 不同：duplication 在两处重复同一含义；散落是把一个含义碎片化到许多处。）

**Sprawl** 是这里的失败模式：文档过长，即使每一行都 live 且 unique。注意力在多余内容上变稀薄，每一行多余的都要多维护一条。治疗方式是 ladder：把 **reference** disclose 到 pointers 后面，并按 **branch** 或 sequence 拆分，让每条路径只携带它需要的。

## Steps 与 completion criteria

每个 step 都以一个 **completion criterion** 结束：告诉 agent 工作完成的条件。两个属性让它成为杠杆：

- **Clarity**：agent 能分辨 done 与 not-done 吗？一个模糊的边界（"understanding reached"）会诱发 **premature completion**：在 step 真正完成之前就结束，注意力滑向 _being done_。仍然可见的后续 steps（**post-completion steps**）提供拉力；criterion 的清晰度是阻力。按顺序防御：**先 sharpen 边界**（局部且廉价）；只有当它不可避免地模糊 _且_ 你观察到 rush 时，才通过拆分 sequence 隐藏后续 steps，而且隐藏只在跨越真实 context boundary（一次 hand-off 或 subagent dispatch；inline 调用会把后续 steps 留在 context 里，什么也清不掉）时才有效。
- **Demand**：它要求多少。"Every modified model accounted for" 迫使做彻底的工作，而 "produce a change list" 不会。Demand 驱动 **legwork**（agent 在工作的内部做的挖掘，潜伏在措辞里而不是被写成自己的 step），并且它不受 step 约束："every rule applied" 约束一整套 flat reference，正如 "every step done" 约束一个 sequence，这正是为什么一个全 reference 的文档仍然带有穷尽性的门槛。

最强的 criteria 既可检查又穷尽。

## 何时拆分

把一个文档拆成两个会花掉两种 load 之一，所以只有当这一刀赚回成本时才拆：

- **By sequence**：当 post-completion steps 会诱使 agent 急着结束眼前那一步时，拆分一连串 steps。把它们挡在视野之外，会在当前任务上驱动更多 legwork。当心反面：合并 sequences 会让每个 step 的后续 steps 暴露给它后面的东西，诱发 premature completion。
- **By invocation**，skill 专属：见 [`SKILL-MECHANICS.md`](SKILL-MECHANICS.md)。

## Leading words

**leading word** 是一个已经存在于模型预训练中的紧凑概念，agent 在运行文档时会用它思考（_lesson_、_fog of war_、_tracer bullets_）。它作为一个 token 反复出现，绝不作为一个句子，累积 distributed definition，并通过招募模型已持有的 priors，用最少的 tokens 锚定一整片行为。自己造词也可以，只要你定义清楚，但一个编造的词招募不到任何 priors，你会在定义上付出一个预训练词免费提供的东西；先伸手去拿一个已有的词。

它两次做锚定。正文中锚定 _execution_：每次出现该词，agent 都伸手去拿同样的行为，在 flat reference 内部它把注意力聚焦到要寻找的一类事物上。pointer 中锚定 _invocation_：当同一个词存在于你的 prompts、docs 和 codebase 中，agent 会把那份 shared language 连到该材料，更可靠地触达它。

寻找用 leading words 做重构的机会。一个在三处展开的 triad、一个花一句话来指向一个概念的 pointer，每一段都是恳求 collapse 成单个 token 的文字：

- "fast, deterministic, low-overhead" → _tight_（一个 _tight_ loop）。
- "a loop you believe in" → _red_：一个模糊的 gate 变成一个二元可观察状态（loop 在 bug 上变 _red_，或者不变）。

你赢两次：更少的 tokens，以及一个更尖锐的 hook 让 agent 挂起它的思考。假设每个文档都携带着 leading words 可以退役的 restatements，去找它们。

**Negation** 是这个杠杆旁边的失败模式：用禁止来引导会把被禁止的行为拖进 context，让它 _更容易_ 浮现，而不是更难。_Don't think of an elephant_，而 elephant 就是全部；negation 是一个被强烈激活的概念压垮的弱修饰符，所以禁令读起来一半像是在叫你去做那件事。应 prompt **positive**：直接说明目标行为（"write one-line comments"），让被禁止的那个从不被说出。只有当你无法正向表达某条 hard guardrail 时，prohibition 才配得上一个位置；即便如此，也要配上正向目标，让注意力落到该做什么上。

## 修剪

- 让每个 meaning 都保持在 **single source of truth**：一个权威位置，这样改变行为就是一处的编辑。**Duplication**（同一含义出现在多处）会花维护成本和 tokens，并把这个含义在 ladder 上的 prominence 抬高到超过它真实等级的位置。（这是 leading word 的意外反例：leading word 是有意重复一个 token，绝不重复含义。）
- **environment** 也是一个 source of truth（`package.json` scripts、config files、目录布局、`--help` output），而一个把它重述出来的文档是一个 **cache**：一次 lookup 的副本，只有当 lookup 很昂贵时才配得上它的 load。缓存那些 agent 查看环境也找不到的东西：未写下的约定、某个选择背后的原因、没有 config 会招认的 gotcha。把 one-file、one-command 的 lookups 留给 environment，在那里它们不会过时。
- 逐行检查 **relevance**：它是否仍支撑文档所做的工作？一行会因为从不支撑任务（只是 expository，或一个本应被 disclose 的 branch）而失去 relevance，或随着它描述的行为或 world 变化而 stale。更短的文档更容易保持 relevance。没有 pruning discipline，默认命运是 **sediment**：因为添加看着安全、删除看着有风险而沉积的 stale layers，直到你必须钻穿它们去找仍然 live 的东西。
- 逐句寻找 **no-ops**：一条模型默认就会服从的指令，付出 load 却什么也没说。检验标准（它是否相对于默认改变行为？）是模型相对的，不是读者相对的：两个人在一个 no-op 上意见不一，其实是对默认不一致，用运行文档来裁决，而不是用辩论。当一个句子失败时，删除整句，而不是修剪其中的词。这个检验标准也用于给 leading words 打分：一个弱到打不赢默认的词（当 agent 已经大致 thorough 时的 _be thorough_）就是 no-op，修法是换一个更强的词（_relentless_），而不是换一种 technique。