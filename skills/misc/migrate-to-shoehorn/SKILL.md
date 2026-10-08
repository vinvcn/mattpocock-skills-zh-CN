---
name: migrate-to-shoehorn
description: 将测试文件从 `as` 类型断言迁移到 @total-typescript/shoehorn。适用于用户提到 shoehorn、想替换测试中的 `as`，或需要局部测试数据时。
---

# 迁移到 Shoehorn

## 为什么用 shoehorn？

`shoehorn` 允许你在 tests 中传入 partial data，同时保持 TypeScript 满意。它用 type-safe alternatives 替换 `as` assertions。

**只用于 test code。** 永远不要在 production code 中使用 shoehorn。

Tests 中 `as` 的问题：

- 经过训练，不去使用它
- 必须手动指定 target type
- 对故意错误的数据需要 double-as（`as unknown as Type`）

## 安装

```bash
npm i @total-typescript/shoehorn
```

## 迁移模式

### 只需要少数属性的大型 objects

Before:

```ts
type Request = {
  body: { id: string };
  headers: Record<string, string>;
  cookies: Record<string, string>;
  // ...20 more properties
};

it("gets user by id", () => {
  // Only care about body.id but must fake entire Request
  getUser({
    body: { id: "123" },
    headers: {},
    cookies: {},
    // ...fake all 20 properties
  });
});
```

After:

```ts
import { fromPartial } from "@total-typescript/shoehorn";

it("gets user by id", () => {
  getUser(
    fromPartial({
      body: { id: "123" },
    }),
  );
});
```

### `as Type` → `fromPartial()`

Before:

```ts
getUser({ body: { id: "123" } } as Request);
```

After:

```ts
import { fromPartial } from "@total-typescript/shoehorn";

getUser(fromPartial({ body: { id: "123" } }));
```

### `as unknown as Type` → `fromAny()`

Before:

```ts
getUser({ body: { id: 123 } } as unknown as Request); // wrong type on purpose
```

After:

```ts
import { fromAny } from "@total-typescript/shoehorn";

getUser(fromAny({ body: { id: 123 } }));
```

## 何时使用哪一个

| Function        | Use case                                           |
| --------------- | -------------------------------------------------- |
| `fromPartial()` | 传入仍能 type-check 的 partial data                |
| `fromAny()`     | 传入故意错误的数据（保留 autocomplete）             |
| `fromExact()`   | 强制 full object（之后可换成 fromPartial）          |

## 工作流

1. **Gather requirements** - 询问用户：
   - 哪些 test files 中的 `as` assertions 造成问题？
   - 是否在处理大型 objects，但只关心部分 properties？
   - 是否需要传入故意错误的数据来测试 error paths？

2. **Install and migrate**：
   - [ ] Install: `npm i @total-typescript/shoehorn`
   - [ ] 查找 test files 中的 `as` assertions: `grep -r " as [A-Z]" --include="*.test.ts" --include="*.spec.ts"`
   - [ ] 用 `fromPartial()` 替换 `as Type`
   - [ ] 用 `fromAny()` 替换 `as unknown as Type`
   - [ ] 添加来自 `@total-typescript/shoehorn` 的 imports
   - [ ] 运行 type check 验证
