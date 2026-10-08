# HTML 报告格式

Architecture review 渲染为单个 self-contained HTML file，写到 OS temp directory。Tailwind 和 Mermaid 都来自 CDNs。Mermaid 可靠处理 graph-shaped diagrams；手写 divs 和 inline SVG 更适合 editorial visuals（mass diagrams、cross-sections）。两者混用，不要所有内容都依赖 Mermaid，否则会显得 generic。

## 脚手架

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Architecture review for {{repo name}}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script type="module">
      import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";
      mermaid.initialize({ startOnLoad: true, theme: "neutral", securityLevel: "loose" });
    </script>
    <style>
      /* small custom layer for things Tailwind doesn't cover cleanly:
         dashed seam lines, hand-drawn-feeling arrow heads, etc. */
      .seam { stroke-dasharray: 4 4; }
      .leak { stroke: #dc2626; }
      .deep { background: linear-gradient(135deg, #0f172a, #1e293b); }
    </style>
  </head>
  <body class="bg-stone-50 text-slate-900 font-sans">
    <main class="max-w-5xl mx-auto px-6 py-12 space-y-12">
      <header>...</header>
      <section id="candidates" class="space-y-10">...</section>
      <section id="top-recommendation">...</section>
    </main>
  </body>
</html>
```

## 页头

Repo name、date，以及紧凑 legend：solid box = module，dashed line = seam，red arrow = leakage，thick dark box = deep module。不要 introduction paragraph，直接进入 candidates。

## 候选项卡片

Diagrams 承担主要信息量。Prose 要稀疏、直白，并自然使用 `/codebase-design` skill 中的 glossary terms。

每个 candidate 是一个 `<article>`：

- **Title** - 简短，命名 deepening（例如 "Collapse the Order intake pipeline"）。
- **Badge row** - recommendation strength（`Strong` = emerald，`Worth exploring` = amber，`Speculative` = slate），再加 dependency category tag（`in-process`、`local-substitutable`、`ports & adapters`、`mock`）。
- **Files** - monospace list，`font-mono text-sm`。
- **Before / After diagram** - 核心内容。两列并排。见下方 patterns。
- **Problem** - 一句话，说明哪里痛。
- **Solution** - 一句话，说明什么会改变。
- **Wins** - bullets，每条不超过 6 words，例如 "Tests hit one interface"、"Pricing logic stops leaking"、"Delete 4 shallow wrappers"。
- **ADR callout**（如适用）- amber-tinted box 中一行。

不要写大段解释。如果 diagram 需要一段话才能懂，就重画 diagram。

## 图表模式

选择适合 candidate 的 pattern，可以混用。不要让每个 diagram 都长得一样：多样性本身就是目的的一部分。

### Mermaid graph（dependencies / call flow 的主力）

当要表达的是 "X calls Y calls Z, and look at the mess." 时，使用 Mermaid `flowchart` 或 `graph`。把它包在 Tailwind-styled card 中，免得显得是硬塞进来的。用 `classDef` 把 leakage edges 标红，把 deep module 标深色。Sequence diagrams 适合表达 "before: 6 round-trips; after: 1"。

```html
<div class="rounded-lg border border-slate-200 bg-white p-4">
  <pre class="mermaid">
    flowchart LR
      A[OrderHandler] --> B[OrderValidator]
      B --> C[OrderRepo]
      C -.leak.-> D[PricingClient]
      classDef leak stroke:#dc2626,stroke-width:2px;
      class C,D leak
  </pre>
</div>
```

### 手绘方框与箭头（当 Mermaid 的 layout 妨碍表达时）

Modules 用带 border 和 label 的 `<div>`；arrows 用绝对定位在 relative container 上的 inline SVG `<line>` 或 `<path>`。当你希望 "after" diagram 像一个 thick-bordered 的 deep module、internals 灰显时，就用这种方式：Mermaid 无法以合适的视觉分量渲染出那种效果。

### 横截面（适合 layered shallowness）

用水平 bands（`h-12 border-l-4`）展示一个 call 穿过的 layers。Before：6 个薄 layers，每个几乎不做事。After：1 个厚 band，标注 consolidated responsibility。

### 体量图（适合表达 "interface as wide as implementation"）

每个 module 两个 rectangles：一个代表 interface surface area，一个代表 implementation。Before：interface rectangle 几乎和 implementation rectangle 一样高（shallow）。After：interface rectangle 矮，implementation rectangle 高（deep）。

### 调用图收拢

Before：把 function calls tree 渲染为 nested boxes。After：把同一棵 tree collapse 成一个 box，内部 calls 以 faded 状态显示。

## 样式指南

- Lean editorial，不要 corporate-dashboard。留足 whitespace。Headings 可选 serif（`font-serif` 与 stone/slate 很搭）。
- 谨慎用色：一个 accent（emerald 或 indigo），red 用于 leakage，amber 用于 warnings。
- Diagrams 保持约 320px 高，让 before/after 并排时不需要滚动。
- Diagram 内 module labels 使用 `text-xs uppercase tracking-wider`；它们应像 schematic，不像 UI。
- 唯一脚本是 Tailwind CDN 和 Mermaid ESM import。除此之外 report 是 static；不要 app code，不要 Mermaid 自身渲染以外的 interactivity。

## 首选推荐区

一个更大的 card。Candidate name、一句话说明为什么、指向该 card 的 anchor link。仅此而已。

## 语气

平实的语言，简洁；但 architectural nouns 和 verbs 必须来自 `/codebase-design` skill。简洁不是术语漂移的借口。

**Use exactly:** module, interface, implementation, depth, deep, shallow, seam, adapter, leverage, locality.

**Never substitute:** component, service, unit（当你指 module 时）；API, signature（当你指 interface 时）；boundary（当你指 seam 时）；layer, wrapper（当你指 module 时）。

合适的措辞：

- "Order intake module is shallow - interface nearly matches the implementation."
- "Pricing leaks across the seam."
- "Deepen: one interface, one place to test."
- "Two adapters justify the seam: HTTP in prod, in-memory in tests."

**Wins bullets** 要用 glossary terms 命名收益：*"locality: bugs concentrate in one module"*、*"leverage: one interface, N call sites"*、*"interface shrinks; implementation absorbs the wrappers"*。不要写 *"easier to maintain"* 或 *"cleaner code"*；这些词不在 glossary 中，不能挣到自己的位置。

不要 hedging，不要 throat-clearing，不要 "it's worth noting that..."。一句话如果能变 bullet，就变 bullet。一个 bullet 如果能删，就删。一个 term 不在 `/codebase-design` glossary 中，就先找 glossary 里的词，而不是发明新词。
