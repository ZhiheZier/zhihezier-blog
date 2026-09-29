# 私密内容与主仓库隔离

主仓库保留模板默认文件。个人文章、展示数据和图片只在 `content/`
或独立的 `zhihezier-blog-content` 仓库中编辑和提交。

`pnpm dev`、`pnpm start` 和 `pnpm build` 会把主仓库代码与内容副本组合到
被 Git 忽略的 `.content-workspace/` 中。构建成功后仅把产物复制到同样被忽略
的 `dist/`，Cloudflare 继续使用该目录部署。

`pnpm sync-content` 只准备这个隔离目录，不再改写 `src/content`、`src/data`
或 `public/images`，不提交主仓库，也不修改现有内容仓库的 Git 状态。
内容目录不存在时，才使用 `CONTENT_REPO_URL` 克隆。已有目录使用其当前版本；
需要更新时，请在内容仓库中自行拉取。CI 的全新克隆会获取远程最新版本。

`ENABLE_CONTENT_SYNC=false` 时直接使用主仓库默认内容。
使用私密内容时，修改内容后重启开发服务器以刷新副本；主仓库代码变化也需要
重启以刷新。`.content-workspace/` 是临时副本，不应直接编辑。

验证隔离：`node --test tests/content-isolation.test.mjs`。
测试会验证默认文件和内容源不变、重复准备清除旧副本、缺少忽略规则时拒绝运行，
以及 `git add .` 不会暂存私密内容。

隔离仅保护源代码提交，站点构建产物仍会按正常发布流程公开。
恢复当前版本不会移除以前已提交到公开仓库历史中的内容。
