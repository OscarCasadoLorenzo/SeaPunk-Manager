# SeaPunk Manager

A full-stack desktop application built with **Electron**, **React**, **Node.js**, and **PostgreSQL**. This modern task management application follows best practices for security, performance, and maintainability.

![SeaPunk Manager](https://via.placeholder.com/800x400?text=SeaPunk+Manager+Screenshot)

## 🚀 Features

- **Desktop Application**: Cross-platform Electron app for Windows, macOS, and Linux
- **Modern UI**: React with TypeScript and Tailwind CSS
- **Real-time Data**: TanStack Query (React Query) for efficient data fetching and caching
- **Robust Backend**: Node.js with Express.js and PostgreSQL
- **Type Safety**: Full TypeScript support across the entire stack
- **Database ORM**: Prisma for type-safe database operations
- **Security**: Content Security Policy, rate limiting, and secure communication
- **Development Tools**: Hot reload, ESLint, and comprehensive error handling

## 🛠️ Tech Stack

### Frontend (Renderer)

- **React 18** - Modern React with hooks
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **TanStack Query** - Data fetching and state management
- **React Router** - Client-side routing
- **Heroicons** - Beautiful SVG icons
- **Vite** - Fast build tool and development server

### Backend (API)

- **Node.js** (LTS) - JavaScript runtime
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **Prisma** - Database ORM and query builder
- **TypeScript** - Type safety for backend code
- **Security packages** - Helmet, CORS, rate limiting

### Desktop (Electron)

- **Electron** - Desktop app framework
- **Security best practices** - Context isolation, preload scripts
- **Cross-platform** - Windows, macOS, Linux support

## 📁 Project Structure

```
SeaPunk-Manager/
├── electron/                 # Electron main process
│   ├── main.ts              # Main process entry point
│   ├── preload.ts           # Preload script for security
│   └── tsconfig.json        # TypeScript config for Electron
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── server.ts        # Express server setup
│   │   └── seed.ts          # Database seeding script
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   └── package.json         # Backend dependencies
├── renderer/                # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service functions
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
├── dist/                    # Build output
├── build/                   # Electron build output
└── package.json             # Root package.json
```

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (LTS version 18.x or higher)
- **PostgreSQL** (12.x or higher)
- **npm** or **yarn**

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/seapunk-manager.git
cd seapunk-manager
```

### 2. Install dependencies

```bash
# Install root dependencies
npm install

# This will automatically install backend and renderer dependencies
```

### 3. Database Setup

#### Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE seapunk_db;

# Create user (optional)
CREATE USER seapunk_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE seapunk_db TO seapunk_user;
```

#### Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your database credentials
DATABASE_URL="postgresql://username:password@localhost:5432/seapunk_db"
PORT=3001
NODE_ENV=development
ELECTRON_IS_DEV=true
```

#### Run Database Migrations

```bash
# Navigate to backend directory
cd backend

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed the database with sample data
npm run db:seed
```

## 🚀 Development

### Start the Development Environment

```bash
# From the root directory
npm run dev
```

This command will:

1. Start the backend API server on `http://localhost:3001`
2. Start the Electron app with hot reload

### Individual Development Commands

```bash
# Backend only
npm run dev:backend

# Frontend only (for web development)
cd renderer && npm run dev

# Electron only (requires backend to be running)
npm run dev:electron
```

### Database Management

```bash
# Open Prisma Studio (Database GUI)
cd backend && npm run db:studio

# Reset database
cd backend && npx prisma migrate reset

# Generate Prisma client after schema changes
cd backend && npm run db:generate
```

## 🏗️ Building for Production

### Build All Components

```bash
npm run build
```

### Build Individual Components

```bash
# Backend
npm run build:backend

# Frontend
npm run build:renderer

# Electron
npm run build:electron
```

## 📦 Packaging

### Package for Current Platform

```bash
npm run package
```

### Package for Specific Platforms

```bash
# Windows
npm run package:win

# macOS
npm run package:mac
```

The packaged applications will be available in the `build/` directory.

## 🔒 Security Features

- **Content Security Policy** - Prevents XSS attacks
- **Context Isolation** - Secure communication between processes
- **Preload Scripts** - Secure API exposure to renderer
- **Rate Limiting** - API protection against abuse
- **Input Validation** - Server-side validation
- **CORS Configuration** - Secure cross-origin requests

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Fix linting issues
npm run lint -- --fix
```

## 📚 API Documentation

### Users API

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Tasks API

- `GET /api/tasks` - Get all tasks (with optional filters)
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Query Parameters

```bash
# Filter tasks
GET /api/tasks?userId=123&completed=false&priority=HIGH
```

## 🔧 Configuration

### Environment Variables

| Variable          | Description                  | Default     |
| ----------------- | ---------------------------- | ----------- |
| `DATABASE_URL`    | PostgreSQL connection string | -           |
| `PORT`            | Backend server port          | 3001        |
| `NODE_ENV`        | Environment mode             | development |
| `ELECTRON_IS_DEV` | Electron development mode    | true        |

### Database Schema

The application uses the following main entities:

- **Users**: User accounts with authentication
- **Tasks**: Task management with priorities and due dates

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Error**

   - Ensure PostgreSQL is running
   - Check connection string in `.env`
   - Verify database exists

2. **Port Already in Use**

   - Change `PORT` in `.env` file
   - Kill existing processes: `lsof -ti:3001 | xargs kill`

3. **Build Errors**

   - Clear node_modules: `rm -rf node_modules && npm install`
   - Clear build cache: `npm run clean`

4. **Electron Won't Start**
   - Ensure backend is running first
   - Check for TypeScript compilation errors

### Debug Mode

```bash
# Enable debug logging
DEBUG=* npm run dev

# Backend debug only
cd backend && DEBUG=express:* npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- [Electron](https://electronjs.org/) - Desktop app framework
- [React](https://reactjs.org/) - Frontend library
- [Prisma](https://prisma.io/) - Database ORM
- [TanStack Query](https://tanstack.com/query) - Data fetching library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

---

**Made with ❤️ using modern web technologies**
