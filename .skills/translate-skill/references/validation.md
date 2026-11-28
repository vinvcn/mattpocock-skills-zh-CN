# 验证（8 项 + 人工判定 + 输出）

每次上游内容刷新后，必须完成并记录下列检查。结果写进顶层 `README.md` 的简短 checklist，不要把完整命令输出粘进去。

## 机器检查

1. `node scripts/check-translation.mjs`
   确认 Markdown 结构、frontmatter、README install path、license invariant 未被破坏。
2. `git diff --check` 与 `git diff --cached --check`
   无 whitespace / patch hygiene 问题。
3. `node scripts/audit-english.mjs`
   只作**人工复核队列**，因为本仓库会列出大量合理的英文术语、命令、示例与 identifiers，**不是失败门槛**。

## 结构与索引

4. 公开 skill 索引一致性：
   `engineering/`、`productivity/`、`misc/` 下的 skill 必须同时出现在顶层 `README.md` 和 `.claude-plugin/plugin.json`；
   `personal/`、`in-progress/`、`deprecated/` 不应出现在 plugin 或顶层公开索引中。
5. 对比 `upstream/main` 的 in-scope 文件清单：无缺失上游文件；也没有保留「已从上游移除且不属于本地策略」的 stale files。

## 不变量

6. 共同 Markdown 文件的行为关键内容：
   frontmatter keys 与 `name` 值不变；fenced code blocks 平衡；路径、命令、URL、identifier 未被误改。
7. 扫描 stale install path 与旧路径：仍指向上游 repo 的安装命令、旧中文仓库短路径、已移除的 triage skill 名、已移除的 domain-model 相对路径等。
8. `SYNC.md` 同步记录：指向最新 upstream short SHA，并包含本地同步 commit；不得留「待定」占位。

## 判定口径

```text
PASS：1)2) 无输出且退出码 0；4)5)6)7)8) 人工核对全部通过；3) 的命中逐条有结论
复核：3) 里无法判断的条目、以及任何被打标记的歧义转换
FAIL：1)2) 任一出错，或 4)~8) 任一项不满足
```

## 复核输出格式

```text
改动文件 / 已翻译文件 / 复制或保留文件 / 移除或过时文件 / 复核标记
SYNC.md 同步记录
验证结果
不变量检查：
- 安装命令指向 vinvcn/mattpocock-skills-zh-CN
- 代码块保持原样
- frontmatter keys 保持原样
- 路径和 identifiers 保持原样
- Markdown 结构保持原样
```
