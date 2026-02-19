import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Pressable } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { week1Schedule } from '../../data/week1';
import { openYouTubeSearch } from '../../utils/youtube';
import { globalStyles } from '../../styles/common';
import { getDB, saveDB } from '../../utils/database';

export default function WorkoutScreen() {
    const { colors } = useTheme();
    const scrollRef = useRef<ScrollView>(null);

    const todayIndex = new Date().getDay();
    const adjustedIndex = todayIndex === 0 ? 6 : todayIndex - 1;
    const todayKey = new Date().toISOString().split('T')[0];

    const [completed, setCompleted] = useState(false);
    const [expandedIndex, setExpandedIndex] = useState(adjustedIndex);

    // Load completion status on focus
    useFocusEffect(
        useCallback(() => {
            loadCompletion();
        }, [])
    );

    async function loadCompletion() {
        const db = await getDB();
        const isComplete = db.workout.completions?.[todayKey] ?? false;
        setCompleted(isComplete);
    }

    async function handleCompleteToggle() {
        const db = await getDB();

        const currentStatus = db.workout.completions?.[todayKey] ?? false;
        const newStatus = !currentStatus;

        // Update completion
        db.workout.completions = {
            ...db.workout.completions,
            [todayKey]: newStatus,
        };

        // Update streak (simple logic: increment only when marking complete)
        if (newStatus) {
            db.workout.streak = (db.workout.streak || 0) + 1;
        } else {
            db.workout.streak = Math.max((db.workout.streak || 1) - 1, 0);
        }

        await saveDB(db);
        setCompleted(newStatus);
    }

    function toggleDay(index: number) {
        setExpandedIndex((prev) => (prev === index ? -1 : index));
    }

    // Scroll to today
    useEffect(() => {
        const timer = setTimeout(() => {
            scrollRef.current?.scrollTo({
                y: adjustedIndex * 160,
                animated: true,
            });
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView
                ref={scrollRef}
                contentContainerStyle={globalStyles.container}
            >
                <ThemedText type="title" style={globalStyles.title}>
                    🔥 Week 1
                </ThemedText>

                {week1Schedule.map((day, index) => {
                    const isToday = index === adjustedIndex;
                    const isExpanded = expandedIndex === index;

                    return (
                        <ThemedView
                            key={index}
                            style={[
                                globalStyles.card,
                                { backgroundColor: colors.card },
                                isToday && {
                                    borderColor: colors.primary,
                                    borderWidth: 2,
                                },
                            ]}
                        >
                            <Pressable
                                onPress={() => toggleDay(index)}
                                style={({ pressed }) => [
                                    globalStyles.titleContainer,
                                    pressed && { opacity: 0.6 },
                                ]}
                            >
                                <ThemedText
                                    type="subtitle"
                                    style={isToday ? { color: colors.primary } : undefined}
                                >
                                    {isToday ? '🔥 ' : ''}
                                    {day.day} – {day.title}
                                </ThemedText>
                            </Pressable>

                            {isExpanded &&
                                day.sections.map((section, secIndex) => (
                                    <ThemedView
                                        key={secIndex}
                                        style={globalStyles.section}
                                    >
                                        <ThemedText type="defaultSemiBold">
                                            {section.title}
                                        </ThemedText>

                                        {section.exercises.map((exercise, exIndex) => (
                                            <Pressable
                                                key={exIndex}
                                                onPress={() => openYouTubeSearch(exercise)}
                                                style={({ pressed }) => [
                                                    globalStyles.exerciseContainer,
                                                    {
                                                        backgroundColor: pressed
                                                            ? colors.card + '66'
                                                            : 'transparent',
                                                    },
                                                ]}
                                            >
                                                <ThemedText
                                                    style={[
                                                        globalStyles.exerciseText,
                                                        { color: colors.primary },
                                                    ]}
                                                >
                                                    • {exercise}
                                                </ThemedText>
                                            </Pressable>
                                        ))}
                                    </ThemedView>
                                ))}

                            {isExpanded && isToday && (
                                <Pressable
                                    onPress={handleCompleteToggle}
                                    style={[
                                        globalStyles.completeButton,
                                        {
                                            backgroundColor: completed
                                                ? colors.primary
                                                : colors.card,
                                        },
                                    ]}
                                >
                                    <ThemedText
                                        style={{
                                            color: completed ? '#fff' : colors.text,
                                            fontWeight: '600',
                                        }}
                                    >
                                        {completed ? 'Completed ✅' : 'Mark Complete'}
                                    </ThemedText>
                                </Pressable>
                            )}
                        </ThemedView>
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
}