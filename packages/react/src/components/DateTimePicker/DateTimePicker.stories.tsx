import { useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DateTimePicker } from './DateTimePicker';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Forms/Date Time Picker',
  component: DateTimePicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A Temporal-powered picker that pairs a keyboard-navigable month ' +
          'calendar with hour and minute steppers. The value is a ' +
          '`Temporal.PlainDateTime`, and all date math uses the standard ' +
          '`Temporal` API.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    alignEnd: { control: 'boolean' },
    disabled: { control: 'boolean' },
    locale: { control: 'text' },
  },
} satisfies Meta<typeof DateTimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { defaultValue: Temporal.PlainDateTime.from('2026-05-30T09:30') },
};

function DateTimeControlledExample({
  selectedLabel,
  ...props
}: ComponentProps<typeof DateTimePicker> & { selectedLabel: string }) {
  const [when, setWhen] = useState<Temporal.PlainDateTime | null>(
    Temporal.PlainDateTime.from('2026-05-30T09:30'),
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <DateTimePicker {...props} value={when} onChange={setWhen} />
      <p style={{ margin: 0, color: 'var(--lily-color-fg-muted)' }}>
        {selectedLabel} <strong>{when ? when.toString() : '—'}</strong>
      </p>
    </div>
  );
}

export const Controlled: Story = {
  render: (args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return <DateTimeControlledExample {...args} selectedLabel={t('Selected:', '選択中：')} />;
  },
};

export const FifteenMinuteSteps: Story = {
  args: { defaultValue: Temporal.PlainDateTime.from('2026-05-30T09:00'), minuteStep: 15 },
};

export const WithMinMax: Story = {
  args: {
    defaultValue: Temporal.PlainDateTime.from('2026-05-15T12:00'),
    min: '2026-05-10T08:00',
    max: '2026-05-20T18:00',
  },
};

export const Japanese: Story = {
  args: {
    defaultValue: Temporal.PlainDateTime.from('2026-05-15T13:30'),
    locale: 'ja-JP',
    weekStartsOn: 0,
  },
};

export const Disabled: Story = {
  args: { defaultValue: Temporal.PlainDateTime.from('2026-05-15T09:30'), disabled: true },
};
