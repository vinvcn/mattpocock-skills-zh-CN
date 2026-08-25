---
name: setup-matt-pocock-skills
description: "为此仓库配置 engineering skills——设置其 issue tracker、triage labels 词汇与 domain docs 布局。在首次使用其他 engineering skills 前运行一次。"
disable-model-invocation: true
---

# Setup Matt Pocock's Skills

搭建 engineering skills 所假定的每仓库配置：

- **Issue tracker** - issues 存放在哪里（默认 GitHub；也原生支持 local markdown）
- **Triage labels** - 五个 canonical triage roles 使用的字符串
- **Domain docs** - `CONTEXT.md` 与 ADRs 的位置，以及读取它们的 consumer rules

这是 prompt-driven skill，不是确定性脚本。先探索，展示发现，与用户确认，然后写入。

## Process

### 1. Explore

查看当前 repo，理解起始状态。读取已有内容，不要假设：

- `git remote -v` 和 `.git/config` - 这是 GitHub repo 吗？是哪一个？
- repo root 的 `AGENTS.md` 和 `CLAUDE.md` - 是否存在？其中是否已有 `## Agent skills` section？
- repo root 的 `CONTEXT.md` 和 `CONTEXT-MAP.md`
- `docs/adr/` 以及任何 `src/*/docs/adr/` directories
- `docs/agents/` - 这个 skill 之前是否已经输出过内容？
- `.scratch/` - 表明已经在使用 local-markdown issue tracker 约定
- 是否已安装 `triage` skill（本 skill 旁边有 `triage` folder，或 available skills 中存在 `triage`）？这决定 Section B 是否运行。
- Monorepo signals：`pnpm-workspace.yaml`、`package.json` 的 `workspaces` field，或已有内容且各自带 `src/` 的 `packages/*`。只有真正的大型 multi-package repo 才算；没有这些 signal 就是 single-context，几乎所有 repo 都如此。

### 2. Present findings and ask

总结已有内容和缺失内容。按顺序处理 sections：每次一个 section、一个回答，再进入下一个。

每个 section 都先给 recommended answer，让用户一个词就能接受。只有 choice 真正分叉时才给一行 explainer；exploration 已经确定答案时跳过整个 section（未安装 `triage` 时跳过 Section B；没有 monorepo 时跳过 Section C）。

**Section A - Issue tracker.**

> Explainer: "issue tracker" 是这个 repo 存放 issues 的地方。`to-tickets`、`triage` 和 `to-spec` 等 skills 会从中读取并写入；它们需要知道是调用 `gh issue create`、在 `.scratch/` 下写 markdown 文件，还是遵循你描述的其他工作流。请选择你实际用于跟踪这个 repo 工作的位置。

默认姿态：这些 skills 是为 GitHub 设计的。如果 `git remote` 指向 GitHub，推荐 GitHub。如果 `git remote` 指向 GitLab（`gitlab.com` 或 self-hosted host），推荐 GitLab。否则（或用户偏好），提供：

- **GitHub** - issues 位于 repo 的 GitHub Issues（使用 `gh` CLI）
- **GitLab** - issues 位于 repo 的 GitLab Issues（使用 [`glab`](https://gitlab.com/gitlab-org/cli) CLI）
- **Local markdown** - issues 作为文件位于本 repo 的 `.scratch/<feature>/` 下（适合个人项目或没有 remote 的 repos）
- **Other**（Jira、Linear 等）- 让用户用一段话描述工作流；skill 会把它记录为 freeform prose

把选择记录到 `docs/agents/issue-tracker.md`。GitHub 和 GitLab templates 带有 “PRs as a request surface” flag，默认 **off**；保持关闭且不要提问。想把 external PRs 放入 triage queue 的用户可以之后直接修改文件。

**Section B - Triage label vocabulary.** 如果未安装 `triage`，完全跳过本 section；未安装的 skill 不需要 labels。

如果已安装，只问一个问题：

> 是否保留默认 triage labels？（recommended: **yes**）

默认值是五个 canonical roles，label string 与 role name 相同：`needs-triage`、`needs-info`、`ready-for-agent`、`ready-for-human`、`wontfix`。回答 yes 就原样写入。只有用户说 no（通常因为 tracker 已使用其他名称，例如用 `bug:triage` 表示 `needs-triage`）时，才收集 overrides，避免 `triage` 创建重复 labels。

**Section C - Domain docs.** 默认 **single-context**：repo root 下一个 `CONTEXT.md` + `docs/adr/`。这适合几乎所有 repo，直接写入，无需提问。

只有 exploration 找到 monorepo signals 时，才提供 **multi-context**（root 下 `CONTEXT-MAP.md` 指向每个 context 的 `CONTEXT.md` files），并确认用户想要哪种 layout。

### 3. Confirm and edit

向用户展示草稿：

- 要添加到 `CLAUDE.md` / `AGENTS.md` 的 `## Agent skills` block（选择规则见 step 4）
- `docs/agents/issue-tracker.md`、`docs/agents/domain.md`，以及仅在安装了 `triage` 时才有的 `docs/agents/triage-labels.md` 内容

写入前允许用户修改。

### 4. Write

**选择要编辑的文件：**

- 如果 `CLAUDE.md` 存在，编辑它。
- 否则如果 `AGENTS.md` 存在，编辑它。
- 如果两者都不存在，询问用户要创建哪一个；不要替用户选择。

当 `CLAUDE.md` 已存在时，绝不创建 `AGENTS.md`（反之亦然）；始终编辑已经存在的那个。

如果所选文件已有 `## Agent skills` block，就原地更新其内容，而不是追加重复 block。不要覆盖周围 sections 的用户编辑。

Block：

```markdown
## Agent skills

### Issue tracker

[one-line summary of where issues are tracked]. See `docs/agents/issue-tracker.md`.

### Triage labels

[one-line summary of the label vocabulary]. See `docs/agents/triage-labels.md`.

### Domain docs

[one-line summary of layout - "single-context" or "multi-context"]. See `docs/agents/domain.md`.
```

只有安装了 `triage` 且 Section B 实际运行时，才包含 `### Triage labels` sub-block 并写入 `docs/agents/triage-labels.md`；否则两者都省略。

然后使用本 skill folder 中的 seed templates 作为起点写 docs files：

- [issue-tracker-github.md](./issue-tracker-github.md) - GitHub issue tracker
- [issue-tracker-gitlab.md](./issue-tracker-gitlab.md) - GitLab issue tracker
- [issue-tracker-local.md](./issue-tracker-local.md) - local-markdown issue tracker
- [triage-labels.md](./triage-labels.md) - label mapping（仅当安装了 `triage`）
- [domain.md](./domain.md) - domain doc consumer rules + layout

对于 "other" issue trackers，根据用户描述从头写 `docs/agents/issue-tracker.md`。

### 5. Done

告诉用户 setup 已完成，以及哪些 engineering skills 现在会读取这些文件。说明他们之后可以直接编辑 `docs/agents/*.md`；只有当他们想切换 issue trackers 或从头开始时，才需要重新运行此 skill。
