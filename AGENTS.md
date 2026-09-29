# Content privacy boundary

- This is the public code repository. `content/` and the separate
  `zhihezier-blog-content` checkout are private content repositories.
- Edit and commit personal content only inside its own repository. Never stage
  its mapped copies, article files, images, or data in the public repository.
- Keep `src/content`, `src/data`, and `public/images` as the original template
  defaults unless the user explicitly requests a template change.
- Build private content through `pnpm build` or `pnpm dev`. These commands use
  ignored `.content-workspace/`; never replace tracked directories with content
  symlinks or copies. Do not force-add ignored runtime files.
- Before pushing, inspect all outgoing commits, not just the latest commit.
  Content-sync commits must not be included in a code push.
