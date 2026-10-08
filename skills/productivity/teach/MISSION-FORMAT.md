# MISSION.md 格式

`MISSION.md` 位于 workspace root。它记录用户学习这个 topic 的 _reason_。每个 teaching decision：下一步教什么、展示哪些 resources、设计哪些 exercises，都应追溯到这个文档。

## 模板

```md
# Mission: {Topic}

## Why
{1-3 sentences. The concrete real-world goal the user is chasing. What changes in their life or work when they have this skill? Avoid abstract framings like "to understand X"; push for the underlying outcome.}

## Success looks like
- {A specific, observable thing the user will be able to do}
- {Another specific thing}
- {…}

## Constraints
- {Time, budget, prior commitments, learning preferences, anything that bounds the approach}

## Out of scope
- {Adjacent topics the user explicitly does not want to chase right now, protecting the zone of proximal development}
```

## 规则

- **One mission per workspace.** 如果用户想学两个不相关的东西，那就是两个 workspaces。
- **Concrete over abstract.** “Run a half marathon by October” 胜过 “get fitter”。“Ship a Rust CLI to my team” 胜过 “learn Rust”。
- **Push back on vagueness.** 如果用户说不清为什么，在写任何东西前先 interview 他们。糟糕的 mission 比没有 mission 更差。
- **Revise when reality shifts.** Missions 会变化。当用户目标移动时，更新这个文件，不要让 stale mission 继续指导 future sessions。
- **Keep it short.** 如果 `MISSION.md` 超过一屏，它就不再是 compass，而变成 plan 了。
