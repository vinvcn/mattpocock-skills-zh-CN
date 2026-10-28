# 防止 sub-agent 递归调用 skills 的守卫

Skills 不会添加防止 sub-agent 递归调用 skills 或生成嵌套 agent 的守卫（例如 `/code-review` 的 sub-agent 再次调用 `/code-review`，或 `/research` 的 agent 再生成另一个 agent）。增加 leaf-agent 指令、深度限制或“do not invoke this skill”字句的请求不在范围内。

## 为什么这不在范围内

负责阻止无限 subagent 循环的应该是 harness，而不是 skills。sub-agent 能访问哪些 tools 和 skills、嵌套能到多深，都由 harness 决定，因此设在那里的限制一次性对所有 skill 都生效。写进某个 skill 散文里的守卫只覆盖那一个 skill，每次运行都要消耗 token，而且最终仍然依赖模型选择服从它。

如果某个 sub-agent 无限制地递归或 fan out，请向 harness 报告。

## Prior requests

- #530: "research skill: spawned background agent can recursively re-spawn another agent (uncontrolled nesting)"
- #573: "code-review sub-agents recursively invoke /code-review and fan out"（PR #1186，"code-review: make the Standards and Spec sub-agents leaf reviewers"，已关闭）
