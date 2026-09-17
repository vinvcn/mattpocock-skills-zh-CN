---
name: claude-handoff
description: 把当前对话交接给一个全新的 background agent，让它立即接手工作。
argument-hint: "下一个 session 将用于什么？"
disable-model-invocation: true
---

为当前对话写一份 handoff summary，让一个全新的 agent 可以继续工作。不要把它保存下来，而是启动一个以这份 summary 作为 prompt 的 background agent：`claude --bg --name "<descriptive name>" "<handoff summary>"`。它会在当前工作目录中启动并立即返回；用户用 `claude agents` 管理它。

始终带上 `-n`/`--name` 并给出描述性名称（例如 `--name "Fix login bug"`）——它设置显示名称，会出现在 job list、session picker 和 terminal title 中。

在 summary 中包含一个 "suggested skills" section，写明下一个 agent 应调用 Skill 工具并指定哪些 skills。

不要重复其它 artifacts（PRDs、plans、ADRs、issues、commits、diffs）中已经记录的内容，改为用 path 或 URL 引用它们。

删去任何敏感信息，例如 API keys、passwords 或个人身份信息——这份 summary 会成为 agent 的 prompt。

如果用户传入了 arguments，把它们当作对下一个 session 重点的描述，并据此调整 summary。
