## 它做什么

`research` 通过阅读拥有答案的 sources 来回答一个问题，然后在 repo 里留下一份带引用的 Markdown 文件。它只基于 **[primary sources](https://www.aihero.dev/ai-coding-dictionary/primary-source)**（official docs、source code、specs、first-party APIs）工作，并把每条说法追溯回拥有它的 source，所以在 API 自己的 docs 可达时，它不会复述一篇博客文章对那个 API 的转述。

它不在对话里回答你。输出是一份文件，写在 repo 已经存放此类笔记的地方，每条说法上都带着链接。这正是重点：一份你可以回应、可以交给另一个 agent、也可以扔掉的文件，而不是一个在 [session](https://www.aihero.dev/ai-coding-dictionary/session) 结束时消失的答案。

## 何时使用

输入 `/research`，或者当任务变成阅读类 legwork 时由 [agent](https://www.aihero.dev/ai-coding-dictionary/agent) 自动取用它。

当下一步是从 working directory 之外*弄清楚某件事*时使用它（第三方 API 如何表现、一份 spec 实际说了什么、某个版本说法是否成立），而你宁愿不让自己的 thread 因做这些阅读而停滞。你需要什么，决定用哪个 skill：

| 你需要什么 | 该用哪个 |
| --- | --- |
| 一个决策在等待的外部事实 | `research` |
| 一个通过访谈*与你共同*做出的决策 | [grilling](https://aihero.dev/skills-grilling) |
| 一个写入 `GLOSSARY.md` 和 ADRs 的持久架构决策 | [grill-with-docs](https://aihero.dev/skills-grill-with-docs) |
| 弄清某个方法在你的 codebase 里是否可行 | [prototype](https://aihero.dev/skills-prototype) |
| 一个大到一次 session 装不下的计划 | [wayfinder](https://aihero.dev/skills-wayfinder) |

`research` 和 `grill-with-docs` 之间的界线是**带回之物的保质期**。研究产出短寿的 asset：这个库的 auth 机制截至本周表现如何。一份 ADR 记录一个你要保留的决策。如果你产出的是一份决策而不是一个事实，那你是在 [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling)，而不是在研究。

## 委派出去的跑腿工作

标志性的动作是：阅读以 **background agent** 的形式运行。你继续工作；它离开去把每条说法追溯回其 primary source，写出一份 Markdown 文件，然后回报。Research 是你委派出去的 legwork，而不是你外包出去的思考：你拿回的是一份可供你 grill、plan 或 design 的文档，而做判断的仍然是你。

这次委派是不设防的，background agent 可以再衍生一个它自己的 background agent。这是这个 skill 被记录得最充分的毛糙边缘。

文件落在哪里由 repo 决定，而不是由 skill 决定：它匹配任何已经存在的笔记约定，如果没有，它就挑一个合理的地方并告诉你位置。每次运行写一份文件。

## 常见问题

**它衍生出了第二个 research agent：这是该发生的吗？**

不是。这是一个 open bug，[issue #530](https://github.com/mattpocock/skills/issues/530)。这个 skill 告诉它的调用者去启动一个 background agent，但不去限制 agent 类型，所以它衍生出的 agent 是一个持有 `Agent` 工具和相同指令的 `general-purpose` agent，于是又开火了一次。一位报告者测算，单个 research 任务在三次重叠运行中消耗了大约 450k [tokens](https://www.aihero.dev/ai-coding-dictionary/token)，而复制的那个在整整半小时后、完全无人可见地完成。它在 Claude Code 之外也能复现；同样的嵌套在 Codex 里用 GPT-5.6-sol 得到了确认。没有随附的修复。用户们给自己安装的副本打上了补丁，加了一行命令，告诉一个已经是 [subagent](https://www.aihero.dev/ai-coding-dictionary/subagent) 的 agent 自己做这份工作，这有帮助，但属于指令层面，而非结构层面。调用后留意你的 background task 列表，并停掉那个复制的任务。

相反的失败也存在：如果你自己的全局指令禁止 agent 重新委派工作，background agent 会礼貌地拒绝这个任务，而 skill 则静默地什么都不做。

**文件应该住在哪里？而我又该提交它吗？**

skill 把文件放在 repo 已经存放笔记的地方，除此之外没有更多意见。社区的意见相当一致：ADR 被保留，research 文件不被保留。它最锐利的版本，来自一个恰好讨论这个问题的 Discord thread："ADRs 保留。其余的在完成后归档或删除。否则它就会变成工作的 cruft，而且如果你已经偏离了 spec/research，它还可能毒害未来的 repo 阅读。"一份 research 文件记录的是它写就那天为真的东西，所以一份过期的比没有更糟。总体而言，这些 artifact 并不真正属于 git，它们也没有一个规范的家：人们改用 Obsidian、一个独立的知识 repo，或者 issue tracker。

**什么才算"high-trust"的 primary source，又由谁来定？**

由 [model](https://www.aihero.dev/ai-coding-dictionary/model) 来定。skill 点出够格的 source *种类*（official docs、source code、specs、first-party APIs），没有 allowlist、没有领域门禁、也没有验证过程。这是 skill 最初被提出时最响亮的反对，而且从未被公开回答："把五个 research subagents 指向垃圾，只会更快地给你五个自信的错误答案。你是怎么把关什么算 high-trust sources 的？"你实际拥有的缓解措施是每条说法上的引用。跟两三条追下去。如果它们落在某个东西的总结上，而不是那个东西本身，那这次运行就在它唯一的职责上失败了。

**后来的 session 会复用之前某次运行的发现吗？**

不会。没有任何东西会自动加载一份过去的 research 文件；它是一份坐在 repo 里的文档，直到某个人类或某个 skill 指向它。这一点在早期就被提出，是对该设计最强的挑战（"价值在于这份 markdown 成为 agent 之后会重新阅读的 context，而不是抓取本身。一份写过就死的文件只是一种花哨的搜索"），而随附的 skill 并没有解决它。在实践中，这份文件通过被刻意喂进下一步来挣得自己的存在：把它附到一份 spec 上、引用进一场 grilling session、用一个 [ticket](https://www.aihero.dev/ai-coding-dictionary/ticket) 指向它。

**为什么不干脆让 agent 去读文档？**

你可以，而一句恰好这么说的两行 prompt，正是这个 skill 所取代的做法。skill 相对 prompt 多买到两样东西：它在后台运行，所以你的 session 能保持 [context](https://www.aihero.dev/ai-coding-dictionary/context) 干净；以及 primary-source 约束和带引用的文件输出每次都一以贯之地产出，而不是取决于你碰巧怎么措辞。相比 [harness](https://www.aihero.dev/ai-coding-dictionary/harness) 自己的 deep-research 模式，区别在于 artifact 和 source 纪律，而不在于搜索。如果一句两行 prompt 就能让你在小问题上得到所需，那就用那句两行 prompt。

**它什么时候停止阅读？**

skill 里没有停止准则，而这表现为两个看似相反、实为同一个缺口的抱怨：走得太深的 agents，以及广泛覆盖主题却漏掉那个真正要紧的具体细节的 agents。一位实践者这么说："deep-research skills 有时候有点太深了。而让 agent 去 research 通常会导致漏掉关键细节。"收窄范围是你的事。一个狭窄、可回答的问题（一个 API、一个行为、一个版本说法）带回来的结果远比"research X"好。

**`/wayfinder` 创建了 research tickets：我要自己解决它们吗？**

不用，它现在会替你把它们发射出去。在 v1.1 以来未发布的变更中，一次绘图 session 会为每个 research ticket 衍生一个 `/research` subagent 并并行把它们烧完，把发现捕获在一条 throwaway `research/<name>` branch 上，并带上来自 ticket 的 [context pointer](https://www.aihero.dev/ai-coding-dictionary/context-pointer)。Research tickets 是 wayfinder 的 one-ticket-per-session 规则的唯一例外，因为它们是 [AFK](https://www.aihero.dev/ai-coding-dictionary/afk) 的：没有东西在等你。那些 branch 有两个已知的绊脚石：有人看到 subagent 从一条从不打算合并的 branch 上开了一个 draft PR（[issue #576](https://github.com/mattpocock/skills/issues/576)），以及之后删除 branch 会破坏 tickets 持有的 context pointers。

## 它正常工作的标志

- 你自己的 session 继续推进。如果你坐在那里看着它阅读，说明委派没有发生。
- 恰好出现一个新的 background task。第二个名字几乎相同的，就是嵌套 bug。
- 一份新的 Markdown 文件出现，位于 repo 已经用作笔记的文件夹里，而 agent 告诉你路径。
- 其中每条说法都带着链接，随机跟两条能落在官方 doc、spec 或实际源文件上，而不是落在某人对它的转述上。
- 你能仅凭这份文件做出那个你卡住的决策，而无需自己回到 sources。

## 它在整体中的位置

一个可随时取用的 standalone，为思考类 skills 供料，而不是坐在 build chain 里。它的文件是某种要*带进* flow 的东西：当事实已经摆在桌面上时，[grilling](https://aihero.dev/skills-grilling) 和 [grill-with-docs](https://aihero.dev/skills-grill-with-docs) 会问出更锐利的问题，而 [to-spec](https://aihero.dev/skills-to-spec) 可以对着它做综合。[wayfinder](https://aihero.dev/skills-wayfinder) 是唯一直接调用它的 skill，用 `/research` subagent 解决其地图上的每个 research ticket。完整地图见 [ask-matt](https://aihero.dev/skills-ask-matt)。