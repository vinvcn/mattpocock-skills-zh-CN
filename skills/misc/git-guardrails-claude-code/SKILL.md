---
name: git-guardrails-claude-code
description: 设置 Claude Code hooks，在危险 git commands（push、reset --hard、clean、branch -D 等）执行前阻止它们。适用于用户想防止破坏性 git 操作、添加 git safety hooks，或在 Claude Code 中阻止 git push/reset 时。
---

# 设置 Git Guardrails

设置一个 PreToolUse hook，在 Claude 执行危险 git commands 前拦截并阻止它们。

## 会被阻止的命令

- `git push`（包括 `--force` 在内的所有 variants）
- `git reset --hard`
- `git clean -f` / `git clean -fd`
- `git branch -D`
- `git checkout .` / `git restore .`

被阻止时，Claude 会看到一条 message，说明它无权访问这些 commands。

## 步骤

### 1. 询问安装范围

询问用户：只为**当前 project** 安装（`.claude/settings.json`），还是为**所有 projects** 安装（`~/.claude/settings.json`）？

### 2. 复制 hook 脚本

bundled script 位于：[scripts/block-dangerous-git.sh](scripts/block-dangerous-git.sh)

根据 scope 复制到目标位置：

- **Project**: `.claude/hooks/block-dangerous-git.sh`
- **Global**: `~/.claude/hooks/block-dangerous-git.sh`

用 `chmod +x` 让它可执行。

### 3. 把 hook 加入 settings

添加到对应 settings file：

**Project** (`.claude/settings.json`):

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/block-dangerous-git.sh"
          }
        ]
      }
    ]
  }
}
```

**Global** (`~/.claude/settings.json`):

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/block-dangerous-git.sh"
          }
        ]
      }
    ]
  }
}
```

如果 settings file 已存在，把 hook merge 到现有 `hooks.PreToolUse` array 中，不要覆盖其他 settings。

### 4. 询问是否定制

询问用户是否要在 blocked list 中添加或移除 patterns。相应编辑复制后的 script。

### 5. 验证

运行快速测试：

```bash
echo '{"tool_input":{"command":"git push origin main"}}' | <path-to-script>
```

应以 code 2 退出，并向 stderr 打印 BLOCKED message。
