# 范围

这个仓库是我自己每天在用的一套 skills，内容经过刻意筛选：欢迎提出想法，每个想法都会对照下面的门槛来评判。Issues 用来跟踪对 skills 的改动。提问与讨论请移步 [GitHub Discussions](https://github.com/mattpocock/skills/discussions)。

## 门槛

一个想法或反馈类 issue，只有同时通过以下**两个**部分，才会保持 open：

1. **实际观察到的失败。** 它描述的是一次真实 session 里出错的事：你运行了什么、skill 做了什么、你原本期望的是什么。假设性的改进（“要是能……就好了”）过不了这一条。
2. **符合项目理念。** 它不匹配 [`.out-of-scope/`](./.out-of-scope/) 里的任何条目，也不属于过去的任何一次拒绝；并且它不是配置选项、不是 harness 专属分支、也不是为迎合某个人工作流而做的微调。这些应该放进你自己的 `CLAUDE.md` / `AGENTS.md`，或者放进一个 fork（skills.sh 会给你一份可编辑的副本）。

规模无关紧要：一个词的修复和一次整体重写面对同样的门槛。Reactions 和 +1 评论不计入其中。

## 按 bucket 划分

- **`engineering/`、`productivity/`、`in-progress/`**：上面的门槛。
- **`misc/`**：已冻结、无人维护。所有 issue 都会被关闭。见 [`frozen-misc-skills.md`](./.out-of-scope/frozen-misc-skills.md)。
- **新 skills**：提案与贡献一律会被关闭。如果这个行为可以由现有 skills 组合出来，就不会新增 skill。见 [`new-skills.md`](./.out-of-scope/new-skills.md)。

## 已有定论

[`.out-of-scope/`](./.out-of-scope/) 里的每个文件都记录了一个已被拒绝的概念及其原因。提交 issue 之前先读一遍：

- [`frozen-misc-skills.md`](./.out-of-scope/frozen-misc-skills.md)
- [`harness-name-collisions.md`](./.out-of-scope/harness-name-collisions.md)
- [`mainstream-issue-trackers-only.md`](./.out-of-scope/mainstream-issue-trackers-only.md)
- [`native-question-tool.md`](./.out-of-scope/native-question-tool.md)
- [`new-skills.md`](./.out-of-scope/new-skills.md)
- [`question-limits.md`](./.out-of-scope/question-limits.md)
- [`setup-skill-verify-mode.md`](./.out-of-scope/setup-skill-verify-mode.md)
- [`subagent-recursion.md`](./.out-of-scope/subagent-recursion.md)

## 无法评判的 issues

无法对照门槛评判的 issue，会得到一轮提问，并打上 `needs-info` 标签。报告者 14 天内没有回复，issue 就会被关闭。被拒绝的 issue 会以 “not planned” 状态关闭。
