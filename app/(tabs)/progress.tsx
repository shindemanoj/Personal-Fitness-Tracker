import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Pressable } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@react-navigation/native';
import { globalStyles } from '../../styles/common';
import { getDB, saveDB } from '../../utils/database';

export default function ProgressScreen() {
    const { colors } = useTheme();

    const proteinTarget = 125;
    const waterTarget = 3000;

    const [protein, setProtein] = useState(0);
    const [water, setWater] = useState(0);
    const [vitamins, setVitamins] = useState({
        multivitamin: false,
        vitaminD: false,
        omega3: false,
        magnesium: false,
        b12: false,
        creatine: false,
    });

    // Load from DB every time screen is focused
    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    async function loadData() {
        const db = await getDB();
        setProtein(db.metrics.protein);
        setWater(db.metrics.water);
        setVitamins(db.metrics.vitamins);
    }

    async function updateDB(updatedMetrics: any) {
        const db = await getDB();
        db.metrics = updatedMetrics;
        await saveDB(db);
    }

    async function addProtein(amount: number) {
        const newProtein = protein + amount;
        setProtein(newProtein);
        await updateDB({
            protein: newProtein,
            water,
            vitamins,
        });
    }

    async function addWater(amount: number) {
        const newWater = water + amount;
        setWater(newWater);
        await updateDB({
            protein,
            water: newWater,
            vitamins,
        });
    }

    async function toggleVitamin(key: string) {
        const updatedVitamins = {
            ...vitamins,
            [key]: !vitamins[key as keyof typeof vitamins],
        };

        setVitamins(updatedVitamins);

        await updateDB({
            protein,
            water,
            vitamins: updatedVitamins,
        });
    }

    const proteinPercent = Math.min((protein / proteinTarget) * 100, 100);
    const waterPercent = Math.min((water / waterTarget) * 100, 100);

    const compliance =
        (proteinPercent >= 100 ? 40 : proteinPercent * 0.4) +
        (waterPercent >= 100 ? 30 : waterPercent * 0.3) +
        (Object.values(vitamins).filter(Boolean).length /
            Object.keys(vitamins).length) *
        30;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView contentContainerStyle={globalStyles.container}>
                <ThemedText type="title" style={globalStyles.title}>
                    🔥 Today's Progress
                </ThemedText>

                {/* PROTEIN */}
                <ThemedView style={globalStyles.card}>
                    <ThemedText type="subtitle">🥩 Protein</ThemedText>
                    <ThemedText>
                        {protein}g / {proteinTarget}g
                    </ThemedText>

                    <ThemedView
                        style={[globalStyles.progressBar, { backgroundColor: colors.card }]}
                    >
                        <ThemedView
                            style={[
                                globalStyles.progressFill,
                                { width: `${proteinPercent}%`, backgroundColor: colors.primary },
                            ]}
                        />
                    </ThemedView>

                    <ThemedView style={globalStyles.row}>
                        <Pressable style={globalStyles.button} onPress={() => addProtein(25)}>
                            <ThemedText>+25g</ThemedText>
                        </Pressable>
                        <Pressable style={globalStyles.button} onPress={() => addProtein(10)}>
                            <ThemedText>+10g</ThemedText>
                        </Pressable>
                        <Pressable style={globalStyles.button} onPress={() => addProtein(5)}>
                            <ThemedText>+5g</ThemedText>
                        </Pressable>
                    </ThemedView>
                </ThemedView>

                {/* WATER */}
                <ThemedView style={globalStyles.card}>
                    <ThemedText type="subtitle">💧 Water</ThemedText>
                    <ThemedText>
                        {water} ml / {waterTarget} ml
                    </ThemedText>

                    <ThemedView
                        style={[globalStyles.progressBar, { backgroundColor: colors.card }]}
                    >
                        <ThemedView
                            style={[
                                globalStyles.progressFill,
                                { width: `${waterPercent}%`, backgroundColor: colors.primary },
                            ]}
                        />
                    </ThemedView>

                    <ThemedView style={globalStyles.row}>
                        <Pressable style={globalStyles.button} onPress={() => addWater(500)}>
                            <ThemedText>+500ml</ThemedText>
                        </Pressable>
                        <Pressable style={globalStyles.button} onPress={() => addWater(250)}>
                            <ThemedText>+250ml</ThemedText>
                        </Pressable>
                    </ThemedView>
                </ThemedView>

                {/* VITAMINS */}
                <ThemedView style={globalStyles.card}>
                    <ThemedText type="subtitle">💊 Vitamins</ThemedText>

                    {Object.entries(vitamins).map(([key, value]) => (
                        <Pressable
                            key={key}
                            onPress={() => toggleVitamin(key)}
                            style={({ pressed }) => [
                                globalStyles.vitaminRow,
                                pressed && { backgroundColor: colors.card },
                            ]}
                        >
                            <ThemedText
                                style={{
                                    color: value ? colors.primary : colors.text,
                                    fontWeight: value ? '600' : '500',
                                }}
                            >
                                {value ? '✔ ' : '○ '}
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </ThemedText>
                        </Pressable>
                    ))}
                </ThemedView>

                {/* COMPLIANCE */}
                <ThemedView style={globalStyles.card}>
                    <ThemedText type="subtitle">📊 Compliance</ThemedText>
                    <ThemedText style={{ fontSize: 24, fontWeight: '600' }}>
                        {Math.round(compliance)}%
                    </ThemedText>
                </ThemedView>
            </ScrollView>
        </SafeAreaView>
    );
}