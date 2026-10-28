# 在评判面向 agent 写作的 skills 中懒加载 `writing-for-agents`

`retro` 每次运行都会加载 `writing-for-agents`，而不只是在动笔之前。把这次加载推迟到 skill 真正动手编辑某个 skill、某份 `AGENTS.md`/`CLAUDE.md` 或某份文档的请求，不在范围内。

## 为什么这不在范围内

`writing-for-agents` 不只是一份风格指南。它定义了什么算 no-op instruction、什么算一个好 skill；`retro` 在写下任何东西之前，就会用这些定义评判它读到的 steering files。一次只读取并报告、什么也不写的 retro，同样需要它。改成懒加载，属于 No-ops 和 Skills 的候选条目就没了评判的标尺。

## Prior requests

- #1238: "retro: load writing-for-agents only before writing"（已关闭）
