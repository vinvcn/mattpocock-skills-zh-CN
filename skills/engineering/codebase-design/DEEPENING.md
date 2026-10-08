# 深化

在已知 dependencies 的情况下，安全地深化一组 shallow modules。本文件假设你已经使用 [SKILL.md](SKILL.md) 中的词汇：**module**、**interface**、**seam**、**adapter**。

## Dependency 分类

评估 deepening candidate 时，先分类它的 dependencies。分类决定 deepened module 如何跨 seam 测试。

### 1. 进程内

纯计算、内存状态、无 I/O。总是可以 deepen：合并 modules，并直接通过新的 interface 测试。不需要 adapter。

### 2. 本地可替换

有本地 test stand-ins 的 dependencies（例如 Postgres 的 PGLite、in-memory filesystem）。如果 stand-in 存在，就可以 deepen。Deepened module 在 test suite 中带着 stand-in 一起测试。seam 是 internal 的；module external interface 上不需要 port。

### 3. 远程但自有（Ports & Adapters）

你拥有的跨网络服务（microservices、internal APIs）。在 seam 上定义 **port**（interface）。Deep module 拥有 logic；transport 作为 **adapter** 注入。Tests 使用 in-memory adapter。Production 使用 HTTP/gRPC/queue adapter。

推荐形状：*"Define a port at the seam, implement an HTTP adapter for production and an in-memory adapter for testing, so the logic sits in one deep module even though it's deployed across a network."*

### 4. 真正的外部（Mock）

你无法控制的第三方服务（Stripe、Twilio 等）。Deepened module 把外部 dependency 作为 injected port；tests 提供 mock adapter。

## Seam 纪律

- **One adapter means a hypothetical seam. Two adapters means a real one.** 除非至少有两个 adapters 合理存在（通常是 production + test），否则不要引入 port。单 adapter seam 只是 indirection。
- **Internal seams vs external seams。** Deep module 可以有 internal seams（implementation 私有，供自身 tests 使用），也可以有 interface 上的 external seam。不要只因为 tests 使用 internal seams，就把它们暴露到 interface。

## 测试策略：替换，而不是叠加

- 一旦 deepened module interface 上有了 tests，旧的 shallow modules unit tests 就变成 waste，删除它们。
- 在 deepened module 的 interface 上写新 tests。**Interface is the test surface**。
- Tests 通过 interface 断言 observable outcomes，而不是 internal state。
- Tests 应能承受 internal refactors；它们描述 behavior，不描述 implementation。若 implementation 改动会迫使 test 改动，那就是在越过 interface 测试。
