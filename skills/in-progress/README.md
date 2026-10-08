# In Progress

Beta。这些 skills 是有意公开的——试用它们，告诉我们哪里坏了。在毕业进入稳定 bucket 之前，它们被排除在 plugin 和顶层 README 之外，没有 docs page，并且可能随时变更或消失。

Plugin 不会提供它们。直接安装某一个：

```bash
npx skills@latest add vinvcn/mattpocock-skills-zh-CN --skill=<name>
```

- **[loop-me](./loop-me/SKILL.md)** — 通过多个 sessions 把自己 grilling 成可实现的 workflow specs，使用当前目录作为 stateful workspace。User-invoked。
- **[writing-beats](./writing-beats/SKILL.md)** — 以自选路径（choose-your-own-adventure）风格，把文章塑造成一段节拍旅程。选一个 starting beat，只写那个 beat，然后 pivot 到下一个，直到文章自然结束。
- **[writing-fragments](./writing-fragments/SKILL.md)** — Grilling session，从你身上挖掘 fragments——异质的写作素材——并把它们追加到单一文档中，作为未来文章的 raw material。
- **[writing-shape](./writing-shape/SKILL.md)** — 拿一份 raw material markdown 文件，一段一段地把它塑造成文章，并在每一步论证格式选择。
- **[claude-handoff](./claude-handoff/SKILL.md)** — 把当前对话交接给一个全新的 background agent，让它立即接手工作，通过 `claude --bg` 以 handoff summary 作为种子。User-invoked。
- **[setup-ts-deep-modules](./setup-ts-deep-modules/SKILL.md)** — 在 TypeScript repo 中接入 dependency-cruiser，让每个 package 成为 deep module——implementation 隐藏在 subfolders 中，只能通过其 entry-point files 访问，tests 则通过这些 entry points 来验证它。User-invoked。
