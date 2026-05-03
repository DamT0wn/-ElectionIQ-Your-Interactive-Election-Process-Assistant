# 🏗️ ElectionIQ - System Architecture

## High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           USER INTERFACE LAYER                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │                    React Frontend Application                       │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │  │
│  │  │  Home Page   │  │  Chat Page   │  │ Timeline     │             │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘             │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │  │
│  │  │  Map Page    │  │ Calendar     │  │  Quiz Page   │             │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘             │  │
│  │                                                                     │  │
│  │  ┌─────────────────────────────────────────────────────────────┐  │  │
│  │  │  Context Providers (Auth, Chat, Theme)                     │  │  │
│  │  └─────────────────────────────────────────────────────────────┘  │  │
│  │                                                                     │  │
│  │  ┌─────────────────────────────────────────────────────────────┐  │  │
│  │  │  Floating Chat Widget (Available on all pages)             │  │  │
│  │  └─────────────────────────────────────────────────────────────┘  │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTPS
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           API GATEWAY LAYER                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │                    Express.js Backend Server                        │  │
│  │                                                                     │  │
│  │  ┌──────────────────────────────────────────────────────────────┐  │  │
│  │  │  Middleware Stack                                            │  │  │
│  │  │  • Helmet (Security Headers)                                │  │  │
│  │  │  • CORS (Cross-Origin Resource Sharing)                    │  │  │
│  │  │  • Rate Limiting (100 req/15min, 20 req/min for AI)       │  │  │
│  │  │  • Morgan (Request Logging)                                │  │  │
│  │  │  • Body Parser (JSON/URL-encoded)                          │  │  │
│  │  └──────────────────────────────────────────────────────────────┘  │  │
│  │                                                                     │  │
│  │  ┌──────────────────────────────────────────────────────────────┐  │  │
│  │  │  API Routes                                                  │  │  │
│  │  │  • /api/chat          - AI Chat Messages                    │  │  │
│  │  │  • /api/voice         - Speech-to-Text & Text-to-Speech   │  │  │
│  │  │  • /api/translation   - Multi-language Translation         │  │  │
│  │  │  • /api/calendar      - Election Events & Dates            │  │  │
│  │  │  • /api/quiz          - AI-Generated Quiz Questions        │  │  │
│  │  │  • /api/progress      - User Progress Tracking             │  │  │
│  │  │  • /api/health        - Service Health Check               │  │  │
│  │  └──────────────────────────────────────────────────────────────┘  │  │
│  │                                                                     │  │
│  │  ┌──────────────────────────────────────────────────────────────┐  │  │
│  │  │  Input Validation & Error Handling                          │  │  │
│  │  │  • express-validator for all inputs                         │  │  │
│  │  │  • Global error handler middleware                          │  │  │
│  │  │  • Graceful error responses                                 │  │  │
│  │  └──────────────────────────────────────────────────────────────┘  │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
┌──────────────────────────┐  ┌──────────────────────────┐  ┌──────────────────────────┐
│   GOOGLE CLOUD SERVICES  │  │   FIREBASE SERVICES      │  │   EXTERNAL SERVICES      │
├──────────────────────────┤  ├──────────────────────────┤  ├──────────────────────────┤
│                          │  │                          │  │                          │
│ • Vertex AI              │  │ • Authentication         │  │ • Election Commission    │
│   (Gemini 2.5 Flash)     │  │   (Google Sign-In)       │  │   of India Portal        │
│                          │  │                          │  │   (voters.eci.gov.in)    │
│ • Cloud Speech-to-Text   │  │ • Firestore Database     │  │                          │
│   (Voice Recognition)    │  │   (User Data, Chat       │  │ • Google Calendar API    │
│                          │  │    History, Progress)    │  │   (Event Management)     │
│ • Cloud Text-to-Speech   │  │                          │  │                          │
│   (Voice Synthesis)      │  │ • Cloud Storage          │  │                          │
│                          │  │   (File Storage)         │  │                          │
│ • Cloud Translation      │  │                          │  │                          │
│   (Multi-language)       │  │                          │  │                          │
│                          │  │                          │  │                          │
│ • Secret Manager         │  │                          │  │                          │
│   (API Keys)             │  │                          │  │                          │
│                          │  │                          │  │                          │
└──────────────────────────┘  └──────────────────────────┘  └──────────────────────────┘
```

---

## Component Architecture

### Frontend Component Hierarchy

```
App
├── ThemeProvider
│   └── AuthProvider
│       └── Router
│           └── ChatProvider
│               ├── Navbar
│               ├── main (Routes)
│               │   ├── HomePage
│               │   ├── ChatPage
│               │   ├── TimelinePage
│               │   ├── MapPage
│               │   ├── CalendarPage
│               │   ├── QuizPage
│               │   └── ProgressPage
│               ├── Footer
│               └── FloatingChat
```

### Context API Structure

```
ThemeContext
├── State: { isDark, toggleTheme }
└── Used by: All components for styling

AuthContext
├── State: { user, isAuthenticated, loading }
├── Methods: { login, logout, signInWithGoogle }
└── Used by: Protected routes, user-specific features

ChatContext
├── State: { messages, sessionId, loading }
├── Methods: { sendMessage, clearHistory, loadHistory }
└── Used by: ChatPage, FloatingChat
```

---

## Data Flow Architecture

### Chat Message Flow

```
User Input
    │
    ▼
Frontend (ChatPage/FloatingChat)
    │
    ├─ Validate input
    ├─ Add to local state
    │
    ▼
API Call: POST /api/chat/message
    │
    ├─ Request: { message, sessionId, userId, history }
    │
    ▼
Backend (Express)
    │
    ├─ Validate input (express-validator)
    ├─ Check rate limit
    ├─ Load chat history from Firestore (if needed)
    │
    ▼
Vertex AI Service
    │
    ├─ Send message + context to Gemini 2.5 Flash
    ├─ Receive AI response
    │
    ▼
Backend Processing
    │
    ├─ Save to Firestore (chat history)
    ├─ Format response
    │
    ▼
API Response: { reply, sessionId, timestamp }
    │
    ▼
Frontend Display
    │
    ├─ Update chat state
    ├─ Render message
    ├─ Scroll to latest
    │
    ▼
User Sees Response
```

### Authentication Flow

```
User Clicks "Sign in with Google"
    │
    ▼
Firebase Google Sign-In
    │
    ├─ Opens Google login popup
    ├─ User authenticates
    │
    ▼
Firebase Auth
    │
    ├─ Creates user session
    ├─ Returns auth token
    │
    ▼
Frontend (AuthContext)
    │
    ├─ Stores user info
    ├─ Stores auth token
    ├─ Updates isAuthenticated state
    │
    ▼
Protected Routes Unlocked
    │
    ├─ User can access all features
    ├─ API calls include auth token
    │
    ▼
Backend Verification
    │
    ├─ Verifies token with Firebase
    ├─ Allows/denies request
    │
    ▼
User Session Active
```

---

## Database Schema (Firestore)

```
firestore/
├── users/
│   └── {userId}
│       ├── email: string
│       ├── displayName: string
│       ├── photoURL: string
│       ├── createdAt: timestamp
│       ├── lastLogin: timestamp
│       └── preferences: object
│
├── chatSessions/
│   └── {userId}
│       └── {sessionId}
│           ├── messages: array
│           │   └── { role, content, timestamp }
│           ├── createdAt: timestamp
│           ├── updatedAt: timestamp
│           └── title: string
│
├── userProgress/
│   └── {userId}
│       ├── chatCompleted: boolean
│       ├── timelineViewed: boolean
│       ├── mapExplored: boolean
│       ├── calendarChecked: boolean
│       ├── quizTaken: boolean
│       ├── score: number
│       └── lastUpdated: timestamp
│
└── quizQuestions/
    └── {questionId}
        ├── question: string
        ├── options: array
        ├── correctAnswer: string
        ├── explanation: string
        ├── category: string
        └── difficulty: string
```

---

## API Request/Response Examples

### Chat API

**Request:**
```json
{
  "message": "What is the voting age in India?",
  "sessionId": "session-123",
  "userId": "user-456",
  "history": [
    { "role": "user", "content": "Hello" },
    { "role": "assistant", "content": "Hi! I'm ElectionIQ..." }
  ]
}
```

**Response:**
```json
{
  "reply": "In India, the voting age is 18 years. Any Indian citizen who is 18 years or older can vote in elections.",
  "sessionId": "session-123",
  "timestamp": "2026-04-26T18:30:00Z"
}
```

### Voice API

**Request (Transcribe):**
```
POST /api/voice/transcribe
Content-Type: multipart/form-data

[Audio file binary data]
```

**Response:**
```json
{
  "text": "What is the voting process?",
  "confidence": 0.95,
  "language": "en"
}
```

### Quiz API

**Request:**
```json
{
  "userId": "user-456",
  "limit": 5
}
```

**Response:**
```json
{
  "questions": [
    {
      "id": "q-1",
      "question": "What is the minimum age to vote?",
      "options": ["16", "18", "21", "25"],
      "category": "voting-rights",
      "difficulty": "easy"
    }
  ]
}
```

---

## Deployment Architecture

### Cloud Run Services

```
Google Cloud Run
├── electioniq-frontend
│   ├── Image: gcr.io/event-project-493505/electioniq-frontend:latest
│   ├── Base: nginx:alpine
│   ├── Port: 8080
│   ├── Memory: 256MB
│   ├── CPU: 1
│   ├── Timeout: 300s
│   ├── Concurrency: 80
│   └── Auto-scaling: 0-100 instances
│
└── electioniq-backend
    ├── Image: gcr.io/event-project-493505/electioniq-backend:latest
    ├── Base: node:20-slim
    ├── Port: 8080
    ├── Memory: 512MB
    ├── CPU: 1
    ├── Timeout: 300s
    ├── Concurrency: 80
    └── Auto-scaling: 0-100 instances
```

### CI/CD Pipeline (Cloud Build)

```
Git Push to main
    │
    ▼
Cloud Build Triggered
    │
    ├─ Step 1: Build Backend Docker Image
    │   └─ FROM node:20-slim
    │   └─ COPY package*.json
    │   └─ RUN npm ci --only=production
    │   └─ COPY src/
    │   └─ USER electioniq (non-root)
    │
    ├─ Step 2: Push Backend to Container Registry
    │   └─ gcr.io/event-project-493505/electioniq-backend:latest
    │
    ├─ Step 3: Deploy Backend to Cloud Run
    │   └─ Set environment variables
    │   └─ Set secrets from Secret Manager
    │   └─ Enable health checks
    │
    ├─ Step 4: Build Frontend Docker Image
    │   └─ Stage 1: Build with Node.js
    │   │   └─ FROM node:20-slim
    │   │   └─ npm ci
    │   │   └─ npm run build
    │   └─ Stage 2: Serve with Nginx
    │       └─ FROM nginx:alpine
    │       └─ COPY dist/ to /usr/share/nginx/html
    │
    ├─ Step 5: Push Frontend to Container Registry
    │   └─ gcr.io/event-project-493505/electioniq-frontend:latest
    │
    └─ Step 6: Deploy Frontend to Cloud Run
        └─ Set environment variables
        └─ Enable health checks
        └─ Configure Nginx for SPA routing
```

---

## Security Architecture

### Authentication & Authorization

```
User Request
    │
    ▼
Frontend
    ├─ Check localStorage for auth token
    ├─ If not found, redirect to login
    │
    ▼
Firebase Authentication
    ├─ Google Sign-In
    ├─ Generate JWT token
    ├─ Store in localStorage
    │
    ▼
API Request
    ├─ Include Authorization header
    ├─ Bearer token in header
    │
    ▼
Backend Middleware
    ├─ Extract token from header
    ├─ Verify with Firebase Admin SDK
    ├─ Attach user info to request
    │
    ▼
Route Handler
    ├─ Check user authentication
    ├─ Verify permissions
    ├─ Process request
    │
    ▼
Response
    ├─ Return data or error
```

### Data Security

```
Sensitive Data (API Keys, Secrets)
    │
    ▼
Google Secret Manager
    ├─ Encrypted at rest
    ├─ Encrypted in transit
    ├─ Access controlled via IAM
    │
    ▼
Cloud Run Environment
    ├─ Injected as environment variables
    ├─ Never logged or exposed
    ├─ Rotated regularly
```

---

## Scalability Architecture

### Horizontal Scaling

```
Traffic Spike
    │
    ▼
Cloud Run Auto-scaling
    ├─ Monitor CPU/Memory usage
    ├─ Detect high load
    │
    ▼
Spin Up New Instances
    ├─ Frontend: 0-100 instances
    ├─ Backend: 0-100 instances
    │
    ▼
Load Balancer
    ├─ Distribute traffic
    ├─ Health checks
    ├─ Session affinity
    │
    ▼
Serve All Requests
```

### Database Scaling

```
Firestore
    ├─ Automatic sharding
    ├─ Distributed globally
    ├─ Automatic backups
    ├─ Real-time sync
    │
    ▼
Handles Millions of Operations
    ├─ Reads: 50,000+ per second
    ├─ Writes: 20,000+ per second
    ├─ Queries: Indexed for performance
```

---

## Monitoring & Observability

### Logging Architecture

```
Application Logs
    │
    ├─ Frontend: Browser console + error tracking
    ├─ Backend: Morgan middleware + Winston
    │
    ▼
Cloud Logging
    ├─ Centralized log aggregation
    ├─ Real-time log streaming
    ├─ Log filtering and search
    │
    ▼
Log Analysis
    ├─ Error tracking
    ├─ Performance monitoring
    ├─ User behavior analysis
```

### Metrics & Monitoring

```
Cloud Monitoring
    ├─ CPU Usage
    ├─ Memory Usage
    ├─ Request Latency
    ├─ Error Rate
    ├─ Throughput
    │
    ▼
Alerts
    ├─ High error rate (>5%)
    ├─ High latency (>1s)
    ├─ Service down
    ├─ Quota exceeded
    │
    ▼
Notifications
    ├─ Email alerts
    ├─ SMS alerts
    ├─ Slack integration
```

---

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 | UI Framework |
| | Vite | Build Tool |
| | Tailwind CSS | Styling |
| | Framer Motion | Animations |
| | React Router | Routing |
| | Firebase | Auth & DB |
| **Backend** | Node.js 20 | Runtime |
| | Express | Web Framework |
| | Vertex AI | AI/ML |
| | Firestore | Database |
| | Cloud Services | Infrastructure |
| **Infrastructure** | Cloud Run | Serverless Compute |
| | Container Registry | Image Storage |
| | Cloud Build | CI/CD |
| | Secret Manager | Secrets |
| | Cloud Logging | Observability |

---

## Performance Optimization

### Frontend Optimization
- Code splitting with Vite
- Lazy loading of routes
- Image optimization
- CSS minification
- JavaScript minification
- Gzip compression

### Backend Optimization
- Connection pooling
- Query optimization
- Caching strategies
- Rate limiting
- Request compression
- Response caching

### Database Optimization
- Firestore indexing
- Query optimization
- Denormalization where needed
- Batch operations
- Pagination

---

This architecture ensures **scalability**, **reliability**, **security**, and **performance** for the ElectionIQ application.