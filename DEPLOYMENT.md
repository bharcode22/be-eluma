# 🚀 Eluma Backend - Vercel Deployment Guide

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI** (Optional): `npm i -g vercel`
3. **Database**: PostgreSQL database (recommended: Neon, Supabase, or Railway)

## 🔧 Setup Steps

### 1. Prepare Your Database

Since Vercel is serverless, you need an external database. Recommended options:

#### Option A: Neon (Recommended - Free Tier Available)
```bash
# Visit https://neon.tech
# Create a new project
# Copy the connection string
```

#### Option B: Supabase
```bash
# Visit https://supabase.com
# Create a new project
# Go to Settings > Database
# Copy the connection string
```

#### Option C: Railway
```bash
# Visit https://railway.app
# Create a PostgreSQL database
# Copy the connection string
```

### 2. Update Environment Variables

Create these environment variables in Vercel Dashboard:

```env
DATABASE_URL=postgresql://user:password@host:5432/database?schema=public
JWT_SECRET=your-super-secret-jwt-key-here
PORT=3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NODE_ENV=production
```

### 3. Deploy to Vercel

#### Method 1: Using Vercel Dashboard (Easiest)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Select the `backend` folder as root directory
4. Add environment variables in Settings
5. Click "Deploy"

#### Method 2: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to backend folder
cd backend

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

### 4. Run Database Migrations

After first deployment, you need to run Prisma migrations:

```bash
# Option 1: Using Vercel CLI
vercel env pull .env.production
npx prisma migrate deploy

# Option 2: Add to package.json build script
# Already configured in vercel.json
```

## 📁 Project Structure

```
backend/
├── api/
│   └── index.ts          # Vercel serverless handler
├── src/
│   ├── main.ts           # NestJS entry point
│   ├── app.module.ts     # Root module
│   └── ...               # Other modules
├── prisma/
│   └── schema.prisma     # Database schema
├── propertyImages/       # Static files
├── vercel.json           # Vercel configuration
├── .vercelignore         # Files to ignore
└── package.json          # Dependencies
```

## 🔑 Important Configuration Files

### `vercel.json`
- Configures Vercel build and routing
- Maps all requests to serverless function
- Handles static file serving

### `api/index.ts`
- Serverless function wrapper for NestJS
- Handles CORS configuration
- Implements app caching for performance

## ⚙️ Environment Variables Setup in Vercel

1. Go to your project in Vercel Dashboard
2. Click "Settings" > "Environment Variables"
3. Add each variable:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: Random secure string (use: `openssl rand -base64 32`)
   - `PORT`: `3000`
   - `GOOGLE_CLIENT_ID`: From Google Cloud Console
   - `GOOGLE_CLIENT_SECRET`: From Google Cloud Console
   - `NODE_ENV`: `production`

## 🗄️ Database Setup

### Initialize Prisma

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# (Optional) Seed database
npx prisma db seed
```

## 🔍 Troubleshooting

### Issue: "Cannot find module '@prisma/client'"
**Solution**: Make sure `prisma generate` runs during build
```json
// package.json
"scripts": {
  "build": "nest build && npx prisma generate"
}
```

### Issue: "Database connection failed"
**Solution**: 
1. Check DATABASE_URL format
2. Ensure database is accessible from internet
3. Check firewall/security group settings

### Issue: "Function timeout"
**Solution**: 
1. Upgrade to Vercel Pro for longer timeouts
2. Optimize database queries
3. Add indexes to frequently queried fields

### Issue: "Static files not loading"
**Solution**: 
1. Check `vercel.json` routes configuration
2. Ensure files are in `propertyImages` folder
3. Use absolute URLs in frontend

## 📊 Monitoring

### View Logs
```bash
# Real-time logs
vercel logs

# Specific deployment
vercel logs [deployment-url]
```

### Performance Monitoring
- Go to Vercel Dashboard > Your Project > Analytics
- Monitor function execution time
- Check error rates

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to:
- **Production**: `main` or `master` branch
- **Preview**: Any other branch or pull request

## 🌐 Custom Domain

1. Go to Project Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate provisioning

## 📝 Post-Deployment Checklist

- [ ] Database migrations completed
- [ ] Environment variables configured
- [ ] API endpoints working
- [ ] CORS configured correctly
- [ ] Static files accessible
- [ ] Authentication working
- [ ] Google OAuth configured
- [ ] Error monitoring setup

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [NestJS Deployment](https://docs.nestjs.com/faq/serverless)
- [Prisma with Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)

## 💡 Tips

1. **Use Connection Pooling**: For Prisma with serverless
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
     directUrl = env("DIRECT_URL")
   }
   ```

2. **Optimize Cold Starts**: Keep dependencies minimal

3. **Use Edge Functions**: For better global performance (if supported)

4. **Monitor Costs**: Check Vercel usage dashboard regularly

## 🆘 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review Prisma migration status
3. Verify environment variables
4. Check database connectivity
5. Contact Vercel support

---

**Happy Deploying! 🎉**
