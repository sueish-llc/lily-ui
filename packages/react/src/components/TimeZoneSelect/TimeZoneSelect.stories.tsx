import { useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TimeZoneSelect } from './TimeZoneSelect';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Forms/Time Zone Select',
  component: TimeZoneSelect,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Choose an IANA time-zone id from a native `<select>`. The option list ' +
          'comes from `Intl.supportedValuesOf`, with a small static fallback for ' +
          'runtimes that lack it. The value is the IANA id string that the ' +
          '`Temporal` API consumes.',
      },
    },
  },
  argTypes: {
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof TimeZoneSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { defaultValue: 'Asia/Tokyo' },
};

function TimeZoneControlledExample({
  selectedLabel,
  ...props
}: ComponentProps<typeof TimeZoneSelect> & { selectedLabel: string }) {
  const [zone, setZone] = useState('Asia/Tokyo');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <TimeZoneSelect {...props} value={zone} onChange={setZone} />
      <p style={{ margin: 0, color: 'var(--lily-color-fg-muted)' }}>
        {selectedLabel} <strong>{zone}</strong>
      </p>
    </div>
  );
}

export const Controlled: Story = {
  render: (args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return <TimeZoneControlledExample {...args} selectedLabel={t('Selected:', '選択中：')} />;
  },
};

export const FixedList: Story = {
  args: {
    zones: ['UTC', 'Asia/Tokyo', 'America/New_York', 'Europe/London'],
    defaultValue: 'UTC',
  },
};

export const WithPlaceholder: Story = {
  args: { placeholder: 'Select a time zone' },
};

export const Disabled: Story = {
  args: { defaultValue: 'Asia/Tokyo', disabled: true },
};
