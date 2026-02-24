import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useRouter } from 'expo-router';
import { getDB } from '@/utils/database';
import { useTheme } from '@react-navigation/native';

export default function Index() {
    const router = useRouter();
    const { colors } = useTheme();

    useEffect(() => {
        async function checkUser() {
            const db = await getDB();
            if (db.user?.intakeCompleted) {
                router.replace('/(tabs)/home');
            } else {
                router.replace('/intake');
            }
        }

        checkUser();
    }, []);

    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors.background,
            }}
        >
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
    );
}