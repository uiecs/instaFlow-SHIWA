# instaFlow SHIWA

A premium dark SaaS dashboard prototype for Instagram growth automation. The interface follows the supplied SHIWA reference: luminous blue/purple/pink gradients, glass panels, growth analytics, quick actions, activity feed, and connection status.

## Run locally

No build step is required. Open `index.html` directly, or serve the repository with:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Current v1.0 slice

- Responsive dashboard matching the supplied product direction
- Sidebar navigation with mobile drawer behavior
- Followers, following, and posts KPI cards
- SVG growth overview chart
- Post, Reels, Schedule, and Analytics quick-action cards
- Recent activity feed and Instagram connection status
- Accessible labels, responsive breakpoints, and lightweight interaction toasts

## Product roadmap

The static dashboard is intentionally dependency-free so it can be deployed immediately. Production integrations should be added behind a server API: Meta OAuth/token management, Instagram Graph API publishing, PostgreSQL persistence, Redis/Celery scheduling, JWT authentication, and an AI service. Never expose Meta or AI secrets in browser code.
