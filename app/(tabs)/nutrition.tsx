import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, View, StyleSheet, Text } from 'react-native';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { useCallback, useState } from 'react';

import MacroRing from '@/components/nutrition/MacroRing';
import CollapsibleMeal from '@/components/nutrition/CollapsibleMeal';

import { nutritionFramework } from '../../data/nutrition';
import { getDB } from '@/utils/database';
import { getProteinSuggestion } from '@/utils/nutritionInsights';

export default function NutritionScreen() {
    const { colors } = useTheme();

    const [protein, setProtein] = useState(0);
    const [water, setWater] = useState(0);

    const [proteinTarget, setProteinTarget] = useState(0);
    const [waterTarget, setWaterTarget] = useState(0);
    const [calorieTarget, setCalorieTarget] = useState(0);
    const [carbsTarget, setCarbsTarget] = useState(0);
    const [fatsTarget, setFatsTarget] = useState(0);

    const [userGoal, setUserGoal] = useState('Performance Mode');

    /* -------------------------
       LOAD FROM DB
    -------------------------- */
    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    async function loadData() {
        const db = await getDB();

        const profile = db.user?.profile;
        const targets = db.user?.targets;

        // Metrics
        setProtein(db.metrics.protein || 0);
        setWater(db.metrics.water || 0);

        // Targets (Single Source of Truth)
        if (targets) {
            setProteinTarget(targets.proteinTarget);
            setWaterTarget(targets.waterTarget);
            setCalorieTarget(targets.calorieTarget);
            setCarbsTarget(targets.carbsTarget);
            setFatsTarget(targets.fatsTarget);
        }

        // Goal Label
        if (profile?.fitnessGoal === 'fat_loss') {
            setUserGoal('Fat Loss Focused');
        } else if (profile?.fitnessGoal === 'strength') {
            setUserGoal('Strength Focused');
        } else if (profile?.fitnessGoal === 'recomposition') {
            setUserGoal('Recomposition Mode');
        } else {
            setUserGoal('Performance Mode');
        }
    }

    const proteinSuggestion = getProteinSuggestion(protein, proteinTarget);
    const remainingProtein = Math.max(proteinTarget - protein, 0);

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <ScrollView contentContainerStyle={styles.content}>
                {/* HEADER */}
                <Text style={[styles.title, { color: colors.text }]}>
                    Nutrition
                </Text>
                <Text style={[styles.subtitle, { color: colors.text }]}>
                    {userGoal}
                </Text>

                {/* MACRO PROGRESS */}
                <View style={styles.card}>
                    <View style={styles.ringRow}>
                        <MacroRing
                            label="Protein"
                            value={protein}
                            target={proteinTarget}
                            color="#22C55E"
                            unit="g"
                        />
                        <MacroRing
                            label="Water"
                            value={water}
                            target={waterTarget}
                            color="#3B82F6"
                            unit="ml"
                        />
                    </View>
                </View>

                {/* PROTEIN STATUS */}
                <View style={styles.card}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Daily Protein Status
                    </Text>

                    <Text style={[styles.suggestion, { color: colors.text }]}>
                        {proteinSuggestion}
                    </Text>

                    <Text style={[styles.remaining, { color: colors.text }]}>
                        {remainingProtein}g remaining today
                    </Text>
                </View>

                {/* DAILY TARGETS */}
                <View style={styles.card}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Daily Targets
                    </Text>

                    <Text style={[styles.listItem, { color: colors.text }]}>
                        Calories: {calorieTarget} kcal
                    </Text>

                    <Text style={[styles.listItem, { color: colors.text }]}>
                        Protein: {proteinTarget} g
                    </Text>

                    <Text style={[styles.listItem, { color: colors.text }]}>
                        Carbs: {carbsTarget} g
                    </Text>

                    <Text style={[styles.listItem, { color: colors.text }]}>
                        Fats: {fatsTarget} g
                    </Text>

                    <Text style={[styles.listItem, { color: colors.text }]}>
                        Water: {waterTarget} ml
                    </Text>
                </View>

                {/* MEAL STRUCTURE */}
                <View style={styles.card}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Structure
                    </Text>

                    <CollapsibleMeal
                        title="Breakfast"
                        items={nutritionFramework.structure.breakfast}
                    />
                    <CollapsibleMeal
                        title="Post Workout"
                        items={nutritionFramework.structure.postWorkout}
                    />
                    <CollapsibleMeal
                        title="Lunch"
                        items={nutritionFramework.structure.lunch}
                    />
                    <CollapsibleMeal
                        title="Snack"
                        items={nutritionFramework.structure.snack}
                    />
                    <CollapsibleMeal
                        title="Dinner"
                        items={nutritionFramework.structure.dinner}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

/* ----------------------------- */

const styles = StyleSheet.create({
    container: { flex: 1 },

    content: {
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 60,
    },

    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 4,
    },

    subtitle: {
        fontSize: 14,
        opacity: 0.6,
        marginBottom: 28,
    },

    card: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#1F2937',
        backgroundColor: '#111111',
    },

    ringRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },

    suggestion: {
        fontSize: 14,
        opacity: 0.85,
        marginBottom: 8,
    },

    remaining: {
        fontSize: 13,
        opacity: 0.6,
    },

    listItem: {
        fontSize: 14,
        opacity: 0.85,
        marginBottom: 6,
    },
});