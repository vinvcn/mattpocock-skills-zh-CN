---
name: research
description: 对照高可信一手来源调研问题，并把发现保存为仓库中的 Markdown 文件。适用于用户想调研主题、收集文档或 API 事实，或把阅读工作委托给后台代理时。
---

启动一个 **background agent** 做 research，这样你可以在它阅读时继续工作。使用全新的 context window 启动它。

它的工作：

1. 对照 **primary sources** 调研问题：official docs、source code、specs、first-party APIs，而不是二手解读。每个 claim 都要追溯到拥有该事实的 source。
2. 把 findings 写入一个 Markdown 文件，并为每个 claim 标注 source。
3. 保存到 repo 既有的 notes 位置；匹配现有 convention。如果没有 convention，就放在合理位置并说明路径。
