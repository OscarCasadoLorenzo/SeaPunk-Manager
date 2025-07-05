# SeaPunk Manager

This project is an Electron desktop application using React (Vite), Tailwind CSS, and a PostgreSQL database managed with Prisma ORM.

## Tech Stack

- **Electron**: Desktop application framework
- **React + Vite**: Frontend UI
- **Tailwind CSS**: Utility-first CSS framework
- **Prisma ORM**: Database ORM for PostgreSQL

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up the database

- Configure your PostgreSQL connection in `.env` (created by Prisma)
- Run Prisma migrations:

```bash
npx prisma migrate dev
```

### 3. Start the app

```bash
npm run dev
```

## Folder Structure

- `src/` - React frontend code
- `prisma/` - Prisma schema and migrations
- `main/` - Electron main process (to be created)

## Customization

- Update `prisma/schema.prisma` for your data models
- Add Electron main process code in `main/`

---

For more details, see the documentation for each technology.
# SeaPunk-Manager
