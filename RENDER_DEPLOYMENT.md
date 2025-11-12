# Render Deployment Guide for SeaPunk Manager API

This guide explains how to deploy the NestJS backend API to Render.

## Prerequisites

1. A Render account (sign up at https://render.com)
2. Your repository pushed to GitHub
3. PostgreSQL database connection string

## Deployment Steps

### Option 1: Using render.yaml (Recommended)

The repository includes a `render.yaml` file that automates the deployment process.

1. **Connect Your Repository to Render**
   - Go to https://render.com/dashboard
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Select the branch: `develop`
   - Render will automatically detect the `render.yaml` file

2. **The Blueprint Will Create:**
   - A PostgreSQL database (`seapunk-db`)
   - A web service for the NestJS API (`seapunk-api`)
   - All necessary environment variables

3. **Deploy**
   - Click "Apply" to create the services
   - Render will automatically:
     - Install dependencies
     - Run Prisma migrations
     - Generate Prisma Client
     - Build the NestJS application
     - Start the server

### Option 2: Manual Setup

If you prefer to set up manually:

1. **Create PostgreSQL Database**
   - New → PostgreSQL
   - Name: `seapunk-db`
   - Database: `seapunk_manager`
   - User: `seapunk_user`
   - Region: Oregon (or your preferred region)
   - Plan: Free

2. **Create Web Service**
   - New → Web Service
   - Connect your repository
   - Configuration:
     - Name: `seapunk-api`
     - Region: Oregon
     - Branch: `develop`
     - Runtime: Node
     - Build Command:
       ```bash
       npm install && npx prisma generate --schema=apps/backend-rest/prisma/schema.prisma && npx prisma migrate deploy --schema=apps/backend-rest/prisma/schema.prisma && npm run backend:build
       ```
     - Start Command:
       ```bash
       cd apps/backend-rest && npm run start:prod
       ```

3. **Environment Variables**
   Add these in the Render dashboard under "Environment":

   | Key              | Value             | Note                             |
   | ---------------- | ----------------- | -------------------------------- |
   | `NODE_ENV`       | `production`      |                                  |
   | `PORT`           | `10000`           | Render's default port            |
   | `DATABASE_URL`   | (from database)   | Link to your PostgreSQL database |
   | `JWT_SECRET`     | (generate random) | Generate a secure random string  |
   | `JWT_EXPIRATION` | `7d`              | Token expiration time            |

## Environment Variables Details

### Required Variables

- **DATABASE_URL**: PostgreSQL connection string
  - Format: `postgresql://user:password@host:port/database`
  - Provided by Render PostgreSQL database

- **JWT_SECRET**: Secret key for JWT token signing
  - Generate a secure random string (at least 32 characters)
  - Example generation: `openssl rand -base64 32`

- **NODE_ENV**: Set to `production`

- **PORT**: Set to `10000` (Render's default)

### Optional Variables

- **JWT_EXPIRATION**: Token expiration time (default: `7d`)

## Post-Deployment

### Verify Deployment

1. Check the deployment logs in Render dashboard
2. Access your API at: `https://seapunk-api.onrender.com`
3. Check Swagger documentation at: `https://seapunk-api.onrender.com/api`

### Run Migrations

Migrations run automatically during deployment via `prisma migrate deploy`.

If you need to run migrations manually:

1. Go to your web service in Render
2. Open the Shell tab
3. Run:
   ```bash
   cd apps/backend-rest
   npx prisma migrate deploy
   ```

### Database Seeding

To seed the database with initial data:

1. Open the Shell in Render
2. Run:
   ```bash
   cd apps/backend-rest
   npm run db:seed
   ```

## Monorepo Configuration

This is a monorepo using npm workspaces and Turborepo. Key points:

- **Root**: Contains workspace configuration
- **Build**: Uses the root-level `backend:build` script
- **Dependencies**: Workspace packages use `*` version to link locally
  - `@seapunk/tsconfig`
  - Other shared packages

## Troubleshooting

### Build Fails with "Cannot find module"

- Ensure all workspace dependencies use `*` version
- Check that `npm install` runs from the repository root

### Prisma Client Generation Fails

- Verify `DATABASE_URL` is set correctly
- Check that the Prisma schema path is correct in build command

### Database Connection Issues

- Verify `DATABASE_URL` environment variable
- Check that the PostgreSQL database is running
- Ensure IP allowlist is configured (or empty for public access)

### Port Issues

- Make sure `PORT` environment variable is set to `10000`
- Verify `main.ts` uses `process.env.PORT`

## Updating Deployment

### Automatic Deployments

Render automatically deploys when you push to the `develop` branch.

### Manual Deployment

1. Go to your web service in Render
2. Click "Manual Deploy" → "Deploy latest commit"

## Cost Optimization

**Free Tier Limitations:**

- Web service spins down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- 750 hours/month free (sufficient for one service running 24/7)
- PostgreSQL: 90 days free, then $7/month

**Upgrading:**

- Consider upgrading to paid tier ($7/month) for:
  - No spin-down
  - Faster performance
  - More resources

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Render PostgreSQL Guide](https://render.com/docs/databases)
- [NestJS Deployment](https://docs.nestjs.com/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-render)
