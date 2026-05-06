# Nutrition Optimizer (0/1 Knapsack Project)

## Overview

This project applies a **0/1 Knapsack Dynamic Programming algorithm** to a real world nutrition dataset in order to build a smart meal recommendation system.

The goal is to help users choose foods that maximize nutritional value while staying within a calorie budget. Instead of manually trying to compare foods one by one or only looking at calories, the system uses dynamic programming to figure out which combination gives the best nutrition score under the calorie limit.

In this project, we combined:
- EDA
- preprocessing on a real world dataset
- DP optimization
- frontend/backend integration for the demo

Our final result is an interactive nutrition optimizer where users can:
- enter a calorie limit
- select foods they want to consider
- generate an optimzed set of meals

---

## Problem Statement

Given a set of food items, each with:

- Calories (weight)
- Nutrition density (value)

The goal is to:

> Maximize total nutrition score while ensuring total calorie intake does not exceed a user-defined limit.

---

## Algorithmic Approach

This project uses the **0/1 Knapsack Dynamic Programming algorithm**.

### Mapping to Knapsack Problem

| Knapsack Concept | Project Mapping        |
|------------------|------------------------|
| Items            | Meals / Foods         |
| Weight           | Calories              |
| Value            | Nutrition Density     |
| Capacity         | Calorie Limit         |

---

## Approach

1. Each meal is treated as an item that can either be:
   - Selected (1)
   - Not selected (0)

   which is why this is modeled as a 0/1 Knapsack problem instead of fractional knapsack.

2. A DP table is constructed where:
   - Rows represent meals
   - Columns represent calorie limits

3. The algorithm computes the maximum nutrition score achievable under the calorie constraint.

4. Final selected meals are obtained using **backtracking on the DP table**.

---

## Dataset 

Dataset used: https://www.kaggle.com/datasets/utsavdey1410/food-nutrition-dataset

The dataset contains nutritional info for thousands of food items, including:
- calories
- protein
- fats
- carbs
- sugars
- sodium
- vitamins
- nutrition density score

-----

## Project structure

```bash
nutrition-optimizer/
│
├── data/
│   ├── raw/
│   │
│   └── processed/
│       └── clean_food_data.csv
│
├── notebooks/
│   └── eda.ipynb
│
├── src/
│   └── knapsack.py
│
├── frontend/
│
├── app.py
├── requirements.txt
└── README.md
```

---

## Exploratory Data Analysis (EDA) and Preprocessing:

The preprocessiing and EDA for this project were done inside `notebooks/eda.ipynb`

### Main observations from the EDA

After combining the 5 main Kaggle data files into a single dataframe, the dataset contained:
- 2,395 food items
- 37 columns

We found:
- no major missing value issues
- extra index columns left over from the CSV exporting
- rows with zero calorie values
- rows with zero nutritino density

### Why zero calorie foods were removed

One important issue discovered during preprocesing was the presence of foods with:
- zero calories
- but non-zero nutrition density

These rows are a problem for the knapsack setup because calories are supposed to act as the weight constraint while nutrition density acts as the value.
A food with zero weight but positive nutritional value would always be selected by the algo because it provides:
> "free nutrition"
without actually contributing to the calorie limit.

But this would produce unrealistic optimization results and break the intended behavior of the system.

Foods with zero calories and zero nutrition were also removed since they contribute nothing to either the objective fuction or the constraint and only end up adding unnecessary noise to the dataset.

### Preprocessing steps

The preprocessing pipeline was implemented directly inside the same `notebook/eda.ipynb` instead of a separate preprocessing script. 
The following steps were performed:

1. Combined the 5 Kaggle food data files into one dataframe

2. Removed unnecessary index columns:
 - `Unnamed: 0`
 - `Unnamed: 0.1`

3. Standardized column names:
 - lowercase
 - underscores instead of spaces

4. Kept only the columns needed for the knapsack setup and those were:
 - `food`
 - `caloric_value`
 - `nutrition_density`

5. Removed rows with zero calorie values

6. Kept the dataset's original `nutrition_density` score as the optimization value metric.

> We treat the `nutrition_density` score as a black box metric that's just provided by the dataset rather than trying to come up with our own logic for how we'd go about calculating the nutrition of a food item since that's not the goal of this project and is outside the scope of an algorithms project.

7. The cleaned dataframe was exported directly from the notebook and is located at `../data/processed/clean_food_data.csv`

-----

### Expected Knapsack Behavior

The knapsack algorithm should use the cleaned dataset created during preprocessing (available as `clean_food_data.csv` under `data/processed/`)

For each food item:

- item name = `food`
- weight = `caloric_value`
- value = `nutrition_density`

The user should provide:

1. a calorie limit
2. a list of selected food items

The algorithm should only run on the foods selected by the user and not the entire dataset

The goal is to choose the subset of selected foods that maximizes total nutrition score while also staying within the user’s calorie limit that they enter

so basically:

maximize total `nutrition_density`

subject to:

total `caloric_value` <= user calorie limit

The output should include:

- list of chosen foods
- each chosen food’s name
- each chosen food’s calories
- each chosen food’s nutrition score
- total calories used
- total nutrition score
- remaining calories

If a selected food is not found in the cleaned dataset, it should either be skipped with a warning or shown as unavailable. The algorithm should not include foods that exceed the calorie limit unless they are part of a valid combination that stays within the total limit.

--------


### Frontend Interface

The frontend provides an interactive interface for testing the nutrition optimizer without having to run the algorithm directly from the terminal.

The interface lets the user:
- enter a calorie budget
- choose which food options they want the algorithm to consider
- click the "create meal plan" button to run the knapsack algorithm
- reset selected food options if they want to start over

The frontend sends the selected foods and calorie limit to the FastAPI backend. The backend then runs the 0/1 knapsack algorithm and sends the optimized result back to the frontend.

The results section displays:
- selected foods from the optimal solution
- each food’s calories
- each food’s nutrition density score
- total calories used
- total nutrition score
- remaining calories

### User interactions

- Entering a calorie limit  
  - sets the maximum calorie capacity for the knapsack problem

- Selecting food options  
  - controls which foods are available to the algorithm
  - users can see search results update in real time as they start typing in letters similar to actual search engines

- Clicking optimize  
  - sends the selected inputs to the backend and displays the optimal subset

- Clicking reset  
  - clears the selected foods so the user can choose again

### Layout

The interface is organized into 3 main sections:

1. Input Panel  
Displays the calorie limit input and the selectable food options

2. Middle Panel
This section displays the selected food items and the "Create Meal Plan" and "Reset selections" buttons as well

3. Results Panel  
Displays the optimized meal combination and summary values after the algorithm runs

### UI Goal

Instead of explaining the DP table directly, the interface lets users actually see what the algorithm is doing where given a calorie budget and a set of food choices, it returns the best combination based on nutrition score.


----

## Efficiency

The dynamic programming solution runs in:

O(n * W)

where:
- `n` = # of food items
- `W` = calorie limit

This is more efficient than brute force search over all possible food combinations.

-------

## Key learning outcomes

- Better understanding of DP
- Handling edge cases in optimization problems
- Practical application of what we learned in class

-----

## Future steps

- Possibly incorporating a larger dataset
- Verifying the validity of the `nutrition_density` field
- User being able to enter (in lbs or g or kg) how much of a food item they have instead of just going by the current 1 standard portion size that's used to calculate nutrition in the model

----


## How to run

1. Clone the repo

```bash
git clone https://github.com/varshamanickam/nutrition-optimizer.git
```

```bash
cd nutrition-optimizer
```
---

2. Install dependencies

```bash
pip install -r requirements.txt
```

---

3. Run the backend server

```bash
uvicorn app:app --reload
```

---

4. Start the frontend

```bash
cd frontend
npm install
npm run dev
```
----


## ACKNOWLEDGEMENTS and REFERENCES

The data loading, exploratory analysis, preprocessing, and knapsack implementation were all our own logic and implementation. Did not use AI for those sections.

AI tools were used to assist with frontend development (React component strcuture and UI styling). We described our design requirements (clean, intuitive, green themed).

No AI tools were used in the design or implementation of the core data structures or algos.

1. dataset: https://www.kaggle.com/datasets/utsavdey1410/food-nutrition-dataset
2. looked at apps like this for inspo: https://www.myfitnesspal.com
3. https://youtu.be/nLmhmB6NzcM?si=Dont3DHz2v6EU6o5
4. https://youtu.be/zRza99HPvkQ?si=Llrk38xjq9x8X8fD

The YT videos were to better understand the algo itself.

