# ResumeIQ AI - AI-Powered Resume Analyzer

A full-stack Next.js 16 application that uses AI to analyze resumes, provide scoring, identify strengths/weaknesses, and suggest improvements.

## Features

- **User Authentication**: Secure sign up and login with bcrypt password hashing
- **Resume Upload**: Upload PDF resumes for analysis
- **AI-Powered Analysis**: Get detailed feedback including:
  - Overall score (0-100)
  - Key strengths
  - Areas for improvement
  - Important keywords and skills
  - Actionable suggestions
- **Resume Management**: View, store, and delete uploaded resumes
- **Persistent Storage**: SQLite database for local storage (no setup required)

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: SQLite with better-sqlite3
- **Authentication**: Custom session-based auth with bcryptjs
- **AI**: OpenAI GPT-4 Turbo via Vercel AI SDK
- **PDF Processing**: pdf-parse

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm (or npm/yarn)
- OpenAI API key

### Installation

1. **Clone or download the project**

2. **Install dependencies**:
```bash
pnpm install
```

3. **Set up environment variables**:
Create a `.env.local` file in the root directory:
```
OPENAI_API_KEY=your_openai_api_key_here
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

To generate a secure `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

4. **Run the development server**:
```bash
pnpm dev
```

5. **Open your browser**:
Navigate to `http://localhost:3000`

## Project Structure

```
app/
├── page.tsx                 # Landing page
├── auth/
│   └── page.tsx            # Login/Register page
├── dashboard/
│   ├── page.tsx            # Dashboard with resume list
│   └── [id]/
│       └── page.tsx        # Resume analysis detail page
└── api/
    ├── auth/
    │   ├── register/route.ts
    │   ├── login/route.ts
    │   ├── logout/route.ts
    │   └── me/route.ts
    └── resumes/
        ├── route.ts        # Get/Delete resumes
        ├── upload/route.ts # Upload resume
        └── analyze/route.ts # Analyze resume with AI

components/
├── login-form.tsx
├── register-form.tsx
├── resume-upload.tsx
└── analysis-display.tsx

lib/
├── db.ts                   # Database initialization
├── auth.ts                 # Authentication functions
├── auth-context.tsx        # React context for auth
├── resume.ts               # Resume operations
└── ai.ts                   # AI analysis logic
```

## How to Use

1. **Create an Account**: Sign up with email and password on the landing page
2. **Upload Resume**: Go to dashboard and upload a PDF resume
3. **Analyze**: Click "View Analysis" on a resume to analyze it with AI
4. **View Results**: See your score, strengths, improvements, and suggestions
5. **Manage**: Delete resumes you no longer need

## Environment Variables

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | Your OpenAI API key for GPT-4 Turbo |
| `NEXTAUTH_SECRET` | Secret key for session encryption |
| `NEXTAUTH_URL` | Application URL (localhost:3000 for dev) |

## Database

The app uses SQLite stored in `data/resume-checker.db`. The database is automatically initialized on first run with tables for:
- users
- resumes
- analyses
- sessions

No external database setup required!

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel project settings
4. Deploy

For production, set `NEXTAUTH_URL` to your actual domain.

### Deploy to Other Platforms

The app can be deployed to any Node.js hosting platform (Railway, Render, Heroku, etc.). Ensure:
- Environment variables are set
- Node.js 18+ is available
- The `data` directory has write permissions (for SQLite)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Resumes
- `GET /api/resumes` - Get user's resumes
- `POST /api/resumes/upload` - Upload new resume
- `DELETE /api/resumes?id=<id>` - Delete resume
- `POST /api/resumes/analyze` - Analyze resume with AI
- `GET /api/resumes/analyze?id=<id>` - Get existing analysis

## Security

- Passwords are hashed with bcryptjs (10 rounds)
- Sessions are stored in database with expiration
- Session IDs are HTTP-only cookies
- User resumes can only be accessed by the owner
- All user data is filtered by user ID on backend

## License

MIT
