# UI 原型

在单一路由上生成**几种差异很大的 UI variations**，并通过浮动底栏切换。用户在浏览器里来回切换 variants，选中一个（或从每个里面偷一部分），然后把其余部分丢掉。

如果问题是 logic/state，而不是东西应该长什么样，这是错误分支。使用 [LOGIC.md](LOGIC.md)。

## 何时适合这个形状

- "What should this page look like?"
- "I want to see a few options for this dashboard before committing."
- "Try a different layout for the settings screen."
- 任何用户原本要花一天在脑子里比较三个模糊 mockups 的情况。

## 两种 sub-shape：强烈优先 sub-shape A

当 UI prototype **贴着应用其他部分运行**时会更容易判断：真实 header、真实 sidebar、真实 data、真实 density。一个独立的 throwaway route 是真空环境；每个 variant 单看都还行。只要有合理的现有页面可以承载 variants，默认选择 sub-shape A。只有 prototype 确实没有附近归宿时，才使用 sub-shape B。

### Sub-shape A：调整现有页面（首选）

路由已经存在。Variants 渲染在**同一路由**上，通过 `?variant=` URL search param gate。现有 data fetching、params、auth 都保留；只替换 rendering。这是默认选择，除非有明确理由不用。

如果 prototype 的东西还没有页面，但*自然会存在于某个页面内部*（dashboard 新 section、settings screen 新 card、现有 flow 的新 step），仍然算 sub-shape A。把 variants mount 到 host page 内。

### Sub-shape B：一个新页面（最后手段）

只有被 prototype 的东西确实没有现有页面可放时才用，例如全新的顶层 surface，或无法合理嵌入任何地方的 flow。

按照项目现有 routing convention 创建一个 **throwaway route**；不要发明新的顶层结构。命名要明显是 prototype（例如在 path 或 filename 中包含 `prototype`）。同样使用 `?variant=` pattern。

在决定 sub-shape B 前 sanity-check：真的没有现有页面可以嵌入吗？空路由会隐藏 populated page 才能暴露的 design problems。

两种 sub-shapes 都使用相同的浮动底栏。

## 流程

### 1. 陈述问题并选定 N

默认做 **3 variants**。超过 5 个就不再是 radically different，而是 noise；最多 5 个。

在 prototype 所在位置或文件顶部 comment 写一行计划：

> "Three variants of the settings page, switchable via `?variant=`, on the existing `/settings` route."

无论用户是否在旁边反馈，这都有效。

### 2. 生成截然不同的 variants

起草每个 variant，并要求它们满足：

- 符合页面目的和可访问数据。
- 符合项目 component library / styling system（TailwindCSS、shadcn、MUI、plain CSS 等）。
- 有清晰 exported component name，例如 `VariantA`、`VariantB`、`VariantC`。

Variants 必须**结构不同**：不同 layout、不同 information hierarchy、不同 primary affordance，而不只是颜色不同。三个稍微调过的 card grids 不是 UI prototype，是 wallpaper。如果两个 drafts 太像，明确要求 “do not use a card grid” 后重做其中一个。

### 3. 把它们串联起来

在路由上创建一个 switcher component：

```tsx
// pseudo-code, adapt to the project's framework
const variant = searchParams.get('variant') ?? 'A';
return (
  <>
    {variant === 'A' && <VariantA {...data} />}
    {variant === 'B' && <VariantB {...data} />}
    {variant === 'C' && <VariantC {...data} />}
    <PrototypeSwitcher variants={['A','B','C']} current={variant} />
  </>
);
```

对 sub-shape A（existing page）：保留 switcher 上方所有 existing data fetching；只有 rendered subtree 随 variant 改变。

对 sub-shape B（new page）：`/prototype/<name>` 下的 throwaway route mount 同一个 switcher。

### 4. 构建浮动 switcher

屏幕底部居中的 fixed-position 小 bar，包含三部分：

- **Left arrow**：切到上一个 variant（循环）。
- **Variant label**：显示当前 variant key；如果 variant export 了 name，也一起显示。例如 `B (Sidebar layout)`。
- **Right arrow**：切到下一个 variant（循环）。

Behaviour：

- 点击 arrow 更新 URL search param（使用 framework router：Next 用 `router.replace`，React Router 用 `navigate` 等），让 variant 可分享且 reload-stable。
- Keyboard：`←` 和 `→` arrow keys 也能切换。当 focus 在 `<input>`、`<textarea>` 或 `[contenteditable]` 内时不要拦截 arrow keys。
- 视觉上要和页面区分开（例如 high-contrast pill、subtle shadow），让它明显不是被评估设计的一部分。
- 在 production builds 中隐藏；用 `process.env.NODE_ENV !== 'production'` 或等价检查 gate，避免 stray prototype merge 把 bar 发给用户。

把 switcher 放进单个 shared component，让两种 sub-shapes 都能复用。放在项目 shared UI 所在位置。

### 5. 交给对方

给出 URL（以及 `?variant=` keys）。用户会在方便时切换。最有价值的反馈通常是 **"I want the header from B with the sidebar from C"**，那才是他们真正想要的设计。

### 6. 捕获答案并清理

一旦某个 variant 胜出，capture answer（哪个胜出以及为什么），再按 [SKILL](SKILL.md) 描述的方式 capture prototype。把 winner 折进真实 code，其余内容移到 throwaway branch，不要进入 main：

- **Sub-shape A**：把 winner 折进 existing page；从 main 中移除 losing variants 和 switcher。
- **Sub-shape B**：把 winning variant 提升为 real route；从 main 中移除 throwaway route 和 switcher。

完整 variants 集合是 primary source，应进入 throwaway branch，而不是垃圾桶；留在 main branch 的 variant components 和 switcher 会迅速腐烂并误导下一位读者。

## 反模式

- **Variants 只在颜色或文案上不同。** 那是 tweak，不是 prototype。真正的 variants 会在结构上互相不同意。
- **Variants 之间共享太多代码。** 共享 `<Header>` 可以；共享 `<Layout>` 会破坏目的。每个 variant 都应该可以扔掉 layout。
- **把 variants 接到真实 mutations。** Read-only prototypes 没问题。如果某个 variant 需要 mutate，指向 stub；问题是 “what should this look like”，不是 “does the backend work”。
- **直接把 prototype 提升到 production。** Variant code 是在 prototype constraints 下写的（无 tests、最少 error handling）。折进真实实现时要重新正确实现。
