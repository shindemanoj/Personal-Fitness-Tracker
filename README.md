# Personal Fitness Tracker

A minimalist fitness tracking app built with **React Native + Expo**.

Track workouts, protein, water, vitamins, and daily streaks --- all
powered by a smart target engine that personalizes nutrition goals
automatically.

------------------------------------------------------------------------

## Features

-   Smart calorie & macro target calculation
-   Protein, water, and supplement tracking
-   Daily workout plan with guided sessions
-   Workout streak tracking
-   Daily reset logic (10 AM local time)
-   Clean dark minimalist UI
-   Local offline database (AsyncStorage)
-   Smart reminders (Expo Notifications)

------------------------------------------------------------------------

## Tech Stack

-   React Native (Expo)
-   TypeScript
-   Expo Router
-   AsyncStorage
-   Expo Notifications

------------------------------------------------------------------------

## Target Engine

Targets are automatically calculated based on:

-   Weight
-   Goal (Fat Loss / Strength / Recomposition)
-   Activity Level
-   Experience Level

The app calculates:

-   Calories
-   Protein
-   Carbs
-   Fats
-   Water

Targets update automatically when profile changes.

------------------------------------------------------------------------

## Project Structure

/app\
/(tabs)\
intake.tsx\
profile.tsx\
nutrition.tsx\
progress.tsx\
workout.tsx

/utils\
database.ts\
targetEngine.ts\
reminders.ts

------------------------------------------------------------------------

## Setup

1.  Install dependencies

npm install

2.  Start development server

npx expo start

3.  Build for production

eas build -p ios\
eas build -p android

------------------------------------------------------------------------

## App Store Notes

-   Uses push notifications for reminders
-   No third-party data sharing
-   Data stored locally on device
-   Privacy Policy required before release

------------------------------------------------------------------------

## License

© 2026 Manoj Shinde. All rights reserved.
