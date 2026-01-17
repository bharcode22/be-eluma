#!/bin/bash

# Eluma Backend - Vercel Deployment Script
# This script helps you deploy your NestJS backend to Vercel

echo "🚀 Eluma Backend - Vercel Deployment Helper"
echo "==========================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "⚠️  Vercel CLI not found!"
    echo "📦 Installing Vercel CLI globally..."
    npm install -g vercel
    echo "✅ Vercel CLI installed successfully!"
    echo ""
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "📝 Please create a .env file with the following variables:"
    echo ""
    cat .env.example
    echo ""
    echo "❌ Deployment cancelled. Please create .env file first."
    exit 1
fi

echo "📋 Pre-deployment Checklist:"
echo ""
echo "1. ✅ Vercel CLI installed"
echo "2. ✅ .env file exists"
echo ""

# Ask for deployment type
echo "🎯 Select deployment type:"
echo "1) Development (Preview)"
echo "2) Production"
read -p "Enter your choice (1 or 2): " deploy_type

echo ""
echo "🔍 Checking dependencies..."
npm install

echo ""
echo "🏗️  Building project..."
npm run build

echo ""
echo "🧪 Generating Prisma Client..."
npx prisma generate

echo ""
if [ "$deploy_type" = "2" ]; then
    echo "🚀 Deploying to Production..."
    vercel --prod
else
    echo "🚀 Deploying to Preview..."
    vercel
fi

echo ""
echo "✅ Deployment initiated!"
echo ""
echo "📝 Next Steps:"
echo "1. Configure environment variables in Vercel Dashboard"
echo "2. Run database migrations: npx prisma migrate deploy"
echo "3. Test your API endpoints"
echo ""
echo "🔗 Useful Commands:"
echo "  - View logs: vercel logs"
echo "  - List deployments: vercel ls"
echo "  - Remove deployment: vercel rm [deployment-url]"
echo ""
echo "Happy deploying! 🎉"
