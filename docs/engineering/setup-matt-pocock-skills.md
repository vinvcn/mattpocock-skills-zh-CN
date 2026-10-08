## 它做什么

`setup-matt-pocock-skills` 就一个 repo 回答三个问题（issues 放在哪里、triage labels 叫什么名字、以及 domain docs 放在哪里），并把答案记录为 `docs/agents/` 下的 markdown 文件。

这些文件是 repo 之间唯一会变化的东西。Skills 本身在任何地方都相同；它们在运行时读取 `docs/agents/issue-tracker.md`，并按它说的去做。这就是为什么这套工具不绑定 GitHub，也为什么任何 skill 文件永远都不需要编辑来指向别处。用 "link the skills to a custom issue tracker" 来调用它，可以用任何你能以编程方式连接的东西，对 skills 零改动。

它是一个 prompt 驱动的 skill，而不是一个确定性的脚本。它读取你的 `git remote`、你已有的 `CLAUDE.md`、你已有的 `GLOSSARY.md`，提出它发现的内容，并在写入任何东西之前等你确认。

## 何时使用

你通过输入 `/setup-matt-pocock-skills` 调用它，[agent](https://www.aihero.dev/ai-coding-dictionary/agent) 不会自行触发。它被刻意标记为不可调用，所以没有其他 skill 能替你触发它。

**每个 repo 使用一次，在首次使用任何其他 engineering skill 之前**。如果 [triage](https://aihero.dev/skills-triage)、[to-spec](https://aihero.dev/skills-to-spec)、[to-tickets](https://aihero.dev/skills-to-tickets) 或 [wayfinder](https://aihero.dev/skills-wayfinder) 开始猜测你的 issues 放在哪里，或套用你的 tracker 并不存在的 labels，说明它们还没在这里完成配置。一个已经进行到项目一半的 repo 也是运行它的好地方；这个 skill 会读取已经存在的内容，之前的工作不会浪费。

## 前置条件

它写入你运行它的那个 repo：

| 它写入 | 位置 |
| --- | --- |
| `issue-tracker.md` | `docs/agents/` |
| `domain.md` | `docs/agents/` |
| `triage-labels.md` | `docs/agents/`，仅在安装了 `triage` skill 时 |
| 一个 `## Agent skills` 块 | 已存在的 `CLAUDE.md` / `AGENTS.md` 中二者之一 |

全部都是已提交的 markdown。没有 user-level 或 global 模式：config 就在 repo 里，所以每个 repo 都有自己的副本。

## 三个决策

它用每个小节都先给出推荐答案的方式开头，并跳过任何已经解决的探索。大多数运行就是两次确认然后收工。

| Decision | 它提议什么 | 它什么时候真正询问 |
| --- | --- | --- |
| **Issue tracker** | 与你的 `git remote` 匹配的那个 | 总是，这是唯一一个真正的选择 |
| **Triage labels** | 保留五个 canonical 名称（`needs-triage`、`needs-info`、`ready-for-agent`、`ready-for-human`、`wontfix`） | 仅在安装了 `triage` skill 时 |
| **Domain docs** | single-context：根目录一个 `GLOSSARY.md` 加 `docs/adr/` | 仅当它发现 monorepo 信号时，然后它提供 multi-context 的 `GLOSSARY-MAP.md` |

tracker 选项：

| 选项 | issues 放在哪里 | 需要 |
| --- | --- | --- |
| **GitHub** | 该 repo 的 GitHub Issues | `gh` CLI |
| **GitLab** | 该 repo 的 GitLab Issues | `glab` CLI |
| **Local markdown** | 本 repo 中 `.scratch/<feature>/` 下的文件 | 什么都不需要，完全没有 remote |
| **Other** | 随你指定的地方 | 你写一段话描述 workflow |

前三个作为 skill 中的模板随附，开箱即用。Local markdown 是一等公民选项，而不是 fallback：没有 remote 的个人项目也完全受支持。有一个 caveat 值得重复：如果你在用 GitHub，就不要用 local markdown。它们是替代方案，不是分层。

"Other" 也不是一个 stub。它就是 Jira、Linear、Azure DevOps、Beads 都能工作的原因：你描述 workflow，skill 把你的段落记录进 `docs/agents/issue-tracker.md`，下游 skills 遵循那段文字。社区已经这么做过：一个 Jira-over-[MCP](https://www.aihero.dev/ai-coding-dictionary/mcp) 变体、一个形状像 `gh` 的 Gitea CLI、一个手工构建的本地 dashboard。

## 常见问题

**我非得用 GitHub 吗？**

不必。GitHub、GitLab 和 `.scratch/` 下的 local markdown 都以现成模板随附，任何其他东西都可以通过 "other" 路径工作。这是记录中出现频率最高的问题，大致是这些措辞：*"hard locked to github"*、*"can I use GitLab / Jira"*、*"what about Azure DevOps"*。每次的回答都是：tracker 是一个 setup 答案，而不是 skill 属性。

**更新 skills 之后我需要重新运行它吗？**

在 v1.1 之后被直接问到，Matt 回答要。这个 skill 自己的收尾消息更温和：它告诉你只有在切换 tracker 或从头来过时才需要重新运行。两种说法都说得通，而这个差距的原因是真的：seed templates 会随版本变化，所以一个由旧版本写出的 `docs/agents/issue-tracker.md`，对着现在正在读取它的 skills 会过时。如果某个下游 skill 开始以 docs 描述不同的方式行事，重新运行就是廉价的修复。

**它写进了 `CLAUDE.md`，但我用的是 Codex。**

已知缺口，仍未解决。文件选择规则是 "如果存在 `CLAUDE.md` 就编辑它，否则编辑 `AGENTS.md`"：它检查的是哪个文件存在，而不是哪个 [harness](https://www.aihero.dev/ai-coding-dictionary/harness) 在运行。一个遗留自 Claude Code 的、带有 `CLAUDE.md` 的 repo，会把它 `## Agent skills` 块写到 Codex 从不读取的地方。有两个 workaround 在流传：手工把块移到 `AGENTS.md`，或者让 `AGENTS.md` 成为 canonical，并让 `CLAUDE.md` 成为指向它的单行 pointer。如果两个文件都不存在，这个 skill 会询问你要创建哪一个，而不是替你做决定，这让那些期望它直接决定的人感到困惑。

**它没有创建我的 triage labels。**

它本来就不创建。`docs/agents/triage-labels.md` 是一个 **mapping**：它告诉 `/triage` 你的 tracker 中哪些字符串对应这五个 canonical roles。它不运行 `gh label create`。在一个全新的 GitHub repo 上，labels 确实还不存在，而这件事已经被作为一个 bug 提报过不止一次。两个后续：

- 如果你的 tracker 已经在使用 canonical 名称，mapping 就是一个恒等表，没有什么需要配置。这是预期的常见情形，而不是一个缺失的步骤。
- [wayfinder](https://aihero.dev/skills-wayfinder) 的 `wayfinder:map` 和 `wayfinder:<type>` labels 也不在这里创建，而 `gh issue create --label <missing>` 会直接失败，而不是创建 label。在 GitHub repo 上首次运行 wayfinder 之前，手工创建它们。

**我能在这里配置其他 skills 的行为吗（[grilling](https://www.aihero.dev/ai-coding-dictionary/grilling) 节奏、问题格式、语气）？**

不能。它配置三件事：tracker、labels、doc 布局。有人直接要求让它成为 per-user preferences 的归属地，而长期以来的回答是：skills 保持 opinionated：*"Config is death."* Preferences 属于你的 `CLAUDE.md`，作为普通指令，每个 skill 都已经会读取它。

**我能把 config 放在 `~/.claude` 而不是提交到每个 repo 吗？**

今天不行。有一个来自跨多个 repo 运行这些 skills 的人的开放请求，也不存在 user-level 模式。每个 repo 各自携带自己的 `docs/agents/`。

**一个配置其他 skills 的 skill，不是很奇怪吗？**

一个长期存在的抱怨说奇怪，措辞大致是：*"having a skill to set up the other skill does not feel right to me: that means the LLM is configuring its own skills."* 这个权衡是真实且被承认的：setup 步骤的替代方案，是把 tracker 指令复制进每一个触碰 issues 的 skill。输出是可检查、可编辑的 markdown，这正是缓解手段：你可以读取它写下的每个文件并手工改动，而日常的微调正是那样，而不是再一次运行。

## 它正常工作的标志

- `docs/agents/issue-tracker.md` 和 `docs/agents/domain.md` 存在，如果安装了 `triage` 还有 `triage-labels.md`。
- 你的 harness 真正读取的那个指令文件中出现了一个 `## Agent skills` 小节，每一行以一个单行摘要指向这些文件中的每一个。
- 它提议的 tracker 与你真正使用的 remote 匹配，label 字符串与你的 tracker 中真实存在的 labels 匹配。
- 之后，`/to-tickets` 发布时不再询问 issues 放在哪里，`/triage` 套用 labels 而不是发明它们。
- skill 文件本身没有任何变化。如果 setup 编辑了一个 `SKILL.md`，那一定出错了。

## 它在整体中的位置

`setup-matt-pocock-skills` 是 engineering flow 的 **run-once setup**，是其他一切默认的前提，而不是 chain 中的一个步骤。它的邻居是它的读者：[triage](https://aihero.dev/skills-triage)，它套用在里写下的 label vocabulary；[to-spec](https://aihero.dev/skills-to-spec) 和 [to-tickets](https://aihero.dev/skills-to-tickets)，它们发布到在这里命名的 tracker；以及 [wayfinder](https://aihero.dev/skills-wayfinder)，它读取同一个 tracker 文件的「Wayfinding 操作」小节，以知道 maps 和子 [tickets](https://www.aihero.dev/ai-coding-dictionary/ticket) 是如何存储的。它记录的 domain-doc 布局，正是 [domain-modeling](https://aihero.dev/skills-domain-modeling) 之后要填满的：它非惰性地创建 `GLOSSARY.md` 和 ADRs，当一个 term 或 decision 真正被解决时，所以 setup 之后一个空 repo 是预期的状态。至于下一步该用哪个 skill，[ask-matt](https://aihero.dev/skills-ask-matt) 为整套工具路由。