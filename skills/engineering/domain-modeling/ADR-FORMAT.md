# ADR 格式

ADRs 位于 `docs/adr/`，使用连续编号：`0001-slug.md`、`0002-slug.md` 等。

按需懒创建 `docs/adr/` 目录：只有第一个 ADR 需要出现时才创建。

## 模板

```md
# {Short title of the decision}

{1-3 sentences: what's the context, what did we decide, and why.}
```

就这些。ADR 可以只有一个段落。价值在于记录 *做出了某个决定* 以及 *为什么*，而不是填满章节。

## 可选章节

只有在真正增加价值时才包含这些。多数 ADRs 不需要。

- **Status** frontmatter（`proposed | accepted | deprecated | superseded by ADR-NNNN`）- 当 decisions 会被重新审视时有用
- **Considered Options** - 只有被拒绝的 alternatives 值得记住时才写
- **Consequences** - 只有需要指出非显而易见的下游影响时才写

## 编号

扫描 `docs/adr/` 中已有的最高编号并递增一。

## 何时提议 ADR

以下三项必须全部成立：

1. **Hard to reverse** - 之后改变主意的成本有意义
2. **Surprising without context** - 未来读者看到代码会疑惑 "why on earth did they do it this way?"
3. **The result of a real trade-off** - 确实存在替代方案，而你基于具体理由选择了其中一个

如果决定很容易反转，就跳过；你会直接反转它。如果它不意外，就没人会问为什么。如果没有真正 alternative，就没有超过 "we did the obvious thing" 的内容可记录。

### 符合条件的情形

- **Architectural shape.** "We're using a monorepo." "The write model is event-sourced, the read model is projected into Postgres."
- **Integration patterns between contexts.** "Ordering and Billing communicate via domain events, not synchronous HTTP."
- **Technology choices that carry lock-in.** Database、message bus、auth provider、deployment target。不是每个 library，只有那些替换要花一个季度的。
- **Boundary and scope decisions.** "Customer data is owned by the Customer context; other contexts reference it by ID only." 明确的 no 和 yes 一样有价值。
- **Deliberate deviations from the obvious path.** "We're using manual SQL instead of an ORM because X." 任何合理读者会默认相反方案的地方，都值得记录，避免下一个 engineer 把 deliberate choice "修掉"。
- **Constraints not visible in the code.** "We can't use AWS because of compliance requirements." "Response times must be under 200ms because of the partner API contract."
- **Rejected alternatives when the rejection is non-obvious.** 如果你考虑过 GraphQL，却因为微妙原因选择 REST，就记录；否则六个月后还会有人再提 GraphQL。
