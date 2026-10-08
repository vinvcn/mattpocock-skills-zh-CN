---
name: setup-pre-commit
description: 在当前仓库设置 Husky pre-commit hooks，集成 lint-staged (Prettier)、类型检查和测试。适用于用户想添加 pre-commit hooks、设置 Husky、配置 lint-staged，或在提交时运行格式化、类型检查和测试时。
---

# 设置 Pre-Commit Hooks

## 这会配置什么

- **Husky** pre-commit hook
- **lint-staged** 对所有 staged files 运行 Prettier
- **Prettier** config（如果缺失）
- pre-commit hook 中的 **typecheck** 和 **test** scripts

## 步骤

### 1. 检测 package manager

检查 `package-lock.json` (npm)、`pnpm-lock.yaml` (pnpm)、`yarn.lock` (yarn)、`bun.lockb` (bun)。使用存在的那个。不清楚时默认 npm。

### 2. 安装依赖

作为 devDependencies 安装：

```
husky lint-staged prettier
```

### 3. 初始化 Husky

```bash
npx husky init
```

这会创建 `.husky/` dir，并向 package.json 添加 `prepare: "husky"`。

### 4. 创建 `.husky/pre-commit`

写入这个文件（Husky v9+ 不需要 shebang）：

```
npx lint-staged
npm run typecheck
npm run test
```

**Adapt**：把 `npm` 替换为检测到的 package manager。如果 repo 的 package.json 没有 `typecheck` 或 `test` script，就省略对应行并告知用户。

### 5. 创建 `.lintstagedrc`

```json
{
  "*": "prettier --ignore-unknown --write"
}
```

### 6. 创建 `.prettierrc`（如果缺失）

只有没有 Prettier config 时才创建。使用这些 defaults：

```json
{
  "useTabs": false,
  "tabWidth": 2,
  "printWidth": 80,
  "singleQuote": false,
  "trailingComma": "es5",
  "semi": true,
  "arrowParens": "always"
}
```

### 7. 验证

- [ ] `.husky/pre-commit` 存在且可执行
- [ ] `.lintstagedrc` 存在
- [ ] package.json 中的 `prepare` script 是 `"husky"`
- [ ] prettier config 存在
- [ ] 运行 `npx lint-staged` 验证可用

### 8. 提交

Stage 所有 changed/created files，并用 message 提交：`Add pre-commit hooks (husky + lint-staged + prettier)`

这会经过新的 pre-commit hooks，是一个不错的 smoke test。

## 备注

- Husky v9+ 不需要 hook files 中的 shebangs
- `prettier --ignore-unknown` 会跳过 Prettier 无法 parse 的 files（images 等）
- pre-commit 先运行 lint-staged（快，只针对 staged files），再运行完整 typecheck 和 tests
