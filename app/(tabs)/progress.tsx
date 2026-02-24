import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { getDB, saveDB } from '../../utils/database';

export default function ProgressScreen() {
    const { colors } = useTheme();

    const [protein, setProtein] = useState(0);
    const [water, setWater] = useState(0);
    const [streak, setStreak] = useState(0);
    const [userName, setUserName] = useState('');

    const [proteinTarget, setProteinTarget] = useState(0);
    const [waterTarget, setWaterTarget] = useState(0);

    const [vitamins, setVitamins] = useState({
        multivitamin: false,
        vitaminD: false,
        omega3: false,
        magnesium: false,
        b12: false,
        creatine: false,
    });

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

        // Metrics (safe defaults to prevent undefined overwrite)
        const metrics = db.metrics ?? {};

        setProtein(metrics.protein ?? 0);
        setWater(metrics.water ?? 0);

        setVitamins(
            metrics.vitamins ?? {
                multivitamin: false,
                vitaminD: false,
                omega3: false,
                magnesium: false,
                b12: false,
                creatine: false,
            }
        );

        setStreak(db.workout?.streak ?? 0);

        // Profile
        if (db.user?.profile) {
            setUserName(db.user.profile.name);
        }

        // Targets (Single Source of Truth)
        if (db.user?.targets) {
            setProteinTarget(db.user.targets.proteinTarget);
            setWaterTarget(db.user.targets.waterTarget);
        }
    }

    /* -------------------------
       UPDATE HELPERS
    -------------------------- */

    async function updateMetrics(updatedMetrics: any) {
        const db = await getDB();
        db.metrics = {
            ...(db.metrics ?? {}),
            ...updatedMetrics,
        };
        await saveDB(db);
    }

    async function addProtein(amount: number) {
        const newProtein = protein + amount;
        setProtein(newProtein);

        await updateMetrics({
            protein: newProtein,
            water,
            vitamins,
        });
    }

    async function addWater(amount: number) {
        const newWater = water + amount;
        setWater(newWater);

        await updateMetrics({
            protein,
            water: newWater,
            vitamins,
        });
    }

    async function toggleVitamin(key: string) {
        const updated = {
            ...vitamins,
            [key]: !vitamins[key as keyof typeof vitamins],
        };

        setVitamins(updated);

        await updateMetrics({
            protein,
            water,
            vitamins: updated,
        });
    }

    /* -------------------------
       CALCULATIONS
    -------------------------- */

    const proteinPercent =
        proteinTarget > 0
            ? Math.min((protein / proteinTarget) * 100, 100)
            : 0;

    const waterPercent =
        waterTarget > 0
            ? Math.min((water / waterTarget) * 100, 100)
            : 0;

    const vitaminScore =
        (Object.values(vitamins).filter(Boolean).length /
            Object.keys(vitamins).length) *
        30;

    const compliance =
        (proteinPercent >= 100 ? 40 : proteinPercent * 0.4) +
        (waterPercent >= 100 ? 30 : waterPercent * 0.3) +
        vitaminScore;

    /* -------------------------
       UI
    -------------------------- */

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* HEADER */}
                <Text style={[styles.header, { color: colors.text }]}>
                    {userName ? `${userName}'s Day` : 'Today'}
                </Text>

                <Text style={[styles.streak, { color: colors.text }]}>
                    {streak} day streak
                </Text>

                {/* Protein */}
                <View
                    style={[
                        styles.card,
                        { backgroundColor: colors.card, borderColor: colors.border },
                    ]}
                >
                    <Text style={[styles.label, { color: colors.text }]}>
                        Protein
                    </Text>

                    <Text style={[styles.value, { color: colors.text }]}>
                        {protein}g
                    </Text>

                    <Text style={[styles.sub, { color: colors.text }]}>
                        {proteinTarget}g target
                    </Text>

                    <View style={styles.progressBg}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: `${proteinPercent}%` },
                            ]}
                        />
                    </View>

                    <View style={styles.buttonRow}>
                        {[25, 10, 5].map((amt) => (
                            <Pressable
                                key={amt}
                                style={styles.smallButton}
                                onPress={() => addProtein(amt)}
                            >
                                <Text style={styles.buttonText}>+{amt}</Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Water */}
                <View
                    style={[
                        styles.card,
                        { backgroundColor: colors.card, borderColor: colors.border },
                    ]}
                >
                    <Text style={[styles.label, { color: colors.text }]}>
                        Water
                    </Text>

                    <Text style={[styles.value, { color: colors.text }]}>
                        {water}ml
                    </Text>

                    <Text style={[styles.sub, { color: colors.text }]}>
                        {waterTarget}ml target
                    </Text>

                    <View style={styles.progressBg}>
                        <View
                            style={[
                                styles.progressFillBlue,
                                { width: `${waterPercent}%` },
                            ]}
                        />
                    </View>

                    <View style={styles.buttonRow}>
                        {[500, 250].map((amt) => (
                            <Pressable
                                key={amt}
                                style={styles.smallButton}
                                onPress={() => addWater(amt)}
                            >
                                <Text style={styles.buttonText}>+{amt}</Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Supplements */}
                <View
                    style={[
                        styles.card,
                        { backgroundColor: colors.card, borderColor: colors.border },
                    ]}
                >
                    <Text style={[styles.label, { color: colors.text }]}>
                        Supplements
                    </Text>

                    {Object.entries(vitamins).map(([key, value]) => (
                        <Pressable
                            key={key}
                            onPress={() => toggleVitamin(key)}
                            style={styles.vitaminRow}
                        >
                            <Text
                                style={[
                                    styles.vitaminText,
                                    { color: value ? '#22C55E' : colors.text },
                                ]}
                            >
                                {key.toUpperCase()}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                {/* Compliance */}
                <View
                    style={[
                        styles.card,
                        { backgroundColor: colors.card, borderColor: colors.border },
                    ]}
                >
                    <Text style={[styles.label, { color: colors.text }]}>
                        Compliance
                    </Text>

                    <Text style={[styles.bigNumber, { color: colors.text }]}>
                        {Math.round(compliance)}%
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

/* ----------------------------- */

const styles = StyleSheet.create({
    container: {
        padding: 24,
        gap: 24,
    },

    header: {
        fontSize: 28,
        fontWeight: '700',
    },

    streak: {
        fontSize: 14,
        opacity: 0.6,
        marginBottom: 12,
    },

    card: {
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
    },

    label: {
        fontSize: 14,
        marginBottom: 8,
        letterSpacing: 1,
    },

    value: {
        fontSize: 32,
        fontWeight: '700',
    },

    sub: {
        fontSize: 12,
        opacity: 0.6,
        marginBottom: 12,
    },

    progressBg: {
        height: 6,
        backgroundColor: '#1a1a1a',
        borderRadius: 6,
        overflow: 'hidden',
        marginBottom: 14,
    },

    progressFill: {
        height: 6,
        backgroundColor: '#22C55E',
    },

    progressFillBlue: {
        height: 6,
        backgroundColor: '#3B82F6',
    },

    buttonRow: {
        flexDirection: 'row',
        gap: 12,
    },

    smallButton: {
        backgroundColor: '#1f2937',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 12,
    },

    buttonText: {
        color: '#fff',
        fontWeight: '600',
    },

    vitaminRow: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#1f2937',
    },

    vitaminText: {
        fontSize: 14,
        fontWeight: '600',
    },

    bigNumber: {
        fontSize: 40,
        fontWeight: '800',
    },
});