import { UserProfile, UserTargets } from './database';

export function calculateTargets(profile: UserProfile): UserTargets {
    const {
        weightKg,
        heightCm,
        age,
        gender,
        activityLevel,
        fitnessGoal,
    } = profile;

    /* -----------------------------
       1️⃣ BMR (Mifflin-St Jeor)
    ----------------------------- */

    let bmr =
        gender === 'male'
            ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
            : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

    /* -----------------------------
       2️⃣ Activity Multiplier
    ----------------------------- */

    const activityMap = {
        low: 1.4,
        moderate: 1.6,
        high: 1.8,
    };

    const tdee = bmr * activityMap[activityLevel];

    /* -----------------------------
       3️⃣ Goal Adjustment
    ----------------------------- */

    let calorieTarget = tdee;

    if (fitnessGoal === 'fat_loss') {
        calorieTarget = tdee - 400;
    }

    if (fitnessGoal === 'strength') {
        calorieTarget = tdee + 250;
    }

    if (fitnessGoal === 'recomposition') {
        calorieTarget = tdee;
    }

    calorieTarget = Math.round(calorieTarget);

    /* -----------------------------
       4️⃣ Protein (goal based)
    ----------------------------- */

    let proteinMultiplier = 1.6;

    if (fitnessGoal === 'fat_loss') proteinMultiplier = 2.0;
    if (fitnessGoal === 'strength') proteinMultiplier = 1.8;
    if (fitnessGoal === 'recomposition') proteinMultiplier = 2.2;

    const proteinTarget = Math.round(weightKg * proteinMultiplier);

    /* -----------------------------
       5️⃣ Fat (25% calories)
    ----------------------------- */

    const fatsTarget = Math.round((calorieTarget * 0.25) / 9);

    /* -----------------------------
       6️⃣ Carbs (Remaining calories)
    ----------------------------- */

    const caloriesFromProtein = proteinTarget * 4;
    const caloriesFromFat = fatsTarget * 9;

    const remainingCalories =
        calorieTarget - caloriesFromProtein - caloriesFromFat;

    const carbsTarget = Math.round(remainingCalories / 4);

    /* -----------------------------
       7️⃣ Water (35ml per kg)
    ----------------------------- */

    const waterTarget = Math.round(weightKg * 35);

    return {
        calorieTarget,
        proteinTarget,
        waterTarget,
        carbsTarget,
        fatsTarget,
    };
}