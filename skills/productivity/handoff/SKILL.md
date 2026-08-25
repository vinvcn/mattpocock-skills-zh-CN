---
name: handoff
description: 把当前对话压缩成交接文档，让另一个代理接手。
argument-hint: "下一个会话将用于什么？"
disable-model-invocation: true
---

编写一份 handoff document，总结当前对话，让 fresh agent 能继续工作。保存到用户操作系统的临时目录，不要保存到当前 workspace。

在文档中包含 "suggested skills" section，写明下一个 agent 应调用 Skill 工具并指定哪些 skills。

不要重复已经被其他 artifacts 捕获的内容（specs、plans、ADRs、issues、commits、diffs）。改用 path 或 URL 引用它们。

删去任何敏感信息，例如 API keys、passwords 或 personally identifiable information。

如果用户传入了 arguments，把它们视为下一次 session 的关注点描述，并据此调整文档。
