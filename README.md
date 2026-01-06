# 📚 EduCycle – Sustainable Textbook Reuse Platform

EduCycle is a **safe, free, and sustainable textbook reuse platform** designed to reduce educational inequality and book waste. It connects students who want to **donate or request physical textbooks** with **NGOs and educational institutions** that act as trusted collection and distribution hubs.

The platform prioritizes **offline and low‑income students**, ensures **user safety**, and tracks **real social and environmental impact**.

---

## 🌍 Problem Statement

Every year after exams, millions of usable textbooks are discarded or resold, while many students—especially from low‑income or offline backgrounds—struggle to access affordable study materials. Existing solutions focus on selling books or informal exchanges, often ignoring **safety, fairness, and accessibility**.

---

## 💡 Solution – EduCycle

EduCycle creates a **circular system for textbooks**:
- Students can **donate or request books for free**
- NGOs and schools act as **verified pickup and distribution points**
- No phone numbers, no payments, no home deliveries
- Safety‑first, NGO‑verified, and impact‑driven

---

## 👥 User Roles

### 👤 Student
- Donate physical textbooks
- Request textbooks
- Upload and download study notes (PDFs)
- Track personal impact (books reused, credits earned)

### 🏫 NGO / Institution
- Request books in bulk for students
- Collect donated books
- Distribute books to needy or offline students
- View impact reports and analytics

---

## 🔐 Safety & Trust Principles

- ❌ No phone numbers or personal contact sharing
- ❌ No home pickup or delivery
- ✅ Only verified public pickup locations (NGOs, schools, libraries)
- ✅ In‑app chat opens **only after request approval**
- ✅ NGO‑verified distribution
- ✅ Feedback and reputation system

---

## 🔄 Core Feature: Request Book Flow (Summary)

1. Student requests a book and selects a safe pickup location  
2. Backend creates a request with `pending` status  
3. Donor or NGO reviews and approves/rejects the request  
4. On approval:
   - Temporary in‑app chat opens
   - Pickup details are coordinated
5. Student collects the book and confirms receipt  
6. Feedback is submitted and impact metrics are updated  

---
**Unique Differentiators**

1. Focuses on reuse, not resale
2. NGO-mediated model instead of peer-to-peer handoffs
3. Built-in impact measurement, not an afterthought
4. Safety-by-design rather than safety-as-policy

## 🧠 Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS

### Backend
- Python 3.11
- FastAPI
- Async APIs

### Google / Firebase Services
- Firebase Authentication (Google Identity)
- Cloud Firestore (database)
- Firebase Storage (images, PDFs)
- Cloud Functions (logic‑ready structure)

### Location Services
- OpenStreetMap (Nominatim API) for nearby NGO suggestions

---

## 🗂️ Database Design (Firestore – High Level)

Collections:
- `users` – student and NGO profiles
- `books` – donated book listings
- `requests` – book request lifecycle
- `chats` & `messages` – approval‑based in‑app chat
- `ngo_requests` – bulk NGO requests
- `feedback` – ratings and trust
- `resources` – uploaded notes and PDFs
- `impact_metrics` – reuse and sustainability tracking

---

## 📊 Impact Tracking

EduCycle tracks:
- Number of books reused
- Number of students supported
- Estimated money saved
- Estimated paper waste reduced

This data supports **NGOs, CSR partners, and sustainability reporting**.

---

## 🤝 Partnerships & Sustainability

- **NGOs & Schools:** Distribution and verification
- **CSR Partners:** Fund book reuse initiatives and platform sustainability
- **Institutions:** Host donation drives and pickup points

💰 Students always use the platform **for free**.  
Revenue is generated through **institution partnerships, CSR‑funded campaigns, and paid impact analytics**.

---

## 🚀 Project Status

This project was built as part of a **hackathon** and is:
- Functionally complete as an MVP
- Technically scalable
- Designed with real‑world constraints in mind
- Ready for pilot testing with NGOs or schools

---

## 👨‍👩‍👧‍👦 Team

**Team Name:** QuadSquad  
**Project:** EduCycle  
**Focus Areas:** Education Access • Sustainability • Safety • Social Impact

---

## 📌 Future Enhancements

- Automated NGO verification
- Advanced impact analytics
- Multilingual support
- Mobile‑friendly optimizations
- Government and district‑level integrations

---

## 📝 License

This project is intended for educational and social‑impact use.

---

**EduCycle – Reuse books. Reduce waste. Reach students.**
