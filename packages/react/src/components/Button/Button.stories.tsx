import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Actions/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The primary action control. Combines a `variant` (visual style) with a `status` (semantic color). Fully keyboard- and screen-reader-accessible. Styling is provided by `@lily-ui/css`.',
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['solid', 'outline', 'ghost', 'link'] },
    status: { control: 'select', options: ['primary', 'danger', 'success', 'warning', 'neutral'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    block: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
  args: {
    children: 'Button',
    variant: 'solid',
    status: 'primary',
    size: 'md',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

// `variant` and `status` names are technical (they equal the prop values), so
// they stay untranslated; prose labels switch with the Language toolbar.
export const Variants: Story = {
  render: (args) => (
    <div className="lily-flex lily-gap-3 lily-items-center" style={{ flexWrap: 'wrap' }}>
      <Button {...args} variant="solid">Solid</Button>
      <Button {...args} variant="outline">Outline</Button>
      <Button {...args} variant="ghost">Ghost</Button>
      <Button {...args} variant="link">Link</Button>
    </div>
  ),
};

export const Statuses: Story = {
  render: (args) => (
    <div className="lily-flex lily-gap-3 lily-items-center" style={{ flexWrap: 'wrap' }}>
      {(['primary', 'danger', 'success', 'warning', 'neutral'] as const).map((s) => (
        <Button {...args} key={s} status={s}>
          {s}
        </Button>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <div className="lily-flex lily-gap-3 lily-items-center">
        <Button {...args} size="sm">{t('Small', '小')}</Button>
        <Button {...args} size="md">{t('Medium', '中')}</Button>
        <Button {...args} size="lg">{t('Large', '大')}</Button>
      </div>
    );
  },
};

export const Loading: Story = { args: { loading: true } };
export const Disabled: Story = { args: { disabled: true } };

export const AsLink: Story = {
  render: (args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <Button {...args} as="a" href="#">
        {t('I am a link styled as a button', 'ボタン風のリンクです')}
      </Button>
    );
  },
};
