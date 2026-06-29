from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import joblib
import numpy as np
import pandas as pd
import os
import contextlib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def get_path(folder, filename):
    return os.path.join(BASE_DIR, folder, filename)

# Shared State
class ModelContainer:
    def __init__(self):
        self.base = None
        self.lstm = None
        self.lstm_scaler = None
        self.lstm_features = None
        self.lstm_seq_length = 7

# Global container instance
models = ModelContainer()

@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    # --- Startup ---
    print("🚀 Initializing AI Service Stability Layer (FastAPI)...")
    
    # 1. Load Base Model (Always try)
    try:
        base_model_path = get_path('models', 'mood_model.joblib')
        if os.path.exists(base_model_path):
            print("📊 Pre-loading Base Mood model...")
            m_data = joblib.load(base_model_path)
            models.base = m_data['model']
            print("✅ Base model loaded.")
        else:
            print("⚠️ Warning: Base model not found.")
    except Exception as e:
        print(f"❌ Error loading base model: {e}")

    # 2. Load LSTM Model (With Fallback Support)
    try:
        l_model_path = get_path('models', 'lstm_mood_model.h5')
        l_scaler_path = get_path('models', 'lstm_scaler.joblib')
        
        if os.path.exists(l_model_path) and os.path.exists(l_scaler_path):
            print("🧠 Attempting to pre-load LSTM model...")
            # We try to import here - if it fails, we fall back to statistical forecasting
            from keras.models import load_model as tf_load_model
            models.lstm = tf_load_model(l_model_path, compile=False)
            l_data = joblib.load(l_scaler_path)
            models.lstm_scaler = l_data['scaler']
            models.lstm_features = l_data['features']
            models.lstm_seq_length = l_data.get('seq_length', 7)
            print("✅ LSTM model warm-started and ready.")
        else:
            print("⚠️ Warning: LSTM model files missing.")
    except Exception as e:
        print(f"⚠️ LSTM Model loading failed: {e}")
        print("🛡️ Resilience Mode: Statistical Fallback Engine enabled.")

    yield
    # --- Shutdown ---
    print("👋 Shutting down AI Service...")

app = FastAPI(title="MindTrack ML Service", lifespan=lifespan)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Data Models ---
class MoodInput(BaseModel):
    sleep_hours: Optional[float] = 7
    stress_level: Optional[float] = 5
    exercise_minutes: Optional[float] = 30
    social_interaction_level: Optional[float] = 5
    screen_time_hours: Optional[float] = 4
    journal_sentiment_score: Optional[float] = 0
    prev_mood: Optional[float] = 5

class MoodHistoryItem(BaseModel):
    sleep_hours: Optional[float] = 7
    stress_level: Optional[float] = 5
    exercise_minutes: Optional[float] = 30
    social_interaction_level: Optional[float] = 5
    screen_time_hours: Optional[float] = 4
    journal_sentiment_score: Optional[float] = 0
    mood_score: Optional[float] = 5

class ForecastInput(BaseModel):
    history: List[MoodHistoryItem]

# --- Helper Logic ---
def get_mood_label(v):
    if v >= 8: return "Excellent"
    if v >= 6.5: return "Good"
    if v >= 4.5: return "Neutral"
    if v >= 3: return "Poor"
    return "Terrible"

def calculate_statistical_forecast(history: List[MoodHistoryItem]):
    """Provides a high-fidelity weighted moving average for forecasting."""
    scores = [h.mood_score for h in history]
    if not scores: return {"score": 5, "label": "Neutral"}
    
    # Simple WMA (last 3 entries weighted higher)
    weights = np.linspace(0.5, 1.0, len(scores))
    weighted_avg = np.average(scores, weights=weights)
    
    # Trend Calculation (Momentum)
    if len(scores) >= 2:
        recent_trend = scores[-1] - scores[-2]
    else:
        recent_trend = 0
        
    def project(days):
        # We dampen the trend for longer projections to avoid wild values
        decay = 1.0 / (1 + (days * 0.1))
        projected = weighted_avg + (recent_trend * days * decay)
        return float(np.clip(projected, 1, 10))

    return {
        'next_day': {'score': round(project(1), 1), 'label': get_mood_label(project(1))},
        '3_days':   {'score': round(project(3), 1), 'label': get_mood_label(project( project(3)))},
        '7_days':   {'score': round(project(7), 1), 'label': get_mood_label(project(project(7)))}
    }

# --- Endpoints ---

@app.post("/predict-mood")
async def predict(req: MoodInput):
    # Base model is very stable, but we should handle its absence
    if not models.base:
        # Static heuristic if model is missing
        pred = (req.sleep_hours / 10 * 4) + (req.social_interaction_level / 10 * 3) + (req.prev_mood / 10 * 3)
        return {'predicted_mood': round(float(np.clip(pred, 1, 10)), 1), 'confidence': 'low (heuristic)'}
    
    try:
        input_data = {
            'sleep_hours':              req.sleep_hours or 7,
            'stress_level':             req.stress_level or 5,
            'exercise_minutes':         req.exercise_minutes or 30,
            'social_interaction_level': req.social_interaction_level or 5,
            'screen_time_hours':        req.screen_time_hours or 4,
            'journal_sentiment_score':  req.journal_sentiment_score or 0,
            'prev_mood':                req.prev_mood or 5,
        }
        
        pred = models.base.predict(pd.DataFrame([input_data]))[0]
        return {'predicted_mood': round(float(pred), 1), 'confidence': 'high'}
    except Exception as e:
        print(f"Prediction error fallback: {e}")
        return {'predicted_mood': 5.0, 'confidence': 'fallback'}

@app.post("/predict_future")
async def predict_future(req: ForecastInput):
    # CASE 1: LSTM is available
    if models.lstm and models.lstm_scaler is not None:
        try:
            history = req.history
            seq_length = models.lstm_seq_length
            
            if len(history) >= seq_length:
                inputs = [[
                    h.sleep_hours, h.stress_level, h.exercise_minutes,
                    h.social_interaction_level, h.screen_time_hours,
                    h.journal_sentiment_score, h.mood_score
                ] for h in history[-seq_length:]]
                
                X = np.array(inputs)
                X_scaled = models.lstm_scaler.transform(X).reshape(1, seq_length, X.shape[1])
                y_scaled = models.lstm.predict(X_scaled, verbose=0)[0] 
                
                def unscale(val):
                    row = np.zeros(X.shape[1])
                    row[-1] = val
                    return models.lstm_scaler.inverse_transform([row])[0][-1]

                preds = [np.clip(unscale(v), 1, 10) for v in y_scaled]
                return {
                    'next_day': {'score': round(float(preds[0]), 1), 'label': get_mood_label(preds[0])},
                    '3_days':   {'score': round(float(preds[1]), 1), 'label': get_mood_label(preds[1])},
                    '7_days':   {'score': round(float(preds[2]), 1), 'label': get_mood_label(preds[2])}
                }
        except Exception as e:
            print(f"LSTM Prediction failed, shifting to statistics: {e}")

    # CASE 2: Fallback to Statistical Engine (Guaranteed result)
    return calculate_statistical_forecast(req.history)

@app.get("/health")
async def health():
    return {
        'status': 'online', 
        'mode': 'hybrid' if models.lstm else 'statistical-fallback',
        'models_ready': {
            'base': models.base is not None, 
            'lstm': models.lstm is not None
        }
    }

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=5006)
