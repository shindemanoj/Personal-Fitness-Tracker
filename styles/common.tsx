import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
    // Container for ScrollViews
    container: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 60, // increase slightly to account for bottom safe area
    },

    // Standard card for Workout / Nutrition / Progress
    card: {
        padding: 16,
        borderRadius: 14,
        gap: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
        backgroundColor: 'transparent', // allow theme to handle background
    },

    // Titles
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 12,
    },

    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 6,
    },

    // Sections inside cards
    section: {
        marginTop: 10,
        gap: 6,
    },

    // Horizontal rows
    row: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
        flexWrap: 'wrap',
    },

    // Buttons (protein/water increments)
    button: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Exercise Pressable container
    exerciseContainer: {
        paddingVertical: 14,
        paddingHorizontal: 12,
        marginTop: 8,
        borderRadius: 12,
    },

    exerciseText: {
        fontWeight: '500',
    },

    // Progress bars
    progressBar: {
        height: 10,
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 8,
    },

    progressFill: {
        height: '100%',
        borderRadius: 10,
    },

    // Vitamins rows
    vitaminRow: {
        paddingVertical: 14,
        paddingHorizontal: 12,
        marginTop: 8,
        borderRadius: 12,
    },

    // Title container for Pressable headings
    titleContainer: {
        paddingVertical: 8,
    },

    completeButton: {
        marginTop: 16,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
});