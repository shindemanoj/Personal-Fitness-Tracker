export function getProteinSuggestion(current: number, target: number) {
    const diff = target - current;

    if (diff <= 0) return "Protein target achieved. Maintain discipline.";
    if (diff <= 20) return "Add yogurt or 2 eggs.";
    if (diff <= 40) return "Add paneer or whey shake.";
    return "You are behind. Prioritize a strong protein meal now.";
}