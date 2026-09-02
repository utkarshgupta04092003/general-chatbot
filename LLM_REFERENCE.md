# LLM Reference — Utkarsh's Coding DNA

A snapshot of how I build Next.js SaaS products. Paste this into any new project so the LLM already knows my defaults.

---

## Mindset

- **Ship first, refactor later.** Commits like "Dummy Commit for Deploy" and "Fix Minor Changes" show I push when it works, not when it's perfect.
- **Config-driven everything.** If a value might change or be reused, it goes in `lib/config.ts` — model names, plan limits, event names, error messages, all of it. I don't scatter magic strings.
- **Iterate in small, named steps.** Every feature gets its own commit. I don't bundle unrelated changes.
- **Modularize when it hurts, not before.** I start with co-located code and extract it only when files get unwieldy (see: "Modularize Components", "Modularize the files").
- **The UI is the product.** I invest in animations, glassmorphism, dark mode, and polished loading states — not as extras, but as core.
- **Observability is non-negotiable.** Every user action fires a PostHog event. Analytics are wired from day one, not added later.
- **Model-agnostic backend, user-configurable frontend.** We support multiple models (Flash/Pro) and let the user decide per-chatbot.
- **Hybrid Data Ingestion.** Scrape websites or paste raw text — the pipeline treats them the same.

---

## Approach to Problems

1. **Define the data shape first.** Prisma schema comes before routes. Routes come before UI.
2. **Add one concern at a time.** Auth → CRUD → embeddings → analytics → UI polish. Not all at once.
3. **Fail loudly in dev, fail gracefully in prod.** Error boundaries on client, try/catch on API, mock fallbacks for optional services.
4. **Ownership is always part of the query.** Every DB read includes `userId` alongside `id`. Never trust the URL param alone.
5. **Use `Promise.all` for independent async work.** Analytics route runs 12+ Prisma queries in parallel. Always.

---

## File Structure

```
app/
├── layout.tsx                    # Root layout — fonts, providers
├── globals.css                   # CSS vars + animations + utilities
├── page.tsx                      # Landing page (server component)
├── (public pages)                # login, signup, about, contact, terms, privacy
├── widget/[id]/page.tsx          # Embeddable chat widget
├── onboarding/
│   ├── page.tsx                  # Orchestrator — manages step state
│   └── _components/              # One file per step
├── dashboard/
│   ├── layout.tsx                # Sidebar + UsageProvider
│   ├── page.tsx                  # Overview
│   ├── [section]/
│   │   ├── page.tsx              # Server component — fetches + passes data
│   │   └── _components/          # Client components for that section
└── api/
    ├── auth/[...nextauth]/route.ts
    ├── auth/signup/route.ts
    ├── chat/route.ts
    ├── chatbots/route.ts
    ├── chatbots/[id]/route.ts
    ├── data-sources/route.ts
    ├── data-sources/[id]/route.ts
    ├── data-sources/[id]/resync/route.ts
    ├── analytics/route.ts
    ├── messages/[id]/feedback/route.ts
    ├── upload/route.ts
    ├── crawl/route.ts
    ├── scrape/route.ts
    ├── embed/route.ts
    └── usage/route.ts

lib/
├── config.ts        # ALL constants — models, limits, events, messages
├── declaration.ts   # Types derived from config constants
├── auth.ts          # NextAuth config (JWT, Credentials)
├── session.ts       # getServerSession(), requireAuth() helpers
├── prisma.ts        # Prisma singleton (global check for dev HMR)
├── endpoint.ts      # All API paths as constants + helper functions
├── utils.ts         # cn(), formatters, getAIClient() factory (Gemini focus)
├── logger.ts        # Console wrapper (dev logs, prod silence)
├── posthog.ts       # PostHog factory with mock fallback
├── cloudinary.ts    # Image upload wrapper
└── scraper.ts       # robustFetch() → Puppeteer fallback, UA rotation

components/
├── [SharedComponents].tsx
├── dashboard/
├── landing/
└── providers/
    ├── theme-provider.tsx   # next-themes
    ├── posthog-provider.tsx
    └── usage-provider.tsx   # UsageContext with useUsage() hook

public/
└── widget.js        # Embeddable loader script

prisma/
└── schema.prisma

middleware.ts        # Route protection — /dashboard/* and /onboarding/*
```

---

## CSS & Styling

**Stack:** Tailwind v4 (via PostCSS) + custom CSS in `globals.css`.

**Theme variables** — always HSL, always in `:root` and `.dark`:
```css
--background, --foreground
--card, --card-foreground
--primary, --primary-foreground
--secondary, --secondary-foreground
--muted, --muted-foreground
--accent, --accent-foreground
--border, --input, --ring, --radius
```

**Brand colors** — defined in `@theme` block, used as Tailwind classes:
```css
--color-primary: #6366f1      /* indigo-500 */
--color-primary-dark: #4f46e5
--color-secondary: #8b5cf6    /* violet-500 */
```

**Dark mode:** `next-themes` with `class` strategy. Components use `hsl(var(--token))` tokens — they respond automatically without any manual `dark:` prefix needed for background/text.

**Named utility classes** (defined in `globals.css`, not Tailwind config):
- `.gradient-text` — indigo→violet→cyan gradient on text
- `.glass` / `.glass-light` — frosted glass backgrounds
- `.skeleton` — shimmer loading placeholder
- `.chat-message` — markdown chat bubble styles
- `.hero-gradient` — radial gradient background
- `.animate-fade-in-up`, `.animate-slide-in-right`, `.animate-typing-bounce`
- `.delay-100`, `.delay-200`, `.delay-300` — animation stagger helpers

**Conventions:**
- Rounded: `rounded-xl` / `rounded-2xl` for cards, `rounded-full` for avatars/badges
- Shadows: `shadow-xl` for cards, `shadow-2xl shadow-indigo-500/25` for hero elements
- Icons: `text-indigo-500`, `text-green-500`, `text-red-500` for semantic color
- Responsive: `sm:` → `md:` → `lg:` (mobile-first always)
- Framer Motion for enter/exit animations on modals and lists

---

## `lib/` Directory Management

Every file has one job:

| File | Job |
|------|-----|
| `config.ts` | Single source of truth for all constants |
| `declaration.ts` | TypeScript types derived from config (`as const` → type) |
| `auth.ts` | NextAuth setup only |
| `session.ts` | Session helper functions only |
| `prisma.ts` | Prisma client singleton |
| `endpoint.ts` | API path constants + dynamic route helpers |
| `utils.ts` | Pure utility functions (`cn`, formatters, AI client factory) |
| `posthog.ts` | Analytics client with mock fallback |
| `logger.ts` | Console wrapper — one place to swap log behavior |
| `scraper.ts` | Web scraping logic (fetch → Puppeteer fallback) |

**Rule:** If a value is used in more than one file, it lives in `lib/config.ts`. If a function is used in more than one file, it lives in `lib/utils.ts` or gets its own lib file.

---

## Patterns That Work

### 1. Config-first constants
```typescript
// lib/config.ts
export const ANALYTICS_EVENTS = {
  CHATBOT_CREATED: "chatbot_created",
  USER_SIGNED_UP: "user_signed_up",
} as const;

// lib/declaration.ts
export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];
```

### 2. Endpoint registry
```typescript
// lib/endpoint.ts
export const ENDPOINTS = {
  CHATBOTS: "/api/chatbots",
  CHATBOT_BY_ID: (id: string) => `/api/chatbots/${id}`,
} as const;
```

### 3. Ownership-safe DB queries
```typescript
// Always include userId — never trust id alone
await prisma.chatbot.findFirst({
  where: { id, userId: session.user.id, deleted: false },
});
```

### 4. Soft delete
```typescript
// Schema: deleted Boolean @default(false)
// Delete:
await prisma.chatbot.update({ where: { id }, data: { deleted: true } });
// Query:
where: { userId, deleted: false }
```

### 5. API route shape (consistent across every route)
```typescript
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // logic
    return NextResponse.json({ data }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    await posthog.shutdown();
  }
}
```

### 6. Parallel async queries
```typescript
const [total, unanswered, helpful] = await Promise.all([
  prisma.message.count({ where: { ... } }),
  prisma.message.count({ where: { unanswered: true, ... } }),
  prisma.message.count({ where: { feedback: FEEDBACK_TEXT.HELPFUL, ... } }),
]);
```

### 7. Context + hook for shared state
```typescript
// providers/usage-provider.tsx
const UsageContext = createContext<UsageContextType | null>(null);
export function useUsage() {
  const ctx = useContext(UsageContext);
  if (!ctx) throw new Error("useUsage must be used within UsageProvider");
  return ctx;
}
```

### 8. Client fetch pattern
```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setLoading(true);
  setError("");
  try {
    const res = await fetch(ENDPOINTS.CHATBOTS, { method: "POST", body: JSON.stringify(data) });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error);
    // handle success
  } catch (err) {
    setError(err instanceof Error ? err.message : "Failed");
  } finally {
    setLoading(false);
  }
}
```

### 9. Loading state on buttons
```typescript
<button disabled={loading}>
  {loading ? <Loader2 className="animate-spin" /> : <SendIcon />}
  {loading ? "Saving..." : "Save"}
</button>
```

### 10. Graceful degradation for optional services
```typescript
// lib/posthog.ts — returns mock if key missing
if (!apiKey) return { capture: () => {}, shutdown: async () => {} };
```

### 11. Plan limit check before create
```typescript
const count = await prisma.chatbot.count({ where: { userId, deleted: false } });
if (ENABLE_USAGE_LIMITS && count >= PLAN_LIMITS.FREE.MAX_CHATBOTS) {
  return NextResponse.json({ error: "Limit reached" }, { status: 403 });
}
```

### 12. Page → `_components/` split
Server page fetches data. Client sub-components handle interactivity. Never mix server data fetching with `useState` in the same component.

---

## TypeScript Conventions

- `as const` on all plain-object enums in `config.ts`
- Types derived via `(typeof CONST)[keyof typeof CONST]` — never duplicate manually
- `import type` for type-only imports
- `err instanceof Error ? err.message : "fallback"` everywhere errors are caught
- `Record<string, T>` for typed maps
- Zod for external data validation (AI responses, API inputs)

---

## Authentication

- NextAuth v5 with JWT strategy (no DB sessions)
- Providers: Credentials (email + bcryptjs)
- JWT callback adds `user.id`; session callback surfaces it to client
- `requireAuth()` in server components — redirects to `/login` if missing
- Middleware guards `/dashboard/*` and `/onboarding/*`

---

## Database

- Prisma + MongoDB Atlas
- ObjectId PKs mapped with `@map("_id")`
- All sensitive queries scope by `userId`
- Soft deletes over hard deletes — `deleted: Boolean @default(false)`
- Prisma singleton in `lib/prisma.ts` with `global` check to survive dev HMR

---

## Analytics (PostHog)

- Every mutation (create, update, delete, view) fires a named event from `ANALYTICS_EVENTS`
- Events captured server-side in API routes
- Always `posthog.shutdown()` in `finally` block to ensure flush
- Mock client used when `NEXT_PUBLIC_POSTHOG_KEY` is missing

---

## Key Dependencies

| Package | Purpose |
|---------|---------|
| `next-auth` v5 | Auth (JWT + OAuth) |
| `prisma` | ORM (MongoDB) |
| `@pinecone-database/pinecone` | Vector DB for RAG |
| `openai` | AI SDK (used for Gemini OpenAI-compatible endpoint) |
| `@google/generative-ai` | Google Generative AI SDK (Gemini 1.5) |
| `posthog-node` | Server analytics |
| `posthog-js` | Client analytics |
| `cloudinary` | Image storage |
| `framer-motion` | UI animations |
| `next-themes` | Dark mode |
| `lucide-react` | Icons |
| `zod` | Schema validation |
| `bcryptjs` | Password hashing |
| `clsx` + `tailwind-merge` | `cn()` utility |
| `react-markdown` | Chat message rendering |
| `recharts` | Analytics charts |
