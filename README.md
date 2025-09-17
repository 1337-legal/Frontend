# ⚡ 1337.legal Frontend

Landing & marketing surface for the **1337.legal** privacy email alias service + browser extension.

<p align="left">
  <img src="https://img.shields.io/badge/Build-Vite-orange?style=flat" />
  <img src="https://img.shields.io/badge/React-18+-61dafb?style=flat&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Styling-TailwindCSS-38bdf8?style=flat&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Status-Beta-orange?style=flat" />
</p>

---

## 🎯 Purpose

- Present core value: private aliases, Blindflare envelope, infra posture
- Drive users to **Get Started**, extension install, API docs
- Zero user data handling (static marketing surface)

---

## 🧱 Tech Stack

| Layer | Choice |
|-------|--------|
| Runtime | Bun |
| Framework | React + TypeScript + Vite |
| Styling | Tailwind CSS (utility + local keyframes) |
| Routing | `react-router` |
| Icons | `lucide-react` |
| UI | Shadcn UI |

---

## 🔧 Development

```bash
bun install          # deps
bun run dev          # local dev (Vite)
bun run build        # production build
bun run preview      # serve built output
```

---

## ✨ Conventions

- Keep page shells lean; collocate animations with component usage
- Reusable marketing slices live under feature components
- Internal nav: `Button asChild + <Link>`
- External links: plain `<a>`
- No runtime env needed (pure SPA marketing)

---

## ☁️ Deployment

Any static host (Netlify / Vercel / Cloudflare Pages / S3+CDN).  
Build output: `dist/`.

---

## 🛣 Future Ideas

- 🚀 Extension install CTA section
- 🌓 Theme toggle (light/dark)
- 🌐 i18n (maybe)
- 📊 Privacy‑preserving, deferred analytics
- 🪪 Transparency + infra posture evolution

---

## 🤝 Contributing (Soon)

Lightweight contribution guide will be added once extension public API stabilizes.

---

## 🛡 Trademark

“1337” and related branding are reserved; code reuse fine, avoid confusing representation.

---

## 🧩 License

(Choose: MIT / Apache-2.0 / MPL-2.0 — not finalized in this repo yet.)

---

> Built to make email aliasing boring, private, and fast. 🧪