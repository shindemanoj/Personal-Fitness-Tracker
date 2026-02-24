import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import Svg, { Circle } from 'react-native-svg';

import { week1Schedule } from '../../data/week1';
import { buildWorkoutTimeline } from '../../utils/workoutEngine';
import { getDB, saveDB } from '../../utils/database';

export default function GuidedWorkout() {
    const { dayIndex } = useLocalSearchParams();
    const day = week1Schedule[Number(dayIndex)];
    const timeline = buildWorkoutTimeline(day);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [secondsLeft, setSecondsLeft] = useState(
        timeline[0]?.duration ?? 0
    );
    const [isPaused, setIsPaused] = useState(false);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);    const silentSoundRef = useRef<Audio.Sound | null>(null);
    const current = timeline[currentIndex];
    const isRest = current?.type === 'rest';

    /* ---------------------------
       BACKGROUND AUDIO SUPPORT
    ---------------------------- */
    useEffect(() => {
        async function enableBackgroundMode() {
            await Audio.setAudioModeAsync({
                staysActiveInBackground: true,
                shouldDuckAndroid: true,
            });

            const { sound } = await Audio.Sound.createAsync(
                require('../../assets/silence.mp3'),
                { isLooping: true, volume: 0.01 }
            );

            silentSoundRef.current = sound;
            await sound.playAsync();
        }

        enableBackgroundMode();

        return () => {
            silentSoundRef.current?.unloadAsync();
        };
    }, []);

    /* ---------------------------
       SPEECH
    ---------------------------- */
    function speak(text: string) {
        Speech.stop();
        Speech.speak(text, {
            rate: 0.9,
            pitch: 1.0,
        });
    }

    /* ---------------------------
       STEP TRANSITION
    ---------------------------- */
    async function nextStep() {
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
        }
    }

    /* ---------------------------
       COMPLETE WORKOUT
    ---------------------------- */
    function finishWorkout() {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        Speech.stop();
        markWorkoutComplete();
    }

    async function markWorkoutComplete() {
        const db = await getDB();
        const todayKey = new Date().toISOString().split('T')[0];

        db.workout.completions = db.workout.completions || {};
        db.workout.streak = db.workout.streak || 0;

        db.workout.completions[todayKey] = true;
        db.workout.streak += 1;

        await saveDB(db);
    }

    /* ---------------------------
       TIMER ENGINE
    ---------------------------- */
    useEffect(() => {
        if (isPaused) return;

        intervalRef.current = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev === 3) {
                    Haptics.notificationAsync(
                        Haptics.NotificationFeedbackType.Warning
                    );
                }

                if (prev <= 1) {
                    nextStep();
                    return 0;
                }

                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(intervalRef.current!);
    }, [currentIndex, isPaused]);

    /* ---------------------------
       PROGRESS
    ---------------------------- */
    const workoutProgress =
        (currentIndex / timeline.length) * 100;

    const stepProgress =
        ((current?.duration - secondsLeft) /
            current?.duration) *
        100;

    const radius = 110;
    const strokeWidth = 12;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset =
        circumference - (stepProgress / 100) * circumference;

    /* ---------------------------
       UI
    ---------------------------- */
    return (
        <View
            style={[
                styles.container,
                { backgroundColor: isRest ? '#111827' : '#0f172a' },
            ]}
        >
            <Text style={styles.section}>{current?.section}</Text>
            <Text style={styles.round}>Round {current?.round}</Text>

            {/* Circular Timer */}
            <View style={{ alignItems: 'center', marginVertical: 30 }}>
                <Svg width={260} height={260}>
                    <Circle
                        stroke="#1f2937"
                        fill="none"
                        cx="130"
                        cy="130"
                        r={radius}
                        strokeWidth={strokeWidth}
                    />
                    <Circle
                        stroke="#22c55e"
                        fill="none"
                        cx="130"
                        cy="130"
                        r={radius}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        rotation="-90"
                        origin="130,130"
                    />
                </Svg>

                <Text style={styles.timer}>{secondsLeft}s</Text>
            </View>

            <Text style={styles.label}>{current?.label}</Text>

            {/* Workout Progress Bar */}
            <View style={styles.progressBar}>
                <View
                    style={[
                        styles.progressFill,
                        { width: `${workoutProgress}%` },
                    ]}
                />
            </View>

            {/* Controls */}
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

/* ---------------------------
   STYLES
---------------------------- */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    section: {
        fontSize: 14,
        opacity: 0.6,
        marginBottom: 5,
    },
    round: {
        fontSize: 18,
        marginBottom: 10,
    },
    label: {
        fontSize: 22,
        textAlign: 'center',
        marginTop: 10,
    },
    timer: {
        position: 'absolute',
        fontSize: 48,
        fontWeight: 'bold',
        color: '#fff',
    },
    progressBar: {
        height: 6,
        width: '80%',
        backgroundColor: '#1f2937',
        marginTop: 30,
        borderRadius: 6,
    },
    progressFill: {
        height: 6,
        backgroundColor: '#22c55e',
        borderRadius: 6,
    },
    controls: {
        flexDirection: 'row',
        gap: 50,
        marginTop: 40,
    },
    control: {
        fontSize: 28,
        color: '#fff',
    },
});