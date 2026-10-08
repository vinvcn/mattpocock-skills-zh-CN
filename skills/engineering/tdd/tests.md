# 好测试与坏测试

## 好测试

**Integration-style**：通过真实 interfaces 测试，而不是 mock internal parts。

```typescript
// GOOD: Tests observable behavior
test("user can checkout with valid cart", async () => {
  const cart = createCart();
  cart.add(product);
  const result = await checkout(cart, paymentMethod);
  expect(result.status).toBe("confirmed");
});
```

Characteristics：

- 测试 users/callers 关心的 behavior
- 只使用 public API
- 能承受 internal refactors
- 描述 WHAT，而不是 HOW
- 每个 test 一个 logical assertion

## 坏测试

**Implementation-detail tests**：与 internal structure 耦合。

```typescript
// BAD: Tests implementation details
test("checkout calls paymentService.process", async () => {
  const mockPayment = jest.mock(paymentService);
  await checkout(cart, payment);
  expect(mockPayment.process).toHaveBeenCalledWith(cart.total);
});
```

Red flags：

- Mocking internal collaborators
- Testing private methods
- Asserting on call counts/order
- Refactor 但 behavior 未变时 test breaks
- Test name 描述 HOW 而不是 WHAT
- 绕过 interface 用外部方式验证

```typescript
// BAD: Bypasses interface to verify
test("createUser saves to database", async () => {
  await createUser({ name: "Alice" });
  const row = await db.query("SELECT * FROM users WHERE name = ?", ["Alice"]);
  expect(row).toBeDefined();
});

// GOOD: Verifies through interface
test("createUser makes user retrievable", async () => {
  const user = await createUser({ name: "Alice" });
  const retrieved = await getUser(user.id);
  expect(retrieved.name).toBe("Alice");
});
```

**Tautological tests**：expected value 复述了 implementation，因此 test 天然通过。

```typescript
// BAD: Expected value is recomputed the way the code computes it
test("calculateTotal sums line items", () => {
  const items = [{ price: 10 }, { price: 5 }];
  const expected = items.reduce((sum, i) => sum + i.price, 0);
  expect(calculateTotal(items)).toBe(expected);
});

// GOOD: Expected value is an independent, known literal
test("calculateTotal sums line items", () => {
  expect(calculateTotal([{ price: 10 }, { price: 5 }])).toBe(15);
});
```
