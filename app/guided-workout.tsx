import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState, useMemo } from 'react';
import { View, Text, Pressable, StyleSheet, Alert, BackHandler } from 'react-native';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import Svg, { Circle } from 'react-native-svg';

import { week1Schedule } from '../data/week1';
import { buildWorkoutTimeline } from '../utils/workoutEngine';
import { getDB, saveDB } from '../utils/database';

export default function GuidedWorkout() {
    const { dayIndex } = useLocalSearchParams();
    const router = useRouter();

    const parsedIndex = Number(dayIndex ?? 0);

    const day = useMemo(() => {
        return week1Schedule[parsedIndex];
    }, [parsedIndex]);

    const timeline = useMemo(() => {
        return day ? buildWorkoutTimeline(day) : [];
    }, [day]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [secondsLeft, setSecondsLeft] = useState(
        timeline[0]?.duration ?? 0
    );
    const [isPaused, setIsPaused] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const current = timeline[currentIndex];
    const isRest = current?.type === 'rest';

    /* ---------------------------
       SAFE AUDIO MODE
    ---------------------------- */
    useEffect(() => {
        Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: true,
            staysActiveInBackground: false,
            shouldDuckAndroid: true,
        });
    }, []);

    /* ---------------------------
       SPEAK HELPER
    ---------------------------- */
    function speak(text: string) {
        Speech.stop();
        Speech.speak(text, { rate: 0.9 });
    }

    /* ---------------------------
       AUTO ANNOUNCE FIRST STEP
    ---------------------------- */
    useEffect(() => {
        if (timeline.length > 0) {
            speak(timeline[0].label);
        }
    }, [timeline]);

    /* ---------------------------
       STEP TRANSITION
    ---------------------------- */
    async function nextStep() {
        if (!timeline.length) return;

        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        if (currentIndex < timeline.length - 1) {
            const next = currentIndex + 1;
            setCurrentIndex(next);
            setSecondsLeft(timeline[next].duration);
            speak(timeline[next].label);
        } else {
            finishWorkout();
        }
    }

    function previousStep() {
        if (currentIndex > 0) {
            const prev = currentIndex - 1;
            setCurrentIndex(prev);
            setSecondsLeft(timeline[prev].duration);
            speak(timeline[prev].label);
        }
    }

    /* ---------------------------
       COMPLETE WORKOUT SAFELY
    ---------------------------- */
    async function finishWorkout() {
        if (intervalRef.current) clearInterval(intervalRef.current);

        Speech.stop();
        setIsFinished(true);

        await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
        );

        speak("Workout complete. Great job.");

        await markWorkoutComplete();

        Alert.alert("🔥 Workout Complete!", "You crushed it today.", [
            {
                text: "Back to Plan",
                onPress: () => router.replace('/(tabs)/workout'),
            },
        ]);
    }

    async function markWorkoutComplete() {
        const db = await getDB();
        const todayKey = new Date().toISOString().split('T')[0];

        db.workout.completions = db.workout.completions || {};
        db.workout.streak = db.workout.streak || 0;

        // 🔥 IMPORTANT: Prevent double streak farming
        if (!db.workout.completions[todayKey]) {
            db.workout.completions[todayKey] = true;
            db.workout.streak += 1;
            await saveDB(db);
        }
    }

    /* ---------------------------
       TIMER ENGINE
    ---------------------------- */
    useEffect(() => {
        if (isPaused || isFinished || !current) return;

        intervalRef.current = setInterval(() => {
            setSecondsLeft((prev) => {
                const halfway = Math.floor(current.duration / 2);

                if (prev === halfway) speak("Halfway");
                if (prev === 4) speak("Three");
                if (prev === 3) speak("Two");
                if (prev === 2) speak("One");
                if (prev === 1) speak("Switch");

                if (prev <= 5 && prev > 0) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }

                if (prev < 1) {
                    nextStep();
                    return 0;
                }

                return prev - 1;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [currentIndex, isPaused, isFinished, current]);

    /* ---------------------------
       PROGRESS
    ---------------------------- */
    const workoutProgress =
        timeline.length > 0
            ? (currentIndex / timeline.length) * 100
            : 0;

    const stepProgress =
        current && current.duration
            ? ((current.duration - secondsLeft) /
                current.duration) *
            100
            : 0;

    const radius = 110;
    const strokeWidth = 12;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset =
        circumference - (stepProgress / 100) * circumference;

    const intensityColor = useMemo(() => {
        if (!current) return '#22C55E';
        if (secondsLeft <= 3) return '#EF4444';
        if (secondsLeft <= 8) return '#F59E0B';
        return '#22C55E';
    }, [secondsLeft, current]);

    /* ---------------------------
       SAFE EMPTY STATE
    ---------------------------- */
    if (!timeline.length) {
        return (
            <View style={styles.center}>
                <Text style={{ color: '#fff' }}>
                    No workout available.
                </Text>
            </View>
        );
    }

    /* ---------------------------
       UI
    ---------------------------- */
    return (
        <View
            style={[
                styles.container,
                { backgroundColor: isRest ? '#0B1220' : '#000000' },
            ]}
        >
            <Text style={styles.section}>{current?.section}</Text>
            <Text style={styles.round}>Round {current?.round || '-'}</Text>

            <View style={styles.circleWrapper}>
                <Svg width={260} height={260}>
                    <Circle
                        stroke="#1A1A1A"
                        fill="none"
                        cx="130"
                        cy="130"
                        r={radius}
                        strokeWidth={strokeWidth}
                    />
                    <Circle
                        stroke={intensityColor}
                        fill="none"
                        cx="130"
                        cy="130"
                        r={radius}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        transform={`rotate(-90 130 130)`}
                    />
                </Svg>

                <View style={styles.timerContainer}>
                    <Text style={[styles.timer, { color: intensityColor }]}>
                        {secondsLeft}
                    </Text>
                    <Text style={styles.secondsLabel}>sec</Text>
                </View>
            </View>

            <Text
                style={[
                    styles.label,
                    isRest && { color: '#9CA3AF', fontWeight: '500' },
                ]}
            >
                {current?.label}
            </Text>

            <View style={styles.progressBar}>
                <View
                    style={[
                        styles.progressFill,
                        {
                            width: `${workoutProgress}%`,
                            backgroundColor: intensityColor,
                        },
                    ]}
                />
            </View>

            <View style={styles.controls}>
                <Pressable onPress={previousStep}>
                    <Text style={styles.control}>◀</Text>
                </Pressable>

                <Pressable onPress={() => setIsPaused(!isPaused)}>
                    <Text style={styles.control}>
                        {isPaused ? '▶' : '⏸'}
                    </Text>
                </Pressable>

                <Pressable onPress={nextStep}>
                    <Text style={styles.control}>▶▶</Text>
                </Pressable>
            </View>
        </View>
    );
}

/* ----------------------------- */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 50,
        paddingBottom: 40,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    section: {
        fontSize: 12,
        letterSpacing: 2,
        textTransform: 'uppercase',
        color: '#6B7280',
        marginBottom: 6,
    },
    round: {
        fontSize: 18,
        fontWeight: '600',
        color: '#E5E7EB',
        marginBottom: 28,
    },
    label: {
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        color: '#FFFFFF',
        marginTop: 20,
        paddingHorizontal: 16,
    },
    circleWrapper: {
        width: 260,
        height: 260,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timerContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    timer: {
        fontSize: 72,
        fontWeight: '800',
        letterSpacing: 2,
    },
    secondsLabel: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: -4,
    },
    progressBar: {
        height: 4,
        width: '100%',
        backgroundColor: '#1A1A1A',
        borderRadius: 4,
        marginTop: 40,
        overflow: 'hidden',
    },
    progressFill: {
        height: 4,
        borderRadius: 4,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginTop: 50,
    },
    control: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        backgroundColor: '#111111',
        paddingVertical: 18,
        paddingHorizontal: 24,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#1F2937',
    },
});