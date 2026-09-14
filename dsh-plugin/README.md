# Matt Pocock Skills 中文本地化 dsh 插件

## 这是什么

本插件包把 `mattpocock-skills-zh-CN` 仓库的 35 个可用技能，打包为 DeepSeek Harness（dsh）插件。

技能以 `zh-<name>` 命名，并以 `/zh-<name>` 调用，例如 `/zh-grilling`。

## 30 秒安装

前提：机器上已能运行 dsh（`dsh --version` 有输出）。尚未安装时，先用 `npx @deepseek-ai/dsh web` 启动一次。

1. 把插件装进 web profile：

   ```sh
   dsh plugin --profile web add @vinvcn/dsh-mattpocock-skills-zh
   ```

   该包尚未发布到 npm 之前，用打包出的 tarball 绝对路径代替包名：

   ```sh
   (cd dsh-plugin && npm pack)
   dsh plugin --profile web add "$PWD/dsh-plugin/vinvcn-dsh-mattpocock-skills-zh-1.2.3.tgz"
   ```

2. 启动 dsh：

   ```sh
   dsh web
   ```

3. 在会话中输入 `/zh-grilling`（或任意 `/zh-<name>`）即可调用。

确认插件已挂载：

```sh
dsh --profile web --dump-config | grep 'id: mattpocock-skills-zh'
```

## 构建期改写

构建期会重写 skill 正文里的内部引用：`/grilling` 会变成 `/zh-grilling`。

非 `.md` 资源文件与 `argument-hint` frontmatter 原样复制，dsh 不消费它们。

仓库根目录内容不会被改动。

## 维护者发布

发布前先登录 npm（账号需有权发布 `@vinvcn` scope）：

```sh
npm login
npm whoami
```

然后构建并发布：

```sh
(cd dsh-plugin && npm run build)
(cd dsh-plugin && npm publish)
```

`private:false` 与 `publishConfig.access: public` 使该包可以公开发布。

发布成功后无需 tarball，直接安装：

```sh
dsh plugin --profile web add @vinvcn/dsh-mattpocock-skills-zh
```

## 局限

正文中裸写的技能名不会被重写。

`in-progress` 技能仍为 beta。

当前共 35 个技能。
