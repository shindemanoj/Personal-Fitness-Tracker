import { SafeAreaView } from 'react-native-safe-area-context';
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { getDB, saveDB } from '@/utils/database';
import { useTheme } from '@react-navigation/native';

export default function IntakeScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const [step, setStep] = useState(1);

    const [profile, setProfile] = useState({
        name: '',
        age: '',
        gender: 'male',
        heightCm: '',
        weightKg: '',
        targetWeightKg: '',
        activityLevel: 'moderate',
        fitnessGoal: 'fat_loss',
        experienceLevel: 'beginner',
        unitSystem: 'metric',
        injuries: '',
    });

    const next = () => setStep((prev) => prev + 1);
    const back = () => setStep((prev) => prev - 1);

    async function finish() {
        const db = await getDB();

        db.user = {
            intakeCompleted: true,
            intakeVersion: 1,
            profile: {
                name: profile.name.trim(),
                age: Number(profile.age),
                gender: profile.gender as any,
                heightCm: Number(profile.heightCm),
                weightKg: Number(profile.weightKg),
                targetWeightKg: profile.targetWeightKg
                    ? Number(profile.targetWeightKg)
                    : undefined,
                activityLevel: profile.activityLevel as any,
                fitnessGoal: profile.fitnessGoal as any,
                experienceLevel: profile.experienceLevel as any,
                unitSystem: profile.unitSystem as any,
                injuries: profile.injuries || undefined,
                createdAt: new Date().toISOString(),
            },
        };

        await saveDB(db);
        router.replace('/(tabs)/home');
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView
                        contentContainerStyle={styles.content}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <Text style={[styles.title, { color: colors.text }]}>
                            Personalize Your Plan
                        </Text>

                        <Text style={[styles.subtitle, { color: colors.text }]}>
                            Less than 60 seconds
                        </Text>

                        {step === 1 && (
                            <>
                                <Input
                                    label="Name"
                                    value={profile.name}
                                    onChangeText={(v: string) =>
                                        setProfile({ ...profile, name: v })
                                    }
                                />
                                <Input
                                    label="Age"
                                    value={profile.age}
                                    keyboardType="numeric"
                                    onChangeText={(v: string) =>
                                        setProfile({ ...profile, age: v })
                                    }
                                />
                                <Selector
                                    label="Gender"
                                    options={['male', 'female', 'other']}
                                    value={profile.gender}
                                    onSelect={(v: string) =>
                                        setProfile({ ...profile, gender: v })
                                    }
                                />
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <Input
                                    label="Height (cm)"
                                    value={profile.heightCm}
                                    keyboardType="numeric"
                                    onChangeText={(v: string) =>
                                        setProfile({ ...profile, heightCm: v })
                                    }
                                />
                                <Input
                                    label="Weight (kg)"
                                    value={profile.weightKg}
                                    keyboardType="numeric"
                                    onChangeText={(v: string) =>
                                        setProfile({ ...profile, weightKg: v })
                                    }
                                />
                                <Input
                                    label="Target Weight (optional)"
                                    value={profile.targetWeightKg}
                                    keyboardType="numeric"
                                    onChangeText={(v: string) =>
                                        setProfile({
                                            ...profile,
                                            targetWeightKg: v,
                                        })
                                    }
                                />
                            </>
                        )}

                        {step === 3 && (
                            <>
                                <Selector
                                    label="Activity Level"
                                    options={['low', 'moderate', 'high']}
                                    value={profile.activityLevel}
                                    onSelect={(v: string) =>
                                        setProfile({
                                            ...profile,
                                            activityLevel: v,
                                        })
                                    }
                                />
                                <Selector
                                    label="Experience Level"
                                    options={[
                                        'beginner',
                                        'intermediate',
                                        'advanced',
                                    ]}
                                    value={profile.experienceLevel}
                                    onSelect={(v: string) =>
                                        setProfile({
                                            ...profile,
                                            experienceLevel: v,
                                        })
                                    }
                                />
                                <Selector
                                    label="Primary Goal"
                                    options={[
                                        'fat_loss',
                                        'strength',
                                        'recomposition',
                                    ]}
                                    value={profile.fitnessGoal}
                                    onSelect={(v: string) =>
                                        setProfile({
                                            ...profile,
                                            fitnessGoal: v,
                                        })
                                    }
                                />
                            </>
                        )}

                        {step === 4 && (
                            <>
                                <Selector
                                    label="Unit System"
                                    options={['metric', 'imperial']}
                                    value={profile.unitSystem}
                                    onSelect={(v: string) =>
                                        setProfile({
                                            ...profile,
                                            unitSystem: v,
                                        })
                                    }
                                />
                                <Input
                                    label="Injuries (optional)"
                                    value={profile.injuries}
                                    onChangeText={(v: string) =>
                                        setProfile({
                                            ...profile,
                                            injuries: v,
                                        })
                                    }
                                />
                            </>
                        )}

                        <View style={styles.footer}>
                            {step > 1 && (
                                <Pressable onPress={back}>
                                    <Text style={{ color: colors.text }}>
                                        Back
                                    </Text>
                                </Pressable>
                            )}

                            {step < 4 ? (
                                <Pressable
                                    style={[
                                        styles.primaryButton,
                                        { backgroundColor: colors.primary },
                                    ]}
                                    onPress={next}
                                >
                                    <Text style={styles.primaryText}>
                                        Continue
                                    </Text>
                                </Pressable>
                            ) : (
                                <Pressable
                                    style={[
                                        styles.primaryButton,
                                        { backgroundColor: colors.primary },
                                    ]}
                                    onPress={finish}
                                >
                                    <Text style={styles.primaryText}>
                                        Start
                                    </Text>
                                </Pressable>
                            )}
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

/* ---------------- Components ---------------- */

function Input({ label, ...props }: any) {
    const { colors } = useTheme();

    return (
        <View style={{ marginBottom: 18 }}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
                {label}
            </Text>
            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                        color: colors.text,
                    },
                ]}
                placeholderTextColor={colors.text + '80'}
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
                {...props}
            />
        </View>
    );
}

function Selector({ label, options, value, onSelect }: any) {
    const { colors } = useTheme();

    return (
        <View style={{ marginBottom: 20 }}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
                {label}
            </Text>
            <View style={styles.selectorRow}>
                {options.map((opt: string) => {
                    const isActive = value === opt;

                    return (
                        <Pressable
                            key={opt}
                            onPress={() => onSelect(opt)}
                            style={[
                                styles.option,
                                {
                                    backgroundColor: isActive
                                        ? colors.primary
                                        : colors.card,
                                    borderColor: colors.border,
                                },
                            ]}
                        >
                            <Text
                                style={{
                                    color: isActive ? '#fff' : colors.text,
                                    fontWeight: '500',
                                }}
                            >
                                {opt}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
    container: { flex: 1 },

    content: {
        padding: 28,
        paddingBottom: 40,
    },

    title: {
        fontSize: 26,
        fontWeight: '700',
        marginBottom: 6,
    },

    subtitle: {
        opacity: 0.7,
        marginBottom: 30,
    },

    inputLabel: {
        fontSize: 13,
        marginBottom: 6,
        fontWeight: '500',
    },

    input: {
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        fontSize: 15,
    },

    selectorRow: {
        flexDirection: 'row',
        gap: 10,
        flexWrap: 'wrap',
    },

    option: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
    },

    footer: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    primaryButton: {
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 30,
    },

    primaryText: {
        color: '#fff',
        fontWeight: '600',
    },
});