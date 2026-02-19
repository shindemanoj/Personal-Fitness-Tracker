import AsyncStorage from '@react-native-async-storage/async-storage';

const COMPLETION_KEY = 'workout-completions';
const STREAK_KEY = 'workout-streak';

/**
 * Marks a day as complete or incomplete.
 * @param dateKey - YYYY-MM-DD string
 * @param completed - true (default) marks complete, false marks incomplete
 */
export async function markDayComplete(dateKey: string, completed: boolean = true) {
    const stored = await AsyncStorage.getItem(COMPLETION_KEY);
    const completions = stored ? JSON.parse(stored) : {};

    completions[dateKey] = completed;
    await AsyncStorage.setItem(COMPLETION_KEY, JSON.stringify(completions));

    if (completed) {
        await updateStreak(dateKey);
    } else {
        // Optional: decrement streak or reset? Currently we leave streak untouched
        // You can implement streak reset logic here if needed
    }
}

export async function isDayComplete(dateKey: string) {
    const stored = await AsyncStorage.getItem(COMPLETION_KEY);
    const completions = stored ? JSON.parse(stored) : {};
    return !!completions[dateKey];
}

async function updateStreak(dateKey: string) {
    const storedStreak = await AsyncStorage.getItem(STREAK_KEY);
    let streak = storedStreak ? parseInt(storedStreak) : 0;

    streak += 1;
    await AsyncStorage.setItem(STREAK_KEY, streak.toString());
}

export async function getStreak() {
    const stored = await AsyncStorage.getItem(STREAK_KEY);
    return stored ? parseInt(stored) : 0;
}