import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const TWO_HOURS = 60 * 60 * 2; // 7200 seconds
const FORTY_MIN = 60 * 40;     // 2400 seconds
const EIGHTY_MIN = 60 * 80;    // 4800 seconds

async function requestPermission() {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
}

export async function scheduleSmartReminders() {
    // 🔹 Prevent duplicate scheduling
    const existing = await Notifications.getAllScheduledNotificationsAsync();
    if (existing.length > 0) return;

    const granted = await requestPermission();
    if (!granted) return;

    // 🔹 Android channel setup
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.HIGH,
        });
    }

    await Notifications.scheduleNotificationAsync({
        content: {
            title: '6-Pack Discipline',
            body: 'Train. No excuses.',
            sound: true,
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
            repeats: true,
        },
    });

    // 💧 Water Reminder
    await Notifications.scheduleNotificationAsync({
        content: {
            title: '💧 Stay Hydrated',
            body: 'Drink Water if needed.',
            sound: true,
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: TWO_HOURS,
            repeats: true,
        },
    });

    // 🥩 Protein Reminder (staggered +40 min)
    await Notifications.scheduleNotificationAsync({
        content: {
            title: '🥩 Protein Reminder',
            body: 'Eat protein if needed.',
            sound: true,
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: TWO_HOURS + FORTY_MIN,
            repeats: true,
        },
    });

    // 💊 Vitamin Reminder (staggered +80 min)
    await Notifications.scheduleNotificationAsync({
        content: {
            title: '💊 Supplement Reminder',
            body: 'Did you take all of your vitamins?',
            sound: true,
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: TWO_HOURS + EIGHTY_MIN,
            repeats: true,
        },
    });
}

export async function cancelReminders() {
    await Notifications.cancelAllScheduledNotificationsAsync();
}