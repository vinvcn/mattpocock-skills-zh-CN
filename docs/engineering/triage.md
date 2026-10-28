## 它做什么

`triage` 逐个处理你项目 tracker 上的 issues。它把每一个都推进一个小型 **triage roles** state machine（一个 category role 和一个 state role）。每个 issue 的终点是：一份 agent-ready brief、一个给 reporter 的具体问题、或一个带记录原因的已关闭 issue。

它只用于**不是你创建的** issues。也就是说：原始的 bug reports、进来的 feature requests、或一个未经通告就到达的外部 pull request，即从外部以 reporter 留下的任何形状进入 tracker 的工作。[to-tickets](https://aihero.dev/skills-to-tickets) 产出的 [tickets](https://www.aihero.dev/ai-coding-dictionary/ticket) 已经是 agent-ready 的，在它们上面运行 `triage` 就是浪费这些工作。规则很简单：`/triage` 只用于进来的 issues，不用于你自己创建的 issues。

它与手工打 label 的另一个不同在于：它先推荐、后等待。它带着推理把它对 category 和 state 的判断给你，外加它在 codebase 里发现了什么，在你告诉它之前不应用任何东西。

## 何时使用

你通过输入 `/triage` 然后用自然语言描述你想要什么来调用它，[agent](https://www.aihero.dev/ai-coding-dictionary/agent) 不会自行触发。例如："Show me anything that needs my attention"、"let's look at #42"、"move #42 to ready-for-agent"。

| 你有什么 | 去哪里 |
| --- | --- |
| 一个满是别人原始 reports 的 tracker | `/triage` |
| 你自己一个粗略的想法，什么都没写下来 | [grill-with-docs](https://aihero.dev/skills-grill-with-docs) |
| 一次要变成 [spec](https://www.aihero.dev/ai-coding-dictionary/spec) 的已定稿 conversation | [to-spec](https://aihero.dev/skills-to-spec) |
| 一份要拆成 agent-ready tickets 的 spec | [to-tickets](https://aihero.dev/skills-to-tickets) |
| 一个已确认、需要 root cause 而非 label 的 bug | [diagnosing-bugs](https://aihero.dev/skills-diagnosing-bugs) |

## 前置条件

`triage` 会读写你的 issue tracker，所以 [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) 必须先配置好那个 tracker 和它的 label vocabulary。下面这些 role 名称是 **canonical** 的。你 tracker 里的 label 字符串可能不同，那份映射由 setup 提供。如果你的 tracker 已经精确使用 canonical 名称，你就没有什么可映射、也没什么可配置。

Tracker config 还决定外部 pull requests 是否算作一个 request surface，以及谁算作 external。那个 flag 默认关闭，setup 不再询问它。要让 PRs 进入范围，在 `docs/agents/issue-tracker.md` 里打开它。

## 状态机

每个被 triage 的条目最终都恰好有一个 category role 和一个 state role。有两个 categories：`bug`（有东西坏了）和 `enhancement`（新 feature 或改进）。有五个 states：

| State | 意思 |
| --- | --- |
| `needs-triage` | 你需要评估它。未被 label 的 issue 通常最先落在这里。 |
| `needs-info` | 等待 reporter。他们回复时回到 `needs-triage`。 |
| `ready-for-agent` | 完全指定，附有 agent brief。一个 [AFK](https://www.aihero.dev/ai-coding-dictionary/afk) agent 可以领取它。 |
| `ready-for-human` | 同一份 brief，外加为什么 agent 做不了它（判断、外部访问、手工测试）。 |
| `wontfix` | 已关闭，记录了原因。 |

那就是全部词汇。每个条目恰好一个 state role 的规则让 queries 保持简单。States 也是这个 [skill](https://www.aihero.dev/ai-coding-dictionary/skill) 最常被要求的地方。用户要求过：一个用于已指定但被另一个 issue block 的工作的 state、一个用于等待未来 trigger 的 `deferred` state、以及一个终态的 `implemented` state。这些都没有发布。见下面的问题。

`wontfix` 有三种情形。区别很重要，因为只有其中一种写入知识库：

| 你关闭它的原因 | 发生什么 |
| --- | --- |
| 已经实现 | 一条指向该 feature 已存在位置的 comment。没有任何东西进入 `.out-of-scope/`；它是一个已构建的 feature，而不是被拒绝的，在那里放一个文件会破坏 dedup checks。 |
| 拒绝的 bug | 礼貌的解释，然后关闭。 |
| 拒绝的 enhancement | `.out-of-scope/` 中的一个文件，从关闭 comment 链接，然后关闭。 |

`.out-of-scope/` 为每个被拒绝的**概念**保存一个 markdown 文件，而不是每个 issue 一个。每个文件是一份简短的设计文档，而不是一个 database row。它写明拒绝了什么、为什么，并列出每一个要求过它的 issue。`triage` 在评估任何东西之前读取整个目录。它按概念而非 keyword 匹配，所以 "night theme" 匹配 `dark-mode.md`。当它找到一个匹配时，它把旧决定拿给你看，问你如今是否仍然同意，而不是从头重新争论这个请求。

## 先验证，再写 brief

在任何 [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling) 之前，`triage` 检查主张是否成立。对 bug，它从 reporter 的步骤复现它。对 PR，它 checkout 那个 branch 并运行相关 tests。然后它报告三种结果之一：

- 已确认，带代码路径。
- 复现失败。
- 细节不足以尝试。这本身就是最强的 `needs-info` 信号。

在同一遍里，它对 codebase 再运行两项检查。**redundancy** 检查问这个 feature 是否已经实现，并按 domain concept 而非 reporter 的措辞搜索。**prior rejection** 检查问 `.out-of-scope/` 是否已经说 no。两项检查都便宜，命中任何一个都会产生一个 `wontfix`。

这一切工作都是为了做好一个 artifact：**agent brief**。它就是 `triage` 在 issue 移动到 `ready-for-agent` 时发布的那个结构化 comment。`triage` 发布它之后，brief 就是 contract，原始 report 只是 context。Briefs 是 **durable** 而非 precise 的，因为一个 issue 可能坐在 `ready-for-agent` 里几周，而代码一直在变。所以 brief 命名类型、signatures 和 behavioral contracts，从不是文件路径或行号。一次已确认的复现会比猜测构成一份强得多的 brief。

## PR 是附带代码的 issue

如果 tracker 把外部 pull requests 当作一个 request surface，它们会经过同一台机器：相同的 categories、states 和 transitions。States 作用于 diff。`ready-for-agent` 意味着已附上一份 brief、agent 应该对代码采取下一步。`ready-for-human` 意味着可以让人来合并它。一份 PR 上的 brief 描述的是对现有 diff 还剩下什么要做，而不是如何从无到有构建那个东西。

Discovery 只显示*外部* PRs，因为协作者进行中的 branch 不是 triage 工作。那个过滤器只作用于 discovery。如果你显式点名一个 PR，`triage` 会处理它，无论它是谁写的。

## 常见问题

**我运行了 `/to-spec` 和 `/to-tickets`，现在那些 tickets 坐在那里未 triage。我要在它们上面运行 `/triage` 吗？**
不。它们已经是 agent-ready 的。`to-tickets` 在发布它们时应用 `ready-for-agent` label，让一个 AFK runner 无需再走一遍就领起它们。撞上这个的用户运行了 spec flow，在输出上看到 `needs-triage`，而他们的 AFK runner 忽略了一切。`triage` 是外部到达工作的 on-ramp。Spec flow 是你自己发起工作的车道。两者在 `ready-for-agent` 相遇，而不是之前。

**现在有了 `to-spec` → `to-tickets` → `implement` flow，`triage` 还相关吗？**
只有在你有人境工作的时候。`triage` 比那条 flow 更早出现，做的是不同的工作：它处理别人提交的 reports。如果你的 tracker 里一切来自你自己的规划，你很少会用到它。如果你维护任何公开的东西，或你的团队向你提报 bugs，这些工作就从它开始。主要用途是接收来自外部贡献者 issues 的开源 repos。

**agent 试图应用 `ready-for-agent`，而 `gh` 说这个 label 不存在。**
这是一个已知的开放 bug（[#616](https://github.com/mattpocock/skills/issues/616)）。`setup-matt-pocock-skills` 把 label vocabulary 写进 `docs/agents/triage-labels.md`，但不会在你的 tracker 里创建 labels。自己创建那五个 state labels 和两个 category labels，一次，用 `gh label create` 或 tracker 的 UI，这个错误就停了。Issue 链接到一个尚未合并的社区修复分支。

**五个 states 不够。blocked 或 deferred 或 implemented 呢？**
这是这个 skill 上被提报最多的缺口。它有三种形式：

- 一个已完全指定但等另一个 issue 关闭的 issue（[#139](https://github.com/mattpocock/skills/issues/139)）。Reporter 说 `ready-for-agent` 在那里 "technically true" 但有误导性，所以一个 agent 领起它然后卡住。
- 打算做但等待一个 trigger 的未来工作，所以还不能行动（[#297](https://github.com/mattpocock/skills/issues/297)）。
- 一个用于 "implemented, awaiting verification" 的终态。没有它，一个 AFK runner 会把已完成的 tickets 再次排队。

Blocked 情形被承认为真实，但名字未定（`blocked` 对 `paused`）。它们都没发布。作为 workaround，人们在 category 旁边加一个 repo-local 的额外 label。State 槽于是持有一个准确的值，但 skill 不知道那个额外 label。一个社区 fork 走得更远，加了 `needs-slicing`、`tracking` 和 effort labels。那可行，但它属于那个 fork，不属于 skill。

**这与 `/diagnosing-bugs` 有什么不同？**
这里的 verification 步骤刻意很浅。它回答 "这是真的吗，它大概住在哪里"，不去找 root cause。如果一个 bug 不能在几分钟内从 reporter 的步骤复现，就用 `needs-info`，或者如果你想现在就追查它，用 [diagnosing-bugs](https://aihero.dev/skills-diagnosing-bugs)。目前两个 skill 的文本都没有提到对方。一个用户报告过那个缺口，它仍是开放的。

**我能把它指向我整个 backlog 让它跑吗？**
你可以要求，但注意它读什么。"Show what needs attention" 那一遍是一个供*选择*的廉价 listing。你挑一个 issue，然后 `triage` 在那个 issue 上收集完整 [context](https://www.aihero.dev/ai-coding-dictionary/context)。如果一次跨二十个 issue 运行它，agent 会悄悄把那个廉价 listing 当作它唯一的证据基础。那个 listing 返回 issue bodies 但不返回 comments。一个用户正是撞上这个：三个 issues 已经带着一条说 "already fixed, recommend closing" 的 comment，而三个都反而得到了全新的 agent briefs。如果你想要一个批量遍，明确说必须读取每个 issue 的 comments。

**它能配合 Linear，或 GitHub Issues 以外的任何东西吗？**
能。Tracker 是 config，不是一个硬编码假设。人们通过 `linear` CLI 对 Linear、对 GitLab、以及对 `.scratch/` 下的纯 markdown 文件运行它。一个常见的拆分是 Linear 用于 issues 和 planning，GitHub 用于 code 和 PRs。这时说 "issue tracker" 的 skills 映射到 Linear，说 "PR" 的 skills 映射到 GitHub。Local-markdown tracker 有一个开放的 template bug：生成的文件可能把 acceptance criteria 带两次，一次在顶层，一次在 agent brief 里（[#200](https://github.com/mattpocock/skills/issues/200)）。

## 它正常工作的标志

- 它接触的每个条目最终都恰好有一个 category role 和一个 state role，绝不为零，也绝没有两个互相冲突的 states。
- 它给你一份带推理的推荐然后停下。它不会重新打 label 然后继续。
- 在任何东西到达 `ready-for-agent` 之前，它复现了 bug，或 checkout 并运行了 PR。
- 它写的 briefs 命名类型和 behaviors，不含文件路径和行号。
- 当一个你六个月前拒绝的请求回来时，它会告诉你并引用旧原因，而不是重新 triage 它。
- 它发布的每条 comment 都以 `> *This was generated by AI during triage.*` 开头。

## 它在整体中的位置

`triage` 是一个 **on-ramp**，不是 main chain 中的一个步骤。Main flow 从你自己有的一个想法开始（grill、spec、tickets、implement、review），而 `triage` 是留给来自别人的工作的并行车道。两条车道终点相同：一个带 brief、标 `ready-for-agent` 的 issue。[implement](https://aihero.dev/skills-implement) 领起它的方式，和领起 [to-tickets](https://aihero.dev/skills-to-tickets) 的一个 ticket 一样。当一个请求在 `triage` 能为它写 brief 之前需要更多细节时，`triage` 一起运行 [grilling](https://aihero.dev/skills-grilling) 和 [domain-modeling](https://aihero.dev/skills-domain-modeling)，一次一轮问题，所以在你做出决定时把它们记录进 `GLOSSARY.md` 和 ADRs。当你不确定自己在哪条车道时，[ask-matt](https://aihero.dev/skills-ask-matt) 会为你路由。