---
name: setup-ts-deep-modules
description: 在 TypeScript repo 中接入 dependency-cruiser，让每个 package 成为 deep module：implementation 隐藏在 subfolders 中，只能通过 entry-point files 访问。User-invoked。
disable-model-invocation: true
---

# Setup TS Deep Modules

让 repo 中每个 package 成为 **deep module**：用小 interface 隐藏大量 behaviour。Package 的 public surface 是其 **entry points**（package root 中的 files），所有 subfolders 都隐藏。这个 skill 会安装 [dependency-cruiser](https://github.com/sverweij/dependency-cruiser)，加入强制只能通过 entry points 访问的 rules，并证明这些 rules 确实会拦截违规。

Vocabulary（deep module、interface、seam、depth）来自调用 Skill 工具并指定 `codebase-design`；整个过程都使用它的语言。

## The shape this enforces

```
src/packages/
  <name>/
    index.ts        ← an entry point (public). Import this from outside.
    client.ts       ← another entry point. Packages may expose SEVERAL.
    lib/            ← implementation: hidden from outside, free to import each other.
    tests/          ← co-located tests + fixtures (a subfolder, so private).
```

Public surface 是 package 的 **root files**，并非指定的单个 `index.ts`。按 convention，implementation 放在 `lib/`，tests 放在 `tests/`，使所有 packages 采用相同的 two-folder shape。Rule 本身是通用的：*任何* subfolder 中的*任何*内容都是 private，因此永远无需为了新增 folder 扩展 config。

四条 rules，全部为 `error`：

1. **Entry-point boundary** — package 外的 code（app code 或其他 package）只能 import 该 package 的 entry points（root files），不能 import subfolder 中的任何内容。
2. **Intra-package freedom** — package 自己的 files 可以自由互相 import。
3. **Tests through the entry points** — `<pkg>/tests/` 下的 files 可以 import 任意 package 的 entry points 和自己的 `tests/` fixtures，但不能 import 任何 package 的 subfolder internals（包括自己的）。允许跨 package integration tests，不允许 deep imports。
4. **No cycles** — 不允许 dependency cycles。

**Entry points, not a barrel.** Public surface 是每个 root file，因此 package 可以提供多个小 entry points（`index.ts`、`client.ts`、`server.ts`），不必把一切汇入巨大的 `index.ts`。不鼓励 re-export 整个 subtree 的 barrel files；entry points 要小，implementation 隐藏在 subfolders。

Layering（哪些 packages 可以依赖哪些）是另一个 concern，在 config 中保留 commented stub，由当前 repo 填写。

## Steps

### 1. Detect the environment

- **Package manager** — `pnpm-lock.yaml` → pnpm，`yarn.lock` → yarn，`bun.lockb` → bun，否则 npm。后续每条 command 都使用它（`pnpm`/`yarn`/`npm run`/`bunx`）。
- **Packages root** — 存在 `src/` 就用 `src/packages`，否则用 `packages`。如果 repo 已有明显不同的 convention，与用户确认。
- **Existing config** — 检查 `.dependency-cruiser.*` file。若存在，不要覆盖；merge 四条 rules 和 options，并说明添加了什么。

**Done when:** package manager、packages root 和 existing-config status 全部明确。

### 2. Install dependency-cruiser

使用检测到的 package manager，把 `dependency-cruiser` 安装为 devDependency。

**Done when:** `dependency-cruiser` 出现在 `devDependencies`。

### 3. Write the config

把 [`dependency-cruiser.config.cjs`](./dependency-cruiser.config.cjs) 复制到 repo root，命名为 `.dependency-cruiser.cjs`。把 `PACKAGES_ROOT` 设置成 step 1 检测到的 root。Rules 基于 path depth 且与 extension 无关，不需要其他调整。

**Done when:** `.dependency-cruiser.cjs` 存在、`PACKAGES_ROOT` 正确，并包含四条 forbidden rules。

### 4. Wire it into the checks

- 添加 `lint:boundaries` script：`depcruise <packages-root>`（或 `depcruise src`）。
- 把它纳入 repo 已经执行 typecheck 的 umbrella check command（如 `check` / `ci` / `validate`）。不要修改 `tsconfig` 或添加 path aliases。
- 如果没有 umbrella script，就添加 `lint:boundaries`，并告诉用户把它加入 CI。

**Done when:** `lint:boundaries` 存在，且和 typecheck 由同一 command 运行。

### 5. Scaffold the example package

创建并 commit 一个 `<packages-root>/example/` 作为 copy-me template：

- `index.ts` — entry point，export 一个 delegate 给 internal file 的 function，让 package 明显是 *deep*，不是 pass-through。
- `lib/impl.ts` — **subfolder** 中的 internal file，由 `index.ts` import，外部无法访问。
- `tests/example.test.ts` — **只** import `../index`（entry point），并针对 public function assert。

告诉用户这是可以 copy 或 delete 的 starter template。

**Done when:** example package 存在，通过 root entry point 暴露 behaviour，并把 `impl` 隐藏在 subfolder。

### 6. Prove the rules bite

这是整个 skill 的 completion criterion；不能在 violation 时失败的 config 毫无价值。

1. 运行 `lint:boundaries`，clean example 必须 **pass**。
2. 临时给 `tests/example.test.ts` 加一个 deep import，例如 `import { thing } from "../lib/impl"`。再次运行 `lint:boundaries`，必须以 `tests-through-entrypoints` **fail**。
3. Revert deep import，再运行一次，必须 **pass**。

**Done when:** 已观察到 pass、deep import 时 fail、恢复后再 pass。Step 2 不失败，就先修正 wiring，不能完成任务。

### 7. Document the convention

在 packages folder（`<packages-root>/README.md`）中写 `README.md`，内容覆盖：`src/packages/<name>/` layout（root 中是 entry points、`lib/` 放 implementation、`tests/` 放 tests）、“只通过 package 的 entry points（root files）import”，以及如何运行 `lint:boundaries`。明确 **discourage barrel files**，用多个小 entry points，而不是从一个 index re-export 整个 subtree。内容只保留 copy-me snippet，以及四条 rules 各一段。

再从 repo 的 agent-instructions file 指向它：优先 `CLAUDE.md`，否则 `AGENTS.md`；两者都不存在则创建 `AGENTS.md`。一行即可，例如：`Packages are deep modules — see [src/packages/README.md](./src/packages/README.md) before adding or importing one.` 这让 agent 能发现 boundary rule，而不是撞上它。

**Done when:** `<packages-root>/README.md` 存在且 discourages barrels，repo 的 `CLAUDE.md`/`AGENTS.md` 链接到它。

## Notes

- Config 中的 `$1` back-references（dependency-cruiser group matching）让 package 能访问自己的 internals，同时阻止 outsiders；不要把它们展开成每 package 一条 rule。
- Public/private 由 **depth** 决定：package root files 是 entry points，subfolder 中的一切都是 private。Convention 是 `lib/` 和 `tests/`，但 rule 不 hardcode；新增 folder 无需改 config，新增 entry point 只需新增 root file，不需要 barrel。
- Packages 是 **flat**：root 下只有一层 immediate children。Package internals 可以任意深，但 package 不能包含另一个 package。
- 使用 `.cjs`（不是 `.js`），确保即使 repo 使用 `"type": "module"`，config 的 `module.exports` 也能工作。
