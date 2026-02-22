from __future__ import annotations

import os
import re
from datetime import datetime
from uuid import uuid4

from flask import Flask, jsonify, request
from flask_cors import CORS
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB

app = Flask(__name__)
CORS(app)

complaints: dict[str, dict] = {}

def clean_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-zA-Z\s]", " ", text)
    return " ".join(text.split())

train_texts = [
    "no water for 2 days elderly affected",
    "garbage stinking near school",
    "huge pothole causing accidents",
    "streetlight not working at night",
    "drain overflow and dirty water"
]
train_categories = ["Water Supply", "Sanitation", "Roads", "Streetlight", "Drainage"]
train_priority = ["High", "Medium", "High", "Medium", "High"]
train_resolution = [24, 36, 18, 48, 30]

vectorizer = TfidfVectorizer(max_features=1000)
X = vectorizer.fit_transform([clean_text(t) for t in train_texts])
category_lr = LogisticRegression(max_iter=400).fit(X, train_categories)
category_nb = MultinomialNB().fit(X, train_categories)
priority_rf = RandomForestClassifier(n_estimators=50, random_state=42).fit(X.toarray(), train_priority)
resolution_rf = RandomForestRegressor(n_estimators=50, random_state=42).fit(X.toarray(), train_resolution)

def map_department(category: str) -> str:
    mapping = {
        "Water Supply": "Water Works",
        "Drainage": "Water Works",
        "Sanitation": "Sanitation",
        "Roads": "Road Transport",
        "Streetlight": "Electrical"
    }
    return mapping.get(category, "General")


def predict_complaint(description: str):
    cleaned = clean_text(description)
    v = vectorizer.transform([cleaned])
    cat_a = category_lr.predict(v)[0]
    cat_b = category_nb.predict(v)[0]
    priority = priority_rf.predict(v.toarray())[0]
    resolution = int(max(6, resolution_rf.predict(v.toarray())[0]))
    suggestions = list(dict.fromkeys([cat_a, cat_b]))
    return cat_a, suggestions, priority, resolution


@app.post("/complaints")
def create_complaint():
    payload = request.get_json(force=True)
    category, suggestions, priority, estimate = predict_complaint(payload["description"])
    complaint_id = f"CMP-{datetime.utcnow().strftime('%Y%m%d')}-{str(uuid4())[:8]}"
    record = {
        "id": complaint_id,
        "fullName": payload["fullName"],
        "description": payload["description"],
        "category": payload.get("category", category) or category,
        "suggestedCategories": suggestions,
        "address": payload["address"],
        "area": payload["area"],
        "city": payload["city"],
        "mobile": payload["mobile"],
        "latitude": payload.get("latitude"),
        "longitude": payload.get("longitude"),
        "priority": priority,
        "resolutionEstimateHours": estimate,
        "status": "Pending",
        "department": map_department(payload.get("category", category)),
        "remarks": "",
        "createdAt": datetime.utcnow().isoformat()
    }
    complaints[complaint_id] = record
    return jsonify(record), 201


@app.get("/complaints")
def list_complaints():
    mobile = request.args.get("mobile")
    complaint_id = request.args.get("id")
    items = list(complaints.values())
    if mobile:
        items = [x for x in items if x["mobile"] == mobile]
    if complaint_id:
        items = [x for x in items if x["id"] == complaint_id]
    return jsonify(items)


@app.patch("/complaints/<complaint_id>")
def update_complaint(complaint_id: str):
    payload = request.get_json(force=True)
    if complaint_id not in complaints:
        return jsonify({"error": "Not found"}), 404
    complaints[complaint_id].update(payload)
    if "category" in payload:
        complaints[complaint_id]["department"] = map_department(payload["category"])
    return jsonify(complaints[complaint_id])


@app.get("/analytics/summary")
def analytics_summary():
    items = list(complaints.values())
    by_area = {}
    by_priority = {}
    for item in items:
        by_area[item["area"]] = by_area.get(item["area"], 0) + 1
        by_priority[item["priority"]] = by_priority.get(item["priority"], 0) + 1
    return jsonify(
        {
            "total": len(items),
            "pending": len([x for x in items if x["status"] == "Pending"]),
            "inProgress": len([x for x in items if x["status"] == "In Progress"]),
            "resolved": len([x for x in items if x["status"] == "Resolved"]),
            "byArea": [{"name": k, "value": v} for k, v in by_area.items()],
            "byPriority": [{"name": k, "value": v} for k, v in by_priority.items()],
        }
    )


@app.get("/analytics/ai-summary")
def ai_summary():
    area = request.args.get("area", "Unknown")
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return jsonify({"summary": f"Gemini unavailable. Fallback: Monitor sanitation and road issues in {area}."})
    return jsonify({"summary": f"AI summary for {area}: Water and roads show highest risk."})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
