# Model-invoked 与 user-invoked

本仓库中的每个 `SKILL.md` 都是一个 skill。它们只按一个维度区分：**invocation**，也就是谁能调用它：

- **User-invoked** - 只能由人类输入名称来调用。在 frontmatter 中设置 `disable-model-invocation: true`（Claude Code），并在 `agents/openai.yaml` 中设置 `policy.allow_implicit_invocation: false`（Codex）。`description` 面向人类：浏览 slash commands 时看到的一行摘要。去掉触发词列表（例如 "Use when the user says..."）。
- **Model-invoked** - 模型和用户都可以调用。默认就是这种形式：省略 `disable-model-invocation`，并省略 `agents/openai.yaml` 中的 `policy` block。`description` 面向模型，并保留丰富的触发措辞（例如 "Use when the user wants..."、"mentions..."、"asks for..."），让自动调用能命中。判断一个 skill 是否应保持 model-invoked 的测试是：模型能否有意义地自行想到要用它？（复用是抽出 skill 的理由，不是这个判断标准。）

每个 agent harness 都用自己的方式把 user-invoked skill 排除在模型可调用范围之外，因此只有人类能触发它，其他 skill 也不能调用它。User-invoked skill 可以调用 model-invoked skills，但永远不能调用另一个 user-invoked skill。

每个 skill 的 `SKILL.md` 旁都必须有 `agents/openai.yaml`。它保存 Codex UI metadata：skill picker 使用的 `interface.display_name` 与 `interface.short_description`；对于 user-invoked skills，还保存与 `disable-model-invocation` 配对的 `policy.allow_implicit_invocation: false`。两边必须保持同步：一个 skill 要么在两个 harness 中都是 user-invoked，要么都不是。

Bucket `README.md` 和顶层 `README.md` 都按 **User-invoked** 与 **Model-invoked** 对条目分组。

## 它们之间的依赖

依赖用 **`/skill` 风格的 prose invocation** 表达（例如 "Run the `/grilling` skill"），而不是深层 `../other-skill/FILE.md` 交叉引用。共享 reference docs 存放在拥有它们的 skill 内；其他 skills 通过调用该 skill 触达这些资料，而不是跨目录链接。

## 被动与主动的 domain 工作

只是为了词汇而 _读取_ `GLOSSARY.md`，是一条普通 prose pointer，不是 `domain-modeling` skill。只有主动构建和打磨 domain model 的纪律（挑战术语、构造 edge-case scenarios、写 ADRs、内联更新 `GLOSSARY.md`）才是 `domain-modeling`。
