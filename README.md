# Amil Auto Hub

React/Vite storefront with an Express and MongoDB backend, including a protected MVP admin panel for catalogue management.

## Local setup

Use Node.js 22 or newer and npm.

```powershell
npm ci
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env
```

Configure MongoDB and a strong, unique `JWT_SECRET` in `server/.env`. Then create the first administrator by setting the one-time `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` values and running:

```powershell
npm run create-admin
```

Remove those bootstrap password values from the environment after the account is created. Passwords are stored as bcrypt hashes, never as plaintext.

Run the backend and frontend in separate terminals:

```powershell
npm run server
npm run dev
```

- Storefront: `http://127.0.0.1:5173`
- Admin login: `http://127.0.0.1:5173/admin/login`
- API: `http://127.0.0.1:4000/api`

Development `/api` requests are proxied to port 4000. In production, set `VITE_API_URL` to the deployed API origin before building.

## Admin panel

Authenticated administrators can manage:

- dashboard catalogue counts and recent products;
- products, prices, stock quantities, categories, fitment details, and product images;
- categories and subcategories, with deletion blocked while records are in use;
- Today’s Board images and active/history status;
- Admin and Staff accounts (Admin role only).

Staff accounts can manage products and billboard images but cannot manage categories or users. Sessions use an eight-hour JWT stored in browser session storage. Login is rate-limited, and all admin data routes require a valid token.

Uploaded JPEG, PNG, and WebP images are limited to 5 MB and stored under `server/uploads/`. This directory is git-ignored. For multi-instance production hosting, replace local storage with durable object storage.

## Environment variables

| File | Variable | Purpose |
| --- | --- | --- |
| `server/.env` | `MONGODB_URI` | Required MongoDB connection string |
| `server/.env` | `PORT` | Express port; defaults to 4000 |
| `server/.env` | `CLIENT_ORIGIN` | Comma-separated allowed frontend origins |
| `server/.env` | `JWT_SECRET` | Strong private signing secret for admin tokens |
| `server/.env` | `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | One-time first-admin bootstrap values |
| `client/.env` | `VITE_API_URL` | Public API origin for a production frontend build |

Never commit real `.env` files. `VITE_` values are public build-time configuration and must never contain secrets.

## Main API routes

Public read routes:

- `GET /api/products`
- `GET /api/products/:slug`
- `GET /api/categories`
- `GET /api/billboard/current`
- `POST /api/inquiries`

Authentication and protected admin routes:

- `POST /api/admin/login`
- `GET /api/admin/me`
- `GET /api/admin/dashboard`
- `/api/admin/products`
- `/api/admin/categories` and `/api/admin/subcategories`
- `/api/admin/billboards`
- `/api/admin/users`

## Verification

```powershell
npm test
npm run build
```

The Express health endpoint remains available if MongoDB is temporarily unavailable, while database-backed endpoints return `503`. The storefront retains its existing demo catalogue, category navigation, and board image when the API cannot be reached; once connected, active database records replace those fallbacks.
