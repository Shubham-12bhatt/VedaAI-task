# VedaAI – AI Assessment Creator

AI-powered Assessment Creation Platform built for the VedaAI Full Stack Engineering Assignment.

Live Demo: https://veda-ai-shubham.vercel.app/ <br>
GitHub Repository: https://github.com/Shubham-12bhatt/VedaAI-task

---

## Overview

VedaAI allows teachers to:

* Create assignments
* Configure question patterns
* Generate AI-powered question papers
* View structured assessment output

The platform focuses on clean UI, structured AI responses, and scalable backend architecture.

---

## Features

### Assignment Creation

Teachers can configure:

* Due Date
* Question Types
* Number of Questions
* Marks Distribution
* Additional Instructions
* Optional File Upload

### Validation

* Required field validation
* Invalid value prevention
* Type-safe forms using TypeScript

---

## AI Question Generation

The system converts user input into structured prompts and generates:

* Question Sections
* Questions
* Difficulty Levels
* Marks Allocation

### AI Processing Flow

```text id="q6ykyr"
Teacher Input
    ↓
Prompt Structuring
    ↓
LLM Generation
    ↓
Response Parsing
    ↓
Structured Assessment Output
```

### Important

Raw AI responses are not directly rendered.
The response is parsed into structured JSON before displaying.

---

## Real-Time Updates

Implemented using WebSockets for:

* Live generation updates
* Processing feedback
* Better user experience

---

## Tech Stack

### Frontend

* Next.js
* TypeScript
* Tailwind CSS
* Zustand
* Socket.IO Client

### Backend

* Node.js
* Express.js
* MongoDB
* Redis
* BullMQ
* Socket.IO

### AI

* Groq API / OpenAI-compatible LLM

---

## System Architecture

```text id="i8o2bx"
Frontend
   ↓
Express API
   ↓
BullMQ Queue
   ↓
AI Worker
   ↓
MongoDB Storage
   ↓
WebSocket Updates
   ↓
Frontend Rendering
```

---

## Project Structure

```bash id="ot5i52"
VedaAI-task/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── store/
│   ├── services/
│   └── types/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── workers/
│   ├── queues/
│   ├── models/
│   └── socket/
│
└── README.md
```

---

## UI Highlights

* Figma-inspired implementation
* Clean assessment layout
* Difficulty badges
* Responsive design
* Structured sections
* Exam-paper inspired formatting

---

## Output Features

Generated papers include:

### Student Information

* Name
* Roll Number
* Section

### Question Sections

Each section contains:

* Section Title
* Instructions
* Questions
* Marks
* Difficulty Tags

---

## Local Setup

### Clone Repository

```bash id="jlwmmd"
git clone https://github.com/Shubham-12bhatt/VedaAI-task.git
```

### Frontend Setup

```bash id="vgn67j"
cd frontend

npm install

npm run dev
```

### Backend Setup

```bash id="fhq9al"
cd backend

npm install

npm run dev
```

---

## Environment Variables

### Frontend `.env`

```env id="5m5j48"
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Backend `.env`

```env id="vjlwmh"
PORT=5000

MONGO_URI=your_mongodb_uri

REDIS_HOST=localhost
REDIS_PORT=6379

GROQ_API_KEY=your_api_key
```

---

## API Endpoints

### Create Assignment

```http id="9v4p58"
POST /api/assignments
```

### Get Assignment

```http id="m5pg5m"
GET /api/assignments/:id
```

---

## WebSocket Events

| Event                | Description         |
| -------------------- | ------------------- |
| generation-started   | Generation started  |
| generation-progress  | Progress updates    |
| generation-completed | Questions generated |
| generation-failed    | Error handling      |

---

## Scalability Features

* Queue-based processing using BullMQ
* Redis-backed job management
* Modular backend architecture
* Real-time event communication

---

## Future Improvements

* PDF Export
* Authentication
* Teacher Dashboard
* Regenerate Questions
* Assignment History
* Multi-language Support

---

## Developer

Shubham Bhatt

GitHub: https://github.com/Shubham-12bhatt

---

## License

Developed as part of the VedaAI Full Stack Engineering Assignment.
