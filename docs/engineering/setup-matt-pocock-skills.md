## 它做什么

`setup-matt-pocock-skills` 就一个 repo 回答三个问题（issues 放在哪里、triage labels 叫什么名字、以及 domain docs 放在哪里），并把答案记录为 `docs/agents/` 下的 markdown 文件。

这些文件是 repo 之间唯一会变化的东西。Skills 本身在任何地方都相同。它们在运行时读取 `docs/agents/issue-tracker.md`，并按它说的去做。这就是为什么这套工具不绑定 GitHub，也为什么你永远不需要编辑任何 skill 文件来指向另一个 tracker。用 "link the skills to a custom issue tracker" 来调用它，可以用任何你能以编程方式连接的东西，对 skills 不做任何改动。

它是一个 prompt 驱动的 skill，而不是一个确定性的脚本。它读取你的 `git remote`、`CLAUDE.md` 和 `GLOSSARY.md`，提出它发现的内容，并在写入任何东西之前等你确认。

## 何时使用

你通过输入 `/setup-matt-pocock-skills` 调用它，[agent](https://www.aihero.dev/ai-coding-dictionary/agent) 不会自行触发。它的 metadata 有意把它标记为不可调用，所以没有其他 skill 能替你触发它。

**每个 repo 使用一次，在首次使用任何其他 engineering skill 之前**。如果 [triage](https://aihero.dev/skills-triage)、[to-spec](https://aihero.dev/skills-to-spec)、[to-tickets](https://aihero.dev/skills-to-tickets) 或 [wayfinder](https://aihero.dev/skills-wayfinder) 开始猜测你的 issues 放在哪里，或套用你的 tracker 并不存在的 labels，说明这个 repo 还没有在这里完成配置。你可以在一个进行到项目一半的 repo 里运行它。这个 skill 会读取已经存在的内容，所以之前的工作不会丢失。

## 前置条件

它写入你运行它的那个 repo：

| 它写入 | 位置 |
| --- | --- |
| `issue-tracker.md` | `docs/agents/` |
| `domain.md` | `docs/agents/` |
| `triage-labels.md` | `docs/agents/`，仅在安装了 `triage` skill 时 |
| 一个 `## Agent skills` 块 | 已存在的 `CLAUDE.md` 或 `AGENTS.md` 二者之一 |

你要把全部内容作为 markdown 提交。没有 user-level 或 global 模式。config 就在 repo 里，所以每个 repo 都有自己的副本。

## 三个决策

它每个小节都以推荐答案开头，并跳过其探索已经回答过的任何问题。大多数运行只需要两次确认。

| Decision | 它提议什么 | 它什么时候询问 |
| --- | --- | --- |
| **Issue tracker** | 与你的 `git remote` 匹配的那个 | 总是，因为这是唯一一个真正的选择 |
| **Triage labels** | 保留五个 canonical 名称（`needs-triage`、`needs-info`、`ready-for-agent`、`ready-for-human`、`wontfix`） | 仅在安装了 `triage` skill 时 |
| **Domain docs** | single-context：根目录一个 `GLOSSARY.md` 加 `docs/adr/` | 仅当它发现 monorepo 信号时，然后它提供 multi-context 的 `GLOSSARY-MAP.md` |

tracker 选项：

| 选项 | issues 放在哪里 | 需要 |
| --- | --- | --- |
| **GitHub** | 该 repo 的 GitHub Issues | `gh` CLI |
| **GitLab** | 该 repo 的 GitLab Issues | `glab` CLI |
| **Local markdown** | 本 repo 中 `.scratch/<feature>/` 下的文件 | 什么都不需要，连 remote 都不需要 |
| **Other** | 随你指定的地方 | 你写一段话描述 workflow |

前三个作为 skill 中的模板随附，开箱即用。Local markdown 是一个完整选项，而不是 fallback。这个 skill 支持没有 remote 的个人项目。有一个 caveat：如果你在用 GitHub，就不要用 local markdown。它们是替代方案，选其一即可。

"Other" 同样是一个完整选项。它就是 Jira、Linear、Azure DevOps、Beads 都能工作的方式：你描述 workflow，skill 把你的段落记录进 `docs/agents/issue-tracker.md`，下游 skills 遵循那段文字。用户已经这样构建过：一个 Jira-over-[MCP](https://www.aihero.dev/ai-coding-dictionary/mcp) 变体、一个形状像 `gh` 的 Gitea CLI、一个手工构建的本地 dashboard。

## 常见问题

**我非得用 GitHub 吗？**

不必。GitHub、GitLab 和 `.scratch/` 下的 local markdown 都以现成模板随附，任何其他东西都可以通过 "other" 路径工作。这是出现频率最高的问题，大致是这些措辞：*"hard locked to github"*、*"can I use GitLab / Jira"*、*"what about Azure DevOps"*。每次的回答都一样：是 setup 选择 tracker，而不是 skill。

**更新 skills 之后我需要重新运行它吗？**

v1.1 之后被直接问到时，回答是要。这个 skill 自己的收尾消息更温和。它告诉你，只有切换 tracker 或从头来过时才需要重新运行。两种说法都说得通。Seed templates 会随版本变化，所以一个来自旧版本的 `docs/agents/issue-tracker.md`，对着现在正在读取它的 skills 会过时。如果某个下游 skill 做的事与 docs 描述的不同，就重新运行 setup，成本很低。

**它写进了 `CLAUDE.md`，但我用的是 Codex。**

这是一个已知缺口，仍未解决。文件选择规则是 "如果存在 `CLAUDE.md` 就编辑它，否则编辑 `AGENTS.md`"。它检查的是哪个文件存在，而不是哪个 [harness](https://www.aihero.dev/ai-coding-dictionary/harness) 在运行。在一个遗留自 Claude Code 的、带有 `CLAUDE.md` 的 repo 里，这个 skill 会把它 `## Agent skills` 块写进一个 Codex 从不读取的文件。用户有两个 workaround：手工把块移到 `AGENTS.md`，或者让 `AGENTS.md` 成为 canonical，并让 `CLAUDE.md` 成为指向它的单行 pointer。如果两个文件都不存在，这个 skill 会询问你要创建哪一个，而不是直接挑一个。这让那些期望它直接决定的人感到困惑。

**它没有创建我的 triage labels。**

它本来就不创建。`docs/agents/triage-labels.md` 是一个 **mapping**：它告诉 `/triage` 你的 tracker 中哪些字符串对应这五个 canonical roles。它不运行 `gh label create`。在一个全新的 GitHub repo 上，labels 还不存在，而用户已经把这件事作为一个 bug 提报过不止一次。两个后果：

- 如果你的 tracker 已经在使用 canonical 名称，mapping 就是一个恒等表，没有什么需要配置。这是预期的常见情形，而不是一个缺失的步骤。
- 这个 skill 同样不创建 [wayfinder](https://aihero.dev/skills-wayfinder) 的 `wayfinder:map` 和 `wayfinder:<type>` labels，而 `gh issue create --label <missing>` 会直接失败，而不是创建 label。在 GitHub repo 上首次运行 wayfinder 之前，手工创建它们。

**我能在这里配置其他 skills 的行为吗（[grilling](https://www.aihero.dev/ai-coding-dictionary/grilling) 节奏、问题格式、语气）？**

不能。它配置三件事：tracker、labels、doc 布局。有用户要求把它变成存放 per-user preferences 的地方。回答是：skills 保持 opinionated，不接受任何 per-user config。Preferences 属于你的 `CLAUDE.md`，作为普通指令，每个 skill 都已经会读取它。

**我能把 config 放在 `~/.claude` 而不是提交到每个 repo 吗？**

今天不行。有一个跨多个 repo 运行这些 skills 的用户为此提交了开放请求，但不存在 user-level 模式。每个 repo 各自携带自己的 `docs/agents/`。

**一个配置其他 skills 的 skill，不是很奇怪吗？**

一个长期存在的抱怨说奇怪，措辞大致是：*"having a skill to set up the other skill does not feel right to me: that means the LLM is configuring its own skills."* 这个权衡是真实存在的。没有 setup 步骤，每个触碰 issues 的 skill 都得各自携带一份 tracker 指令的副本。输出是你可以阅读、可以编辑的 markdown，这限制了风险。你可以读取它写下的每个文件并手工改动。日常的改动就照这样做，而不是再运行一次。

## 它正常工作的标志

- `docs/agents/issue-tracker.md` 和 `docs/agents/domain.md` 存在，如果安装了 `triage` 还有 `triage-labels.md`。
- 你的 harness 读取的那个指令文件中出现了一个 `## Agent skills` 小节，其中每个文件都有一条指向它的单行摘要。
- 它提议的 tracker 与你使用的 remote 匹配，label 字符串与你的 tracker 中存在的 labels 匹配。
- 之后，`/to-tickets` 发布时不再询问 issues 放在哪里，`/triage` 套用 labels 而不是发明它们。
- skill 文件本身没有任何变化。如果 setup 编辑了一个 `SKILL.md`，那一定出错了。

## 它在整体中的位置

`setup-matt-pocock-skills` 是 engineering flow 的 **run-once setup**，是其他一切默认的前提，而不是 chain 中的一个步骤。它的邻居是它的读者：[triage](https://aihero.dev/skills-triage)，它套用在里写下的 label vocabulary；[to-spec](https://aihero.dev/skills-to-spec) 和 [to-tickets](https://aihero.dev/skills-to-tickets)，它们发布到在这里命名的 tracker；以及 [wayfinder](https://aihero.dev/skills-wayfinder)，它读取同一个 tracker 文件的「Wayfinding 操作」小节，以了解如何存储 maps 和子 [tickets](https://www.aihero.dev/ai-coding-dictionary/ticket)。[domain-modeling](https://aihero.dev/skills-domain-modeling) 之后会填满 setup 记录的 domain-doc 布局。它只在 term 或 decision 实际得到解决时才创建 `GLOSSARY.md` 和 ADRs，所以 setup 之后一个没有 domain docs 的 repo 是正常的。至于下一步该用哪个 skill，[ask-matt](https://aihero.dev/skills-ask-matt) 为整套工具路由。