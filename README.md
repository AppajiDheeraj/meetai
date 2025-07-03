# 🚀 Meet.AI – Your Personal AI Agent Platform

Meet.AI is a powerful, full-stack AI platform designed to help users create, manage, and interact with custom AI agents in seconds. From secure authentication to AI-powered meeting assistants, Meet.AI blends advanced technologies into an intuitive, production-ready app.

![Meet.AI Logo](./public/logo.svg)

---

## 🎯 Key Features

- 🔐 **Robust Authentication**
  - Magic Link Login (Passwordless)
  - Social Login (GitHub, Google)
  - Two-Factor Authentication (2FA) via TOTP
  - Session Management & Revocation

- 🧑‍💼 **AI Agents & Meetings**
  - Create & Customize AI Agents
  - Manage AI-Powered Meetings (Active/Completed/Processing)
  - Meeting Summaries & Transcriptions (OpenAI GPT-4o)
  - Chat with AI Assistants based on Meeting Context

- 📈 **Premium Features**
  - Polar-powered Payments, Checkout, and Customer Portals
  - Usage-Based Limits for Agents & Meetings
  - Referral System with Incentives

- 💬 **Communication Tools**
  - Stream Video & Chat Integrations
  - Real-Time Assistant During Calls

- 📩 **Notifications**
  - Magic Link Emails
  - Onboarding & Transactional Emails (Customizable)

---

## 🧑‍💻 Tech Stack

| Layer             | Tech Used                    |
|-------------------|------------------------------|
| Framework         | Next.js 15 (App Router)      |
| Language          | TypeScript                   |
| Database ORM      | Drizzle ORM (PostgreSQL)     |
| Auth System       | BetterAuth                   |
| Background Jobs   | Inngest                      |
| API Layer         | TRPC                         |
| AI Services       | OpenAI API (GPT-4o)          |
| Realtime Chat/Video | Stream.io APIs              |
| Styling           | Tailwind CSS                 |
| Forms & Validation | React Hook Form + Zod        |
| Notifications     | Sonner (toasts)              |

---
## 📁 Project Structure (Simplified)

src/
│
├── app/ → App Routes & API Endpoints (Next.js App Router)
├── components/ → UI Components (Reusable & Styled)
├── db/ → Database Config & Schema (Drizzle ORM)
├── inngest/ → Background Functions (Inngest)
├── lib/ → Core Libraries (Auth, APIs, Utils, Emails)
├── modules/ → Feature Modules (Auth, Agents, Meetings, Settings, etc.)
├── public/ → Static Assets (Logo, Prompts)
└── trpc/ → TRPC Routers & Clients

── trpc/ → TRPC Routers & Clients

yaml
Copy
Edit

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository:
```bash
git clone https://github.com/your-username/meetai.git
cd meetai
```
### 2️⃣ Install Dependencies:
```bash
npm install
```
### 3️⃣ Configure Environment Variables:
```bash
cp .env.example .env
```
Update .env with:
PostgreSQL Database URL
API Keys: OpenAI, Stream, Polar, etc.
BetterAuth Config

### 4️⃣ Run Database Migrations:
```bash
npx drizzle-kit push
```
5️⃣ Start the Development Server:
```bash
npm run dev
```
## 📦 Deployment
Meet.AI is optimized for Vercel deployment.

## 🛠️ Useful Scripts
Command	Purpose
npm run dev	Start development server
npm run build	Build production-ready app
npx drizzle-kit push	Apply database migrations
npm run lint	Run ESLint

## ✨ Advanced Features
- TRPC + React Query: Instant data fetching & caching

- OpenAI GPT-4o: Personalized AI responses

- BetterAuth: Secure, modular authentication

- Inngest: Reliable background job processing

- Polar Integration: For monetization & billing
