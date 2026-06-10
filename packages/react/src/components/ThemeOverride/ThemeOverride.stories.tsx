import type { Meta, StoryObj } from '@storybook/react';
import { ThemeOverride } from './ThemeOverride';
import { findContrastIssues } from '../../utils/themeOverride';
import { Button } from '../Button';
import { Badge } from '../Badge';
import { Alert } from '../Alert';

const meta = {
  title: 'Foundations/Theme Override',
  component: ThemeOverride,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Re-colors a subtree with personal color preferences by overriding the semantic ' +
          '`--lily-color-*` tokens. Overrides are partial (only the tokens you name change) and ' +
          'can target a single scheme (`light` / `dark` apply only while that scheme is active). ' +
          'In development, text/background pairs overridden together are checked against the ' +
          'WCAG 2.1 AAA contrast floor (7:1); use `findContrastIssues` to run the same check on ' +
          'end-user picks at runtime.',
      },
    },
  },
  argTypes: {
    colors: { control: 'object' },
    light: { control: 'object' },
    dark: { control: 'object' },
  },
} satisfies Meta<typeof ThemeOverride>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    colors: {
      primary: '#115e59',
      'primary-hover': '#134e4a',
      'primary-active': '#042f2e',
      'on-primary': '#ffffff',
      'primary-text': '#115e59',
    },
  },
  render: (args) => (
    <ThemeOverride {...args}>
      <div className="lily-flex lily-gap-3 lily-items-center" style={{ flexWrap: 'wrap' }}>
        <Button status="primary">Custom primary</Button>
        <Button status="primary" variant="outline">
          Outline
        </Button>
        <Badge>Badge</Badge>
      </div>
    </ThemeOverride>
  ),
};

export const ScopedToASubtree: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Only descendants of the ThemeOverride pick up the custom tokens; siblings keep the ' +
          'accessible defaults. Instances nest, and the closest one wins.',
      },
    },
  },
  render: () => (
    <div className="lily-flex lily-gap-3 lily-items-center" style={{ flexWrap: 'wrap' }}>
      <Button status="primary">Default theme</Button>
      <ThemeOverride
        colors={{ primary: '#115e59', 'primary-hover': '#134e4a', 'on-primary': '#ffffff' }}
      >
        <Button status="primary">Personalized</Button>
      </ThemeOverride>
    </div>
  ),
};

export const DarkSchemeOnly: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Overrides under `dark` apply only while the dark scheme is active — switch the ' +
          'theme in the toolbar to see them. Light mode keeps every default.',
      },
    },
  },
  render: () => (
    <ThemeOverride
      dark={{ primary: '#5eead4', 'primary-hover': '#99f6e4', 'on-primary': '#042f2e' }}
    >
      <div className="lily-flex lily-gap-3 lily-items-center" style={{ flexWrap: 'wrap' }}>
        <Button status="primary">Dark-only brand color</Button>
        <Badge>Badge</Badge>
      </div>
    </ThemeOverride>
  ),
};

export const AccentOnly: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A partial override: only the accent role changes; every other token keeps its ' +
          'accessible default.',
      },
    },
  },
  render: () => (
    <ThemeOverride
      colors={{ accent: '#1e40af', 'on-accent': '#ffffff', 'accent-text': '#1e40af' }}
    >
      <div className="lily-flex lily-gap-3 lily-items-center" style={{ flexWrap: 'wrap' }}>
        <Badge status="primary">Default badge</Badge>
        <span style={{ color: 'var(--lily-color-accent-text)' }}>Accent-colored text</span>
      </div>
    </ThemeOverride>
  ),
};

export const ContrastValidation: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Validate end-user picks with `findContrastIssues` before applying them — here a ' +
          'gray primary with white text fails the 7:1 AAA floor, so the app explains why ' +
          'instead of applying it.',
      },
    },
  },
  render: () => {
    const picks = { colors: { primary: '#9ca3af', 'on-primary': '#ffffff' } };
    const issues = findContrastIssues(picks);
    return (
      <div className="lily-flex" style={{ flexDirection: 'column', gap: 'var(--lily-space-3)' }}>
        {issues.map((issue) => (
          <Alert
            key={`${issue.foreground.token}-${issue.background.token}`}
            status="warning"
            title="Contrast below AAA"
          >
            {`"${issue.foreground.token}" (${issue.foreground.value}) on "${issue.background.token}" (${issue.background.value}) is ${issue.ratio}:1 — the AAA floor is 7:1, so this pick is not applied.`}
          </Alert>
        ))}
      </div>
    );
  },
};
