import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Pressable } from 'react-native';
import { useState } from 'react';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@react-navigation/native';
import { week1Nutrition } from '../../data/week1Nutrition';
import { globalStyles } from '../../styles/common';

export default function NutritionScreen() {
    const { colors } = useTheme();

    const todayIndex = new Date().getDay();
    const adjustedIndex = todayIndex === 0 ? 6 : todayIndex - 1;
    const [expandedIndex, setExpandedIndex] = useState(adjustedIndex);

    function toggleDay(index: number) {
        setExpandedIndex((prev) => (prev === index ? -1 : index));
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView contentContainerStyle={globalStyles.container}>
                <ThemedText type="title" style={globalStyles.title}>
                    🍽 Week 1 Nutrition
                </ThemedText>

                {week1Nutrition.map((day, index) => {
                    const isToday = index === adjustedIndex;
                    const isExpanded = expandedIndex === index;

                    return (
                        <ThemedView key={index} style={globalStyles.card}>
                            {/* TITLE */}
                            <Pressable
                                onPress={() => toggleDay(index)}
                                style={({ pressed }) => [
                                    globalStyles.titleContainer,
                                    pressed && { opacity: 0.7 },
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

                            {/* EXPANDED CONTENT */}
                            {isExpanded && (
                                <>
                                    {/* MACROS */}
                                    <ThemedView style={globalStyles.section}>
                                        <ThemedText>Calories: {day.calories}</ThemedText>
                                        <ThemedText>Protein: {day.protein}</ThemedText>
                                        <ThemedText>Carbs: {day.carbsNote}</ThemedText>
                                    </ThemedView>

                                    {/* RECOMMENDED FOODS */}
                                    {day.highlights && (
                                        <ThemedView style={globalStyles.section}>
                                            <ThemedText type="defaultSemiBold">Recommended:</ThemedText>
                                            {day.highlights.map((item, i) => (
                                                <ThemedText key={i}>• {item}</ThemedText>
                                            ))}
                                        </ThemedView>
                                    )}

                                    {/* RESTRICTIONS */}
                                    {day.restrictions && (
                                        <ThemedView style={globalStyles.section}>
                                            <ThemedText type="defaultSemiBold" style={{ color: '#d32f2f' }}>
                                                Avoid:
                                            </ThemedText>
                                            {day.restrictions.map((item, i) => (
                                                <ThemedText key={i}>• {item}</ThemedText>
                                            ))}
                                        </ThemedView>
                                    )}
                                </>
                            )}
                        </ThemedView>
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
}