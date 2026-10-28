# Issue tracker：GitHub

这个 repo 的 issues 和 specs 存放在 GitHub issues 中。所有操作都使用 `gh` CLI。

## 约定

- **Create an issue**: `gh issue create --title "..." --body "..."`。多行 body 使用 heredoc。
- **Read an issue**: `gh issue view <number> --json number,title,body,labels,comments`。
- **List issues**: `gh issue list --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'`，按需加上 `--label` 和 `--state` filters。
- **Make an issue a sub-issue of a parent**: `gh issue create --parent <parent> ...`，或事后用 `gh issue edit <parent> --add-sub-issue <child>`（`gh` 2.94+）。较旧的 `gh`：`gh api --method POST repos/<owner>/<repo>/issues/<parent>/sub_issues -F sub_issue_id=<child-db-id>`（database id，见下方 **Blocking**）。无法使用 sub-issues 时，在 child body 顶部写 `Part of #<parent>`。
- **Blocking**: GitHub 的 **native issue dependencies**，canonical、UI 可见的表达。用 `gh issue create --blocked-by <n>,<n> ...` 或 `gh issue edit <child> --add-blocked-by <blocker>` 添加 edge（`gh` 2.94+）。较旧的 `gh`：`gh api --method POST repos/<owner>/<repo>/issues/<child>/dependencies/blocked_by -F issue_id=<blocker-db-id>`，其中 `<blocker-db-id>` 是 blocker 的数字 **database id**（`gh api repos/<owner>/<repo>/issues/<n> --jq .id`，_不是_ `#number` 或 `node_id`）。依赖不可用时，回退到 child body 顶部的 `Blocked by: #<n>, #<n>` 行。当所有 blockers 都关闭时，ticket 即为 unblocked。
- **Count open blockers**: `gh api repos/<owner>/<repo>/issues/<n> --jq .issue_dependencies_summary.blocked_by`（仅统计 open blockers；0 表示可以启动）。`gh issue view <n> --json blockedBy` 还会列出已关闭的 blockers，因此要过滤：`--jq '[.blockedBy.nodes[] | select(.state == "OPEN")] | length'`。
- **Comment on an issue**: `gh issue comment <number> --body "..."`
- **Apply / remove labels**: `gh issue edit <number> --add-label "..."` / `--remove-label "..."`
- **Close**: 先用 `gh issue comment <number> --body "..."` 发布说明，然后 `gh issue close <number>`。对已经关闭的 issue，`gh issue close --comment` 会丢掉 comment，且仍然以退出码 0 结束。

从 `git remote -v` 推断 repo；在 clone 内运行时，`gh` 会自动处理。

只把 issues 提交到用户自己的 repo。绝不向 `mattpocock/skills`（这些 skills 的来源 repo）提交 issue，除非用户拥有它。在 fork 中，`gh` 可能默认指向上游 parent，因此在 session 的第一次 `gh issue create` 之前，先用 `gh repo view --json nameWithOwner` 检查目标；如果它不是用户的 repo，先与用户确认。

## Pull requests 作为 triage surface

**PRs as a request surface: no.** _（如果这个 repo 把 external PRs 当作 feature requests，则设为 `yes`；`/triage` 会读取这个 flag。）_

设为 `yes` 时，PRs 走与 issues 相同的 labels 和 states，使用 `gh pr` 对应命令：

- **Read a PR**: `gh pr view <number>`，然后 `gh pr view <number> --comments`（不在 TTY 上时，`--comments` 只打印 comments，不打印 body），以及 `gh pr diff <number>` 获取 diff。
- **List external PRs for triage**: `gh api --paginate 'repos/{owner}/{repo}/pulls?state=open' --jq '.[] | select(.author_association | IN("OWNER","MEMBER","COLLABORATOR") | not) | {number, title, author: .user.login, author_association, labels: [.labels[].name]}'`。
- **Comment / label / close**: `gh pr comment`、`gh pr edit --add-label`/`--remove-label`、`gh pr close`。

GitHub 在 issues 和 PRs 之间共享一个 number space，因此裸 `#42` 可能是两者之一：用 `gh pr view 42` 解析，失败则回退到 `gh issue view 42`。

## 当 skill 说 "publish to the issue tracker" 时

创建一个 GitHub issue。

## 当 skill 说 "fetch the relevant ticket" 时

按上方 **Read an issue** 的方式读取。

## Wayfinding 操作

供 `/wayfinder` 使用。**map** 是单个 issue，以 **child** issues 作为 tickets。

- **Map**: 单个带 `wayfinder:map` label 的 issue，保存 Notes / Decisions-so-far / Fog body。`gh issue create --label wayfinder:map`。
- **Child ticket**: 作为 GitHub sub-issue 链接到 map 的 issue（见 **Make an issue a sub-issue of a parent**）。未启用 sub-issues 时，把 child 加入 map body 中的 task list，并在 child body 顶部写 `Part of #<map>`。Labels：`wayfinder:<type>`（`research`/`prototype`/`grilling`/`task`）。一旦被 claim，ticket 被 assign 给 driving dev。
- **Blocking**: 见 “约定” 一节中的 **Blocking**。
- **Frontier query**: 列出 map 的 open children（`gh issue list --state open`，限定在 map 的 sub-issues / task list），丢弃任何带有 open blocker 的（见 **Count open blockers**，或 `Blocked by` 行中的 open issue）或带有 assignee 的；按 map 顺序第一个胜出。
- **Claim**: `gh issue edit <n> --add-assignee @me`，session 的第一次写入。
- **Resolve**: `gh issue comment <n> --body "<answer>"`，然后 `gh issue close <n>`，再向 map 的 Decisions-so-far 追加 context pointer（gist + link）。
