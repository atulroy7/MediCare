# MMM Medical Store

<div align="center">

![Monorepo](https://img.shields.io/badge/Monorepo-Frontend%20%2B%20Backend-0f172a?style=for-the-badge&logo=github&logoColor=ffffff)
![React](https://img.shields.io/badge/React-18.3-61dafb?style=for-the-badge&logo=react&logoColor=ffffff)
![Vite](https://img.shields.io/badge/Vite-6.3-ffc400?style=for-the-badge&logo=vite&logoColor=ffffff)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=ffffff)
![Express](https://img.shields.io/badge/Express-5.2-000000?style=for-the-badge&logo=express&logoColor=ffffff)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%209.6-13aa52?style=for-the-badge&logo=mongodb&logoColor=ffffff)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38b2ac?style=for-the-badge&logo=tailwind-css&logoColor=ffffff)
![Razorpay](https://img.shields.io/badge/Payments-Razorpay-0084ff?style=for-the-badge&logoColor=ffffff)
![Redis](https://img.shields.io/badge/Cache-Redis%2FIORedis-dc382d?style=for-the-badge&logo=redis&logoColor=ffffff)
![Firebase](https://img.shields.io/badge/Firebase%20Admin-13.10-ffa726?style=for-the-badge&logo=firebase&logoColor=ffffff)

</div>

> Modern full-stack medical store and pharmacy e-commerce monorepo supporting product browsing, prescription uploads, cart flow, and online payments.

## Highlights

- ⚡ **Fast Frontend:** React 18 + Vite 6 with Tailwind CSS and Framer Motion animations
- 🔐 **Secure Backend:** Express with JWT authentication, Helmet security headers, rate limiting
- 📸 **Media Management:** Cloudinary integration for product images and prescription uploads
- 🛒 **E-commerce Flow:** Full cart, checkout, and Razorpay payment integration
- 💊 **Prescription Support:** Dedicated prescription upload workflow with validation
- 📧 **Multi-channel Notifications:** Firebase Admin SDK + EmailJS for user communications
- ⚙️ **Performance:** Redis caching, optimized database queries with Mongoose
- 🎨 **Responsive Design:** Mobile-first Tailwind CSS, accessibility-ready components

## Tech Stack

**Frontend:**
- React 18.3, Vite 6.3, React Router v6, Tailwind CSS 3.4
- Framer Motion for animations, EmailJS for contact forms
- Lucide React for icons, React Hot Toast for notifications

**Backend:**
- Node.js 18+ with Express 5.2, MongoDB with Mongoose 9.6
- Authentication: JWT (jsonwebtoken), Helmet for security headers
- File uploads: Multer with Cloudinary integration
- Rate limiting: express-rate-limit, Morgan for logging
- Payments: Razorpay 2.9.6
- Caching: ioredis 5.10.1
- Validation: Zod
- Notifications: Firebase Admin SDK 13.10

**DevOps & Tooling:**
- Nodemon for backend development
- GitHub Actions CI/CD pipeline
- Environment-based configuration with dotenv

## Repository Layout

See the two main workspaces:

```
mmm-medical-shop/
├── backend/   # API server, models, controllers, routes
└── frontend/  # React + Vite single-page app
```

## Quick Start

**Prerequisites:** Node.js 18+ (LTS), npm 10+, MongoDB (local or Atlas), Redis (optional for caching)

### Frontend Development

```bash
cd frontend
npm install
cp .env.example .env
# Update .env with:
# - VITE_EMAILJS_SERVICE_ID
# - VITE_EMAILJS_TEMPLATE_ID
# - VITE_EMAILJS_PUBLIC_KEY
npm run dev
```

Access at `http://localhost:5173`

**Production Build:**

```bash
npm run build
# Output in dist/
```

### Backend Development

```bash
cd backend
npm install
cp .env.example .env
# Update .env with:
# - MONGODB_URI
# - CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
# - FIREBASE_SERVICE_ACCOUNT (path or JSON)
# - RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
# - REDIS_URL (optional)
# - JWT_SECRET
npm run dev
```

Backend runs on `http://localhost:5000` (default)

**Production Start:**

```bash
npm start
```

## Environment Variables

### Frontend (.env)
- `VITE_EMAILJS_SERVICE_ID` — EmailJS service ID for contact form
- `VITE_EMAILJS_TEMPLATE_ID` — EmailJS email template ID
- `VITE_EMAILJS_PUBLIC_KEY` — EmailJS public API key

### Backend (.env)
- `NODE_ENV` — development | production
- `PORT` — API server port (default: 5000)
- `MONGODB_URI` — MongoDB connection string
- `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — Image hosting
- `FIREBASE_SERVICE_ACCOUNT` — Firebase Admin SDK credentials (JSON path or stringified)
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` — Payment gateway credentials
- `REDIS_URL` — Redis connection URL (optional, for caching)
- `JWT_SECRET` — Secret key for JWT token signing
- `JWT_EXPIRE` — Token expiration time (e.g., "7d")

See `.env.example` files in each workspace for templates.

## Deployment

### Frontend Deployment
Build static assets with `npm run build` in the `frontend/` directory.

Supported platforms:
- **Vercel** — Automatic deployments from Git, zero-config for Vite
- **Netlify** — Drag-and-drop or Git-based deployments
- **GitHub Pages** — Static hosting with `vite build`
- **AWS S3 + CloudFront** — For higher scale

### Backend Deployment
Node.js server from `backend/` directory.

Supported platforms:
- **Render** — Easy Node.js hosting with auto-deploys
- **Railway** — Integrated database and Redis support
- **DigitalOcean App Platform** — Managed containers and databases
- **Heroku** — (legacy, but still viable)
- **AWS EC2 / EB** — For enterprise deployments
- **Self-hosted** — Docker container on any server

**Environment setup:** Ensure all `.env` variables are configured in your deployment platform's dashboard.

## Project Structure

```
mmm-medical-shop/
├── backend/
│   ├── src/
│   │   ├── config/           # Third-party integrations (Cloudinary, Firebase, etc.)
│   │   ├── controllers/      # Route handlers
│   │   ├── middlewares/      # Auth, validation, rate-limiting
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # API route definitions
│   │   └── utils/            # Helpers, validators, error handlers
│   ├── server.js             # Express app entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/       # Reusable React components
    │   ├── context/          # Cart and Theme context
    │   ├── pages/            # Page components (Home, Products, etc.)
    │   ├── data/             # Static data and fixtures
    │   ├── App.jsx           # Root component
    │   ├── main.jsx          # React entry point
    │   └── index.css         # Global styles
    ├── public/               # Static assets
    ├── index.html            # HTML template
    └── package.json
```

## Notes

- ✅ Full-stack medical/pharmacy e-commerce platform with modern tech
- 📖 See [frontend/FRONTEND_README.md](frontend/FRONTEND_README.md) for frontend-specific documentation
- 🔒 Do not commit real secrets; `.env` files are in `.gitignore`
- 🐳 Docker support can be added via Dockerfile for both services
- 🧪 Unit and integration tests recommended before production deployment
- 📱 Mobile-responsive design with Tailwind CSS breakpoints
- ♿ Accessibility-ready component structure (semantic HTML, ARIA labels)

## License

Proprietary — all rights reserved unless a license is added.
