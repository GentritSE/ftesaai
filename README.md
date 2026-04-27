# 💍 FtesaAI — Wedding Invitation Generator

> **Ftesa e dasmës suaj — shqip dhe anglisht, gati në 2 minuta**

FtesaAI është një platformë e thjeshtë e gjenerimit të ftesave të dasmës dygjuhësh (Shqip + Anglisht), e krijuar posaçërisht për diasporën shqiptare.

---

## 🚀 Quick Start

```bash
# 1. Install all dependencies
npm install

# 2. Set up environment variables
cp server/.env.example server/.env
# Edit server/.env with your own values

# 3. Start both client and server
npm run dev
```

- **Client** (React + Vite): http://localhost:5173
- **Server** (Node.js + Express): http://localhost:3001

---

## 📁 Project Structure

```
ftesaai/
├── client/                  # React + Vite + TypeScript + Tailwind
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.tsx  # Landing page with pricing
│   │   │   ├── Create.tsx   # Invitation creation form
│   │   │   ├── Preview.tsx  # Preview + payment + export
│   │   │   └── Admin.tsx    # Admin dashboard
│   │   ├── components/
│   │   │   └── templates/
│   │   │       ├── Template1.tsx  # Rose Elegant template
│   │   │       └── Template2.tsx  # Gold & Dark template
│   │   ├── types.ts
│   │   └── App.tsx
│   └── index.html
├── server/                  # Node.js + Express
│   ├── routes/
│   │   ├── invitations.js   # CRUD + AI generation + payment
│   │   └── admin.js         # Admin approval
│   ├── data/                # JSON storage (invitations.json)
│   ├── uploads/             # Payment proof files
│   └── index.js
├── .env.example
└── package.json             # Monorepo root (npm workspaces)
```

---

## 🔧 Environment Variables

Copy `server/.env.example` to `server/.env` and fill in:

```env
# Groq AI API (free tier available at console.groq.com)
GROQ_API_KEY=your_groq_api_key_here

# Email (Gmail SMTP recommended)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password        # Gmail App Password
ADMIN_EMAIL=admin@example.com

# Admin panel secret key
SECRET_ADMIN_KEY=change_this_to_a_secret_key

# App
PORT=3001
CLIENT_URL=http://localhost:5173
```

> **Note:** If `GROQ_API_KEY` is not set, the app uses mock AI text for development. If SMTP is not configured, emails are logged to console instead.

---

## 🎯 Features

### For Users
- **Create invitation**: Names (Albanian + English), date, time, venue, RSVP info, custom message
- **AI text generation**: Groq/Llama generates bilingual Albanian + English invitation text
- **Template selection**: 2 elegant templates (Rose Elegant, Gold & Dark)
- **Image upload**: Optional photo upload
- **Manual payment**: IBAN shown, user submits payment proof + reference
- **Export**: Download as PDF and PNG after approval

### For Admins
- **Dashboard**: List all invitations with status filtering
- **Approve requests**: One-click approval sends email notification to user
- **View details**: See payer info, payment reference, proof file
- **Status flow**: `pending_payment` → `pending_approval` → `approved`

### Email Notifications
- **Admin**: Notified when a user submits payment proof
- **User**: Notified with download link when admin approves

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/invitations` | Create new invitation |
| `GET` | `/api/invitations/:id` | Get invitation by ID |
| `POST` | `/api/invitations/:id/generate` | Generate AI bilingual text |
| `POST` | `/api/invitations/:id/payment-proof` | Submit payment proof |
| `GET` | `/api/invitations/:id/export/pdf` | Export data for PDF |
| `GET` | `/api/invitations/:id/export/png` | Export data for PNG |
| `GET` | `/api/admin/invitations?adminKey=KEY` | List all invitations (admin) |
| `POST` | `/api/admin/invitations/:id/approve?adminKey=KEY` | Approve invitation (admin) |
| `GET` | `/api/health` | Health check |

---

## 💰 Pricing

- **9€** — 1 ftesë, 2 template (Rose Elegant + Gold & Dark), PDF + PNG
- **15€** — 1 ftesë, të gjitha template-t, prioritet aprovimi

Payment via bank transfer (IBAN). Admin manually verifies and approves.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite 5 |
| Styling | Tailwind CSS 3 |
| Routing | React Router v6 |
| HTTP | Axios |
| PDF/PNG Export | jsPDF + html2canvas |
| Backend | Node.js + Express 4 |
| AI | Groq SDK (Llama 3) |
| Email | Nodemailer |
| Storage | JSON file (invitations.json) |
| Dev | concurrently + nodemon |

---

## 📜 Scripts

```bash
npm run dev          # Start both client and server (development)
npm install          # Install all workspace dependencies
npm run dev --workspace=client   # Client only
npm run dev --workspace=server   # Server only
```
