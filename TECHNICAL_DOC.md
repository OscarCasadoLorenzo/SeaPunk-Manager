# SeaPunk Manager — Technical Documentation

## Environment Variable Configuration

This project uses a split environment variable strategy to ensure security and clarity between the Electron backend (main process) and the React frontend (renderer).

### 1. `.env.main` — Backend (Main Process)

- **Purpose:** Stores secrets and configuration for the Electron main process and Node.js backend code.
- **Usage:** Loaded by the Electron main process (see `forge.config.ts`).
- **Contents:**
  - Database credentials (e.g., `DATABASE_URL`, `PGUSER`, `PGPASSWORD`)
  - Any other backend-only secrets or config
- **Security:** Never expose these variables to the frontend.

### 2. `.env.renderer` — Frontend (Renderer)

- **Purpose:** Stores public configuration for the React/Vite renderer process.
- **Usage:** Loaded by Vite (see `vite.config.ts`).
- **Contents:**
  - Only variables prefixed with `VITE_` are exposed to the frontend (e.g., `VITE_API_URL`)
  - Do **not** put secrets here
- **Security:** Only safe, public config should be placed here.

### 3. `.env` (legacy)

- If present, this file is ignored in favor of `.env.main` and `.env.renderer`.
- You may delete or archive `.env` if you wish.

### 4. How it works

- **Backend:** Loads `.env.main` using `dotenv` in `forge.config.ts`.
- **Frontend:** Loads `.env.renderer` using Vite's `loadEnv` in `vite.config.ts`. Only `VITE_` variables are injected into the React app.

### 5. Example

```
# .env.main (backend only)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/seapunkdb
PGUSER=postgres
PGPASSWORD=postgres

# .env.renderer (frontend only)
VITE_API_URL=http://localhost:3000/api
```

### 6. Best Practices

- Never put secrets or database credentials in `.env.renderer` or with the `VITE_` prefix.
- Use `.env.main` for all backend-only config.
- Use `.env.renderer` for all frontend config, always with the `VITE_` prefix.
- If you add new environment variables, update the documentation and configs as needed.

---

For more details, see the comments in `vite.config.ts` and `forge.config.ts`.
