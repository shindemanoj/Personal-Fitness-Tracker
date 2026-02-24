import { useState } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';

export default function CollapsibleMeal({
                                            title,
                                            items,
                                        }: {
    title: string;
    items: string[];
}) {
    const [open, setOpen] = useState(false);

    return (
        <View style={styles.container}>
            <Pressable onPress={() => setOpen(!open)}>
                <Text style={styles.title}>
                    {title}
                </Text>
            </Pressable>

            {open && (
                <View style={styles.content}>
                    {items.map((item, i) => (
                        <Text key={i} style={styles.item}>
                            • {item}
                        </Text>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    content: {
        marginTop: 8,
    },
    item: {
        fontSize: 14,
        opacity: 0.8,
        color: '#FFFFFF',
        marginBottom: 4,
    },
});