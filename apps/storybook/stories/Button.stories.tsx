import type { Meta, StoryObj } from '@storybook/react';
import { h } from 'vue';
import { Button as RButton } from '@lily-ui/react';
import { Button as VButton } from '@lily-ui/vue';
import { trio, el } from '../src/multiframework';
import { makeT, type StoryLocale } from '../../../packages/react/src/storybook/i18n';

/**
 * The same Button in React, Vue, and as a `<lily-button>` Web Component.
 * Switch the implementation with the **Framework** toolbar control.
 */
interface Args {
  label: string;
  status: 'primary' | 'danger' | 'success' | 'warning' | 'neutral';
  variant: 'solid' | 'outline' | 'ghost' | 'link';
  size: 'sm' | 'md' | 'lg';
  block: boolean;
  loading: boolean;
  disabled: boolean;
}

const meta: Meta<Args> = {
  title: 'Cross-framework/Button',
  tags: ['autodocs'],
  argTypes: {
    status: { control: 'select', options: ['primary', 'danger', 'success', 'warning', 'neutral'] },
    variant: { control: 'select', options: ['solid', 'outline', 'ghost', 'link'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    block: { control: 'boolean' },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: {
    label: '',
    status: 'primary',
    variant: 'solid',
    size: 'md',
    block: false,
    loading: false,
    disabled: false,
  },
  render: (args, ctx) => {
    const t = makeT(ctx.globals.locale as StoryLocale);
    return renderButton({ ...args, label: args.label || t('Save', '保存する') }, ctx);
  },
};

const renderButton = trio<Args>({
    react: (a) => (
      <RButton
        status={a.status}
        variant={a.variant}
        size={a.size}
        block={a.block}
        loading={a.loading}
        disabled={a.disabled}
      >
        {a.label}
      </RButton>
    ),
    vue: (a) => () =>
      h(
        VButton,
        {
          status: a.status,
          variant: a.variant,
          size: a.size,
          block: a.block,
          loading: a.loading,
          disabled: a.disabled,
        },
        { default: () => a.label },
      ),
    wc: (a) =>
      el(
        'lily-button',
        {
          status: a.status,
          variant: a.variant,
          size: a.size,
          block: a.block,
          loading: a.loading,
          disabled: a.disabled,
        },
        a.label,
      ),
});

export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};

export const Danger: Story = { args: { status: 'danger', variant: 'solid' } };
export const Outline: Story = { args: { variant: 'outline' } };
export const Loading: Story = { args: { loading: true } };
