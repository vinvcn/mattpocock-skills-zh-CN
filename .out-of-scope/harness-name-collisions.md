# 为规避 harness 内置命令而重命名 skills

不会因为某个 harness 内置了同名命令或 skill（`/prototype`、`/research`、`/code-review` 等）而更改 skill 名称。为避免这种冲突而重命名 skill 或增加别名的请求不在范围内。

## 为什么这不在范围内

Harness 一直在新增内置功能，而每个 harness 各自挑选名字。每当其中一个撞上我们已经在用的名字就跟着改名，就意味着在 Claude Code、Copilot、Devin 和其余各家之间追逐一个移动靶，而且每改一次，都打破所有用户的肌肉记忆和 skills 之间的每一处交叉引用。

Harness 如何解析两个同名的东西，是 harness 的行为，不是 skill 的。无论解析成哪个，skill 文本都是正确的。

出路是带命名空间的调用。Claude Code plugin 会把每个 skill 都挂在它的 plugin 名下，所以你随时都能显式调用到我们的：

```
/mattpocock-skills:research
/mattpocock-skills:code-review
```

如果你是用 skills.sh 安装的，文件就归你所有：改掉你副本里的目录名和 `name:` 字段即可。

如果某个 harness 完全没有办法调用到一个带命名空间或已重命名的 skill，请向那个 harness 报告。

## Prior requests

- #423: "/code-review shadows Claude Code own review skill"
- #483: "/code-review name clash with Claude Code built-in"
- #857: "Rename the research skill to avoid conflict with Copilot's built-in /research command"
- #1019: "Shorthand `/prototype` conflicts with hidden new Claude Code built-in skill `/prototype`"
- #1037: "Skill name overlap with devin cli inbuilt commands"
