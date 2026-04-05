# Project Structure Overview

```
astral_gym/
│
├── 📁 app/                              # Next.js App Router (main application)
│   ├── 📁 api/                          # API routes
│   │   ├── 📁 health/
│   │   │   └── route.ts                 # Health check endpoint
│   │   └── route.ts                     # Main API welcome endpoint
│   ├── layout.tsx                       # Root layout wrapper
│   └── page.tsx                         # Home page (/)
│
├── 📁 components/                       # Reusable React components
│   └── [Your components go here]
│
├── 📁 lib/                              # Utility functions
│   ├── constants.ts                     # Constants and configuration
│   └── api-utils.ts                     # API helper functions
│
├── 📁 public/                           # Static assets
│   └── [Images, fonts, etc.]
│
├── 📁 styles/                           # Global styles
│   └── globals.css                      # Tailwind + global CSS
│
├── 📁 types/                            # TypeScript type definitions
│   └── index.ts                         # Exported types
│
├── 📋 Configuration Files
│   ├── package.json                     # Dependencies & scripts
│   ├── tsconfig.json                    # TypeScript configuration
│   ├── next.config.js                   # Next.js configuration
│   ├── vercel.json                      # Vercel deployment config
│   ├── tailwind.config.js               # Tailwind CSS configuration
│   ├── postcss.config.js                # PostCSS with Tailwind
│   ├── .eslintrc.json                   # ESLint configuration
│   ├── .prettierrc                      # Prettier code formatting
│   └── middleware.ts                    # Request middleware (optional)
│
├── 📝 Environment & Git
│   ├── .env.local                       # Local environment variables (not in git)
│   ├── .env.example                     # Template for env variables
│   └── .gitignore                       # Git ignore rules
│
├── 📚 Documentation
│   ├── README.md                        # Full documentation
│   ├── QUICKSTART.md                    # Quick start guide
│   ├── DEPLOYMENT.md                    # Vercel deployment guide
│   └── PROJECT_STRUCTURE.md             # This file
│
└── 📄 Original File (For Reference)
    └── astral_gym_system (1).html       # Original HTML file
```

## Key Directories

### `app/`
- **Purpose**: Contains all pages and API routes (Next.js 13+ App Router)
- **Pages**: Automatically become routes
- **API Routes**: In `app/api/` subdirectory
- **Layouts**: Define page structure

### `components/`
- **Purpose**: Reusable React components
- **Organization**: Group by feature if needed
- **Usage**: Import and use throughout app

### `lib/`
- **Purpose**: Helper functions and utilities
- **Files**:
  - `constants.ts`: Colors, API endpoints, types
  - `api-utils.ts`: Fetch wrapper and validation

### `styles/`
- **Purpose**: Global CSS and Tailwind setup
- **Main File**: `globals.css`
- **Customization**: Tailwind config in root

### `types/`
- **Purpose**: Shared TypeScript types
- **File**: `index.ts` exports all types
- **Usage**: `import type { Member } from '@/types'`

## File Creation Checklist

- ✅ `package.json` - Project dependencies
- ✅ `tsconfig.json` - TypeScript settings
- ✅ `next.config.js` - Next.js configuration
- ✅ `vercel.json` - Vercel deployment settings
- ✅ `tailwind.config.js` - Tailwind theming
- ✅ `postcss.config.js` - PostCSS setup
- ✅ `.eslintrc.json` - Code quality
- ✅ `.prettierrc` - Code formatting
- ✅ `.gitignore` - Git exclusions
- ✅ `.env.local` - Local variables
- ✅ `.env.example` - Variable template
- ✅ `middleware.ts` - Request middleware
- ✅ All necessary directories created
- ✅ Sample pages and API routes
- ✅ Type definitions
- ✅ Utility functions
- ✅ Comprehensive documentation

## Next: Initialize Git & Install Dependencies

```bash
# Initialize git repository
git init

# Install dependencies
npm install

# Start development server
npm run dev
```

## Deployment Ready

Your project is fully configured for Vercel deployment:
- ✅ `vercel.json` properly configured
- ✅ Next.js best practices implemented
- ✅ Environment variables structured
- ✅ TypeScript type-safe
- ✅ Performance optimized

See `DEPLOYMENT.md` for deployment instructions.

---

**Created**: March 30, 2026
**Framework**: Next.js 14 with App Router
**Styling**: Tailwind CSS 3.3.6
**Target**: Vercel Deployment
