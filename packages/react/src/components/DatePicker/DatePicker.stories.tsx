import { useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DatePicker } from './DatePicker';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Forms/Date Picker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A Temporal-powered date picker: an ISO `YYYY-MM-DD` text field paired ' +
          'with a keyboard-navigable calendar. The calendar is built from plain ' +
          'elements and CSS (no native `<input type="date">`), so it looks and ' +
          'behaves identically in every browser, including Firefox. All date math ' +
          'uses the standard `Temporal` API.',
      },
    },
  },
  argTypes: {
    weekStartsOn: {
      control: 'inline-radio',
      options: [0, 1],
      description: '0 = Sunday, 1 = Monday',
    },
    alignEnd: { control: 'boolean' },
    disabled: { control: 'boolean' },
    locale: { control: 'text' },
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { defaultValue: Temporal.PlainDate.from('2026-05-30') },
};

function ControlledExample({ selectedLabel, ...props }: ComponentProps<typeof DatePicker> & { selectedLabel: string }) {
  const [date, setDate] = useState<Temporal.PlainDate | null>(Temporal.PlainDate.from('2026-05-30'));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <DatePicker {...props} value={date} onChange={setDate} />
      <p style={{ margin: 0, color: 'var(--lily-color-fg-muted)' }}>
        {selectedLabel} <strong>{date ? date.toString() : '—'}</strong>
      </p>
    </div>
  );
}

export const Controlled: Story = {
  render: (args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return <ControlledExample {...args} selectedLabel={t('Selected:', '選択中：')} />;
  },
};

export const WithMinMax: Story = {
  args: {
    defaultValue: Temporal.PlainDate.from('2026-05-15'),
    min: '2026-05-05',
    max: '2026-05-25',
  },
};

export const DisableWeekends: Story = {
  args: {
    defaultValue: Temporal.PlainDate.from('2026-05-15'),
    // Temporal `dayOfWeek`: 6 = Saturday, 7 = Sunday.
    isDateDisabled: (d) => d.dayOfWeek > 5,
  },
};

export const Japanese: Story = {
  args: {
    defaultValue: Temporal.PlainDate.from('2026-05-15'),
    locale: 'ja-JP',
    weekStartsOn: 0,
  },
};

export const AlignedEnd: Story = {
  args: { defaultValue: Temporal.PlainDate.from('2026-05-15'), alignEnd: true },
};

export const Disabled: Story = {
  args: { defaultValue: Temporal.PlainDate.from('2026-05-15'), disabled: true },
};
