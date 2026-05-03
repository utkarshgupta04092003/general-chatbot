# General Chatbot

**The open-source, limitless, and self-hostable alternative to hosted RAG platforms.**

An end-to-end SaaS application that lets you build, train, and embed custom AI chatbots trained strictly on your website's data in minutes.

- Enter your website URL
- Verify your domain authority
- Allow which page data you want to use
- Select Pages to index
- Give Permission to scrape the page data
- Preview scraped data
- Index and Done

Instantly export an intelligent RAG-powered widget to your website.
No coding required to use, perfectly extensible and open-source for developers.

---

## Demo / Preview

_(Upload a GIF or screenshot of the dashboard and chat widget here)_

---

## Features

### Current Features

- **Data Extraction & Processing**
  - Fetch webpage data using puppeteer
  - Auto-fetch website logo and support custom logo uploads.
  - Resync indexed URLs on demand.
  - **Manual Data Sources:** Paste raw text directly into the dashboard to train your bot without a URL.
- **Chatbot Widget & Interface**
  - Website and embedded widget Light / Dark mode support.
  - Mobile responsive UI and completely dynamic configuration.
  - Assistant configuration variables (Names, System Prompts, Models).
  - Color picker customization.
  - Company name configuration (Chatbase integration fallback).
  - Chatbot fallback contact capture.
  - Business-type dropdown for prompt suggestions.
  - Select / deselect all interaction points.
- **AI & RAG Engine**
  - Full Chat history context injection in response generation.
  - API endpoint implementation for conversational interface.
- **Analytics & Management**
  - Dashboard analytics with event tracking via PostHog.
  - Unanswered question handling system.
  - Chat feedback system (Like / Dislike responses).
  - Chat conversation categorization per chatbot.
  - Usage dashboard with usage analytics and charts.
  - Beta readiness with global usage toggle.

- **Others**
  - Config based limit removal

### 🧠 Future Contributions

- Document upload capability
- Data source document update support
- Secure chatbot identifier

- Inactive chatbot handling
- Show / hide sources in chat responses
- Dynamic widget theming (match host website)
- Multi-database provider support (mongodb, supabase, etc.)
- Cloud storage support (AWS, Azure, etc.)
- Multi-LLM provider support (openai, gemini, etc.)
- Multi-vector DB support (pinecone, chroma DB, qdrant etc.)
- Scheduled auto-resync (cron based)
- Analytics section improvements
- Route optimization across backend

---

## 🧠 How It Works

This project simplifies the complex Retrieval-Augmented Generation (RAG) pipeline into four seamless steps:

1. **URL or Text → Content Extraction:** You can either provide a website domain or paste raw text directly. Our backend handles the rest—scraping JavaScript-heavy pages, bypasses bot blocks, or processing your manual input into clean, noise-free text.
2. **Chunking → Embeddings:** The text is algorithmically broken down into overlapping chunks to preserve meaning. We submit these to an embedding model to convert the text into highly searchable numerical vectors.
3. **Vector Search → Response:** When a user asks the widget a question, their query is converted into a vector. We query our Vector DB to find the most relevant chunks from your website and pass them to the LLM.
4. **Chatbot UI:** The LLM generates a highly accurate, natural-language response which is streamed back to the user via a beautiful, embeddable React interface.

---

## ⚙️ Tech Stack

- **Frontend:** Next.js / React / TailwindCSS
- **Backend:** Node.js (Next.js Serverless API Routes)
- **API Extraction:** Puppeteer
- **Database:** MongoDB (via Prisma ORM)
- **Vector DB:** Pinecone
- **AI Provider:** Google Gemini (Gemini 3 Flash & 3.1 Pro via OpenAI-compatible endpoint)
- **Analytics:** PostHog

---

## 🚀 Getting Started

Launch your own limitless chatbot platform locally in under 10 minutes.

### 1. Clone the repository

```bash
git clone https://github.com/utkarshgupta04092003/general-chatbot.git
cd general-chatbot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Rename `.env.example` to `.env` and fill in your keys. Check the section below for details.

```bash
cp .env.example .env
```

### 4. Update AI Client

Update the AI client in `lib/utils.ts` to use your desired AI provider.

### 5. Setup Database

```bash
npx prisma generate
npx prisma db push
```

### 6. Run the project

```bash
npm run dev
```

Navigate to `http://localhost:3000` to start building your first chatbot!

---

## 🔑 Environment Variables

To run this project, you will need to add the following essential environment variables to your `.env` file:

```env
# Database
DATABASE_URL="mongodb+srv://<username>:<password>@cluster0.ek9bjmo.mongodb.net/<database_name>?appName=Cluster0"

# Authentication (NextAuth)
NEXTAUTH_SECRET="your-secret-key"
AUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
AUTH_TRUST_HOST=true

# AI Providers
GEMINI_API_KEY="<gemini_api_key>"

# Pinecone
PINECONE_API_KEY="pc-..."
PINECONE_INDEX="general-chatbot-v1"


# cloudinary related api keys
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="<cloudinary_cloud_name>"
CLOUDINARY_API_KEY="<cloudinary_api_key>"
CLOUDINARY_API_SECRET="<cloudinary_api_secret>"

# Analytics
NEXT_PUBLIC_POSTHOG_KEY="<posthog_key>"
NEXT_PUBLIC_POSTHOG_HOST="<posthog_host>"
```

_(You can configure AI models, plan metrics, and deployment boundaries inside `lib/config.ts`)_

---

## 🐳 Deployment

### Local Setup

The simplest way to use this project is to un-toggle the SaaS constraints. Inside `lib/config.ts`, set `ENABLE_USAGE_LIMITS = false`. This will completely bypass all usage limits, giving you an unrestricted self-hosted environment.

### Vercel Deployment

This repository is heavily optimized for Vercel:

1. Push your code to GitHub.
2. Import the project into Vercel.
3. Add your Environment Variables in the Vercel dashboard.
4. Click **Deploy**.

---

## 📂 Project Structure

```text
├── app/                  # Next.js App Router (Pages, Layouts, API Routes)
│   ├── api/              # Serverless backend endpoints (Scrape, Embed, Chat)
│   ├── dashboard/        # Authenticated user dashboard & usage analytics
│   └── onboarding/       # Visual flow for dynamic chatbot creation
├── components/           # Reusable React UI components and Embed Widgets
├── lib/                  # Core configuration, Prisma client, AI, and utilities
│   └── config.ts         # Master config (LLM models, global limits toggle)
└── prisma/               # Database schema and migrations
```

---

## 🔌 Extensibility

Designed from day one to be easily modifiable:

- **Swapping the Vector DB:** The Pinecone implementation is cleanly contained in `/app/api/embed/route.ts` and `/app/api/chat/route.ts`. You can swap `pc.index()` references to utilize Weaviate, Milvus, or Supabase pgvector.
- **Changing the LLM:** The AI models are defined globally in `lib/config.ts`. The project uses Google's Gemini models via an OpenAI-compatible interface, making it easy to swap for other providers.
- **Managing Limits:** Toggle `ENABLE_USAGE_LIMITS = false` locally and bypass all tracking blockades automatically.

---

## 📊 Analytics

Built-in analytics automatically track and log vital usage statistics to help you understand how your bots are performing:

- **Conversations:** Map out daily activity and engagement.
- **Unanswered Queries:** Automatically captures questions the AI couldn't find context for, allowing you to manually write custom content to your source documents later.
- **Chat Feedback Check:** View your thumbs up / thumbs down success rate directly in the dashboard.

---

## 🤝 Contributing

Contributions are always welcome!

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

Review this project too deeply from first pr to last one
and if needed read each file, and each directory
Create a md file for "LLM Reference" in which you have to mention

- My mindset while working on this project
- My approach
- How i approach any problem
- File structure
- CSS styles and varaible convension
- Lib directory management
- Patterns we've seen work well across different use cases

I want this file as a overall idea about how i code etc, so that in the next project, i just have to past the document and i have not to think about the code structure and all.
