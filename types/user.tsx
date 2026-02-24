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

export interface UserMeta {
    intakeCompleted: boolean;
    intakeVersion: number; // future-proofing
}