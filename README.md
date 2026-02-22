# Complaint Prioritization and Resolution System

Production-ready split architecture:
- `frontend/`: Next.js 15 (App Router), Tailwind, TypeScript, Recharts, localization provider, citizen/admin portals.
- `backend/`: Flask API, NLP preprocessing, TF-IDF vectorization, Logistic Regression + Naive Bayes category suggestions, Random Forest priority and resolution prediction.

## Run backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

## Run frontend
```bash
cd frontend
npm install
npm run dev
```

## Key Features
- Multilingual (English/Hindi/Gujarati) with session persistence and first-visit popup.
- Citizen complaint intake with validations, geolocation capture, dual-layer category detection.
- Complaint tracking with Complaint ID + mobile + mock OTP (123456).
- Admin dashboard login (`admin123`), status updates, department mapping, analytics charts.
- Resilience fallback when Gemini key is absent or ML/Flask service is offline.

