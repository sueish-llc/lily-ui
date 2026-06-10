import { useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MonthPicker } from './MonthPicker';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Forms/Month Picker',
  component: MonthPicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A Temporal-powered month picker: a 12-month grid with prev/next year ' +
          'navigation. The value is a `Temporal.PlainYearMonth`, and all date math ' +
          'uses the standard `Temporal` API.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    alignEnd: { control: 'boolean' },
    disabled: { control: 'boolean' },
    locale: { control: 'text' },
  },
} satisfies Meta<typeof MonthPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { defaultValue: Temporal.PlainYearMonth.from('2026-05') },
};

function MonthControlledExample({
  selectedLabel,
  ...props
}: ComponentProps<typeof MonthPicker> & { selectedLabel: string }) {
  const [month, setMonth] = useState<Temporal.PlainYearMonth | null>(
    Temporal.PlainYearMonth.from('2026-05'),
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <MonthPicker {...props} value={month} onChange={setMonth} />
      <p style={{ margin: 0, color: 'var(--lily-color-fg-muted)' }}>
        {selectedLabel} <strong>{month ? month.toString() : '—'}</strong>
      </p>
    </div>
  );
}

export const Controlled: Story = {
  render: (args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return <MonthControlledExample {...args} selectedLabel={t('Selected:', '選択中：')} />;
  },
};

export const WithMinMax: Story = {
  args: {
    defaultValue: Temporal.PlainYearMonth.from('2026-05'),
    min: '2026-03',
    max: '2026-09',
  },
};

export const Japanese: Story = {
  args: { defaultValue: Temporal.PlainYearMonth.from('2026-05'), locale: 'ja-JP' },
};

export const Disabled: Story = {
  args: { defaultValue: Temporal.PlainYearMonth.from('2026-05'), disabled: true },
};
