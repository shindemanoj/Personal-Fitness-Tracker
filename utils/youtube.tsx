import { Linking } from 'react-native';

function normalizeExerciseName(name: string) {
    return name
        .replace(/KB/gi, 'kettlebell')
        .replace(/×\d+/g, '')
        .replace(/\d+ ?kg/gi, '')
        .trim();
}

export async function openYouTubeSearch(exercise: string) {
    const query = normalizeExerciseName(exercise);
    const encodedQuery = encodeURIComponent(`${query} tutorial`);

    const appUrl = `youtube://results?search_query=${encodedQuery}`;
    const webUrl = `https://www.youtube.com/results?search_query=${encodedQuery}`;

    const supported = await Linking.canOpenURL(appUrl);

    if (supported) {
        await Linking.openURL(appUrl);
    } else {
        await Linking.openURL(webUrl);
    }
}