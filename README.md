# SeaPunk Manager

A modern character and campaign management tool for SeaPunk RPG built with **Next.js 15**, **NestJS 10**, and **shadcn/ui** in a Turborepo monorepo.

## 🏗️ Project Structure

```
.
├── apps/
│   ├── frontend/           # Next.js 15 web application
│   └── backend-rest/       # NestJS 10 REST API server
├── packages/
│   ├── ui/                # Shared UI components (shadcn/ui)
│   ├── tsconfig/          # Shared TypeScript configurations
│   └── config/            # Shared ESLint & Prettier configs
├── turbo.json             # Turborepo pipeline configuration
└── package.json           # Root workspace configuration
```

## 🚀 Features

- **Modern Frontend**: Next.js 15 with App Router, React 19, and Server Components
- **Type-Safe Backend**: NestJS 10 with TypeScript, Prisma ORM, and Swagger API docs
- **Shared UI Library**: shadcn/ui components with Tailwind CSS 4 and Radix UI primitives
- **Monorepo Architecture**: Turborepo for optimized builds and caching
- **Database Access**: Prisma ORM with PostgreSQL for type-safe queries
- **API Integration**: TanStack Query v5 for server state management
- **Authentication**: JWT-based auth with Passport.js strategies
- **Development Tools**: ESLint, Prettier, TypeScript strict mode

## 🛠️ Tech Stack

### Frontend (Next.js App)

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with Server Components
- **TypeScript 5** - Type safety and developer experience
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components
- **TanStack Query v5** - Data fetching and caching
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful SVG icons

### Backend (NestJS API)

- **NestJS 10** - Progressive Node.js framework
- **Node.js 22+** - JavaScript runtime
- **PostgreSQL** - Relational database
- **Prisma 5** - Next-generation ORM
- **TypeScript 5** - Type safety for backend
- **Passport.js** - Authentication middleware
- **JWT** - JSON Web Tokens for auth
- **Swagger/OpenAPI** - API documentation
- **Class Validator** - Request validation
- **Security**: Helmet, CORS, rate limiting

### Shared Packages

- **@seapunk/ui** - Shared React components library
- **@seapunk/config** - ESLint and Prettier configurations
- **@seapunk/tsconfig** - TypeScript base configurations

## 📁 Detailed Project Structure

### Apps

```
apps/
├── frontend/                # Next.js 15 Web Application
│   ├── app/                # Next.js App Router (pages, layouts)
│   ├── components/         # React components
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom React hooks (API, state management)
│   ├── lib/                # Utility libraries (API client, Prisma)
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Helper functions
│   └── package.json
│
└── backend-rest/           # NestJS 10 REST API
    ├── src/
    │   ├── main.ts         # Application entry point
    │   ├── app.module.ts   # Root module
    │   ├── [feature]/      # Feature modules (characters, players, auth, etc.)
    │   │   ├── *.controller.ts
    │   │   ├── *.service.ts
    │   │   ├── *.module.ts
    │   │   └── dto/        # Data Transfer Objects
    │   └── prisma/         # Prisma service module
    ├── prisma/
    │   ├── schema.prisma   # Database schema
    │   └── migrations/     # Database migrations
    └── package.json
```

### Packages

```
packages/
├── ui/                     # Shared UI Components Library
│   ├── src/
│   │   ├── primitives/    # shadcn/ui base components (40+ components)
│   │   ├── templates/     # Composite components
│   │   ├── hooks/         # Custom UI hooks
│   │   └── lib/           # Utilities (cn helper, etc.)
│   └── package.json
│
├── config/                 # Shared Configurations
│   ├── eslint/            # ESLint base config
│   └── tsconfig/          # TypeScript base config
│
└── tsconfig/              # TypeScript Configurations
    └── package.json
```

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 22.0.0 or higher ([Download](https://nodejs.org/))
- **npm** 10.9.0 or higher (comes with Node.js)
- **PostgreSQL** 12.x or higher ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/downloads))

## 📦 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/OscarCasadoLorenzo/SeaPunk-Manager.git
cd SeaPunk-Manager
```

### 2. Install Dependencies

```bash
# Install all workspace dependencies (root, apps, and packages)
npm install
```

This will install dependencies for:

- Root workspace
- `apps/frontend` - Next.js application
- `apps/backend-rest` - NestJS API
- `packages/ui` - Shared components
- `packages/config` - Shared configurations
- `packages/tsconfig` - Shared TypeScript configs

### 3. Database Setup

#### Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE seapunk_db;
CREATE USER seapunk_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE seapunk_db TO seapunk_user;

# Exit psql
\q
```

#### Configure Backend Environment

Create `.env` file in `apps/backend-rest/`:

```bash
# Navigate to backend
cd apps/backend-rest

# Create .env file
cat > .env << 'EOF'
# Database
DATABASE_URL="postgresql://seapunk_user:your_secure_password@localhost:5432/seapunk_db"

# Server
NODE_ENV=development
PORT=3001

# JWT Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRATION=7d

# CORS (frontend URL)
FRONTEND_URL=http://localhost:3000
EOF
```

#### Run Database Migrations

```bash
# Still in apps/backend-rest/
npx prisma generate
npx prisma migrate deploy

# Optional: Seed database with sample data
npm run db:seed
```

### 4. Configure Frontend Environment (Optional)

Create `.env.local` file in `apps/frontend/`:

```bash
cd apps/frontend

cat > .env.local << 'EOF'
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
EOF
```

## 🚀 Development

### Start Full Stack Development

From the **root directory**, run:

```bash
npm run dev
```

This will start:

- **Backend API** on `http://localhost:3001`
- **Frontend Web** on `http://localhost:3000`

Both services will run with hot-reload enabled.

#### Backend Only

```bash
# From root
cd apps/backend-rest
npm run dev
```

The API will be available at `http://localhost:3001/api`

Swagger documentation: `http://localhost:3001/api`

#### Frontend Only

```bash
# From root
cd apps/frontend
npm run dev
```

The web app will be available at `http://localhost:3000`

### Database Management

#### Prisma Studio (Visual Database Browser)

```bash
cd apps/backend-rest
npm run db:studio
```

Opens Prisma Studio at `http://localhost:5555`

#### Reset Database

```bash
cd apps/backend-rest
npm run db:reset
```

⚠️ **Warning**: This will delete all data!

### Environment Variables for Production

#### Backend (.env)

```bash
DATABASE_URL=postgresql://user:pass@host:5432/db
NODE_ENV=production
PORT=10000
JWT_SECRET=your-production-secret
JWT_EXPIRATION=7d
FRONTEND_URL=https://your-frontend-url.com
```

#### Frontend (.env.local)

```bash
NEXT_PUBLIC_API_URL=https://your-api-url.com
```

## 🔧 Configuration

### Environment Variables

#### Backend (`apps/backend-rest/.env`)

| Variable         | Description                  | Required | Default     | Example                                    |
| ---------------- | ---------------------------- | -------- | ----------- | ------------------------------------------ |
| `DATABASE_URL`   | PostgreSQL connection string | ✅       | -           | `postgresql://user:pass@localhost:5432/db` |
| `NODE_ENV`       | Environment mode             | ✅       | development | `development`, `production`                |
| `PORT`           | Backend server port          | ✅       | 3001        | `3001`, `10000` (Render)                   |
| `JWT_SECRET`     | Secret key for JWT signing   | ✅       | -           | `your-super-secret-key`                    |
| `JWT_EXPIRATION` | JWT token expiration time    | ❌       | 7d          | `7d`, `24h`, `30m`                         |
| `FRONTEND_URL`   | Frontend URL for CORS        | ❌       | \*          | `http://localhost:3000`                    |

#### Frontend (`apps/frontend/.env.local`)

| Variable              | Description          | Required | Default               | Example                   |
| --------------------- | -------------------- | -------- | --------------------- | ------------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL | ❌       | http://localhost:3001 | `https://api.example.com` |

### Turborepo Configuration

The `turbo.json` file defines the build pipeline:

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    }
  }
}
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
