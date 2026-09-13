# Matt Pocock Skills 中文本地化 dsh 插件

## 这是什么

本插件包把 `mattpocock-skills-zh-CN` 仓库的 35 个可用技能，打包为 DeepSeek Harness（dsh）插件。

技能以 `zh-<name>` 命名，并以 `/zh-<name>` 调用，例如 `/zh-grilling`。

## 安装

```
dsh plugin --profile web add @vinvcn/dsh-mattpocock-skills-zh
```

安装后即可在会话中调用全部技能。

## 构建期改写

构建期会重写 skill 正文里的内部引用：`/grilling` 会变成 `/zh-grilling`。

非 `.md` 资源文件与 `argument-hint` frontmatter 原样复制，dsh 不消费它们。

仓库根目录内容不会被改动。

## 维护者发布

```
npm --prefix dsh-plugin run build
npm --prefix dsh-plugin publish
```

`private:false` 与 `publishConfig.access: public` 使该包可以公开发布。

## 局限

正文中裸写的技能名不会被重写。

`in-progress` 技能仍为 beta。

当前共 35 个技能。
