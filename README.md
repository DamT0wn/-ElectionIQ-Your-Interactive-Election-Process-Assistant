# ElectionIQ – Your Interactive Election Process Assistant

A full-stack, AI-powered web application that acts as an intelligent assistant helping users understand the election process, timelines, and steps in an interactive and easy-to-follow way.

## Features
- **Animated Election Timeline**: Motion-graphic step cards guiding users through the election journey.
- **Conversational AI Chatbot**: Powered by Gemini 1.5 Pro to answer election questions in simple language.
- **Polling Location Map**: Integrated Google Maps to find nearby polling stations and drop boxes.
- **Smart Election Calendar**: Add key election dates directly to Google Calendar.
- **AI Election Quiz**: Adaptive civics quiz with real-time AI-generated explanations.
- **Progress Tracker**: A dashboard to track completion of election steps.

## Architecture & Tech Stack

![Architecture Overview](https://via.placeholder.com/800x400.png?text=Architecture+Diagram)

- **Frontend**: React.js 18, Vite, Framer Motion, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: Google Firestore
- **AI / ML**: Vertex AI (Gemini 1.5 Pro)
- **Deployment**: Google Cloud Run
- **Authentication**: Firebase Google Auth

## Setup Instructions

### 1. Prerequisites
- Node.js (v20+)
- Google Cloud Platform account with billing enabled.

### 2. Google Cloud Setup
Enable the following APIs in your GCP project:
- Vertex AI API
- Google Maps JavaScript API & Places API
- Google Cloud Speech-to-Text API
- Google Cloud Text-to-Speech API
- Google Cloud Translation API

### 3. Environment Variables
Copy `.env.example` to `.env` in the root directory and fill in your API keys and project IDs.

### 4. Running Locally

**Terminal 1 (Backend):**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to view the application.

## Testing
Run unit tests for both backend and frontend:
```bash
cd backend && npm test
cd frontend && npm test
```

## Deployment
This application is configured for continuous deployment via Google Cloud Build. Pushing to the `main` branch will trigger the `cloudbuild.yaml` pipeline.

## License
MIT