## Next.js App Router Course - Starter

This is the starter template for the Next.js App Router Course. It contains the starting code for the dashboard application.

For more information, see the [course curriculum](https://nextjs.org/learn) on the Next.js Website.

Chapters
- https://nextjs.org/learn/dashboard-app/getting-started
- https://nextjs.org/learn/dashboard-app/css-styling
- https://nextjs.org/learn/dashboard-app/optimizing-fonts-images
- https://nextjs.org/learn/dashboard-app/creating-layouts-and-pages
- https://nextjs.org/learn/dashboard-app/fetching-data

# CSS
Global styling defined in `/app/ui/global.css`

## Fonts
https://fonts.google.com/
[Inter](https://fonts.google.com/specimen/Inter)
[Lusitana](https://fonts.google.com/specimen/Lusitana)

# Running
```bash
docker compose -f ./docker/docker-compose.yml up
```
Make `.env` and add connection string to url similar to `.env.example` to make the creds in docker-compose

# Database
Postgres docker container