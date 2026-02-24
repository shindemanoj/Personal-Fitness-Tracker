export type WorkoutStep = {
    label: string;
    duration: number;
    type: 'work' | 'rest';
    round?: number;
    section?: string;
};

export function buildWorkoutTimeline(day: any): WorkoutStep[] {
    const timeline: WorkoutStep[] = [];

    day.sections.forEach((section: any) => {
        const rounds = section.rounds || 1;

        for (let r = 1; r <= rounds; r++) {
            section.exercises.forEach((ex: any) => {
                timeline.push({
                    label: ex.name,
                    duration: ex.duration,
                    type: 'work',
                    round: r,
                    section: section.title,
                });

                if (ex.restAfter) {
                    timeline.push({
                        label: 'Rest',
                        duration: ex.restAfter,
                        type: 'rest',
                        round: r,
                        section: section.title,
                    });
                }
            });

            if (section.restBetweenRounds && r < rounds) {
                timeline.push({
                    label: 'Rest Between Rounds',
                    duration: section.restBetweenRounds,
                    type: 'rest',
                    round: r,
                    section: section.title,
                });
            }
        }
    });

    return timeline;
}