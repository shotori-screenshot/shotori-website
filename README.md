# Shotori website

The website and documentation for
[Shotori](https://github.com/shotori-screenshot/shotori), a Wayland-native
screenshot tool. Built with [Astro](https://astro.build) +
[Starlight](https://starlight.astro.build), bilingual (English / 简体中文).

## Develop

```bash
pnpm install
pnpm dev       # dev server on http://localhost:4321/website
pnpm build     # static build in dist/
pnpm preview   # serve the built site
```

## Structure

```
src/content/docs/            # English content (root locale)
src/content/docs/zh-cn/      # 简体中文 content, mirrors the English tree
src/assets/                  # logo + screenshots (copied from the main repo)
astro.config.mjs             # site config, locales, sidebar
```

Content is distilled from the main repository's `README.md` /
`README.zh-CN.md`. English lives at the docs root, Chinese under `zh-cn/`;
the two trees must stay in sync page-for-page (missing pages fall back to
English).

Branding assets (`shotori.svg`, `selection-and-pins.png`) are copied from the
main repo's `assets/` — re-copy them when the originals change.

## Deployment

Deployed on [Vercel](https://vercel.com) (static output, zero config —
Vercel auto-detects Astro and pnpm) at
[shotori.mengh04.top](https://shotori.mengh04.top). The domain is a
subdomain of an Aliyun-managed zone, pointed at Vercel with a CNAME
record (`shotori` → `cname.vercel-dns.com`). If the domain ever changes,
update `site` in `astro.config.mjs` to match, then redeploy.
