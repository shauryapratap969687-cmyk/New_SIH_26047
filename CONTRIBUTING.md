# Contributing to MediKiosk AI

Thank you for your interest in contributing! 🎉

## Getting Started

1. **Fork** this repository
2. **Clone** your fork: `git clone https://github.com/YOUR-USERNAME/New_SIH_26047.git`
3. **Install** dependencies: `npm install`
4. **Run** the dev server: `npm run dev`
5. Open `http://localhost:5173/patient-checkin` in Chrome/Edge

## Development Guidelines

### Code Style
- All code is in **TypeScript** — no `any` types unless unavoidable
- Use **functional React components** with hooks
- Follow the existing file structure (see `src/` layout in README)
- Run `npx oxlint src/` before committing — must exit code 0

### Build Check
```bash
npm run build    # Must succeed with exit code 0
npx oxlint src/  # Must exit code 0 (warnings are OK, errors are not)
```

### Adding a New Language
1. Add an entry in `src/i18n/strings.ts` following the `LangStrings` interface
2. Add the language to `LANG_META` with its TTS lang code
3. Add the `SupportedLang` union type
4. Test all 4 kiosk steps in the new language

### Adding a New AYUSH System Assessment Form
1. Add the system's TypeScript interface in `src/types/index.ts`
2. Add assessment fields to `AyushAssessment`
3. Add the system-specific tab in `src/pages/CaseTakingPage.tsx`

## Pull Request Process

1. Create a descriptive branch: `git checkout -b feat/your-feature-name`
2. Make your changes with clear, atomic commits
3. Update the README if you've changed any public API / user-facing feature
4. Submit a PR with a clear description of what changed and why

## Accessibility Requirements (Non-Negotiable)

Any new patient-facing UI must:
- Have `aria-label` on all interactive elements
- Work with keyboard-only navigation
- Support audio guidance via the `useA11y()` hook
- Have minimum 48×48px tap targets
- Not convey meaning through color alone (pair with icon + text + audio)

## Questions?

Open a [GitHub Issue](https://github.com/shauryapratap969687-cmyk/New_SIH_26047/issues) or start a [Discussion](https://github.com/shauryapratap969687-cmyk/New_SIH_26047/discussions).
