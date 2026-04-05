# Astral Gym Management System

A modern, high-performance gym management system built with Next.js and optimized for Vercel deployment.

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) - React framework for production
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Deployment**: [Vercel](https://vercel.com/) - Optimal hosting for Next.js
- **Linting**: [ESLint](https://eslint.org/) - Code quality
- **Font**: DM Sans, Bebas Neue, Space Mono from Google Fonts

## Project Structure

```
astral_gym/
├── app/                    # Next.js App Router (server & client components)
│   ├── api/               # API routes
│   │   ├── health/        # Health check endpoint
│   │   └── route.ts       # Main API route
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable React components
├── lib/                   # Utility functions and helpers
├── public/                # Static assets (images, fonts, etc.)
├── styles/                # Global styles
│   └── globals.css        # Tailwind & global styles
├── types/                 # TypeScript type definitions
│   └── index.ts           # Type exports
├── .env.local             # Local environment variables (not in git)
├── .env.example           # Example env template
├── .eslintrc.json         # ESLint configuration
├── .gitignore             # Git ignore rules
├── next.config.js         # Next.js configuration
├── package.json           # Dependencies & scripts
├── postcss.config.js      # PostCSS configuration for Tailwind
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
├── vercel.json            # Vercel deployment configuration
└── README.md              # This file
```

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn package manager

### Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Set up environment variables**:
```bash
cp .env.example .env.local
```
Edit `.env.local` with your configuration values.

3. **Start development server**:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Available Scripts

- **`npm run dev`** - Start development server with hot reload
- **`npm run build`** - Build for production
- **`npm start`** - Start production server
- **`npm run lint`** - Run ESLint code quality checks
- **`npm run type-check`** - Check TypeScript for type errors

## Deployment to Vercel

### Automatic Deployment

1. Push your code to a GitHub repository
2. Import the repository in [Vercel Dashboard](https://vercel.com/dashboard)
3. Vercel automatically detects Next.js and configures everything
4. Your app deploys to `project-name.vercel.app`

### Manual Deployment

```bash
npm i -g vercel
vercel
```

### Environment Variables on Vercel

1. Go to Project Settings → Environment Variables
2. Add all variables from `.env.example`
3. Redeploy after adding variables

## API Routes

### Health Check
- **Endpoint**: `GET /api/health`
- **Response**: `{ status: "ok", timestamp: "ISO timestamp" }`
- **Use**: Monitoring and uptime checks

### Main API
- **Endpoint**: `GET /api`
- **Response**: Welcome message with available endpoints

## Features

- ✅ Server-side rendering with Next.js App Router
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for rapid UI development
- ✅ API routes for backend functionality
- ✅ Environment variable management
- ✅ ESLint for code quality
- ✅ Vercel-optimized configuration
- ✅ Mobile-responsive design
- ✅ Dark theme with custom color palette

## Color Scheme

The application uses a dark theme with accent colors:

- **Background**: `#0a0a0f`
- **Surface**: `#111118`
- **Primary Accent**: `#e8ff47` (Yellow)
- **Secondary Accent**: `#ff4747` (Red)
- **Tertiary Accent**: `#47c4ff` (Blue)
- **Success**: `#47ff9b` (Green)
- **Text**: `#f0f0f5` (Light)
- **Muted**: `#6b6b80` (Gray)

## Development Tips

### Adding Components

Create new components in `components/`:
```typescript
// components/MyComponent.tsx
export default function MyComponent() {
  return <div>My Component</div>;
}
```

### Creating API Endpoints

Add new API routes in `app/api/`:
```typescript
// app/api/members/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ members: [] });
}
```

### Using Types

Import types from `types/index.ts`:
```typescript
import type { Member, ApiResponse } from '@/types';
```

## Best Practices

1. **Use Server Components by Default** - Add `'use client'` only when needed
2. **Path Aliases** - Use `@/` prefix for imports (configured in `tsconfig.json`)
3. **Environment Variables** - Prefix public variables with `NEXT_PUBLIC_`
4. **Styling** - Prefer Tailwind classes over custom CSS
5. **Type Safety** - Always use TypeScript types for data structures

## Troubleshooting

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

### Build errors
```bash
rm -rf .next
npm run build
```

### TypeScript errors
```bash
npm run type-check
```

## Performance

- **Automatic Code Splitting**: Each page only loads necessary code
- **Image Optimization**: Next.js optimizes images automatically
- **CSS Tree Shaking**: Tailwind removes unused styles
- **API Route Caching**: Configured in `next.config.js`

## Support & Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## License

MIT License - see LICENSE file for details

---

**Ready to deploy?** Push to GitHub and connect to Vercel for instant deployments!
