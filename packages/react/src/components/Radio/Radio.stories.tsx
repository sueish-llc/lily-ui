import type { Meta, StoryObj } from '@storybook/react';
import { Radio } from './Radio';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Forms/Radio',
  component: Radio,
  tags: ['autodocs'],
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof Radio>;

export const Group: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <fieldset style={{ border: 0, padding: 0 }}>
        <legend className="lily-label">{t('Plan', 'プラン')}</legend>
        <div className="lily-vstack lily-gap-2">
          <Radio name="plan" value="free" label={t('Free', '無料')} defaultChecked />
          <Radio name="plan" value="pro" label={t('Pro', 'プロ')} />
        </div>
      </fieldset>
    );
  },
};
