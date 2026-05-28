# VedaAI – AI Assessment Creator

An AI-powered assessment generation platform built using Next.js, TypeScript, Express, MongoDB, Redis, BullMQ, Socket.io, and Groq Llama 3.

This project allows teachers to create assignments, generate AI-based question papers, and manage assessments in a realtime and scalable architecture.

---

# 🚀 Features

## ✅ Assignment Creation

- Create assignments using a clean UI
- Add:
  - Due date
  - Question types
  - Marks
  - Difficulty level
  - Instructions
  - File upload support (PDF/TXT)

---

## ✅ AI Question Generation

- AI-powered question paper generation using:
  - Groq API
  - Llama 3
- Structured JSON response generation
- Dynamic:
  - Sections
  - Questions
  - Difficulty tags
  - Marks
  - Answer keys

---

## ✅ Realtime Processing

Implemented using:

- BullMQ
- Redis
- Socket.io

Realtime workflow:
1. Assignment submitted
2. Queue job created
3. Worker processes AI generation
4. MongoDB updated
5. Frontend updated in realtime

---

## ✅ Dashboard

- View all generated assignments
- Assignment status tracking:
  - Pending
  - Processing
  - Completed
  - Failed

---

## ✅ PDF Export

- Download generated assessment as PDF
- Styled printable format

---

# 🏗️ Tech Stack

## Frontend
- Next.js 16
- TypeScript
- Tailwind CSS
- Zustand
- React Hook Form
- Zod Validation
- Socket.io Client

## Backend
- Node.js
- Express
- MongoDB Atlas
- Redis (Upstash)
- BullMQ
- Socket.io
- TypeScript

## AI
- Groq API
- Llama 3 (70B)

---

# 🔄 Realtime Workflow

1. Teacher creates assignment
2. Backend creates BullMQ job
3. Redis stores job
4. Worker processes AI generation
5. MongoDB stores generated paper
6. Socket.io emits realtime updates
7. Frontend updates automatically

---


```
```
