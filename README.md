# Nutrition Optimizer (0/1 Knapsack Project)

## Overview

This project implements a **0/1 Knapsack Dynamic Programming algorithm** to help users select an optimal set of meals based on a calorie constraint while maximizing nutritional value.

Instead of choosing foods randomly or based only on calories, this system intelligently selects a subset of meals that provides the **highest nutrition density within a calorie budget**.

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

2. A DP table is constructed where:
   - Rows represent meals
   - Columns represent calorie limits

3. The algorithm computes the maximum nutrition score achievable under the calorie constraint.

4. Final selected meals are obtained using **backtracking on the DP table**.

---

## Resources

NO AI OR EXTERNAL RESOURCES WERE USED IN THIS ASSIGNMENT

