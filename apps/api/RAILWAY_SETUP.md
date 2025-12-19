# Railway Deployment Setup

This guide will help you deploy the Sungaze API to Railway.

## Prerequisites

1. A Railway account (sign up at [railway.app](https://railway.app))
2. Your GitHub repository connected to Railway

## Deployment Steps

### 1. Create a New Project on Railway

1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `sungaze` repository

### 2. Configure the Service

1. Railway will auto-detect the project
2. **Important**: Set the **Root Directory** to `apps/api`
   - Go to Settings → Source → Root Directory
   - Enter: `apps/api`

### 3. Configure Build Settings

Railway should auto-detect the build settings from `nixpacks.toml`, but verify:

- **Build Command**: Should run `pnpm install` and build dependencies
- **Start Command**: `pnpm start`

### 4. Environment Variables

Railway will automatically set:
- `PORT` - The port Railway assigns (usually 3000 or similar)
- `NODE_ENV` - Set to `production`

No additional environment variables are required for basic deployment.

### 5. Deploy

1. Railway will automatically deploy when you push to your main branch
2. Or click "Deploy" in the Railway dashboard
3. Wait for the build to complete

### 6. Get Your Deployment URL

1. Once deployed, Railway will provide a URL like: `https://your-app.railway.app`
2. Copy this URL - you'll need it for the mobile app configuration

### 7. Update Mobile App Configuration

1. Create a `.env` file in `apps/mobile/` (copy from `.env.example`)
2. Set `EXPO_PUBLIC_API_URL` to your Railway URL:
   ```
   EXPO_PUBLIC_API_URL=https://your-app.railway.app
   ```
3. Restart your Expo dev server: `pnpm dev`

### 8. Test the Deployment

1. Visit `https://your-app.railway.app/` in your browser
2. You should see: `{"status":"ok","engineVersion":"..."}`
3. Test the tRPC endpoint: `https://your-app.railway.app/trpc`

## How IP Detection Works

When your iPhone connects to the Railway server:
1. The iPhone makes a request to the Railway URL
2. Railway forwards the request to your Fastify server
3. Fastify extracts the real client IP from the `X-Forwarded-For` header (thanks to `trustProxy: true`)
4. The backend uses IP geolocation to determine the iPhone's location
5. The location is used to calculate sun position

## Troubleshooting

### Build Fails

- Ensure Root Directory is set to `apps/api`
- Check that `pnpm-lock.yaml` exists in the repo root
- Verify all workspace dependencies are properly configured

### Server Won't Start

- Check Railway logs for errors
- Verify `PORT` environment variable is being used
- Ensure `@sungaze/core` package is built before the API

### IP Detection Not Working

- Verify `trustProxy: true` is set in `src/index.ts`
- Check Railway logs to see what IP is being detected
- Test with: `curl https://your-app.railway.app/` and check logs

### CORS Issues

- The server is configured to allow all origins in development
- For production, you may want to restrict CORS origins

## Cost

Railway offers:
- $5 free credit per month
- Pay-as-you-go pricing after that
- Typical cost: $5-10/month for a small API

## Next Steps

After deployment:
1. Update mobile app `.env` with Railway URL
2. Test on physical iPhone to verify real IP detection
3. Consider setting up custom domain (optional)
4. Set up monitoring/alerts (optional)

