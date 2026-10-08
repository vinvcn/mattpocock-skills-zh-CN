# Issue tracker：GitLab

这个 repo 的 issues 和 specs 存放在 GitLab issues 中。所有操作都使用 [`glab`](https://gitlab.com/gitlab-org/cli) CLI。

## 约定

- **Create an issue**: `glab issue create --title "..." --description "..."`。多行 description 使用 heredoc。传入 `--description -` 可打开编辑器。
- **Read an issue**: `glab issue view <number> --comments`。使用 `-F json` 获取 machine-readable output。
- **List issues**: `glab issue list -F json`，按需使用 `--label` filters。
- **Comment on an issue**: `glab issue note <number> --message "..."`。GitLab 把 comments 称为 “notes”。
- **Apply / remove labels**: `glab issue update <number> --label "..."` / `--unlabel "..."`。多个 labels 可以逗号分隔，也可以重复 flag。
- **Close**: `glab issue close <number>`。`glab issue close` 不接受 closing comment，因此先用 `glab issue note <number> --message "..."` 发布说明，再 close。
- **Merge requests**: GitLab 把 PRs 称为 “merge requests”。使用 `glab mr create`、`glab mr view`、`glab mr note` 等；形状与 `gh pr ...` 相同，只是用 `mr` 替代 `pr`，用 `note`/`--message` 替代 `comment`/`--body`。

从 `git remote -v` 推断 repo；在 clone 内运行时，`glab` 会自动处理。

## Merge requests 作为 triage surface

**MRs as a request surface: no.** _（如果这个 repo 把 external merge requests 当作 feature requests，则设为 `yes`；`/triage` 会读取这个 flag。）_

设为 `yes` 时，MRs 走与 issues 相同的 labels 和 states，使用 `glab mr` 对应命令：

- **Read an MR**: `glab mr view <number> --comments`，以及 `glab mr diff <number>` 获取 diff。
- **List external MRs for triage**: `glab mr list -F json`，然后只保留作者不是 project member/owner 的 MR（contributor 的 MR，而非 maintainer 正在进行的工作）。
- **Comment / label / close**: `glab mr note`、`glab mr update --label`/`--unlabel`、`glab mr close`。

与 GitHub 不同，GitLab 对 issues 和 MRs 分别编号，因此一旦知道 maintainer 指的是哪个 surface，`#42` 就没有歧义。

## 当 skill 说 "publish to the issue tracker" 时

创建一个 GitLab issue。

## 当 skill 说 "fetch the relevant ticket" 时

运行 `glab issue view <number> --comments`。

## Wayfinding 操作

供 `/wayfinder` 使用。**map** 是单个 issue，以 **child** issues 作为 tickets。

- **Map**: 单个带 `wayfinder:map` label 的 issue，保存 Notes / Decisions-so-far / Fog body。`glab issue create --label wayfinder:map`。（在带 native epics 的 GitLab tier 上，也可以用 epic 保存 map；带 label 的 issue 在所有地方都可用。）
- **Child ticket**: description 顶部带 `Part of #<map>`、labels 为 `wayfinder:<type>`（`research`/`prototype`/`grilling`/`task`）的 issue。一旦被 claim，ticket 被 assign 给 driving dev。
- **Blocking**: GitLab 的 **native blocking link**，canonical、UI 可见的表达。用 `/blocked_by #<n>` quick action 添加，作为 note 发布（`glab issue note <child> --message "/blocked_by #<blocker>"`）。Native blocking links 是 Premium/Ultimate 功能；在 free tier（或不可用时）回退到 description 顶部的 `Blocked by: #<n>, #<n>` 行。当所有 blockers 都关闭时，ticket 即为 unblocked。
- **Frontier query**: `glab issue list -F json` 限定在 map 的 children，丢弃任何带有 open blocker 的：指向 open issue 的 native `blocked_by` link（`glab api projects/:id/issues/:iid/links`），或 `Blocked by` 行中的 open issue，或带有 assignee 的；按 map 顺序第一个胜出。
- **Claim**: `glab issue update <n> --assignee @me`，session 的第一次写入。
- **Resolve**: `glab issue note <n> --message "<answer>"`，然后 `glab issue close <n>`，再向 map 的 Decisions-so-far 追加 context pointer（gist + link）。
