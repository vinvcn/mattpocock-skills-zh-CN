# 通过 harness 原生提问工具进行 grilling

Grilling session（`/grilling`、`/grill-me`、`/grill-with-docs`，以及其他 skills 内部的 grilling）以普通聊天文本的形式提出问题。把这些问题改由 harness 内置提问 UI（Claude Code 的 `AskUserQuestion`、宿主的“提问工具”、结构化或批量问卷模式）提出的请求不在范围内。

## 为什么这不在范围内

这些 skills 是 harness 中立的文本。它们运行在 Claude Code、Codex、Copilot、Cursor 以及 skills.sh 能安装进入的一切环境里，而每个 harness 的提问工具各不相同，或者根本没有。在 skill 里点名某个 harness 的工具，要么意味着每个 grilling skill 都多出一个 harness 专属分支，要么意味着得到一个只在单一环境里正常工作的 skill。

提问 UI 还会改变 grilling 本身。结构化选择器会把模型推向带预制答案的选择题，这与 grilling 的目的正好相反：grilling 要的是开放性问题，让你用自己的话作答，一次只走 decision tree 的一个分支。我试过 `AskUserQuestion` UI，不希望它出现在这些 skills 里。

如果你更喜欢自己 harness 的提问工具，在你自己的 `CLAUDE.md` / `AGENTS.md` 里写上这一句（“when grilling, ask via AskUserQuestion”）即可。那是一行式的、按用户各自的偏好，不需要共享 skill 知晓它。

## Prior requests

- #19: "grill-me: not always using the question tool"
- #643: "Proposal: Use AskQuestion for structured input during grilling sessions"
- #840: "Use host's question tool for grilling sessions"
- #1107: "Grilling doesn't use Agent's native QA tool OOTB"
- #1152: "Proposal: experimental HTML questionnaire mode for batch grilling"
