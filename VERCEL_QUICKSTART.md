# ⚡ Quick Start - Vercel Deployment

## 🎯 One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/eluma)

## 🚀 Manual Deployment (5 Minutes)

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
# Navigate to backend folder
cd backend

# Run deployment script
./deploy.sh

# OR manually deploy
vercel --prod
```

### Step 4: Configure Environment Variables

Go to your Vercel project dashboard and add these variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Secret key for JWT | `your-secret-key-here` |
| `PORT` | Application port | `3000` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | `xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Secret | `GOCSPX-xxx` |
| `NODE_ENV` | Environment | `production` |

### Step 5: Run Database Migrations
```bash
# Pull environment variables from Vercel
vercel env pull .env.production

# Run migrations
npx prisma migrate deploy
```

## ✅ Verify Deployment

Test your API:
```bash
curl https://your-app.vercel.app/api/health
```

## 📚 Full Documentation

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🆘 Common Issues

### "Cannot find module '@prisma/client'"
**Fix**: Ensure `postinstall` script runs
```json
"postinstall": "npx prisma generate"
```

### "Database connection failed"
**Fix**: Check your `DATABASE_URL` in Vercel environment variables

### "Function timeout"
**Fix**: Optimize queries or upgrade to Vercel Pro

## 🔗 Resources

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Docs](https://vercel.com/docs)
- [NestJS Serverless](https://docs.nestjs.com/faq/serverless)
- [Prisma on Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)

---

Need help? Check [DEPLOYMENT.md](./DEPLOYMENT.md) for troubleshooting guide.
