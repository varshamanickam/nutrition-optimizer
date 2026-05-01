import Papa from "papaparse";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [search, setSearch] = useState("");
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [allMeals, setAllMeals] = useState([]);
  const [calorieLimit, setCalorieLimit] = useState(2000);
  const [result, setResult] = useState(null);

  useEffect(() => {
    Papa.parse("/data/clean_food_data.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const foods = result.data
          .map((row) => (row.food ? row.food.trim().toLowerCase() : ""))
          .filter((food) => food !== "");

        const uniqueFoods = [...new Set(foods)].sort();
        setAllMeals(uniqueFoods);
      },
    });
  }, []);

  const filteredMeals =
    search.trim() === ""
      ? allMeals.slice(0, 30)
      : allMeals
          .filter((meal) => meal.includes(search.trim().toLowerCase()))
          .slice(0, 30);

  function handleMealToggle(meal) {
    if (selectedMeals.includes(meal)) {
      setSelectedMeals(selectedMeals.filter((item) => item !== meal));
    } else {
      setSelectedMeals([...selectedMeals, meal]);
    }
  }
  function handleReset() {
    setSelectedMeals([]);
    setSearch("");
    setResult(null);
  }

  async function handleOptimize() {
    const response = await fetch("http://localhost:8000/optimize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        calorie_limit: Number(calorieLimit),
        selected_meals: selectedMeals,
      }),
    });

    const data = await response.json();
    setResult(data);
  }

  return (
    <div className="app">
      <header className="hero">
        <h1>Nutrition Optimizer</h1>
        <p>
          Choose meals, set a calorie limit, and let the optimizer find the best
          combination.
        </p>
      </header>

      <main className="dashboard">
        <section className="card">
          <h2>Choose Meals</h2>

          <input
            className="search-input"
            type="text"
            placeholder="Search meals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <p className="search-count">Showing {filteredMeals.length} foods</p>

          <div className="meal-list">
            {filteredMeals.map((meal) => (
              <label key={meal}>
                <input
                  type="checkbox"
                  checked={selectedMeals.includes(meal)}
                  onChange={() => handleMealToggle(meal)}
                />
                {meal}
              </label>
            ))}
          </div>
        </section>

        <section className="card">
          <h2>Calorie Budget</h2>

          <input
            className="calorie-input"
            type="number"
            value={calorieLimit}
            onChange={(e) => setCalorieLimit(e.target.value)}
          />

          <button className="optimize-button" onClick={handleOptimize}>
            Create meal plan
          </button>
          <button className="reset-button" onClick={handleReset}>
            Reset Selection
          </button>

          <div className="selected-box">
            <h3>Selected Meals</h3>
            {selectedMeals.length === 0 ? (
              <p>No meals selected yet.</p>
            ) : (
              <ul>
                {selectedMeals.map((meal) => (
                  <li key={meal}>{meal}</li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="card">
          <h2>Results</h2>

          {!result ? (
            <p className="empty-result">
              Your optimized meal combination will appear here.
            </p>
          ) : (
            <div>
              <h3>Optimized Meals</h3>

              {result.selected_meals.length === 0 ? (
                <p>No meals fit within this calorie limit.</p>
              ) : (
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Food</th>
                      <th>Calories</th>
                      <th>Nutrition</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.selected_meals.map((meal) => (
                      <tr key={meal.food}>
                        <td>{meal.food}</td>
                        <td>{meal.caloric_value}</td>
                        <td>{meal.nutrition_density}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <div className="summary-box">
                <p>Total Calories: {result.total_calories}</p>
                <p>Total Nutrition: {result.total_nutrition}</p>
                <p>Remaining Calories: {result.remaining_calories}</p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;