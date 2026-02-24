export function calculateTargets(profile: any) {
    const weight = profile.weightKg || 70;
    const goal = profile.fitnessGoal;

    let proteinMultiplier = 1.6;
    let calorieMultiplier = 30;

    if (goal === 'fat_loss') {
        proteinMultiplier = 2.0;
        calorieMultiplier = 26;
    }

    if (goal === 'strength') {
        proteinMultiplier = 1.8;
        calorieMultiplier = 34;
    }

    if (goal === 'recomposition') {
        proteinMultiplier = 2.2;
        calorieMultiplier = 30;
    }

    return {
        proteinTarget: Math.round(weight * proteinMultiplier),
        waterTarget: Math.round(weight * 35),
        calorieTarget: Math.round(weight * calorieMultiplier),
    };
}