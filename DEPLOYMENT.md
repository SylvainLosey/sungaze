# Deployment Guide

## Railway Server Setup

### Quick Steps

1. **Deploy to Railway:**
   - Go to [railway.app](https://railway.app)
   - Create new project from GitHub repo
   - **Set Root Directory to `apps/api`** (important!)
   - Railway will auto-deploy

2. **Get your Railway URL:**
   - After deployment, copy your Railway URL (e.g., `https://your-app.railway.app`)

3. **Configure Mobile App:**
   - Create `.env` file in `apps/mobile/`:
     ```
     EXPO_PUBLIC_API_URL=https://your-app.railway.app
     ```
   - Restart Expo dev server: `pnpm dev`

4. **Test on iPhone:**
   - Open Expo Go on your iPhone
   - Scan QR code from `pnpm dev`
   - The app will connect to Railway and use your iPhone's real IP for location detection

## How It Works

When your iPhone connects to the Railway server:

- ✅ iPhone makes request to Railway URL (publicly accessible)
- ✅ Railway forwards request to Fastify with real client IP
- ✅ Backend detects iPhone's real IP from `X-Forwarded-For` header
- ✅ IP geolocation service determines location
- ✅ Sun position calculated based on real location

## Files Changed

- `apps/api/src/index.ts` - Now uses `PORT` from environment
- `apps/api/railway.json` - Railway configuration
- `apps/api/nixpacks.toml` - Build configuration for monorepo
- `apps/mobile/src/lib/trpc-client.ts` - Uses `EXPO_PUBLIC_API_URL` environment variable
- `apps/mobile/app.json` - Added `extra.apiUrl` placeholder

## Environment Variables

### Server (Railway)

- `PORT` - Automatically set by Railway
- `HOST` - Optional, defaults to `0.0.0.0`

### Mobile App

- `EXPO_PUBLIC_API_URL` - Set to your Railway URL (e.g., `https://your-app.railway.app`)

## Testing

1. **Test server:**

   ```bash
   curl https://your-app.railway.app/
   # Should return: {"status":"ok","engineVersion":"..."}
   ```

2. **Test on iPhone:**
   - Set `EXPO_PUBLIC_API_URL` in `.env`
   - Run `pnpm dev` in `apps/mobile`
   - Open Expo Go and scan QR code
   - App should connect to Railway and detect your real location

## Troubleshooting

See `apps/api/RAILWAY_SETUP.md` for detailed troubleshooting.
