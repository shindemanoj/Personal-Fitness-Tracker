import AsyncStorage from '@react-native-async-storage/async-storage';

const DB_KEY = 'APP_DATA';

export type AppData = {
    lastUpdated: string; // 👈 important for daily reset

    metrics: {
        protein: number;
        water: number;
        vitamins: {
            multivitamin: boolean;
            vitaminD: boolean;
            omega3: boolean;
            magnesium: boolean;
            b12: boolean;
            creatine: boolean;
        };
    };

    workout: {
        completions: Record<string, boolean>;
        streak: number;
    };
};

const todayString = () => new Date().toISOString().split('T')[0];

// Default structure
const defaultData: AppData = {
    lastUpdated: todayString(),

    metrics: {
        protein: 0,
        water: 0,
        vitamins: {
            multivitamin: false,
            vitaminD: false,
            omega3: false,
            magnesium: false,
            b12: false,
            creatine: false,
        },
    },

    workout: {
        completions: {},
        streak: 0,
    },
};

/**
 * Get entire database document
 */
export async function getDB(): Promise<AppData> {
    try {
        const stored = await AsyncStorage.getItem(DB_KEY);

        if (!stored) {
            await AsyncStorage.setItem(DB_KEY, JSON.stringify(defaultData));
            return defaultData;
        }

        const parsed = JSON.parse(stored);

        return {
            ...defaultData,
            ...parsed,
            metrics: {
                ...defaultData.metrics,
                ...parsed.metrics,
                vitamins: {
                    ...defaultData.metrics.vitamins,
                    ...parsed.metrics?.vitamins,
                },
            },
            workout: {
                ...defaultData.workout,
                ...parsed.workout,
            },
        };
    } catch (error) {
        console.error('Error loading DB:', error);
        return defaultData;
    }
}

/**
 * Save entire database document
 */
export async function saveDB(data: AppData) {
    try {
        await AsyncStorage.setItem(DB_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving DB:', error);
    }
}

/**
 * Daily reset logic
 */
export async function checkDailyReset() {
    const db = await getDB();
    const today = todayString();

    if (db.lastUpdated !== today) {
        db.metrics = {
            protein: 0,
            water: 0,
            vitamins: {
                multivitamin: false,
                vitaminD: false,
                omega3: false,
                magnesium: false,
                b12: false,
                creatine: false,
            },
        };

        db.lastUpdated = today;

        await saveDB(db);
    }
}

/**
 * Optional: Clear entire database
 */
export async function clearDB() {
    await AsyncStorage.removeItem(DB_KEY);
}