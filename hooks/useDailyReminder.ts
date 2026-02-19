import { useEffect } from 'react';
import { registerForNotifications, scheduleDailyReminder } from '../utils/notifications';

export function useDailyReminder(hour: number, minute: number) {
    useEffect(() => {
        async function setup() {
            const granted = await registerForNotifications();
            if (granted) {
                await scheduleDailyReminder(hour, minute);
            }
        }

        setup();
    }, [hour, minute]);
}