# Amil Auto Hub

Responsive React website and a separate Express/MongoDB backend for a Sri Lankan automotive spare parts supplier.

## Current delivery

- All five sections: Home, About, Products, Why Choose Us and Contact.
- React Router navigation, sticky responsive menu, accessible form, reduced-motion support, generated automotive imagery, custom favicon and SEO metadata.
- Six clearly marked category previews. No product inventory, prices, contact numbers or addresses have been invented or seeded.
- The official logo was not attached and Facebook could not be retrieved. The site uses a temporary typographic wordmark in the requested colours. Replace it with the supplied official logo before a public launch.
- The Sites deployment serves the frontend only. Express and MongoDB must be configured and hosted separately before real inquiries can be accepted. In the static preview the form explicitly reports that sending is awaiting setup and directs visitors to the supplied Facebook link.
- Phone, WhatsApp, email, address and Maps location remain labelled placeholders. WhatsApp buttons lead to the contact section until a number is supplied.

## Setup and run

Use Node.js 22 or newer and npm. Open a terminal in this directory.

```powershell
npm ci
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env
```

Install/start MongoDB locally, or put your MongoDB Atlas connection string in `server/.env`. Never commit real environment files or credentials.

Frontend, terminal 1:

```powershell
npm run dev
```

Open the local URL printed by Vite (normally http://127.0.0.1:5173). Development requests to `/api` are proxied to port 4000.

Backend, terminal 2:

```powershell
npm run server
```

The backend deliberately fails startup if it cannot connect to MongoDB; it does not pretend to store inquiries. Run `npm test` for API validation and failure-state tests. Test fixtures are in-memory only and do not seed a database.

Production frontend:

```powershell
npm run build
npm run preview
```

The production frontend is output to `dist/`. Deploy Express on a Node host with HTTPS, set the production frontend origin in `CLIENT_ORIGIN`, then set `VITE_API_URL` to the API's HTTPS origin and rebuild. For a separate Vite preview server, use its printed URL. The WebAssembly esbuild alias works around native bundler directory access restrictions on this Windows environment.

## Environment variables

| File | Variable | Purpose |
| --- | --- | --- |
| server/.env | MONGODB_URI | Required MongoDB connection string; example targets local `amil_auto_hub` database |
| server/.env | PORT | Express port, defaults to 4000; update the Vite proxy if changed |
| server/.env | CLIENT_ORIGIN | Comma-separated allowed frontend origins, with scheme and port, no trailing slash |
| client/.env | VITE_API_URL | Public HTTPS API origin for production; blank uses development proxy in dev and explicit unconnected mode in production |

`VITE_` variables are public build-time configuration. Never place a database URI or secret in them. Site environment settings alone cannot change an already-built static frontend; rebuild with the new value.

## Products and inquiries

`server/models/Product.js` defines name, unique slug, category, brand, vehicleCompatibility, description, images, nullable price, availability, featured, createdAt and updatedAt. Prices are non-negative LKR amounts. Categories are the six categories shown on the site. Availability is `In stock`, `Out of stock` or `On request`. Images accept HTTPS URLs or local absolute asset paths.

Add verified inventory later with a trusted script importing the Product model, or with MongoDB tooling after validating against this schema. There is intentionally no unauthenticated public product-write API or admin interface. Use `Product.create`/`save` to enforce model validation; direct database writes bypass it. The current frontend loads the latest 100 records, featured first; add pagination when the catalogue exceeds that size.

`server/models/Inquiry.js` stores name, phone, optional email, optional vehicleModel, partRequired, optional message and createdAt. Inquiries are stored in MongoDB only: email, SMS and WhatsApp notifications are not configured. Review them through authorised database tooling. No public inquiry-list endpoint is exposed.

| Endpoint | Behaviour |
| --- | --- |
| GET /api/products | Returns `{ products: [] }` for a genuinely empty connected database |
| GET /api/products/:id | Returns a product, 400 for invalid IDs or 404 when absent |
| POST /api/inquiries | Validates and persists an inquiry, returns 201 only after successful storage |

Disconnected databases return 503. The API limits request size and inquiry rate, validates types/lengths, drops unrecognised fields, restricts CORS, and adds security headers. Configure a precise Express `trust proxy` setting if your production host requires it; never blindly trust arbitrary forwarded headers. Before public operation set a business-approved inquiry retention policy and manage database access appropriately.

## Replace contact information, logo and images

- Edit `client/src/data/business.js`. Replace null values with verified details. Use international phone/WhatsApp numbers (country code 94 for Sri Lanka). Set `mapsUrl` to the verified Google Maps link.
- Put the official logo in `client/public/images/` and set `business.logo` to `/images/your-logo-file.png` or `.svg`. Update the favicon if needed.
- The generated illustrative image is `client/public/images/hero.jpg`, reused in Hero and About. Replace the file or update paths in those section components. It is illustrative, not a claim about actual stock.
- Edit global colours, spacing, typography and responsive styles in `client/src/styles/main.css`.
- Google Fonts loads Barlow Condensed and DM Sans with system fallbacks. Self-host the fonts if an entirely local asset policy is required.

## Structure and created files

```text
amil-auto-hub/
  .gitignore
  .openai/hosting.json
  package.json
  package-lock.json
  vite.config.js
  README.md
  FILES.txt
  client/
    .env.example
    index.html
    public/
      favicon.svg
      images/hero.jpg
    src/
      main.jsx
      components/
        Brand.jsx
        ContactAction.jsx
        Header.jsx
        Footer.jsx
      data/business.js
      sections/
        Hero.jsx
        About.jsx
        Products.jsx
        WhyUs.jsx
        Contact.jsx
      styles/main.css
  server/
    .env.example
    index.js
    app.js
    config/database.js
    controllers/products.js
    controllers/inquiries.js
    middleware/validateInquiry.js
    models/Product.js
    models/Inquiry.js
    routes/api.js
    tests/api.test.js
```

`FILES.txt` is the complete source-file inventory. `node_modules/` and `dist/` are generated. The private Sites identity is recorded in `.openai/hosting.json`.

## Verification

- Production build succeeds.
- Seven API tests cover input validation, disconnected storage, invalid product IDs, blocked origins, schema validation, empty inventory and successful inquiry handling with mocked persistence.
- Desktop and 390px mobile browser checks confirm loaded imagery and no horizontal overflow.
- Form failure feedback and responsive navigation were checked in the browser.
- The optional WebMCP `prepare_parts_inquiry` tool prepares the same visible form without sending; invalid input is rejected. Real MongoDB persistence has not been integration-tested because no database was supplied.
