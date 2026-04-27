# ⚖️ Nyaay — AI-Powered Legal Assistant Platform

Nyaay is a full-stack AI-powered legal assistant platform that enables users to upload legal documents, search through them intelligently, generate AI-drafted legal documents, and get real-time legal guidance through an advanced RAG-based chat system.

---

## 🚀 Features

- **RAG-Based Legal AI Chat** — Ask legal questions and get context-aware answers powered by Groq, Voyage AI embeddings, and Cohere reranking.
- **PDF Document Analysis** — Upload legal PDFs and let the AI extract, analyze, and search through them intelligently.
- **AI Legal Document Generation** — Generate professional legal drafts (contracts, notices, agreements) using AI.
- **Hybrid Search** — Combines semantic (vector) search with keyword search for highly relevant legal document retrieval.
- **Multi-Role Authentication** — JWT-based auth with OTP login, access/refresh token rotation, and role-based verification (User, Lawyer, Admin).
- **Legal Marketplace** — Browse and connect with verified legal professionals.
- **Payment Integration** — Razorpay-powered subscription and one-time payment flows.
- **Async Notifications** — Redis + BullMQ-based background worker for email and SMS notifications.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | PostgreSQL, Prisma ORM |
| AI / LLM | Groq (LLaMA 3) |
| Embeddings | Voyage AI |
| Reranking | Cohere |
| Queue / Cache | Redis, BullMQ |
| Payments | Razorpay |
| Auth | JWT (Access + Refresh Tokens), OTP |

---

## 📁 Project Structure

```
Nyaay/
├── backend/
│   ├── prisma/            # Database schema
│   ├── src/
│   │   ├── routes/        # API endpoints (auth, chat, search, documents, payments...)
│   │   ├── middleware/    # JWT auth middleware
│   │   ├── workers/       # Redis/BullMQ background jobs
│   │   └── index.ts       # Express server entry point
│   └── scripts/           # Embedding generation scripts
└── frontend/
    └── src/
        ├── app/           # Next.js pages (login, signup, chat, search, generate...)
        ├── contexts/      # Auth context (global state)
        └── lib/           # Axios API client
```

---

## ⚙️ Getting Started (Local Setup)

### Prerequisites
- Node.js v18+
- PostgreSQL
- Redis

### 1. Clone the Repository
```bash
git clone https://github.com/RaushanKushwaha77/Nyaya.git
cd Nyaya
```

### 2. Configure Environment Variables

Create a `.env` file inside the `backend/` folder:
```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/nyaay?schema=public"
JWT_ACCESS_SECRET="your_jwt_access_secret"
JWT_REFRESH_SECRET="your_jwt_refresh_secret"
GROQ_API_KEY="your_groq_api_key"
VOYAGE_API_KEY="your_voyage_api_key"
COHERE_API_KEY="your_cohere_api_key"
RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
REDIS_HOST="127.0.0.1"
REDIS_PORT=6379
```

Create a `.env` file inside the `frontend/` folder:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. Install Dependencies
```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 4. Set Up the Database
```bash
cd backend
npx prisma db push
npx prisma generate
```

### 5. Run the Application
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 API Keys Required

| Service | Get Key At |
|---|---|
| Groq | https://console.groq.com |
| Voyage AI | https://dash.voyageai.com |
| Cohere | https://dashboard.cohere.com |
| Razorpay | https://razorpay.com |

---

## 👨‍💻 Author

**Raushan Raj**
- GitHub: [@RaushanKushwaha77](https://github.com/RaushanKushwaha77)
