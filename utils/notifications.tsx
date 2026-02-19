import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function registerForNotifications() {
    if (Platform.OS === 'web') return false;

    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
}

export async function scheduleDailyReminder(hour: number, minute: number) {
    if (Platform.OS === 'web') return;

    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
        content: {
            title: '6-Pack Discipline',
            body: 'Train. No excuses.',
            sound: true,
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
            hour,
            minute,
            repeats: true,
        },
    });
}