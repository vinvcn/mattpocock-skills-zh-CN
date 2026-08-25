---
name: domain-modeling
description: 构建并打磨项目的领域模型。适用于讨论 codebase 术语、编写或编辑 CONTEXT.md，或记录或编辑 ADR。
---

# Domain Modeling

在设计过程中主动构建并打磨项目的 domain model。这是 *active* discipline：挑战术语、发明 edge-case scenarios，并在概念成形的当下写入 glossary 和 decisions。

## File structure

多数 repos 只有一个 context：

```text
/
|- CONTEXT.md
|- docs/
|  `- adr/
|     |- 0001-event-sourced-orders.md
|     `- 0002-postgres-for-write-model.md
`- src/
```

如果 root 有 `CONTEXT-MAP.md`，说明 repo 有多个 contexts。map 指向每个 context 的位置：

```text
/
|- CONTEXT-MAP.md
|- docs/
|  `- adr/                          -> system-wide decisions
`- src/
   |- ordering/
   |  |- CONTEXT.md
   |  `- docs/adr/                  -> context-specific decisions
   `- billing/
      |- CONTEXT.md
      `- docs/adr/
```

按需懒创建文件：只有在有内容要写时才创建。如果没有 `CONTEXT.md`，当第一个 term 被解决时创建它。如果没有 `docs/adr/`，当第一个 ADR 需要出现时创建它。

## During the session

### Challenge against the glossary

当用户使用的术语与 `CONTEXT.md` 中既有语言冲突时，立即指出。"Your glossary defines 'cancellation' as X, but you seem to mean Y - which is it?"

### Sharpen fuzzy language

当用户使用模糊或过载术语时，提出一个精确的 canonical term。"You're saying 'account' - do you mean the Customer or the User? Those are different things."

### Discuss concrete scenarios

讨论 domain relationships 时，用具体场景做压力测试。发明能探测 edge cases 的场景，迫使用户精确定义概念之间的 boundaries。

### Cross-reference with code

当用户描述某事如何工作时，检查代码是否同意。如果发现矛盾，要指出："Your code cancels entire Orders, but you just said partial cancellation is possible - which is right?"

### Update CONTEXT.md inline

当一个 term 被解决时，立刻更新 `CONTEXT.md`。不要批量攒到最后；随着概念出现就捕获。使用 [CONTEXT-FORMAT.md](./CONTEXT-FORMAT.md) 中的格式。

`CONTEXT.md` 必须完全不包含 implementation details。不要把 `CONTEXT.md` 当 spec、scratch pad 或 implementation decisions 的仓库。它只是一份 glossary。

### Offer ADRs sparingly

只有以下三项都成立时，才提出创建 ADR：

1. **Hard to reverse** - 之后改变主意的成本有意义
2. **Surprising without context** - 未来读者会疑惑 "why did they do it this way?"
3. **The result of a real trade-off** - 确实存在替代方案，而你基于具体理由选择了其中一个

缺少任一项就跳过 ADR。使用 [ADR-FORMAT.md](./ADR-FORMAT.md) 中的格式。
