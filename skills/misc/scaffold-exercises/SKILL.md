---
name: scaffold-exercises
description: 创建包含章节、题目、答案和讲解的练习目录结构，并确保通过 linting。适用于用户想 scaffold exercises、创建 exercise stubs，或设置新的课程章节时。
---

# 搭建练习

创建能通过 `pnpm ai-hero-cli internal lint` 的 exercise directory structures，然后用 `git commit` 提交。

## 目录命名

- **Sections**：`exercises/` 下的 `XX-section-name/`（例如 `01-retrieval-skill-building`）
- **Exercises**：section 下的 `XX.YY-exercise-name/`（例如 `01.03-retrieval-with-bm25`）
- Section number = `XX`，exercise number = `XX.YY`
- Names 使用 dash-case（小写、连字符）

## Exercise 变体

每个 exercise 至少需要这些 subfolders 中的一个：

- `problem/` - student workspace，包含 TODOs
- `solution/` - reference implementation
- `explainer/` - conceptual material，不含 TODOs

创建 stub 时，除非 plan 指定其他 variant，否则默认使用 `explainer/`。

## 必需文件

每个 subfolder（`problem/`、`solution/`、`explainer/`）都需要一个 `readme.md`，要求：

- **非空**（必须有真实内容，即使只有一行 title 也可以）
- 没有 broken links

创建 stub 时，生成带 title 和 description 的最小 readme：

```md
# Exercise Title

Description here
```

如果 subfolder 有 code，还需要 `main.ts`（>1 行）。但对 stubs 来说，readme-only exercise 可以接受。

## 工作流

1. **Parse the plan** - 提取 section names、exercise names 和 variant types
2. **Create directories** - 对每个 path 执行 `mkdir -p`
3. **Create stub readmes** - 每个 variant folder 一个带 title 的 `readme.md`
4. **Run lint** - 执行 `pnpm ai-hero-cli internal lint` 验证
5. **Fix any errors** - 迭代直到 lint 通过

## Lint 规则摘要

linter（`pnpm ai-hero-cli internal lint`）检查：

- 每个 exercise 有 subfolders（`problem/`、`solution/`、`explainer/`）
- 至少存在 `problem/`、`explainer/` 或 `explainer.1/` 之一
- primary subfolder 中存在非空 `readme.md`
- 没有 `.gitkeep` files
- 没有 `speaker-notes.md` files
- readmes 中没有 broken links
- readmes 中没有 `pnpm run exercise` commands
- 除非是 readme-only，否则每个 subfolder 都需要 `main.ts`

## 移动/重命名 exercises

重新编号或移动 exercises 时：

1. 使用 `git mv`（不是 `mv`）重命名 directories，保留 git history
2. 更新 numeric prefix 以维持顺序
3. 移动后重新运行 lint

Example:

```bash
git mv exercises/01-retrieval/01.03-embeddings exercises/01-retrieval/01.04-embeddings
```

## 示例：从 plan 生成 stubs

给定这样的 plan：

```
Section 05: Memory Skill Building
- 05.01 Introduction to Memory
- 05.02 Short-term Memory (explainer + problem + solution)
- 05.03 Long-term Memory
```

创建：

```bash
mkdir -p exercises/05-memory-skill-building/05.01-introduction-to-memory/explainer
mkdir -p exercises/05-memory-skill-building/05.02-short-term-memory/{explainer,problem,solution}
mkdir -p exercises/05-memory-skill-building/05.03-long-term-memory/explainer
```

然后创建 readme stubs：

```
exercises/05-memory-skill-building/05.01-introduction-to-memory/explainer/readme.md -> "# Introduction to Memory"
exercises/05-memory-skill-building/05.02-short-term-memory/explainer/readme.md -> "# Short-term Memory"
exercises/05-memory-skill-building/05.02-short-term-memory/problem/readme.md -> "# Short-term Memory"
exercises/05-memory-skill-building/05.02-short-term-memory/solution/readme.md -> "# Short-term Memory"
exercises/05-memory-skill-building/05.03-long-term-memory/explainer/readme.md -> "# Long-term Memory"
```
