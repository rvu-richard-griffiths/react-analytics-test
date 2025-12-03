# Contributing to React Analytics UI

Thank you for your interest in contributing! This guide will help you get started.

## Development Setup

### Prerequisites

- Node.js 18+ 
- npm 9+
- [Task](https://taskfile.dev) (optional but recommended)

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/react-analytics-ui.git
   cd react-analytics-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or with Task
   task install
   ```

3. **Start Storybook**
   ```bash
   npm run storybook
   # or with Task
   task dev
   ```

4. **Open your browser**
   Navigate to http://localhost:6006 to see all components

## Project Structure

```
react-analytics-test/
├── src/
│   ├── analytics/          # Analytics context and provider
│   │   ├── AnalyticsContext.tsx
│   │   └── index.ts
│   ├── components/         # UI components
│   │   ├── Button.tsx
│   │   ├── Button.module.css
│   │   ├── Button.stories.tsx
│   │   ├── DatePicker.tsx
│   │   ├── DatePicker.module.css
│   │   ├── DatePicker.stories.tsx
│   │   ├── TextBox.tsx
│   │   ├── TextBox.module.css
│   │   ├── TextBox.stories.tsx
│   │   ├── Popup.tsx
│   │   ├── Popup.module.css
│   │   ├── Popup.stories.tsx
│   │   └── index.ts
│   └── index.ts            # Main entry point
├── .storybook/             # Storybook configuration
├── package.json
├── tsconfig.json
├── rollup.config.js
├── Taskfile.yml
├── README.md
└── CONTRIBUTING.md
```

## Development Workflow

### Using Task (Recommended)

```bash
task dev          # Start Storybook for development
task build        # Build the library
task lint         # Run ESLint
task lint-fix     # Fix linting issues
task type-check   # Run TypeScript type checking
task validate     # Run all checks (lint, type-check, build)
task clean        # Remove build artifacts
```

### Using npm

```bash
npm run storybook       # Start Storybook
npm run build           # Build the library
npm run lint            # Run ESLint
npm run type-check      # Run TypeScript type checking
```

## Making Changes

### 1. Create a Branch

Use descriptive branch names:
```bash
git checkout -b feat/add-dropdown-component
git checkout -b fix/button-disabled-state
git checkout -b docs/update-readme
```

### 2. Develop with Storybook

- Create or update components in `src/components/`
- Add or update stories in `*.stories.tsx` files
- Test components in isolation in Storybook
- Ensure analytics events are properly tracked

### 3. Follow Coding Standards

#### Component Structure

Each component should include:
- TypeScript component file (e.g., `Button.tsx`)
- CSS Module file (e.g., `Button.module.css`)
- Storybook stories file (e.g., `Button.stories.tsx`)

#### Component Template

```tsx
import React from 'react';
import { useOptionalAnalytics } from '../analytics';
import styles from './MyComponent.module.css';

export interface MyComponentProps {
  // Props
  analyticsId?: string;
  analyticsMetadata?: Record<string, any>;
  disableAnalytics?: boolean;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  analyticsId,
  analyticsMetadata,
  disableAnalytics = false,
  ...props
}) => {
  const analytics = useOptionalAnalytics();

  const trackEvent = (eventType: string, metadata?: Record<string, any>) => {
    if (!disableAnalytics && analytics) {
      analytics.track({
        eventType,
        componentType: 'mycomponent',
        componentId: analyticsId,
        metadata: {
          ...analyticsMetadata,
          ...metadata,
        },
      });
    }
  };

  return <div className={styles.container}>Component Content</div>;
};
```

#### TypeScript

- Use TypeScript for all code
- Export component prop interfaces
- Use proper typing for all functions and variables
- Avoid `any` types when possible

#### Styling

- Use CSS Modules for component styles
- Follow BEM-like naming conventions
- Ensure responsive design
- Consider accessibility (focus states, ARIA attributes)

### 4. Add Analytics Tracking

Components should track relevant user interactions:

- **Button**: Click events
- **TextBox**: Focus, blur, and optionally change events
- **DatePicker**: Open, close, and select events
- **Popup**: Open and close events with duration

Track meaningful metadata that consumers might need:
```tsx
analytics.track({
  eventType: 'click',
  componentType: 'button',
  componentId: analyticsId,
  metadata: {
    variant,
    label: typeof children === 'string' ? children : undefined,
    ...analyticsMetadata,
  },
});
```

### 5. Write Storybook Stories

Create comprehensive stories showcasing:
- Default state
- All variants/sizes
- With different props
- Disabled state
- Error states (if applicable)
- With analytics metadata

Example:
```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { MyComponent } from './MyComponent';
import { AnalyticsProvider, AnalyticsAdapter } from '../analytics';

const mockAdapter: AnalyticsAdapter = {
  track: (event) => console.log('📊', event),
};

const meta: Meta<typeof MyComponent> = {
  title: 'Components/MyComponent',
  component: MyComponent,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <AnalyticsProvider adapter={mockAdapter}>
        <Story />
      </AnalyticsProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const Default: Story = {
  args: {
    analyticsId: 'my-component',
  },
};
```

### 6. Test Your Changes

Before submitting:

```bash
task validate     # Run all checks
```

This will:
- Run ESLint
- Check TypeScript types
- Build the library

Ensure:
- No linting errors
- No TypeScript errors
- Components render correctly in Storybook
- Analytics events are tracked properly

**If you've added or changed components:**
```bash
task generate-ai-docs   # Update AI-consumable documentation
```

This regenerates the `.ai/` directory with updated component information for AI agents.

### 7. Commit Your Changes

Use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git add .
git commit -m "feat: add dropdown component with analytics"
git commit -m "fix: resolve button disabled state issue"
git commit -m "docs: update README with new examples"
git commit -m "refactor: improve analytics tracking logic"
git commit -m "style: update button hover states"
git commit -m "test: add tests for textbox component"
```

**Commit Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### 8. Push and Create Pull Request

```bash
git push origin your-branch-name
```

Then create a Pull Request on GitHub with:
- Clear title and description
- Reference any related issues
- Include screenshots/GIFs for UI changes
- List any breaking changes

## Code Style

### EditorConfig

This project uses EditorConfig. Ensure your editor supports it or install the appropriate plugin.

### Git Attributes

Line endings are normalized via `.gitattributes` to ensure consistency across platforms.

### Linting

ESLint is configured for the project. Run:
```bash
task lint-fix
```

## Testing Analytics

When developing components, test analytics tracking by:

1. Opening Storybook
2. Opening browser console
3. Interacting with components
4. Verifying events are logged with correct data structure

## Adding New Components

1. Create component files in `src/components/`:
   - `ComponentName.tsx`
   - `ComponentName.module.css`
   - `ComponentName.stories.tsx`

2. Export from `src/components/index.ts`:
   ```tsx
   export { ComponentName } from './ComponentName';
   export type { ComponentNameProps } from './ComponentName';
   ```

3. Implement analytics tracking
4. Create comprehensive Storybook stories
5. Update README.md with usage examples

## Questions?

- Open an issue for bugs or feature requests
- Start a discussion for questions
- Check existing issues and PRs first

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing! 🎉
