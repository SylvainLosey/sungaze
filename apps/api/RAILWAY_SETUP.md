# Railway Deployment Setup

This guide will help you deploy the Sungaze API (and other services) to Railway.

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

1. Railway will auto-detect the project from the **repo root**
2. **No Root Directory needed!** - We deploy from the root to support multiple services
3. Railway will automatically detect `nixpacks.toml` at the root

### 3. Configure Build Settings

Railway will auto-detect the build settings from `nixpacks.toml` at the repo root. The configuration uses **Turbo** for proper monorepo builds:

- **Install Phase**: Runs `pnpm install --frozen-lockfile` from repo root
- **Build Phase**: Uses `pnpm exec turbo build --filter=@sungaze/api...`
  - The `...` syntax builds `@sungaze/api` and all its dependencies
  - Turbo respects the dependency graph (`^build` in `turbo.json`)
  - This ensures `@sungaze/core` is built before `@sungaze/api`
- **Start Command**: `pnpm --filter @sungaze/api start` (runs the compiled server)

### 4. Environment Variables

Railway will automatically set:

- `PORT` - The port Railway assigns (usually 3000 or similar)
- `NODE_ENV` - Set to `production`

**Optional**: To deploy a different service, set:

- `RAILWAY_SERVICE` - The package name to deploy (defaults to `@sungaze/api`)
  - For API: `RAILWAY_SERVICE=@sungaze/api` (or leave unset)
  - For Web: `RAILWAY_SERVICE=@sungaze/web`

### 5. Deploy

1. Railway will automatically deploy when you push to your main branch
2. Or click "Deploy" in the Railway dashboard
3. Wait for the build to complete

### 6. Get Your Deployment URL

1. Once deployed, Railway will provide a URL like: `https://your-app.railway.app`
2. Copy this URL - you'll need it for the mobile app configuration

### 7. Update Mobile App Configuration

1. Create a `.env` file in `apps/mobile/`:
   ```
   EXPO_PUBLIC_API_URL=https://your-app.railway.app
   ```
2. Restart your Expo dev server: `pnpm dev`

### 8. Test the Deployment

1. Visit `https://your-app.railway.app/` in your browser
2. You should see: `{"status":"ok","engineVersion":"..."}`
3. Test the tRPC endpoint: `https://your-app.railway.app/trpc`

## Deploying Multiple Services

Since we deploy from the repo root, you can easily deploy multiple services in the same Railway project:

### Add the Web App

1. In your Railway project, click "+ New" → "Service"
2. Select "GitHub Repo" and choose the same `sungaze` repository
3. **Important**: Don't set a root directory (deploy from root)
4. Set environment variable: `RAILWAY_SERVICE=@sungaze/web`
5. Railway will build and deploy the web app using the same `nixpacks.toml`

### Service Configuration

Each service in Railway can have:

- Different `RAILWAY_SERVICE` env var to specify which package to run
- Different ports (Railway handles this automatically)
- Different environment variables
- Same build process (uses root `nixpacks.toml`)

## How IP Detection Works

When your iPhone connects to the Railway server:

1. The iPhone makes a request to the Railway URL
2. Railway forwards the request to your Fastify server
3. Fastify extracts the real client IP from the `X-Forwarded-For` header (thanks to `trustProxy: true`)
4. The backend uses IP geolocation to determine the iPhone's location
5. The location is used to calculate sun position

## Troubleshooting

### Build Fails

- Ensure you're deploying from repo root (no root directory set)
- Check that `pnpm-lock.yaml` exists in the repo root
- Verify all workspace dependencies are properly configured
- Check that Turbo is available (it's in root `package.json` devDependencies)
- Verify `turbo.json` has correct build task configuration
- Check Railway logs for specific build errors

### Server Won't Start

- Check Railway logs for errors
- Verify `PORT` environment variable is being used
- Ensure Turbo build completed successfully (check build logs)
- Verify `dist/` directory exists in `apps/api` after build
- Check that `RAILWAY_SERVICE` env var is set correctly (or defaults to `@sungaze/api`)

### IP Detection Not Working

- Verify `trustProxy: true` is set in `src/index.ts`
- Check Railway logs to see what IP is being detected
- Test with: `curl https://your-app.railway.app/` and check logs

### CORS Issues

- The server is configured to allow all origins in development
- For production, you may want to restrict CORS origins

### Can't Find Root Directory Setting

If you can't find the Root Directory setting in Railway:

- **You don't need it!** We deploy from the repo root
- If Railway asks for a root directory, leave it empty or set it to `.` (current directory)
- The `nixpacks.toml` at the root will be automatically detected

## Cost

Railway offers:

- $5 free credit per month
- Pay-as-you-go pricing after that
- Typical cost: $5-10/month for a small API
- Each service is billed separately

## Optional: Turbo Remote Caching

For faster builds, you can enable Turbo's remote caching:

1. Sign up for [Turbo Remote Cache](https://turbo.build/repo/docs/core-concepts/remote-caching)
2. Get your `TURBO_TOKEN` and `TURBO_TEAM` from Turbo dashboard
3. Add these as environment variables in Railway (project-level or service-level):
   - `TURBO_TOKEN` - Your Turbo authentication token
   - `TURBO_TEAM` - Your Turbo team name
4. Railway builds will now use remote cache, making subsequent builds much faster

## Next Steps

After deployment:

1. Update mobile app `.env` with Railway URL
2. Test on physical iPhone to verify real IP detection
3. Consider setting up custom domain (optional)
4. Set up monitoring/alerts (optional)
5. Enable Turbo remote caching for faster builds (optional)
6. Add more services (web app, etc.) using the same approach
