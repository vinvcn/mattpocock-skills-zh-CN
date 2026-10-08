# GLOSSARY.md 格式

`GLOSSARY.md` 是这个 teaching workspace 的 canonical language。所有 explainers、exercises 和 learning records 都应遵守它的 terminology。构建它本身就是学习的一部分：把一个 concept 压缩成 tight definition，是用户理解它的证据。

## 结构

```md
# {Topic} Glossary

{One or two sentence description of the topic this glossary covers.}

## Terms

**Hypertrophy**:
Muscle growth driven by mechanical tension and metabolic stress over repeated training sessions.
_Avoid_: Bulking, getting big

**Progressive overload**:
Systematically increasing the demand on a muscle over time, via load, volume, or intensity.
_Avoid_: Pushing harder, levelling up

**RPE (Rate of Perceived Exertion)**:
A 1–10 self-rating of how hard a set felt, where 10 is failure and 8 means two reps left in the tank.
_Avoid_: Effort score, intensity rating
```

## 规则

- **Add a term only when the user understands it.** Glossary 是 compressed knowledge 的记录，不是给用户阅读学习的 dictionary。如果用户刚接触一个 concept，等到他们能正确使用它后，再把它提升到这里。
- **Be opinionated.** 当同一 concept 有多个词时，选择最好的那个，并把其他词列为应避免的 aliases。这就是 language compression 的方式。
- **Keep definitions tight.** 一两句话。定义这个 term 是什么，而不是它做什么或怎么做。
- **Use the glossary's own terms inside definitions.** 一旦某个 term 进入 glossary，就在所有地方优先使用它，包括其他 definitions 内部。这会让复杂 terms 之后更容易理解。
- **Group under subheadings** when natural clusters emerge（例如 `## Anatomy`、`## Programming`）。当 terms 自然内聚时，扁平列表也可以。
- **Flag ambiguities explicitly.** 如果一个 term 在更大领域中被宽泛使用，记录本 workspace 的 resolution："In this workspace, 'set' always means a working set; warm-ups are tracked separately."
- **Revise as understanding deepens.** 用户第一周写的 definition 到第六周可能是错的。就地更新，不要留下 stale entries。
