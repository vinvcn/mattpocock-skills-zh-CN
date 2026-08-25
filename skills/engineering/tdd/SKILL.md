---
name: tdd
description: 测试驱动开发。适用于用户想用先写测试的方式构建功能或修复缺陷、提到 “red-green-refactor”，或需要集成测试时。
---

# Test-Driven Development

TDD 是 red -> green loop。这个 skill 是让该 loop 产出值得保留的 tests 的 reference：什么是好 test、tests 应该放在哪里、anti-patterns，以及 loop 的规则。每个 cycle 前和 cycle 中都要参考这些内容，而不是事后才看。

探索 codebase 时，读取 `CONTEXT.md`（如果存在），让 test names 和 interface vocabulary 与项目 domain language 对齐，并尊重你触碰区域的 ADRs。

## What a good test is

Tests 应通过 public interfaces 验证 behavior，而不是 implementation details。代码可以完全改变；tests 不该随之改变。一个好 test 读起来像 specification："user can checkout with valid cart" 能清楚说明存在什么能力；因为它不关心 internal structure，所以能承受 refactors。

示例见 [tests.md](tests.md)，mocking 规则见 [mocking.md](mocking.md)。

## Seams — where tests go

**Seam** 是你测试的 public boundary：可以观察 behavior、但不伸手进入内部的 interface。Tests 放在 seams 上，绝不针对 internals。

**只测试预先认可的 seams。** 写任何 test 前，先写下要测试的 seams 并与用户确认。未经确认的 seam 不写 test。你无法测试所有东西；提前认可 seams，才能把测试精力放在 critical paths 和复杂 logic 上，而不是每个 edge case。

询问："What's the public interface, and which seams should we test?"

当 interface 的形状本身就是问题所在时——module 该多深、seam 该放在哪里、interface 应该暴露什么——调用 Skill 工具并指定 `codebase-design` 获取词汇。它是 module、interface、depth、seam、adapter、leverage 和 locality 这些术语的共享来源，是供查阅的 reference，而不是要运行的 session。

## Anti-patterns

- **Implementation-coupled** — mock internal collaborators、测试 private methods，或通过 side channel 验证（例如不用 interface 而直接查询 database）。特征是 refactor 时 test 失败，但 behavior 没变。
- **Tautological** — assertion 以和代码相同的方式重新计算 expected value（`expect(add(a, b)).toBe(a + b)`、手工按同一逻辑生成 snapshot、把 constant 断言等于它自己），因此天然 pass，永远无法与代码 disagree。Expected values 必须来自独立 source of truth：known-good literal、worked example 或 spec。
- **Horizontal slicing** — 先写所有 tests，再写所有 implementation。批量 tests 验证的是 _想象中的_ behavior：你测试的是东西的 _shape_，不是 user-facing behavior；tests 会对真实变化迟钝，并在理解 implementation 前承诺 test structure。改用 **vertical slices**：一个 test -> 一个 implementation -> repeat，每个 test 都是回应上一轮学习的 **tracer bullet**。

## Rules of the loop

- **Red before green.** 先写 failing test，再只写足够让它通过的代码。不要预判未来 tests，也不要添加 speculative features。
- **One slice at a time.** 每个 cycle 只处理一个 seam、一个 test、一个 minimal implementation。
- **Refactoring is not part of the loop.** Refactoring 属于 review stage（见 `code-review` skill），不属于 red -> green implementation cycle。
