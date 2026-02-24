import AsyncStorage from '@react-native-async-storage/async-storage';

const DB_KEY = 'APP_DATA';
const RESET_HOUR = 10;

/* =========================================================
   TYPES
========================================================= */

export type ActivityLevel = 'low' | 'moderate' | 'high';
export type FitnessGoal = 'fat_loss' | 'strength' | 'recomposition';
export type Gender = 'male' | 'female' | 'other';
export type UnitSystem = 'metric' | 'imperial';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export interface UserProfile {
    name: string;
    age: number;
    gender: Gender;

    heightCm: number;
    weightKg: number;
    targetWeightKg?: number;

    activityLevel: ActivityLevel;
    fitnessGoal: FitnessGoal;
    experienceLevel: ExperienceLevel;

    injuries?: string;
    unitSystem: UnitSystem;

    createdAt: string;
}

export interface UserTargets {
    calorieTarget: number;
    proteinTarget: number;
    waterTarget: number;
    carbsTarget: number;
    fatsTarget: number;
}

export interface UserMeta {
    intakeCompleted: boolean;
    intakeVersion: number;
    profile: UserProfile | null;
    targets: UserTargets | null;
}

export type AppData = {
    lastUpdated: string;
    user: UserMeta;

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

/* =========================================================
   LOGICAL DATE (10AM RESET)
========================================================= */

function getLogicalDate(): string {
    const now = new Date();
    const adjusted = new Date(now);

    if (now.getHours() < RESET_HOUR) {
        adjusted.setDate(adjusted.getDate() - 1);
    }

    return adjusted.toISOString().split('T')[0];
}

/* =========================================================
   DEFAULT STRUCTURE
========================================================= */

const defaultData: AppData = {
    lastUpdated: getLogicalDate(),

    user: {
        intakeCompleted: false,
        intakeVersion: 2,
        profile: null,
        targets: null,
    },

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

/* =========================================================
   SAFE GET DATABASE (MIGRATION READY)
========================================================= */

export async function getDB(): Promise<AppData> {
    try {
        const stored = await AsyncStorage.getItem(DB_KEY);

        if (!stored) {
            await AsyncStorage.setItem(DB_KEY, JSON.stringify(defaultData));
            return defaultData;
        }

        const parsed = JSON.parse(stored);

        const merged: AppData = {
            ...defaultData,
            ...parsed,

            user: {
                ...defaultData.user,
                ...parsed.user,

                profile: parsed.user?.profile
                    ? {
                        ...parsed.user.profile,
                        unitSystem:
                            parsed.user.profile.unitSystem ?? 'metric',
                        experienceLevel:
                            parsed.user.profile.experienceLevel ??
                            'beginner',
                        createdAt:
                            parsed.user.profile.createdAt ??
                            new Date().toISOString(),
                    }
                    : null,

                targets: parsed.user?.targets
                    ? {
                        calorieTarget:
                            parsed.user.targets.calorieTarget ?? 0,
                        proteinTarget:
                            parsed.user.targets.proteinTarget ?? 0,
                        waterTarget:
                            parsed.user.targets.waterTarget ?? 0,
                        carbsTarget:
                            parsed.user.targets.carbsTarget ?? 0,
                        fatsTarget:
                            parsed.user.targets.fatsTarget ?? 0,
                    }
                    : null,
            },

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

        return merged;
    } catch (error) {
        console.error('DB Load Error:', error);
        return defaultData;
    }
}

/* =========================================================
   SAVE DATABASE
========================================================= */

export async function saveDB(data: AppData) {
    try {
        await AsyncStorage.setItem(DB_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('DB Save Error:', error);
    }
}

/* =========================================================
   DAILY RESET @ 10AM
========================================================= */

export async function checkDailyReset() {
    const db = await getDB();
    const logicalToday = getLogicalDate();

    if (db.lastUpdated !== logicalToday) {
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

        db.lastUpdated = logicalToday;
        await saveDB(db);
    }
}

/* =========================================================
   CLEAR DATABASE
========================================================= */

export async function clearDB() {
    await AsyncStorage.removeItem(DB_KEY);
}