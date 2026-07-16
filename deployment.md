# Deployment Instructions for clothing-store-fe-nextjs

## Prerequisites
- Docker Engine (>= 20.10) and Docker Compose installed on the server.
- Access to the repository (SSH key or HTTPS token) where the Next.js code lives.
- `docker` group membership for the user running the commands (or use `sudo`).

## Quick reload workflow (manual)
When you push new changes to the `main` (or `develop`) branch, you can reload the production container with a single command:

```bash
# From the project root on the server
cd /path/to/clothing-store-fe-nextjs
# Rebuild the images and recreate the container
docker compose up --build -d --force-recreate
```

- `--build` forces Docker to rebuild the images using the updated source code.
- `-d` runs the services in detached mode.
- `--force-recreate` ensures the existing container is stopped and a fresh one is started, so the new build is used.

## Full CI/CD pipeline (GitHub Actions) – optional
If you prefer an automated reload on every push, add the following workflow file to `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main, develop]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Docker Hub (or your registry)
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push image
        run: |
          docker compose build
          docker compose push

      - name: SSH into server and redeploy
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /path/to/clothing-store-fe-nextjs
            docker compose pull
            docker compose up -d --force-recreate
```

> **Tip:** Store all secret values (`DOCKER_USERNAME`, `DOCKER_PASSWORD`, `SERVER_HOST`, `SERVER_USER`, `SERVER_SSH_KEY`) in the repository *Settings → Secrets*.

## Development mode (hot‑reload)
For local development you may want the container to watch source changes:

```yaml
# docker-compose.dev.yml (optional)
version: "3.9"
services:
  next-app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: next-app-dev
    ports:
      - "8088:3000"
    volumes:
      - .:/app:cached
    command: npm run dev   # Next.js dev server with hot‑reload
    restart: unless-stopped
```

Run it with:
```bash
docker compose -f docker-compose.dev.yml up --build
```
Changes in the local files will automatically refresh the app.

---
**Summary**
- Use `docker compose up --build -d --force-recreate` to reload production after a code push.
- Optionally automate this with a GitHub Actions workflow.
- A separate dev compose file enables hot‑reload for local development.
