# 超出范围的知识库

Repo 中的 `.out-of-scope/` 目录保存被拒绝 feature requests 的持久记录。它有两个用途：

1. **Institutional memory**：记录为什么某个 feature 被拒绝，避免 issue 关闭后理由丢失
2. **Deduplication**：当新 issue 与既往拒绝匹配时，skill 可以指出之前的决策，而不是重新争论

## 目录结构

```
.out-of-scope/
├── dark-mode.md
├── plugin-system.md
└── graphql-api.md
```

每个**概念**一个文件，而不是每个 issue 一个文件。多个请求同一件事的 issues 归入同一个文件。

## 文件格式

文件应该用轻松、可读的风格编写，更像短 design document，而不是 database entry。使用段落、code samples 和 examples，让第一次看到它的人也能理解理由。

```markdown
# Dark Mode

This project does not support dark mode or user-facing theming.

## Why this is out of scope

The rendering pipeline assumes a single color palette defined in
`ThemeConfig`. Supporting multiple themes would require:

- A theme context provider wrapping the entire component tree
- Per-component theme-aware style resolution
- A persistence layer for user theme preferences

This is a significant architectural change that doesn't align with the
project's focus on content authoring. Theming is a concern for downstream
consumers who embed or redistribute the output.

```ts
// The current ThemeConfig interface is not designed for runtime switching:
interface ThemeConfig {
  colors: ColorPalette; // single palette, resolved at build time
  fonts: FontStack;
}
```

## Prior requests

- #42: "Add dark mode support"
- #87: "Night theme for accessibility"
- #134: "Dark theme option"
```

### 命名文件

为概念使用简短、描述性的 kebab-case 名称：`dark-mode.md`、`plugin-system.md`、`graphql-api.md`。文件名应该足够清晰，让浏览目录的人不用打开文件也能知道被拒绝的是什么。

### 撰写理由

理由应该有实质内容，不是“we don't want this”，而是为什么。好的理由会引用：

- Project scope or philosophy（“This project focuses on X; theming is a downstream concern”）
- Technical constraints（“Supporting this would require Y, which conflicts with our Z architecture”）
- Strategic decisions（“We chose to use A instead of B because...”）

理由应该持久。避免引用临时情况（“we're too busy right now”）；那不是真正拒绝，而是延期。

## 何时检查 `.out-of-scope/`

在 triage 期间（Step 1: Gather context），读取 `.out-of-scope/` 中的所有文件。评估新 issue 时：

- 检查请求是否匹配现有 out-of-scope concept
- 匹配依据是 concept similarity，不是 keyword；“night theme” 匹配 `dark-mode.md`
- 如果匹配，向 maintainer 指出：“This is similar to `.out-of-scope/dark-mode.md`. We rejected this before because [reason]. Do you still feel the same way?”

Maintainer 可能会：

- **Confirm**：新 issue 被添加到现有文件的 “Prior requests” list，然后关闭
- **Reconsider**：删除或更新 out-of-scope 文件，并让 issue 走正常 triage
- **Disagree**：issues 相关但不同，继续正常 triage

## 何时写入 `.out-of-scope/`

只有当一个 **enhancement**（不是 bug）被*拒绝*为 `wontfix` 时才写。这对 enhancement PRs 与对 issues 完全适用：被拒绝的 PR 记录在这里，这样同样的请求就不会作为新代码再次出现。

当某事因为**已经实现**而被 close 为 `wontfix` 时，**不要**写在这里。那是一个已构建的 feature，而不是被拒绝的 feature；记录它会让 dedup 检查被错误拒绝污染。相反，closing comment 应指向该 feature 已经存在的位置。

流程：

1. Maintainer 决定某个 feature request 不在范围内
2. 检查是否已有匹配的 `.out-of-scope/` 文件
3. 如果有：把新 issue 追加到 “Prior requests” list
4. 如果没有：用 concept name、decision、reason 和第一个 prior request 创建新文件
5. 在 issue 上发布 comment，解释决策并提到 `.out-of-scope/` 文件
6. 使用 `wontfix` label 关闭 issue

## 更新或删除 out-of-scope 文件

如果 maintainer 改变了对既往拒绝 concept 的看法：

- 删除 `.out-of-scope/` 文件
- Skill 不需要重新打开旧 issues；它们是历史记录
- 触发重新考虑的新 issue 继续正常 triage
