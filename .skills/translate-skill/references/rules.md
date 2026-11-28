# 翻译规则（翻什么 / 留什么 / 怎么统一）

## 1. 翻什么

翻译自然语言文本：

```text
README 说明
skill instructions
skill descriptions
用户可见的 frontmatter prompts
面向 agent 的指引
面向维护者的指引
docs 说明性文字
以说明性文字写成的示例
Markdown 标题（headings）
```

## 2. 标题规则

标题是说明性文字，翻成简体中文；标题层级与 Markdown 结构保持不变；标题内嵌的 inline code、identifiers 原样保留。

- docs 页面的固定 schema 标题（`What it does`、`When to reach for it`、`Common questions`、`It's working if`、`Where it fits`、`Prerequisites`）与 skill 文件的结构性标题（`Steps`、`Reference` 等）必须使用 `TRANSLATION-GLOSSARY.md` 登记的统一译法，保证所有页面一致。
- 其余标题按页面语境意译，无需逐一登记。
- 例外（作为术语保留英文，不译）：bucket 名（`Engineering`、`Productivity`、`Misc` 等，与目录名一致）；invocation 术语（`User-invoked`、`Model-invoked`）。
- 修改标题时，同步更新同一文件内指向该标题的 anchor links（GitHub 按标题文本生成 slug，中文标题生成中文 anchor）。

## 3. 原样保留

不要翻译或改写：

```text
目录名 / skill 名称 / slash commands / CLI 命令
代码块 / inline code / 文件路径 / package 名
tool identifiers / API identifiers / 环境变量名
frontmatter keys / JSON-YAML-TOML keys
Markdown 链接 URL / 行为关键 labels
```

保持 Markdown 结构、标题层级、列表嵌套、表格、链接目标、相对路径和 code fences 不变。

## 4. 仓库路径本地化

翻译用户可见的安装示例时，把上游仓库路径 `mattpocock/skills` 替换为 `vinvcn/mattpocock-skills-zh-CN`。

- 只有当命令或说明性文字是在告诉用户如何安装或使用本地化仓库时才替换；
- 不要移除对上游项目的署名。

## 5. frontmatter 规则

原样保留 frontmatter keys，按含义（而不仅是字段名）给每个值分类：

- `name` 值保持不变；
- 用户可见或面向 agent 的自然语言文本翻成简体中文，包括 `description`、`argument-hint` 的值；
- identifiers、命令、路径、package 名、URL、工具名、布尔值、数字和其他有类型的配置值保持不变；
- 在可翻译的值内部，原样保留内嵌的 slash commands、inline code、占位符、路径、URL、package 名、工具名和其他行为关键片段；
- 对有歧义的值打复核标记，不要猜。

```yaml
---
name: teach
description: 在这个工作区中教用户一个新技能或概念。
disable-model-invocation: true
argument-hint: "你想学习什么？"
---
```

## 6. 风格

简体中文，要求：自然、对开发者友好、简洁、准确、与本仓库现有语气一致。

常见工程术语在开发者中是标准说法、或翻译会降低清晰度时，保留英文。

## 7. 术语权威

- 译法以 `[REPO_DIR]/TRANSLATION-GLOSSARY.md` 为唯一权威；已决定的术语严格使用登记译法。
- 术语的请求与认领流程见 `CONTRIBUTING.md`。
- 遇到术语表里没有、且拿不准的 → 走请求流程或打复核标记，不要自创后静默使用。
