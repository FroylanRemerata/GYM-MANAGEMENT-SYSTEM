# Quick Start Guide

Get your Astral Gym Management System running in minutes!

## 1. Install Dependencies (1 min)

```bash
npm install
```

## 2. Set Up Environment

```bash
# Copy the example env file
cp .env.example .env.local

# Edit .env.local if needed (optional for local development)
# NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 3. Start Development Server (instant)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 4. You're Running!

✅ Hot reload enabled - edit files and see changes instantly
✅ API available at [http://localhost:3000/api](http://localhost:3000/api)
✅ Health check at [http://localhost:3000/api/health](http://localhost:3000/api/health)

## Next Steps

### Add Your Pages
1. Create files in `app/` directory
2. They automatically become routes
3. Example: `app/members/page.tsx` → `http://localhost:3000/members`

### Create API Endpoints
1. Create files in `app/api/` directory
2. Export `GET`, `POST`, `PUT`, `DELETE` functions
3. Example: `app/api/members/route.ts` → `http://localhost:3000/api/members`

### Build Components
1. Create `.tsx` files in `components/` directory
2. Import and use in your pages
3. Use Tailwind classes for styling

### Style Your App
- Tailwind CSS classes: `className="bg-accent text-white p-4"`
- Global styles in `styles/globals.css`
- Color variables in `tailwind.config.js`

## Common Tasks

### Run Type Checking
```bash
npm run type-check
```

### Build for Production
```bash
npm run build
npm start
```

### Run Linter
```bash
npm run lint
```

## Deploy to Vercel

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

**TL;DR:**
1. Push to GitHub
2. Connect to Vercel
3. Done! 🚀

## File Structure Quick Reference

- `app/` - Pages and API routes
- `components/` - Reusable React components
- `lib/` - Utility functions and helpers
- `styles/` - Global CSS
- `types/` - TypeScript types
- `public/` - Static files

## Port Already in Use?

```bash
npm run dev -- -p 3001
```

## Need Help?

- 📖 [Next.js Docs](https://nextjs.org/docs)
- 🎨 [Tailwind Docs](https://tailwindcss.com/docs)
- 🚀 [Vercel Docs](https://vercel.com/docs)
- 📝 [README.md](./README.md) - Full documentation

---

**Happy coding! 🏋️**
