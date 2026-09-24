<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Akshayam Matrimony - Architecture & Invariant Rules

1. Database Integrity:
   - NEVER drop columns from `schema.prisma` without verifying test/production data.
   - Run `prisma migrate deploy` rather than destructive push commands.
   - After any schema update, always regenerate the Prisma Client (`npx prisma generate`).

2. Document Previews:
   - Never render an `<iframe>` or `<img>` directly with `idProofUrl` or `jathagamUrl` without running `isValidDocUrl()`.
   - Always provide fallback UI if a document string is null or empty.

3. Parallel/Drawer Routing:
   - Always maintain `default.tsx` in all parallel slots (`@drawer`, `@modal`) to prevent `"parallelRouterKey"` 500 router crashes.

4. Server Actions:
   - Every mutation modifying `isApproved` must invoke `revalidatePath('/')` and `revalidatePath('/search')`.
