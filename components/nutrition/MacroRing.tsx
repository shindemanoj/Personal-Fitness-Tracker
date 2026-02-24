import Svg, { Circle } from 'react-native-svg';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
    label: string;
    value: number;
    target: number;
    color: string;
    unit?: string;
}

const SIZE = 110;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function MacroRing({
                                      label,
                                      value,
                                      target,
                                      color,
                                      unit = '',
                                  }: Props) {
    const progress = Math.min(value / target, 1);
    const dashoffset = CIRCUMFERENCE - progress * CIRCUMFERENCE;

    return (
        <View style={styles.container}>
            <View style={styles.ringContainer}>
                <Svg width={SIZE} height={SIZE}>
                    <Circle
                        stroke="#1F2937"
                        fill="none"
                        cx={SIZE / 2}
                        cy={SIZE / 2}
                        r={RADIUS}
                        strokeWidth={STROKE}
                    />
                    <Circle
                        stroke={color}
                        fill="none"
                        cx={SIZE / 2}
                        cy={SIZE / 2}
                        r={RADIUS}
                        strokeWidth={STROKE}
                        strokeDasharray={CIRCUMFERENCE}
                        strokeDashoffset={dashoffset}
                        strokeLinecap="round"
                        transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
                    />
                </Svg>

                <View style={styles.center}>
                    <Text style={styles.value}>
                        {value}{unit}
                    </Text>
                    <Text style={styles.target}>/ {target}</Text>
                </View>
            </View>

            <Text style={styles.label}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginHorizontal: 10,
    },
    ringContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    center: {
        position: 'absolute',
        alignItems: 'center',
    },
    value: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    target: {
        fontSize: 11,
        opacity: 0.5,
        color: '#FFFFFF',
    },
    label: {
        marginTop: 8,
        fontSize: 13,
        opacity: 0.7,
        color: '#FFFFFF',
    },
});