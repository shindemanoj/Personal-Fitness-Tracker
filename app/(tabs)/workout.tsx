import { SafeAreaView } from 'react-native-safe-area-context';
import {
    ScrollView,
    Pressable,
    View,
    StyleSheet,
    Text,
} from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { week1Schedule } from '../../data/week1';
import { openYouTubeSearch } from '../../utils/youtube';
import { getDB, saveDB } from '../../utils/database';
import { useRouter } from 'expo-router';

export default function WorkoutScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const scrollRef = useRef<ScrollView>(null);

    const today = new Date();
    const todayIndex = today.getDay();
    const adjustedIndex = todayIndex === 0 ? 6 : todayIndex - 1;
    const todayKey = today.toISOString().split('T')[0];

    const [completed, setCompleted] = useState(false);
    const [streak, setStreak] = useState(0);
    const [expandedIndex, setExpandedIndex] = useState(adjustedIndex);
    const [userName, setUserName] = useState('');
    const [goalLabel, setGoalLabel] = useState('Consistency builds physique');

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    async function loadData() {
        const db = await getDB();

        if (!db.workout) {
            db.workout = { streak: 0, completions: {} };
            await saveDB(db);
        }

        const isComplete = db.workout.completions?.[todayKey] ?? false;
        setCompleted(isComplete);

        calculateStreak(db.workout.completions || {});
        setUserName(db.user?.profile?.name || '');

        const goal = db.user?.profile?.fitnessGoal;

        const goalMap: Record<string, string> = {
            fat_loss: 'Burn fat. Stay consistent.',
            strength: 'Lift heavy. Build strength.',
            recomposition: 'Build muscle. Drop fat.',
        };

        if (goal && goalMap[goal]) {
            setGoalLabel(goalMap[goal]);
        }
    }

    function calculateStreak(completions: Record<string, boolean>) {
        let count = 0;
        let currentDate = new Date();

        while (true) {
            const key = currentDate.toISOString().split('T')[0];

            if (completions[key]) {
                count++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
        }

        setStreak(count);
    }

    async function handleCompleteToggle() {
        const db = await getDB();

        if (!db.workout) {
            db.workout = { streak: 0, completions: {} };
        }

        if (!db.workout.completions) {
            db.workout.completions = {};
        }

        const currentStatus =
            db.workout.completions[todayKey] ?? false;

        db.workout.completions[todayKey] = !currentStatus;

        calculateStreak(db.workout.completions);

        await saveDB(db);

        setCompleted(!currentStatus);
    }

    function toggleDay(index: number) {
        setExpandedIndex(prev => (prev === index ? -1 : index));
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            scrollRef.current?.scrollTo({
                y: adjustedIndex * 160,
                animated: true,
            });
        }, 250);

        return () => clearTimeout(timer);
    }, []);

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <ScrollView ref={scrollRef} contentContainerStyle={styles.content}>
                <Text style={[styles.title, { color: colors.text }]}>
                    {userName ? `${userName}'s Training` : 'Training Plan'}
                </Text>

                <Text style={[styles.subtitle, { color: colors.text }]}>
                    {goalLabel}
                </Text>

                <View style={styles.streakContainer}>
                    <Text style={[styles.streakText, { color: colors.text }]}>
                        🔥 {streak} day streak
                    </Text>
                </View>

                {week1Schedule.map((day, index) => {
                    const isToday = index === adjustedIndex;
                    const isExpanded = expandedIndex === index;

                    return (
                        <View
                            key={index}
                            style={[
                                styles.card,
                                {
                                    borderColor: isToday
                                        ? colors.primary
                                        : colors.border,
                                    backgroundColor: colors.card,
                                },
                            ]}
                        >
                            <Pressable onPress={() => toggleDay(index)}>
                                <View style={styles.cardHeader}>
                                    <Text
                                        style={[
                                            styles.dayTitle,
                                            {
                                                color: isToday
                                                    ? colors.primary
                                                    : colors.text,
                                            },
                                        ]}
                                    >
                                        {day.day}
                                        {isToday ? ' • TODAY' : ''}
                                    </Text>

                                    <Text
                                        style={[
                                            styles.daySubtitle,
                                            { color: colors.text },
                                        ]}
                                    >
                                        {day.title}
                                    </Text>
                                </View>
                            </Pressable>

                            {isExpanded && (
                                <>
                                    {day.sections.map((section, secIndex) => (
                                        <View key={secIndex} style={styles.section}>
                                            <Text
                                                style={[
                                                    styles.sectionTitle,
                                                    { color: colors.text },
                                                ]}
                                            >
                                                {section.title}
                                            </Text>

                                            {section.exercises.map((exercise, exIndex) => (
                                                <Pressable
                                                    key={exIndex}
                                                    onPress={() =>
                                                        openYouTubeSearch(exercise.name)
                                                    }
                                                >
                                                    <Text
                                                        style={[
                                                            styles.exercise,
                                                            { color: colors.primary },
                                                        ]}
                                                    >
                                                        {exercise.name}
                                                    </Text>
                                                </Pressable>
                                            ))}
                                        </View>
                                    ))}

                                    <Pressable
                                        onPress={() =>
                                            router.push({
                                                pathname: '/guided-workout',
                                                params: { dayIndex: index.toString() },
                                            })
                                        }
                                        style={[
                                            styles.primaryButton,
                                            { backgroundColor: colors.primary },
                                        ]}
                                    >
                                        <Text style={styles.primaryButtonText}>
                                            Start Guided Session
                                        </Text>
                                    </Pressable>

                                    {isToday && (
                                        <Pressable
                                            onPress={handleCompleteToggle}
                                            style={[
                                                styles.secondaryButton,
                                                {
                                                    borderColor: completed
                                                        ? colors.primary
                                                        : colors.border,
                                                },
                                            ]}
                                        >
                                            <Text
                                                style={{
                                                    color: completed
                                                        ? colors.primary
                                                        : colors.text,
                                                    fontWeight: '600',
                                                }}
                                            >
                                                {completed
                                                    ? 'Completed ✔'
                                                    : 'Mark as Complete'}
                                            </Text>
                                        </Pressable>
                                    )}
                                </>
                            )}
                        </View>
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
}

/* -----------------------------
   STYLES
------------------------------ */

const styles = StyleSheet.create({
    container: { flex: 1 },

    content: {
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 80,
    },

    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 4,
    },

    subtitle: {
        fontSize: 14,
        opacity: 0.6,
        marginBottom: 20,
    },

    streakContainer: {
        marginBottom: 20,
    },

    streakText: {
        fontSize: 14,
        fontWeight: '600',
    },

    card: {
        borderRadius: 18,
        padding: 18,
        marginBottom: 18,
        borderWidth: 1,
    },

    cardHeader: {
        marginBottom: 6,
    },

    dayTitle: {
        fontSize: 15,
        fontWeight: '700',
    },

    daySubtitle: {
        fontSize: 13,
        opacity: 0.6,
    },

    section: {
        marginTop: 16,
    },

    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 6,
    },

    exercise: {
        fontSize: 14,
        marginBottom: 4,
    },

    primaryButton: {
        marginTop: 20,
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
    },

    primaryButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
    },

    secondaryButton: {
        marginTop: 12,
        paddingVertical: 12,
        borderRadius: 14,
        borderWidth: 1,
        alignItems: 'center',
    },
});