# Deploy

Production URL: https://baditaflorin.github.io/group-theory-visualizer/

Repository URL: https://github.com/baditaflorin/group-theory-visualizer

GitHub Pages is configured from `main` branch `/docs`.

## Publish

```sh
npm install
make build
git add docs
git commit -m "chore: publish pages build"
git push origin main
```

## Rollback

Revert the commit that changed the published `docs/` assets, then push `main`.

## Custom Domain

If a custom domain is added later, create `docs/CNAME` containing the domain and configure DNS with GitHub Pages according to:

https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
