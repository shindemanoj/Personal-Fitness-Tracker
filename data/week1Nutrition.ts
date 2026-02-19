export interface NutritionDay {
    day: string;
    title: string;
    calories: string;
    protein: string;
    carbsNote: string;
    fatNote?: string;
    highlights?: string[];
    restrictions?: string[];
}

export const week1Nutrition: NutritionDay[] = [
    {
        day: 'MONDAY',
        title: 'Full Body + Pull Strength',
        calories: '2,000–2,100',
        protein: '140–150g',
        carbsNote: 'Moderate',
        highlights: [
            'Eggs + chilla + curd',
            'Whey + banana (post workout)',
            '150g chicken + veg + 1 roti',
            'Roasted chana',
            'Paneer 100g + veg',
            'Milk before bed',
        ],
        restrictions: ['No sugar', 'No fried food'],
    },
    {
        day: 'TUESDAY',
        title: 'Upper Body Width',
        calories: '1,950–2,050',
        protein: '135–145g',
        carbsNote: 'Slightly lower than Monday',
        highlights: [
            'Rajma/chole + paneer added',
            'Light dinner: omelette + salad',
        ],
    },
    {
        day: 'WEDNESDAY',
        title: 'Lower Body + Conditioning',
        calories: '2,100',
        protein: '140g',
        carbsNote: 'Slightly higher',
        highlights: [
            'Small rice portion at lunch',
            'Banana post workout',
        ],
        restrictions: ['No evening peanuts'],
    },
    {
        day: 'THURSDAY',
        title: 'Active Recovery',
        calories: '1,850–1,950',
        protein: '130–140g',
        carbsNote: 'Lower',
        highlights: ['Eggs', 'Dal', 'Paneer', 'Vegetables'],
        restrictions: ['No banana', 'No rice'],
    },
    {
        day: 'FRIDAY',
        title: 'Conditioning + Back Thickness',
        calories: '2,000–2,100',
        protein: '145–150g',
        carbsNote: 'Moderate',
        highlights: [
            '150g chicken lunch',
            'Fruit allowed if craving',
        ],
    },
    {
        day: 'SATURDAY',
        title: 'High Intensity',
        calories: '1,950–2,050',
        protein: '135–145g',
        carbsNote: 'Moderate',
        restrictions: ['No cheat meal'],
    },
    {
        day: 'SUNDAY',
        title: 'Rest',
        calories: '1,850',
        protein: '130–140g',
        carbsNote: 'Low',
        restrictions: ['No rice', 'No banana'],
    },
];