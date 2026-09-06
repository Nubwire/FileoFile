# fileofile

A lightweight document management app built on free-tier infrastructure.

- **Frontend:** Vue.js 3 + Vuetify (SPA)
- **Backend:** Cloudflare Workers API
- **Database:** Cloudflare D1
- **File storage:** Cloudflare R2

## Project structure

```
fileofile/
├── frontend/               # Vue.js 3 + Vuetify SPA
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   ├── stores/         # Pinia state management
│   │   ├── router/
│   │   └── main.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/                # Cloudflare Workers API
│   ├── src/
│   │   ├── index.js        # Main worker entry
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   └── utils/
│   ├── wrangler.toml       # Cloudflare config
│   └── package.json
├── database/                # D1 schema
│   └── schema.sql
└── README.md
```

## Setup

### 1. Clone and install

```bash
git clone https://github.com/yourusername/fileofile.git
cd fileofile
```

### 2. Backend (Cloudflare Workers)

```bash
cd backend
npm install
npx wrangler login
npx wrangler d1 create fileofile-db      # copy the database_id into wrangler.toml
npx wrangler d1 execute fileofile-db --file=../database/schema.sql
npx wrangler r2 bucket create fileofile-files

# Set secrets used for JWT signing and password hashing
npx wrangler secret put JWT_SECRET
npx wrangler secret put PASSWORD_SALT

npx wrangler dev   # run locally on http://localhost:8787
```

For local dev without `wrangler secret put`, copy `backend/.dev.vars.example` to
`backend/.dev.vars` and fill in your own values (this file is gitignored).

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_URL to your backend URL
npm run dev            # run locally on http://localhost:5173
```

### 4. Deploy to production

```bash
cd backend
npx wrangler deploy

cd ../frontend
npm run build
# Upload the dist/ folder to Cloudflare Pages, or connect the repo
# to Cloudflare Pages for automatic deploys.
```

Set `VITE_API_URL` in your Cloudflare Pages project settings to your deployed
Worker URL before building for production.

## Key features

- **Authentication** — JWT-based login/register
- **Document management** — upload, view, delete files
- **File storage** — documents stored in Cloudflare R2, metadata in D1
- **Responsive UI** — Vue.js + Vuetify

## Notes / next steps

- Add full-text search over documents (D1 supports it)
- Add document sharing with external users
- Add AI-assisted tagging or smart search via Workers AI
- Add OCR for scanned documents via Workers AI

## Security note

The password hashing here uses SHA-256 with a static salt for simplicity. For
a production deployment, consider a purpose-built password hashing scheme
(e.g. bcrypt/scrypt/Argon2 via a compatible library) and per-user salts.
