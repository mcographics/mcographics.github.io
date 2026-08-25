# Majestic Creations

The official portfolio site for Majestic Creations—an independent multidisciplinary studio creating desktop and mobile apps, Unreal Engine projects, Unity experiences, and original creative work.

## What is included

- Responsive one-page studio website
- Filterable Apps, Game Dev, Creative, and Experiments portfolio
- Real project screenshots, development states, technologies, and public links
- Honest support section ready for a donation provider
- Branded social-sharing image
- Automated GitHub Pages deployment

## Publish with GitHub Pages

1. Create a GitHub repository and push this project to its `main` branch.
2. Open the repository's **Settings → Pages**.
3. Under **Build and deployment**, choose **GitHub Actions** as the source.
4. Open the **Actions** tab and wait for “Deploy Majestic Creations to GitHub Pages” to finish.

Every future push to `main` will rebuild and publish the site automatically.

## Automatic public/private repository checks

The `Check portfolio repository visibility` workflow runs once each day and can also be started manually. It checks every repository registered in `app/repository-status.json`:

- When a repository changes from private to public, its card automatically gains a GitHub link and icon.
- When a repository changes from public to private, its public link is removed and the card displays `Private`.
- If GitHub cannot verify a repository, the workflow fails safely without changing the published status.

The workflow requires a fine-grained personal access token stored as the repository Actions secret `PORTFOLIO_REPO_STATUS_TOKEN`. Give the token read-only **Metadata** access to the repositories represented in the portfolio. No contents, administration, or write permission to those project repositories is required.

To configure it, open **Settings → Secrets and variables → Actions → New repository secret**, use `PORTFOLIO_REPO_STATUS_TOKEN` as the name, and paste the fine-grained token as the value. The workflow itself needs `contents: write` only in this portfolio repository so it can commit a visibility change and trigger the normal Pages deployment.

## Before the public launch

Add your preferred direct donation destination when it is ready. New work can be added to the project collection in `app/page.tsx` with a title, category, development state, description, image, tags, and optional public link.

## Local development

This project requires Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

The GitHub Pages production artifact can be tested with:

```bash
npm run build:pages
```
