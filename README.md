# ABOUT

**TLDR:** Python backend for [this frontend](https://github.com/parfeniukink/fambb-frontend)
**APPROACHES:** DDD
**REASONING:**

    - tracking Transactions (Costs, Incomes, Exchanges) with proper calculations across multiple people
    - this is "View V3". V1 was Telegram Bot, "V2 View" was a mobile application
    - Svelte feels like a native application in Safari, so no reason to play with Apple shit (I don't have Android phone)

**REFERENCES:**

    - (v1 project for Telegram client)[https://github.com/parfeniukink/family_budget_bot] (`pytelegrambotapi`)
    - (v2 project)[https://github.com/parfeniukink/family_budget_bot] for iPhone devices (`Flutter`)

# USER REQUEST

1. not just "minimal", but "only required" UI
2. separate UI for mobile and desktop for UX
3. small build (no heavy frameworks, css libraries)

# USER PATTERN

1. 90% of the time user adds costs
2. 9% of the time user adds incomes or make exchanges
3. 1% of the time user observes analytics or change settings
4. 60% of the time user interacts with "Desktop Version"
5. 40% of the time user interacts with "Mobile Version"

# ARCHITECTURE

- authorization in the `+layout.svelte`
- HTTP client and API types are in `/api`
- data is persistent into the localStorage via `/operational/dataProvider.svelte.ts`
- desktop and mobile versions are separated by routes
  - most of CSS and HTML are duplicated from desktop version to the mobile
- ...

# DEV SETUP

1. project tools configurations: `vite.config.ts`, `svelte.config.js`, `tsconfig.json`
2. useful dev scripts are in the `Makefile`, use `make` command
3. code quality: linter in CI
4. CI/CD: github actions

## COMMANDS

```shell
pnpm install -D --force
pnpm run dev

pnpm run build
pnpm run preview --host
```

# DEPLOY

Set Environment Variables

```
# .env
# API Base URL
PUBLIC_BASE_URL=

# Public Domain (frontend itself)
VITE_ALLOWED_HOST=
```

Build and push docker image to the cluster Docker Registry

```sh
docker build -t docker-registry.homecp/family-budget-ui:latest --platform linux/amd64 --push --build-arg PUBLIC_BASE_URL=$PUBLIC_BASE_URL --build-arg VITE_ALLOWED_HOST=${VITE_ALLOWED_HOST} .
```
