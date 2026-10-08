# 何时使用 Mock

只在 **system boundaries** mock：

- External APIs（payment、email 等）
- Databases（有时可以；优先 test DB）
- Time/randomness
- File system（有时）

不要 mock：

- 你自己的 classes/modules
- Internal collaborators
- 任何你控制的东西

## 为可 Mock 性而设计

在 system boundaries 处，设计容易 mock 的 interfaces：

**1. Use dependency injection**

传入 external dependencies，而不是在内部创建：

```typescript
// Easy to mock
function processPayment(order, paymentClient) {
  return paymentClient.charge(order.total);
}

// Hard to mock
function processPayment(order) {
  const client = new StripeClient(process.env.STRIPE_KEY);
  return client.charge(order.total);
}
```

**2. Prefer SDK-style interfaces over generic fetchers**

为每个 external operation 创建具体 function，而不是一个带 conditional logic 的泛用 function：

```typescript
// GOOD: Each function is independently mockable
const api = {
  getUser: (id) => fetch(`/users/${id}`),
  getOrders: (userId) => fetch(`/users/${userId}/orders`),
  createOrder: (data) => fetch('/orders', { method: 'POST', body: data }),
};

// BAD: Mocking requires conditional logic inside the mock
const api = {
  fetch: (endpoint, options) => fetch(endpoint, options),
};
```

SDK approach 意味着：

- 每个 mock 返回一个具体 shape
- Test setup 中不需要 conditional logic
- 更容易看出 test 触发了哪些 endpoints
- 每个 endpoint 都有 type safety
