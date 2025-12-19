# Deployment Guide

## Railway Server Setup

### Quick Steps

1. **Deploy to Railway:**
   - Go to [railway.app](https://railway.app)
   - Create new project from GitHub repo
   - **Deploy from repo root** (no root directory needed!)
   - Railway will auto-detect `nixpacks.toml` at root
   - Defaults to deploying `@sungaze/api` service

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
- `nixpacks.toml` (repo root) - **Uses Turbo for monorepo builds from root** (supports multiple services)
- `railway.json` (repo root) - Railway configuration
- `apps/mobile/src/lib/trpc-client.ts` - Uses `EXPO_PUBLIC_API_URL` environment variable
- `apps/mobile/app.json` - Added `extra.apiUrl` placeholder

## Build Process

The Railway deployment uses **Turbo** to build the monorepo from the **repo root**:

1. **Install**: `pnpm install --frozen-lockfile` (installs all workspace dependencies)
2. **Build**: `pnpm exec turbo build --filter=@sungaze/api...`
   - The `...` syntax builds `@sungaze/api` and all its dependencies
   - Turbo automatically builds `@sungaze/core` first (due to `^build` in `turbo.json`)
   - Ensures proper build order and dependency resolution
3. **Start**: `pnpm --filter @sungaze/api start` (runs the compiled server from `dist/`)

## Deploying Multiple Services

Since we deploy from the repo root, you can easily add more services:

1. **Add a new service** (e.g., web app):
   - Create a new Railway service in the same project
   - Set environment variable: `RAILWAY_SERVICE=@sungaze/web`
   - Railway will build and run the web app using the same `nixpacks.toml`

2. **Current services:**
   - **API**: `RAILWAY_SERVICE=@sungaze/api` (or leave unset - this is the default)
   - **Web**: `RAILWAY_SERVICE=@sungaze/web` (set this env var in Railway)

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
