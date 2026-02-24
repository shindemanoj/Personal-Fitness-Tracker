import { SafeAreaView } from 'react-native-safe-area-context';
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    ScrollView,
    Keyboard,
    TouchableWithoutFeedback,
    ActivityIndicator,
} from 'react-native';
import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import {
    useFocusEffect,
    useTheme,
} from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import {
    getDB,
    saveDB,
    UserProfile,
} from '@/utils/database';
import { calculateTargets } from '@/utils/targetEngine';

export default function ProfileScreen() {
    const { colors } = useTheme();
    const router = useRouter();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useFocusEffect(
        useCallback(() => {
            loadProfile();
        }, [])
    );

    async function loadProfile() {
        const db = await getDB();
        setProfile(db.user.profile);
        setLoading(false);
    }

    async function saveProfile() {
        if (!profile || saving) return;

        if (
            !profile.name ||
            !profile.weightKg ||
            !profile.heightCm ||
            !profile.age
        ) {
            Toast.show({
                type: 'error',
                text1: 'Incomplete Profile',
                text2: 'Please fill all required fields',
            });
            return;
        }

        try {
            setSaving(true);

            const db = await getDB();

            const updatedProfile: UserProfile = {
                ...profile,
                weightKg: Number(profile.weightKg),
                heightCm: Number(profile.heightCm),
                age: Number(profile.age),
            };

            const targets = calculateTargets(updatedProfile);

            db.user.profile = updatedProfile;
            db.user.targets = targets;
            db.user.intakeCompleted = true;

            await saveDB(db);

            Toast.show({
                type: 'success',
                text1: 'Targets Updated',
                text2: `${targets.calorieTarget} kcal • ${targets.proteinTarget}g protein`,
            });

            router.push({
                pathname: '/home',
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Save Failed',
                text2: 'Please try again',
            });
        } finally {
            setSaving(false);
        }
    }

    if (loading || !profile) {
        return (
            <SafeAreaView style={styles.center}>
                <ActivityIndicator size="large" color="#22C55E" />
            </SafeAreaView>
        );
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView
                style={[styles.container, { backgroundColor: colors.background }]}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text style={[styles.title, { color: colors.text }]}>
                        Edit Profile
                    </Text>

                    <Input
                        label="Name"
                        value={profile.name}
                        onChangeText={(v: string) =>
                            setProfile({ ...profile, name: v })
                        }
                    />

                    <Input
                        label="Age"
                        value={String(profile.age)}
                        keyboardType="numeric"
                        onChangeText={(v: string) =>
                            setProfile({
                                ...profile,
                                age: Number(v),
                            })
                        }
                    />

                    <Input
                        label="Height (cm)"
                        value={String(profile.heightCm)}
                        keyboardType="numeric"
                        onChangeText={(v: string) =>
                            setProfile({
                                ...profile,
                                heightCm: Number(v),
                            })
                        }
                    />

                    <Input
                        label="Weight (kg)"
                        value={String(profile.weightKg)}
                        keyboardType="numeric"
                        onChangeText={(v: string) =>
                            setProfile({
                                ...profile,
                                weightKg: Number(v),
                            })
                        }
                    />

                    <Selector
                        label="Goal"
                        options={[
                            'fat_loss',
                            'strength',
                            'recomposition',
                        ]}
                        value={profile.fitnessGoal}
                        onSelect={(v: any) =>
                            setProfile({
                                ...profile,
                                fitnessGoal: v,
                            })
                        }
                    />

                    <Pressable
                        style={[
                            styles.button,
                            {
                                backgroundColor: saving
                                    ? '#6B7280'
                                    : colors.primary,
                            },
                        ]}
                        onPress={saveProfile}
                        disabled={saving}
                    >
                        {saving ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>
                                Save Changes
                            </Text>
                        )}
                    </Pressable>
                </ScrollView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

/* ---------------- Reusable Components ---------------- */

function Input({ label, ...props }: any) {
    const { colors } = useTheme();

    return (
        <View style={{ marginBottom: 22 }}>
            <Text style={[styles.label, { color: colors.text }]}>
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
                placeholderTextColor={colors.border}
                {...props}
            />
        </View>
    );
}

function Selector({ label, options, value, onSelect }: any) {
    const { colors } = useTheme();

    return (
        <View style={{ marginBottom: 22 }}>
            <Text style={[styles.label, { color: colors.text }]}>
                {label}
            </Text>

            <View style={{ flexDirection: 'row', gap: 10 }}>
                {options.map((opt: string) => {
                    const active = opt === value;

                    return (
                        <Pressable
                            key={opt}
                            onPress={() => onSelect(opt)}
                            style={{
                                paddingVertical: 10,
                                paddingHorizontal: 18,
                                borderRadius: 20,
                                borderWidth: 1,
                                borderColor: colors.border,
                                backgroundColor: active
                                    ? colors.primary
                                    : colors.card,
                            }}
                        >
                            <Text
                                style={{
                                    color: active
                                        ? '#fff'
                                        : colors.text,
                                    fontWeight: '500',
                                }}
                            >
                                {opt.replace('_', ' ')}
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
        padding: 24,
        paddingBottom: 100,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 32,
    },
    label: {
        fontSize: 13,
        marginBottom: 6,
        opacity: 0.7,
    },
    input: {
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        fontSize: 15,
    },
    button: {
        marginTop: 40,
        paddingVertical: 16,
        borderRadius: 22,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});