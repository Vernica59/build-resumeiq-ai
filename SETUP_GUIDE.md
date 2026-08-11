# ResumeIQ AI - Complete Setup Guide

## Overview

ResumeIQ AI is a full-featured resume analysis application built with:
- **Next.js 16** - React framework for production
- **SQLite** - Local file-based database (no setup needed)
- **OpenAI GPT-4** - AI-powered resume analysis
- **Tailwind CSS** - Modern styling
- **Vercel AI SDK** - Structured output and streaming

The entire application is production-ready and can be deployed to Vercel, Railway, Render, or any Node.js hosting platform.

## Prerequisites

Before starting, ensure you have:
- Node.js 18 or higher
- pnpm, npm, or yarn package manager
- An OpenAI API key (get one at https://platform.openai.com/api-keys)

## Installation Steps

### Step 1: Install Dependencies

```bash
pnpm install
```

This installs all required packages including:
- `better-sqlite3` - SQLite database
- `bcryptjs` - Password hashing
- `ai` & `@ai-sdk/openai` - AI integration
- `pdf-parse` - PDF extraction
- `zod` - Schema validation
- And more...

### Step 2: Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Required: Your OpenAI API key
OPENAI_API_KEY=sk-...your-key...

# Required: Session secret (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET=your-secret-key-here

# Required: Application URL
NEXTAUTH_URL=http://localhost:3000
```

**How to get OpenAI API Key:**
1. Visit https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key and paste it in `.env.local`

**How to generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```
Or use any long random string (at least 32 characters).

### Step 3: Run Development Server

```bash
pnpm dev
```

The app will start at `http://localhost:3000`. It automatically:
- Initializes the SQLite database in `data/resume-checker.db`
- Creates required tables for users, resumes, analyses, and sessions
- Enables hot module replacement for development

### Step 4: Access the Application

Open your browser and navigate to:
- **Landing Page**: http://localhost:3000
- **Login/Register**: http://localhost:3000/auth
- **Dashboard**: http://localhost:3000/dashboard (requires login)

## First Time Usage

1. **Create an Account**
   - Click "Get Started" on the landing page
   - Click "Sign up" to create a new account
   - Enter your name, email, and password

2. **Upload a Resume**
   - Go to the Dashboard after logging in
   - Drag and drop a PDF resume or click to browse
   - Wait for the file to upload

3. **Analyze Your Resume**
   - Click "View Analysis" on your uploaded resume
   - Wait while AI analyzes your resume
   - View your score, strengths, improvements, and suggestions

## Database

The app uses SQLite stored locally in `data/resume-checker.db`. The database schema includes:

### Users Table
- `id` - Unique user identifier
- `email` - User email (unique)
- `password` - Hashed password
- `name` - User's full name
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp

### Resumes Table
- `id` - Unique resume identifier
- `userId` - Reference to user
- `fileName` - Internal file name
- `fileData` - PDF file binary data (BLOB)
- `originalName` - Original filename from upload
- `uploadedAt` - Upload timestamp
- `updatedAt` - Last update timestamp

### Analyses Table
- `id` - Unique analysis identifier
- `resumeId` - Reference to resume
- `userId` - Reference to user
- `content` - Extracted PDF text
- `score` - AI-generated score (0-100)
- `strengths` - JSON array of strengths
- `improvements` - JSON array of improvements
- `keywords` - JSON array of identified keywords
- `analyzedAt` - Analysis timestamp

### Sessions Table
- `id` - Session identifier
- `userId` - Reference to user
- `expiresAt` - Session expiration time
- `createdAt` - Session creation time

## Project Structure

```
ResumeIQ-AI/
├── app/                           # Next.js app directory
│   ├── page.tsx                   # Landing page
│   ├── layout.tsx                 # Root layout with AuthProvider
│   ├── globals.css                # Global styles
│   ├── auth/
│   │   └── page.tsx               # Login/Register page
│   ├── dashboard/
│   │   ├── page.tsx               # Dashboard with resume list
│   │   └── [id]/
│   │       └── page.tsx           # Resume analysis detail
│   └── api/
│       ├── auth/
│       │   ├── register/route.ts   # User registration endpoint
│       │   ├── login/route.ts      # User login endpoint
│       │   ├── logout/route.ts     # User logout endpoint
│       │   └── me/route.ts         # Get current user endpoint
│       └── resumes/
│           ├── route.ts           # Get/Delete resumes
│           ├── upload/route.ts     # Upload resume
│           └── analyze/route.ts    # Analyze resume with AI
│
├── components/                    # React components
│   ├── login-form.tsx
│   ├── register-form.tsx
│   ├── resume-upload.tsx
│   └── analysis-display.tsx
│
├── lib/                          # Utility functions
│   ├── db.ts                     # Database initialization and schema
│   ├── auth.ts                   # Authentication functions
│   ├── auth-context.tsx          # React context for auth state
│   ├── resume.ts                 # Resume operations (upload, delete)
│   └── ai.ts                     # AI analysis integration
│
├── data/                         # Data directory (auto-created)
│   └── resume-checker.db         # SQLite database (auto-created)
│
├── .env.local                    # Environment variables (create this)
├── package.json
├── README.md
└── SETUP_GUIDE.md
```

## API Endpoints

All endpoints require authentication (valid session cookie) except registration and login.

### Authentication

**Register**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

Response: { user: {...}, sessionId: "..." }
```

**Login**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: { user: {...}, sessionId: "..." }
```

**Logout**
```bash
POST /api/auth/logout
Response: { success: true }
```

**Get Current User**
```bash
GET /api/auth/me
Response: { user: {...} }
```

### Resumes

**Get User's Resumes**
```bash
GET /api/resumes
Response: [ { id, fileName, originalName, uploadedAt }, ... ]
```

**Upload Resume**
```bash
POST /api/resumes/upload
Content-Type: multipart/form-data

file: (PDF file)
Response: { id, userId, fileName, originalName, uploadedAt }
```

**Delete Resume**
```bash
DELETE /api/resumes?id=<resumeId>
Response: { success: true }
```

**Analyze Resume**
```bash
POST /api/resumes/analyze
Content-Type: application/json

{ "resumeId": "..." }

Response: {
  id, resumeId, userId, content, score, strengths, improvements, keywords, analyzedAt,
  summary, suggestions
}
```

**Get Analysis**
```bash
GET /api/resumes/analyze?id=<resumeId>
Response: { id, resumeId, userId, content, score, strengths, improvements, keywords, analyzedAt }
```

## Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Visit https://vercel.com/new
   - Select your GitHub repository
   - Vercel auto-detects Next.js configuration

3. **Add Environment Variables**
   - In Vercel project settings, add:
     - `OPENAI_API_KEY` = your OpenAI key
     - `NEXTAUTH_SECRET` = a long random string
     - `NEXTAUTH_URL` = your Vercel domain (e.g., `https://myapp.vercel.app`)

4. **Deploy**
   - Vercel automatically deploys on push to main
   - Database files persist in `/tmp` (Vercel serverless environment)

**Note**: For production Vercel deployments with persistent data, consider:
- Migrating to Neon PostgreSQL (built-in Vercel integration)
- Using Supabase (PostgreSQL with built-in auth)
- Mounting a persistent volume on other platforms

### Deploy to Railway, Render, or Other Platforms

1. **Prepare for Production**
   ```bash
   pnpm build
   ```

2. **Set Environment Variables** on your hosting platform
   - `OPENAI_API_KEY`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (your production domain)
   - `NODE_ENV=production`

3. **Deploy**
   - Each platform has different deployment processes
   - Ensure the `data/` directory has write permissions
   - Node.js 18+ is available

### Self-Hosted Deployment

```bash
# Build for production
pnpm build

# Start production server
pnpm start

# Or use a process manager like PM2
pm2 start "pnpm start" --name resumeiq-ai
```

## Troubleshooting

### "Module not found: pdf-parse"
```bash
pnpm install
pnpm dev
```
Clear node_modules and reinstall if the issue persists.

### Database Lock Error
If you see "database is locked":
- Close all other connections to the database
- Ensure only one process is running: `pnpm dev`
- On production, ensure single-instance deployment or migrate to PostgreSQL

### OpenAI API Errors
- Verify your `OPENAI_API_KEY` is correct and has credits
- Check rate limits: https://platform.openai.com/account/rate-limits
- Ensure model `gpt-4-turbo` is available in your account

### Session Not Persisting
- Clear browser cookies: `agent-browser cookies`
- Ensure `NEXTAUTH_SECRET` is set and consistent
- Check database has write permissions

### Upload Fails
- Ensure file is a valid PDF (not corrupted)
- Check file size is reasonable
- Verify `/data` directory exists and is writable

## Performance Optimization

### For Production:

1. **Use Production Builds**
   ```bash
   pnpm build
   pnpm start
   ```

2. **Enable Caching**
   - Analyses are cached after first run
   - Resumes stored efficiently in database

3. **Monitor OpenAI Usage**
   - Set up usage alerts in OpenAI dashboard
   - Each analysis costs approximately $0.01-0.05 depending on resume length

4. **Database Optimization**
   - SQLite has WAL (Write-Ahead Logging) enabled for better concurrency
   - Indexes created on common queries

## Security Considerations

✓ **Implemented Security Features:**
- Passwords hashed with bcryptjs (10 rounds salt)
- HTTP-only session cookies (can't be accessed by JavaScript)
- Session expiration (7 days)
- User data filtering on backend (can only access own data)
- SQL injection prevention (parameterized queries)

**For Production, Also Consider:**
- HTTPS/TLS enforcement
- Rate limiting on API endpoints
- CORS configuration
- Input validation/sanitization
- Regular security audits
- Database backups

## Support & Next Steps

1. **Learn More**: Read the README.md for detailed documentation
2. **Customize**: Modify components in `components/` and pages in `app/`
3. **Extend**: Add features like export to PDF, resume templates, job matching
4. **Monitor**: Track usage and performance in production

## License

MIT - Feel free to use for personal or commercial projects!
