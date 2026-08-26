# Jaya Medical Store Frontend

A professional medical and pharma e-commerce frontend for **Jaya Medical Store**, owned by **Madan Mohan Mishra**. This package now sits inside the shared repo with the backend service, so the project is maintained as a single monorepo.

## Live URL

https://anupamkushwaha85.github.io/Medical-Store-Website/

## Tech Stack

- React
- Vite
- React Router v6
- Tailwind CSS
- Framer Motion
- EmailJS
- GitHub Actions

## Monorepo Layout

The repository root contains both packages:

```text
mmm-medical-shop/
├── backend/
└── frontend/
```

## Setup

Run these commands from the `frontend/` folder.

1. Install dependencies:

```bash
npm install
```

2. Create a local environment file from the example:

```bash
cp .env.example .env
```

3. Add your EmailJS values to `.env`:

```bash
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_CONTACT_TEMPLATE=your_template_id
VITE_EMAILJS_PRESCRIPTION_TEMPLATE=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

4. Start the dev server:

```bash
npm run dev
```

## EmailJS Configuration

1. Sign up at [emailjs.com](https://emailjs.com).
2. Create a service, then create two templates.
3. Contact form fields:
   - `{{name}}`
   - `{{email}}`
   - `{{phone}}`
   - `{{subject}}`
   - `{{message}}`
4. Prescription template fields:
   - `{{patient_name}}`
   - `{{phone}}`
   - `{{address}}`
   - `{{notes}}`
   - `{{file_name}}`
5. Add the values to `.env` locally and to GitHub Secrets for CI builds.

## Deployment

Deployment runs automatically on push to `main` through GitHub Actions from the repository root. The workflow builds the frontend package and publishes `frontend/dist` to GitHub Pages.

## Folder Structure

```text
../backend/
└── server.js

src/
├── components/
├── context/
├── data/
├── pages/
├── App.jsx
├── index.css
└── main.jsx
```

## Screenshots

Add screenshots here after the first production build or deploy preview.

## Git Root

Git is initialized at the repository root, so both `frontend/` and `backend/` are tracked together.

If you are starting fresh, initialize Git at the repo root instead:

```bash
git init
git config user.email "149708150+anupamkushwaha85@users.noreply.github.com"
git config user.name "anupamkushwaha85"
git remote add origin https://github.com/anupamkushwaha85/MMM-Medical-Store.git
git add frontend backend
git commit -m "feat: initialize monorepo"
git branch -M main
git push -u origin main
```

## Backend

The backend package already lives in `backend/` and can be run separately from there:

```bash
cd ../backend
npm install
npm run dev
```

## License

Proprietary project. All rights reserved unless a separate license is added later.
