#!/bin/bash
# Vercel Build Script with Database Migration

echo "🔧 Installing dependencies..."
npm install

echo "🔧 Generating Prisma Client..."
npx prisma generate

echo "🗄️ Running database migrations..."
npx prisma migrate deploy

echo "🏗️ Building Next.js app..."
npm run build
