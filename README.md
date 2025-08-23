# 1337.legal Frontend

Landing + marketing surface for the 1337.legal privacy email alias service & browser extension.

## Purpose

- Present product value (private aliases, Blindflare envelope, infra posture).
- Drive users to Get Started / extension install / API docs.
- Zero user data handling here; purely static + minimal interactivity.

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS (utility + custom keyframes in-page)
- Component organization under: `src/features/home/components`
- Routing: `react-router`
- Icons: `lucide-react`
- UI primitives: local `@Components/ui/*`

## Structure (Key)

```
src/
  pages/
    Home.tsx          # Page shell + layout + global decorative CSS
  features/
    home/
      components/     # HeroSection, FeatureGrid, BenefitsCard, etc.
```

## Development

```bash
pnpm install        # or yarn / npm
pnpm run dev        # Vite dev server
pnpm run build
pnpm run preview
```

## Conventions

- Page-level styling kept minimal; animations colocated where used.
- Reusable marketing pieces live in feature components.
- Prefer `Button asChild + <Link>` for internal navigation; `<a>` only for external.

## Environment

No runtime env vars required (pure SPA marketing surface).

## Deployment

Any static host (Netlify, Vercel, Cloudflare Pages, S3 + CDN). Output: `dist/`.

## Future

- Extension install CTA section
- Light/dark theming toggle
- i18n (if needed)
- Analytics (privacy-preserving, deferred)

## License

MIT (matches