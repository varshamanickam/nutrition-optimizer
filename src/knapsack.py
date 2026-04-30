import pandas as pd


class MealKnapsack:
    """
    0/1 Knapsack for meal selection based on:
    - Weight = calories
    - Value = nutrition score
    """

    def __init__(self, data_path):
        self.df = pd.read_csv(data_path)

        # Ensure clean data
        self.df = self.df[self.df["caloric_value"] > 0].copy()

    def solve(self, calorie_limit, selected_meals):
        
        # Runs 0/1 Knapsack on user-selected meals

        # Filter only selected meals
        data = self.df[self.df["food"].isin(selected_meals)].copy()

        missing = set(selected_meals) - set(data["food"])
        if missing:
            print(f"Warning: Missing meals skipped -> {missing}")

        items = data["food"].tolist()
        calories = data["caloric_value"].tolist()
        values = data["nutrition_density"].tolist()

        n = len(items)
        W = calorie_limit

        # DP table
        dp = [[0 for _ in range(W + 1)] for _ in range(n + 1)]

        # Build DP table
        for i in range(1, n + 1):
            for w in range(W + 1):
                if calories[i - 1] <= w:
                    dp[i][w] = max(
                        values[i - 1] + dp[i - 1][w - calories[i - 1]],
                        dp[i - 1][w]
                    )
                else:
                    dp[i][w] = dp[i - 1][w]

        # Backtracking
        w = W
        selected_indices = []

        for i in range(n, 0, -1):
            if dp[i][w] != dp[i - 1][w]:
                selected_indices.append(i - 1)
                w -= calories[i - 1]

        selected_indices.reverse()

        result = data.iloc[selected_indices]

        total_calories = result["caloric_value"].sum()
        total_nutrition = result["nutrition_density"].sum()

        return {
            "selected_meals": result[["food", "caloric_value", "nutrition_density"]],
            "total_calories": total_calories,
            "total_nutrition": total_nutrition,
            "remaining_calories": calorie_limit - total_calories
        }


# Optional standalone test
if __name__ == "__main__":
    knapsack = MealKnapsack("data/processed/clean_food_data.csv")

    selected_meals = [
        "cream cheese",
        "cheddar cheese",
        "parmesan cheese",
        "ricotta cheese"
    ]

    calorie_limit = 2000

    output = knapsack.solve(calorie_limit, selected_meals)

    print("Selected Meals:")
    print(output["selected_meals"])

    print("Total Calories:", output["total_calories"])
    print("Total Nutrition:", output["total_nutrition"])
    print("Remaining Calories:", output["remaining_calories"])