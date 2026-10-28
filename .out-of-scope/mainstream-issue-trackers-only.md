# Issue tracker 集成：仅限 GitHub、GitLab 和 local markdown

`setup-matt-pocock-skills` 为恰好三个 issue tracker 提供一等支持，每个对应 `skills/engineering/setup-matt-pocock-skills/` 中的一个 seed template：

- **GitHub**（`issue-tracker-github.md`，使用 `gh`）
- **GitLab**（`issue-tracker-gitlab.md`，使用 `glab`）
- **Local markdown**（`issue-tracker-local.md`，`.scratch/` 下的文件）

把任何其他 tracker 增设为一等后端的请求不在范围内，包括 Jira、Linear、Azure DevOps、Trello、YouTrack，以及新出现的面向 agent 的 trackers。

## 为什么这不在范围内

每个 issue-tracker 后端都会把一种 CLI 形态硬编码进 skills（命令、flag、输出解析）。每新增一个后端，都是永久维护面：它必须随着工具 CLI 的演进继续可用，也必须持续针对 `/to-spec`、`/to-tickets`、`/triage` 等工作流测试。我自己用 GitHub，所以那是唯一一个我能真正保持正确的后端。GitLab 的形态足够接近，可以顺带支持；local markdown 则完全不需要 CLI。

流行程度改变不了这一点。Jira 使用广泛，也有官方 CLI（`acli`），但它仍然不会得到一个 template：它是一个我不运行的后端，有自己的一套链接语义、workflow states 和 CLI quirks 需要持续测试。不管工具本身是否主流，成本都落在我身上。

所有其他 tracker 都走 `/setup-matt-pocock-skills` 的 **Other** 选项：你用一段话描述自己的工作流，skill 把它以文字形式记录进 `docs/agents/issue-tracker.md`。那个文件归你所有。如果你打磨出了一套可用的 Jira 或 Linear 工作流，把它留在你自己的仓库里或发布出来，再让 setup 指向它。

## Prior requests

- #99: "Add dex as an issue tracker backend"（dex 当时约 3 个月大，约 300 stars）
- #258: "Add Jira as first-class issue tracker via Rovo MCP"
- #1137: "Add Jira as a first-class issue tracker, via Atlassian's official CLI (`acli`)"
