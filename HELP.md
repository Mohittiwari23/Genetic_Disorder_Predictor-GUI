
# GenPlus – Genetic Disorder Predictor (Help Guide)

Welcome to GenPlus, an intelligent AI-powered tool that predicts possible genetic disorders based on patient data.

This document will walk you through how to set up, run, and use the application, including useful links and troubleshooting tips.

---

## Project Structure

```
project-root/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── prediction/        # Prediction form and results
│   └── disorder/          # Educational content per disorder
├── components/            # UI components
├── apiService.ts          # Frontend service to call FastAPI
├── main.py                # FastAPI backend
├── functions.py           # Backend utility functions
├── .env.local             # Environment variables for frontend
├── model files/           # pca.pkl, label_encoders.pkl, xgb_model.pkl
```

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Mohittiwari23/Genetic_Disorder_Predictor-GUI

```

---

### 2. Backend Setup (FastAPI)

Navigate to your backend directory:

```bash
python -m venv .venv
source .venv\Scripts\activate 
pip install -r requirements.txt
```

#### Run the FastAPI server:

```bash
uvicorn main:app --reload
```

Access the API docs at: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

### 3. Frontend Setup (Next.js + TypeScript)

In a separate terminal:

```bash
cd frontend
npm install
```

#### Ensure your `.env.local` file exists:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

#### Run the development server:

```bash
npm run dev
```

Open in browser: [http://localhost:3000](http://localhost:3000)

---

## Prediction Flow

1. User clicks “Fill Form” on the landing page.
2. A modal opens with step-by-step questions.
3. On form submit, the data is sent to the FastAPI backend.
4. The backend:
   - Transforms input
   - Applies preprocessing (label encoding, PCA)
   - Runs the XGBoost model
   - Returns class probabilities and predicted label
5. The frontend displays:
   - Predicted disorder
   - Confidence level
   - Probability distribution
   - Patient name and age (if given)

---

## Learning More About Disorders

After prediction:
- Click “Learn More”
- Navigate to `/disorder/all`
- See a list of genetic disorder types
- Explore detailed information by clicking each disorder

---

## Troubleshooting

| Problem | Solution |
|--------|----------|
| 404 on load | Make sure `app/page.tsx` exists for your landing page. |
| CORS error | Check FastAPI `CORSMiddleware` settings. |
| Form says “Failed to process data” | Make sure form keys match `InputDict` in `main.py`. |
| "onSubmit is not a function" | Ensure `UploadModal` receives the `onSubmit` prop. |
| Model not found | Ensure `pca.pkl`, `label_encoders.pkl`, and `xgb_model.pkl` are in the backend directory. |

---


Feel free to reach out:
- GitHub Issues
- Email: mohittiwari2522@gmail.com