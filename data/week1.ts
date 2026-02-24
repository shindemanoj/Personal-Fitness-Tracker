export const week1Schedule = [
    // ================= MONDAY =================
    {
        day: "Monday",
        title: "Full Body + Pull Strength",
        sections: [
            {
                title: "Warm-Up",
                rounds: 1,
                exercises: [
                    { name: "Skipping", duration: 180 },
                    { name: "Hip Hinges ×15", duration: 120 },
                    { name: "Scap Pull-ups 2×5", duration: 180 },
                    { name: "Mobility + Plank", duration: 120 },
                ],
                restBetweenRounds: 60
            },
            {
                title: "Main Workout",
                rounds: 4,
                restBetweenRounds: 90,
                exercises: [
                    { name: "KB Swings ×15", duration: 30, restAfter: 30 },
                    { name: "Goblet Squat ×12", duration: 40, restAfter: 30 },
                    { name: "Pull-ups / Negatives", duration: 30, restAfter: 40 },
                    { name: "Push-ups ×12", duration: 30 }
                ]
            },
            {
                title: "Core",
                rounds: 3,
                restBetweenRounds: 60,
                exercises: [
                    { name: "Plank", duration: 45, restAfter: 20 },
                    { name: "Dead Bug ×10/side", duration: 40, restAfter: 30 }
                ]
            }
        ]
    },

    // ================= TUESDAY =================
    {
        day: "Tuesday",
        title: "Upper Width",
        sections: [
            {
                title: "Warm-Up",
                rounds: 1,
                exercises: [
                    { name: "Dead Hang", duration: 30, restAfter: 30 },
                    { name: "Dead Hang", duration: 30 },
                    { name: "Arm Circles", duration: 120 }
                ],
                restBetweenRounds: 60
            },
            {
                title: "Workout",
                rounds: 4,
                restBetweenRounds: 75,
                exercises: [
                    { name: "Pull-ups ×6–8", duration: 30, restAfter: 30 },
                    { name: "KB Press ×10/side", duration: 45, restAfter: 30 },
                    { name: "KB Row ×12/side", duration: 45, restAfter: 30 },
                    { name: "Lateral Raise ×15", duration: 35 }
                ]
            },
            {
                title: "Core",
                rounds: 3,
                restBetweenRounds: 60,
                exercises: [
                    { name: "Hanging Knee Raises ×12", duration: 30, restAfter: 20 },
                    { name: "Russian Twists ×20", duration: 40, restAfter: 30 }
                ]
            }
        ]
    },

    // ================= WEDNESDAY =================
    {
        day: "Wednesday",
        title: "Lower Body + Conditioning",
        sections: [
            {
                title: "Strength",
                rounds: 4,
                restBetweenRounds: 90,
                exercises: [
                    { name: "Goblet Squat ×15", duration: 45, restAfter: 30 },
                    { name: "Reverse Lunges ×12/leg", duration: 50, restAfter: 30 },
                    { name: "KB Swings ×20", duration: 40, restAfter: 30 },
                    { name: "Glute Bridge ×15", duration: 30 }
                ]
            },
            {
                title: "Finisher",
                rounds: 3,
                exercises: [
                    { name: "Skipping ×100", duration: 70, restAfter: 45 }
                ]
            }
        ]
    },

    // ================= THURSDAY =================
    {
        day: "Thursday",
        title: "Active Recovery",
        sections: [
            {
                title: "Cardio",
                rounds: 1,
                exercises: [
                    { name: "Brisk Walk", duration: 1800 }
                ]
            },
            {
                title: "Mobility & Core",
                rounds: 3,
                exercises: [
                    { name: "Dead Hang", duration: 45, restAfter: 45 }
                ]
            },
            {
                title: "Vacuum",
                rounds: 5,
                exercises: [
                    { name: "Vacuum Hold", duration: 20, restAfter: 20 }
                ]
            }
        ]
    },

    // ================= FRIDAY =================
    {
        day: "Friday",
        title: "Conditioning + Back Thickness",
        sections: [
            {
                title: "Main Workout",
                rounds: 5,
                restBetweenRounds: 90,
                exercises: [
                    { name: "KB Swings ×20", duration: 40, restAfter: 30 },
                    { name: "Pull-ups ×6–8", duration: 30, restAfter: 30 },
                    { name: "Push-ups ×15", duration: 40, restAfter: 30 },
                    { name: "Goblet Squat ×15", duration: 45 }
                ]
            },
            {
                title: "Core",
                rounds: 3,
                restBetweenRounds: 60,
                exercises: [
                    { name: "Hanging Knee Raises ×15", duration: 30, restAfter: 20 },
                    { name: "Side Plank (Each Side)", duration: 90, restAfter: 30 }
                ]
            }
        ]
    },

    // ================= SATURDAY =================
    {
        day: "Saturday",
        title: "HIIT",
        sections: [
            {
                title: "HIIT Swings",
                rounds: 10,
                exercises: [
                    { name: "KB Swings", duration: 30, restAfter: 30 }
                ]
            },
            {
                title: "Core Circuit",
                rounds: 3,
                exercises: [
                    { name: "Pull-up Hold", duration: 15, restAfter: 30 },
                    { name: "Dead Bug ×12", duration: 40, restAfter: 20 },
                    { name: "Reverse Crunch ×15", duration: 40, restAfter: 30 }
                ]
            }
        ]
    },

    // ================= SUNDAY =================
    {
        day: "Sunday",
        title: "Rest",
        sections: [
            {
                title: "Recovery",
                rounds: 1,
                exercises: [
                    { name: "8–10k Steps", duration: 3600 },
                    { name: "Light Stretching", duration: 600 }
                ]
            }
        ]
    }
];