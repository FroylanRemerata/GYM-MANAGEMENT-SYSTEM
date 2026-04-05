# Deployment Guide

## Deploying to Vercel

This guide covers deploying the Astral Gym Management System to Vercel.

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- Repository pushed to GitHub

## Step 1: Prepare Your Repository

1. Initialize Git (if not already done):
```bash
git init
git add .
git commit -m "Initial commit: Astral Gym setup"
```

2. Create a GitHub repository and push your code:
```bash
git remote add origin https://github.com/your-username/astral-gym.git
git branch -M main
git push -u origin main
```

## Step 2: Import to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Select "Import Git Repository"
4. Paste your repository URL
5. Click "Import"

## Step 3: Configure Environment Variables

1. In Vercel Project Settings, go to "Environment Variables"
2. Add variables from `.env.example`:
   - `NEXT_PUBLIC_API_URL` = Your API URL (leave empty for production)

3. Click "Save"

## Step 4: Deploy

1. Vercel auto-detects Next.js configuration
2. Click "Deploy"
3. Wait for build to complete (~3-5 minutes)

Your site is now live at: `https://astral-gym-xxx.vercel.app`

## Automatic Deployments

- Every push to `main` branch = Production deployment
- Every pull request = Preview deployment
- Deployments take 2-5 minutes

## Custom Domain

1. In Vercel Project Settings → Domains
2. Add your custom domain (e.g., `astral-gym.com`)
3. Follow DNS setup instructions
4. Typically takes 24-48 hours to propagate

## Environment Variables for Production

Update these in Vercel Project Settings:

```env
# Add any production-specific variables here
NEXT_PUBLIC_API_URL=https://api.astral-gym.com
```

## Monitoring & Logs

- **Vercel Dashboard**: Real-time deployment status
- **Function Logs**: View API route performance
- **Analytics**: Track performance metrics

## Rollback a Deployment

1. In Vercel Deployments tab
2. Click on previous deployment
3. Click "Promote to Production"

## Common Issues

### Build Fails
- Check build logs in Vercel
- Ensure all environment variables are set
- Verify TypeScript has no errors: `npm run type-check`

### 404 Pages Not Found
- Check `app/` directory structure
- Ensure `layout.tsx` exists in `app/`
- Restart deployment if files were added

### API Routes Not Working
- Verify file is in `app/api/` directory
- Check file is named `route.ts` not `route.tsx`
- Review error logs in Vercel dashboard

## Performance Tips

1. **Code Splitting**: Next.js handles automatically
2. **Image Optimization**: Use Next.js Image component
3. **Caching**: Configure in `next.config.js`
4. **Monitoring**: Use Vercel Analytics

## Scaling

Vercel automatically scales based on traffic:
- **Hobby Plan**: Free tier, suitable for development/small projects
- **Pro Plan**: $20/month, better performance & support
- **Enterprise**: Custom scaling and solutions

## Security

- HTTPS automatically enabled
- DDoS protection built-in
- Rate limiting available
- Security headers configurable in `next.config.js

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://nextjs.org/learn/deploy)
- Vercel Support Chat (available in dashboard)

---

**First deployment?** Start with the free Hobby plan, upgrade anytime!
