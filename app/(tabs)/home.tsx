import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Pressable, View, Alert, StyleSheet, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';

import { getDB, checkDailyReset } from '../../utils/database';
import { scheduleSmartReminders } from '../../utils/reminders';
import { week1Schedule } from '../../data/week1';

export default function Home() {
    const router = useRouter();

    const [userName, setUserName] = useState('Athlete');

    /* ---- Targets ---- */
    const [calorieTarget, setCalorieTarget] = useState(2200);
    const [proteinTarget, setProteinTarget] = useState(120);
    const [waterTarget, setWaterTarget] = useState(3000);
    const [fatTarget, setFatTarget] = useState(60);

    const totalVitamins = 6;

    /* ---- Current Metrics ---- */
    const [protein, setProtein] = useState(0);
    const [water, setWater] = useState(0);
    const [vitaminsChecked, setVitaminsChecked] = useState(0);
    const [streak, setStreak] = useState(0);

    const todayIndex = new Date().getDay();
    const adjustedIndex = todayIndex === 0 ? 6 : todayIndex - 1;

    /* -------------------------
       LOAD
    -------------------------- */
    useFocusEffect(
        useCallback(() => {
            scheduleSmartReminders();
            loadData();
        }, [])
    );

    async function loadData() {
        await checkDailyReset();
        const db = await getDB();

        const profile = db.user?.profile;
        const targets = db.user?.targets;

        if (profile) {
            setUserName(profile.name || 'Athlete');
        }

        if (targets) {
            setCalorieTarget(targets.calorieTarget ?? 2200);
            setProteinTarget(targets.proteinTarget ?? 120);
            setWaterTarget(targets.waterTarget ?? 3000);
            setFatTarget(targets.fatsTarget ?? 60);
        }

        setProtein(db.metrics.protein ?? 0);
        setWater(db.metrics.water ?? 0);

        setVitaminsChecked(
            Object.values(db.metrics.vitamins || {}).filter(Boolean).length
        );

        setStreak(db.workout.streak ?? 0);
    }

    const hour = new Date().getHours();
    const greeting =
        hour < 12
            ? 'Good Morning'
            : hour < 18
                ? 'Good Afternoon'
                : 'Good Evening';

    const percent = (value: number, total: number) =>
        total > 0 ? Math.min((value / total) * 100, 100) : 0;

    /* -------------------------
       START WORKOUT
    -------------------------- */
    function startWorkout() {
        const todayWorkout = week1Schedule[adjustedIndex];

        if (!todayWorkout?.sections?.length) {
            Alert.alert(
                'Recovery Day',
                'Walk 8–10k steps and stretch lightly.'
            );
            return;
        }

        router.push({
            pathname: '/guided-workout',
            params: { dayIndex: adjustedIndex.toString() },
        });
    }

    /* -------------------------
       UI
    -------------------------- */
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>
                            {greeting}, {userName}
                        </Text>
                        <Text style={styles.streak}>
                            {streak} day streak
                        </Text>
                    </View>

                    <Pressable onPress={() => router.push('/workout')}>
                        <Text style={styles.link}>Plan</Text>
                    </Pressable>
                </View>

                {/* Metrics */}
                <View style={styles.card}>

                    <Metric
                        label="Calories"
                        value={`${calorieTarget} kcal target`}
                        percent={100}
                    />

                    <Metric
                        label="Protein"
                        value={`${protein}g / ${proteinTarget}g`}
                        percent={percent(protein, proteinTarget)}
                    />

                    <Metric
                        label="Fat"
                        value={`${fatTarget}g target`}
                        percent={100}
                    />

                    <Metric
                        label="Water"
                        value={`${water} ml / ${waterTarget} ml`}
                        percent={percent(water, waterTarget)}
                    />

                    <Metric
                        label="Vitamins"
                        value={`${vitaminsChecked}/${totalVitamins}`}
                        percent={percent(vitaminsChecked, totalVitamins)}
                    />
                </View>

                {/* CTA */}
                <Pressable style={styles.cta} onPress={startWorkout}>
                    <Text style={styles.ctaText}>Start Workout</Text>
                </Pressable>

                {/* Secondary */}
                <Pressable
                    style={styles.secondary}
                    onPress={() => router.push('/progress')}
                >
                    <Text style={styles.secondaryText}>
                        View Detailed Progress
                    </Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

/* --------------------------------
   Metric Component
-------------------------------- */

function Metric({
                    label,
                    value,
                    percent,
                }: {
    label: string;
    value: string;
    percent: number;
}) {
    return (
        <View style={{ marginBottom: 28 }}>
            <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>{label}</Text>
                <Text style={styles.metricValue}>{value}</Text>
            </View>

            <View style={styles.progressTrack}>
                <View
                    style={[
                        styles.progressFill,
                        { width: `${percent}%` },
                    ]}
                />
            </View>
        </View>
    );
}

/* --------------------------------
   STYLES
-------------------------------- */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    content: {
        paddingHorizontal: 24,
        paddingTop: 30,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
    },
    greeting: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    streak: {
        marginTop: 6,
        fontSize: 14,
        color: '#6B7280',
    },
    link: {
        fontSize: 14,
        color: '#22C55E',
        fontWeight: '600',
    },
    card: {
        backgroundColor: '#111111',
        borderRadius: 20,
        padding: 24,
        marginBottom: 40,
        borderWidth: 1,
        borderColor: '#1F2937',
    },
    metricRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    metricLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    metricValue: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    progressTrack: {
        height: 4,
        backgroundColor: '#1F2937',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: 4,
        backgroundColor: '#22C55E',
    },
    cta: {
        backgroundColor: '#22C55E',
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 16,
    },
    ctaText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000000',
        letterSpacing: 1,
    },
    secondary: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    secondaryText: {
        color: '#6B7280',
        fontSize: 14,
    },
});