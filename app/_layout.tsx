import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { useMemo, useEffect } from 'react';
import * as Notifications from 'expo-notifications';

import { getDB, checkDailyReset } from '../utils/database';

export const unstable_settings = {
    anchor: '(tabs)',
};

// 🔥 SMART NOTIFICATION FILTER (Expo SDK 50+ compatible)
Notifications.setNotificationHandler({
    handleNotification: async (notification): Promise<Notifications.NotificationBehavior> => {
        const db = await getDB();

        const protein = db.metrics.protein;
        const water = db.metrics.water;
        const vitamins = db.metrics.vitamins;

        const allVitaminsTaken = Object.values(vitamins).every(Boolean);
        const title = notification.request.content.title ?? '';

        // ❌ Hide if targets already met
        if (title.includes('Hydration') && water >= 3000) {
            return {
                shouldShowBanner: false,
                shouldShowList: false,
                shouldPlaySound: false,
                shouldSetBadge: false,
            };
        }

        if (title.includes('Protein') && protein >= 125) {
            return {
                shouldShowBanner: false,
                shouldShowList: false,
                shouldPlaySound: false,
                shouldSetBadge: false,
            };
        }

        if (title.includes('Supplement') && allVitaminsTaken) {
            return {
                shouldShowBanner: false,
                shouldShowList: false,
                shouldPlaySound: false,
                shouldSetBadge: false,
            };
        }

        // ✅ Show normally
        return {
            shouldShowBanner: true,
            shouldShowList: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
        };
    },
});

export default function RootLayout() {
    const colorScheme = useColorScheme();

    const theme = useMemo(() => {
        return colorScheme === 'dark' ? DarkTheme : DefaultTheme;
    }, [colorScheme]);

    // ✅ Daily reset check on app launch
    useEffect(() => {
        checkDailyReset();
    }, []);

    return (
        <ThemeProvider value={theme}>
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: theme.colors.background,
                    },
                    headerTitleStyle: {
                        color: theme.colors.text,
                    },
                    headerTintColor: theme.colors.text,
                    contentStyle: {
                        backgroundColor: theme.colors.background,
                    },
                }}
            >
                <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                />
            </Stack>

            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </ThemeProvider>
    );
}