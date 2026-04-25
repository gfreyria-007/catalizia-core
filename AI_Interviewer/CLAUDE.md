# Gauntlet AI - Perficient Executive Vet

This project is an AI-powered interview simulator designed to vet candidates for Director roles at Perficient. It uses Gemini for high-stakes interview logic, technical coaching, and study assistance.

## Build Commands
- `npm install`: Install dependencies
- `npm run dev`: Start development server (Port 3000)
- `npm run build`: Build for production
- `npm run lint`: Run TypeScript type checking

## Project Structure
- `src/App.tsx`: Main application entry and UI logic (Antigravity is refactoring this)
- `src/lib/gemini.ts`: AI logic (Gemini 1.5 Flash)
- `src/lib/firebase.ts`: Authentication and Firestore session management
- `src/lib/cheatSheet.ts`: HTML generator for executive cheat sheets
- `src/constants.ts`: Scenario definitions, study modules, and master glossary
- `src/types.ts`: Application type definitions

## Design System (Executive Premium)
- **Primary Color**: Perficient Yellow (#FFCC00) - Used for accents and critical paths.
- **Background**: Executive Dark (#0A0A0B)
- **Typography**: Inter / Mono for technical data.
- **Aesthetics**: Glassmorphism, glitch effects for "Gauntlet" theme, and motion-heavy transitions.

## Antigravity Guidelines
- **Premium UI**: Always prioritize high-end, state-of-the-art aesthetics.
- **Componentization**: Keep `App.tsx` clean by extracting reusable components.
- **Safety First**: Maintain strict Firestore security rules and error handling.
- **AI Grounding**: Ensure all AI responses are technical, direct, and "Executive Director" level.
