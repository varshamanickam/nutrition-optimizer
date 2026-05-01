from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from src.knapsack import MealKnapsack

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ← change this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

knapsack = MealKnapsack("data/processed/clean_food_data.csv")


class OptimizeRequest(BaseModel):
    calorie_limit: int
    selected_meals: list[str]


@app.get("/")
def home():
    return {"message": "backend is running"}


@app.post("/optimize")
def optimize_meals(request: OptimizeRequest):
    result = knapsack.solve(
        request.calorie_limit,
        request.selected_meals
    )

    return {
        "selected_meals": result["selected_meals"].to_dict(orient="records"),
        "total_calories": int(result["total_calories"]),
        "total_nutrition": float(result["total_nutrition"]),
        "remaining_calories": int(result["remaining_calories"]),
    }