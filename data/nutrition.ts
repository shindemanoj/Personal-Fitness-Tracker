export interface NutritionFramework {
    calories: string;
    protein: string;
    carbs: string;
    fats: string;
    water: string;

    structure: {
        breakfast: string[];
        postWorkout: string[];
        lunch: string[];
        snack: string[];
        dinner: string[];
        beforeBed?: string[];
    };

    weeklyAddOns: string[];
    avoid: string[];
    control: string[];
}

export const nutritionFramework: NutritionFramework = {
    /* ----------------------------------
       🔥 DAILY TARGET FRAMEWORK
    ----------------------------------- */

    calories: "2,300–2,400 kcal",
    protein: "155–165g per day",
    carbs: "200–230g per day",
    fats: "65–75g per day",
    water: "3–3.5 liters per day",

    /* ----------------------------------
       🥣 DAILY STRUCTURE
    ----------------------------------- */

    structure: {
        breakfast: [
            "2 whole eggs + 2 egg whites",
            "Besan chilla + curd",
            "Oats + whey + nuts",
            "Greek yogurt + flaxseed + walnuts",
            "Target: 30–35g protein",
        ],

        postWorkout: [
            "1 scoop whey OR 200–250g high-protein yogurt",
            "Banana if heavy session",
        ],

        lunch: [
            "150–200g chicken OR 150g paneer OR dal + curd combo",
            "Large vegetable portion",
            "1–2 rotis OR moderate rice",
            "1 tsp ghee max",
            "Target: 40–45g protein",
        ],

        snack: [
            "Greek yogurt",
            "Roasted chana",
            "2 boiled eggs",
            "1 tbsp peanut butter (controlled)",
            "Target: 15–20g protein",
        ],

        dinner: [
            "Paneer bhurji",
            "Omelette + salad",
            "Chicken + vegetables",
            "Dal + vegetables",
            "Smaller carb portion at night",
            "Target: 30–40g protein",
        ],

        beforeBed: [
            "1 cup cow milk OR 200g yogurt",
            "Not both",
        ],
    },

    /* ----------------------------------
       🧠 WEEKLY ADD-ONS
    ----------------------------------- */

    weeklyAddOns: [
        "Flaxseed 1 tbsp daily",
        "Walnuts 2–3 halves daily",
        "Creatine 3–5g daily",
        "Fish once or twice weekly",
        "Pinch of salt on heavy sweat days",
        "Coconut water 2–3x/week max",
    ],

    /* ----------------------------------
       🚫 DISCIPLINE
    ----------------------------------- */

    avoid: [
        "Deep fried food",
        "Sugary drinks",
        "Daily desserts",
        "Excess ghee",
        "Late-night sugar",
    ],

    control: [
        "Honey (1 tsp max)",
        "Rice portions",
        "Milk quantity",
        "Peanut butter portions",
        "Cheese cubes",
    ],
};