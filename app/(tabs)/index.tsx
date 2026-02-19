import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Pressable, View, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import { globalStyles } from '../../styles/common';
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { getDB, saveDB, checkDailyReset } from '../../utils/database';
import { scheduleSmartReminders } from '../../utils/reminders';

export default function Index() {
    const { colors } = useTheme();
    const router = useRouter();

    const proteinTarget = 125;
    const waterTarget = 3000;
    const totalVitamins = 6;

    const [protein, setProtein] = useState(0);
    const [water, setWater] = useState(0);
    const [vitaminsChecked, setVitaminsChecked] = useState(0);
    const [streak, setStreak] = useState(0);

    useFocusEffect(
        useCallback(() => {
            scheduleSmartReminders();
        }, [])
    );

    // Load data every time screen is focused
    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    async function loadData() {
        await checkDailyReset(); // 🔥 ensures fresh daily state
        const db = await getDB();

        setProtein(db.metrics.protein);
        setWater(db.metrics.water);

        const checkedCount = Object.values(db.metrics.vitamins).filter(Boolean).length;
        setVitaminsChecked(checkedCount);

        setStreak(db.workout.streak || 0);
    }

    const hour = new Date().getHours();
    const greeting =
        hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

    const getPercent = (current: number, target: number) =>
        Math.min((current / target) * 100, 100);

    // Reset nutrition in DB
    const handleReset = () => {
        Alert.alert(
            "Reset Today's Nutrition",
            'Are you sure you want to reset protein, water, and vitamins?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: async () => {
                        const db = await getDB();

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

                        await saveDB(db);
                        loadData();
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView contentContainerStyle={globalStyles.container}>
                {/* Greeting */}
                <ThemedText type="title" style={globalStyles.title}>
                    {greeting}! 🔥
                </ThemedText>

                <ThemedText type="subtitle" style={{ marginBottom: 16 }}>
                    Stay consistent. Streak: {streak} days 💪
                </ThemedText>

                {/* Metrics */}
                <ThemedView style={[globalStyles.row, { flexWrap: 'wrap', gap: 12 }]}>
                    {/* Protein */}
                    <Pressable
                        onPress={() => router.push('/progress')}
                        style={[
                            globalStyles.card,
                            { flex: 1, minWidth: 140, backgroundColor: colors.card },
                        ]}
                    >
                        <ThemedText type="subtitle">🥩 Protein</ThemedText>
                        <ThemedText>{protein}/{proteinTarget}g</ThemedText>
                        <View
                            style={[
                                globalStyles.progressBar,
                                { backgroundColor: colors.background + '33' },
                            ]}
                        >
                            <View
                                style={[
                                    globalStyles.progressFill,
                                    {
                                        width: `${getPercent(protein, proteinTarget)}%`,
                                        backgroundColor: colors.primary,
                                    },
                                ]}
                            />
                        </View>
                    </Pressable>

                    {/* Water */}
                    <Pressable
                        onPress={() => router.push('/progress')}
                        style={[
                            globalStyles.card,
                            { flex: 1, minWidth: 140, backgroundColor: colors.card },
                        ]}
                    >
                        <ThemedText type="subtitle">💧 Water</ThemedText>
                        <ThemedText>{water}/{waterTarget} ml</ThemedText>
                        <View
                            style={[
                                globalStyles.progressBar,
                                { backgroundColor: colors.background + '33' },
                            ]}
                        >
                            <View
                                style={[
                                    globalStyles.progressFill,
                                    {
                                        width: `${getPercent(water, waterTarget)}%`,
                                        backgroundColor: colors.primary,
                                    },
                                ]}
                            />
                        </View>
                    </Pressable>

                    {/* Vitamins */}
                    <Pressable
                        onPress={() => router.push('/progress')}
                        style={[
                            globalStyles.card,
                            { flex: 1, minWidth: 140, backgroundColor: colors.card },
                        ]}
                    >
                        <ThemedText type="subtitle">💊 Vitamins</ThemedText>
                        <ThemedText>
                            {vitaminsChecked}/{totalVitamins} completed
                        </ThemedText>
                        <View
                            style={[
                                globalStyles.progressBar,
                                { backgroundColor: colors.background + '33' },
                            ]}
                        >
                            <View
                                style={[
                                    globalStyles.progressFill,
                                    {
                                        width: `${getPercent(vitaminsChecked, totalVitamins)}%`,
                                        backgroundColor: colors.primary,
                                    },
                                ]}
                            />
                        </View>
                    </Pressable>

                    {/* Workout */}
                    <Pressable
                        onPress={() => router.push('/workout')}
                        style={[
                            globalStyles.card,
                            { flex: 1, minWidth: 140, backgroundColor: colors.card },
                        ]}
                    >
                        <ThemedText type="subtitle">🏋️ Workout</ThemedText>
                        <ThemedText>Open today’s plan</ThemedText>
                    </Pressable>
                </ThemedView>

                {/* Action Buttons */}
                <ThemedView style={[globalStyles.row, { marginTop: 24, flexWrap: 'wrap', gap: 12 }]}>
                    <Pressable
                        onPress={() => router.push('/workout')}
                        style={[
                            globalStyles.card,
                            { flex: 1, minWidth: 140, backgroundColor: colors.primary },
                        ]}
                    >
                        <ThemedText style={{ color: '#fff', fontWeight: '600' }}>
                            Start Workout
                        </ThemedText>
                    </Pressable>

                    <Pressable
                        onPress={() => router.push('/progress')}
                        style={[
                            globalStyles.card,
                            { flex: 1, minWidth: 140, backgroundColor: colors.primary },
                        ]}
                    >
                        <ThemedText style={{ color: '#fff', fontWeight: '600' }}>
                            Track Progress
                        </ThemedText>
                    </Pressable>
                </ThemedView>

                {/* Reset Nutrition */}
                <Pressable
                    onPress={handleReset}
                    style={[
                        globalStyles.completeButton,
                        { backgroundColor: '#d32f2f', marginTop: 24 },
                    ]}
                >
                    <ThemedText style={{ color: '#fff', fontWeight: '600' }}>
                        Reset Nutrition
                    </ThemedText>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}