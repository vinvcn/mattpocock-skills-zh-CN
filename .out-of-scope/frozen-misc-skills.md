# 对 `misc/` skills 的变更

`skills/misc/` 下的 skills（`git-guardrails-claude-code`、`migrate-to-shoehorn`、`scaffold-exercises`、`setup-pre-commit`，以及之后落到这里的任何 skill）已冻结。针对它们的 bug reports、feature requests 和 PRs 都会被关闭。

## 为什么这不在范围内

`misc/` 是那些我保留着、但很少使用的 skills 的去处。它们没有被 promote：不随 Claude Code plugin 发布，没有 docs 页面，我日常也不运行它们，因此我既无法判断一个修复是否正确，也察觉不到某个修复什么时候弄坏了别的东西。按 promoted skills 的同一标准去维护它们，付出的是一整个 promoted skill 的成本，换来的使用量却只有一小部分。

它们留在仓库里、无人维护，因为现状下它们对一些人仍然可用。如果某个 skill 对你不好用，用 skills.sh 安装你自己的副本并修改它：这些文件归你所有。

如果某个 `misc/` skill 之后被重新 promote 回 `engineering/` 或 `productivity/`，从那一刻起它就重新进入范围。

## Prior requests

- #14: "Potential typo in setup-pre-commit/SKILL.md"
- #301: "`block-dangerous-git.sh` is bypassed by any git global option (e.g. `git -C <dir> push`)"
- #465: "git-guardrails-claude-code documentation is missing benefits over built in Claude code deny rules"
- #898: "git-guardrails-claude-code: hook fails open without jq and misses common git spellings"
