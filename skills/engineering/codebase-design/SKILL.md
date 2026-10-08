---
name: codebase-design
description: 用于设计深模块的共享词汇。适用于用户想设计或改进模块接口、寻找深化机会、决定 seam 放在哪里、让代码更容易测试或更适合 AI 导航，或其他技能需要深模块词汇时。
---

# 代码库设计

设计 **deep modules**：把大量行为放在小 interface 之后，把 interface 放在清晰 seam 上，并通过该 interface 测试。凡是在设计或重构代码时，都使用这套语言和原则。目标是给 callers 带来 leverage，给 maintainers 带来 locality，并让每个人都更容易测试。

## 术语表

准确使用这些术语，不要替换成 "component"、"service"、"API" 或 "boundary"。一致语言就是重点。

**Module** - 任何拥有 interface 和 implementation 的东西。它故意不限定尺度：function、class、package，或跨层 slice 都可以。_Avoid_: unit, component, service.

**Interface** - caller 为了正确使用 module 必须知道的一切：type signature，以及 invariants、ordering constraints、error modes、required configuration 和 performance characteristics。_Avoid_: API, signature（太窄，只指 type-level surface）。

**Implementation** - module 内部的代码体。它不同于 **Adapter**：一个东西可以是小 adapter 但有大 implementation（Postgres repo），也可以是大 adapter 但 implementation 很小（in-memory fake）。讨论 seam 时说 adapter；其他时候说 implementation。

**Depth** - interface 上的 leverage：caller（或 test）每学习一单位 interface，就能触达多少行为。大量行为藏在小 interface 后面时，module 是 **deep**；interface 几乎和 implementation 一样复杂时，module 是 **shallow**。

**Seam**（Michael Feathers）- 你可以在不编辑当前位置的情况下改变行为的地方；也就是 module 的 interface 所在的 *location*。seam 放在哪里是独立设计决策，不同于 seam 后面放什么。_Avoid_: boundary（它和 DDD bounded context 过载）。

**Adapter** - 在 seam 上满足某个 interface 的具体东西。描述的是 *role*（填哪个槽位），不是 substance（内部是什么）。

**Leverage** - callers 从 depth 获得的收益：每学习一单位 interface，就得到更多能力。一个 implementation 会在 N 个 call sites 和 M 个 tests 中回本。

**Locality** - maintainers 从 depth 获得的收益：change、bugs、knowledge 和 verification 集中在一个地方，而不是散到 callers 里。修一次，到处都修好。

## Deep 与 shallow

**Deep module** = small interface + lots of implementation:

```text
+------------------+
| Small Interface  | -> few methods, simple params
+------------------+
|                  |
| Deep             | -> complex logic hidden
| Implementation   |
|                  |
+------------------+
```

**Shallow module** = large interface + little implementation（避免）：

```text
+-------------------------------+
| Large Interface               | -> many methods, complex params
+-------------------------------+
| Thin Implementation           | -> mostly pass-through
+-------------------------------+
```

设计 interface 时问：

- 我能减少 methods 数量吗？
- 我能简化 parameters 吗？
- 我能把更多复杂度藏到内部吗？

## 原则

- **Depth 是 interface 的属性，不是 implementation 的属性。** Deep module 内部可以由小的、mockable、swappable parts 组成，只是它们不属于 interface。一个 module 可以同时拥有 **internal seams**（implementation 私有，供自身 tests 使用）和位于 interface 的 **external seam**。
- **Deletion test。** 想象删除这个 module。如果复杂度消失了，它只是 pass-through。如果复杂度重新散落到 N 个 callers 里，它就在发挥价值。
- **Interface is the test surface。** Callers 和 tests 穿过同一个 seam。若你想测试 interface 之后的内部细节，这个 module 形状可能不对。
- **One adapter means a hypothetical seam. Two adapters means a real one.** 除非确实有东西会跨 seam 变化，否则不要引入 seam。

## 为可测试性而设计

好的 interfaces 让测试自然发生：

1. **Accept dependencies, don't create them.**

   ```typescript
   // Testable
   function processOrder(order, paymentGateway) {}

   // Hard to test
   function processOrder(order) {
     const gateway = new StripeGateway();
   }
   ```

2. **Return results, don't produce side effects.**

   ```typescript
   // Testable
   function calculateDiscount(cart): Discount {}

   // Hard to test
   function applyDiscount(cart): void {
     cart.total -= discount;
   }
   ```

3. **Small surface area.** 更少 methods = 需要更少 tests。更少 params = 更简单的 test setup。

## 关系

- 一个 **Module** 恰好有一个 **Interface**（它呈现给 callers 和 tests 的 surface）。
- **Depth** 是 **Module** 的属性，并以其 **Interface** 衡量。
- **Seam** 是 **Module** 的 **Interface** 所在的位置。
- **Adapter** 位于 **Seam** 上，并满足 **Interface**。
- **Depth** 为 callers 产生 **Leverage**，为 maintainers 产生 **Locality**。

## 不采用的表述

- **把 depth 当作 implementation-lines 与 interface-lines 的比例**（Ousterhout）：这会奖励 padding implementation。这里使用 depth-as-leverage。
- **把 "Interface" 理解为 TypeScript `interface` keyword 或 class public methods**：太窄；这里的 interface 包括 caller 必须知道的所有事实。
- **"Boundary"**：与 DDD bounded context 过载。说 **seam** 或 **interface**。

## 进一步深化

- **Deepening a cluster given its dependencies** - 见 [DEEPENING.md](DEEPENING.md)：Dependency 分类、Seam 纪律和「替换，而不是叠加」的测试策略。
- **Exploring alternative interfaces** - 见 [DESIGN-IT-TWICE.md](DESIGN-IT-TWICE.md)：启动并行 sub-agents，用几种截然不同的方式设计 interface，再按 depth、locality 和 seam placement 比较。
