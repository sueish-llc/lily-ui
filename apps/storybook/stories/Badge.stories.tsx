import type { Meta, StoryObj } from '@storybook/react';
import { h } from 'vue';
import { Badge as RBadge } from '@lily-ui/react';
import { Badge as VBadge } from '@lily-ui/vue';
import { trio, el } from '../src/multiframework';

/** The same Badge across React, Vue, and `<lily-badge>`. */
interface Args {
  label: string;
  status: 'primary' | 'danger' | 'success' | 'warning' | 'info' | 'neutral';
  subtle: boolean;
  pill: boolean;
}

const meta: Meta<Args> = {
  title: 'Cross-framework/Badge',
  tags: ['autodocs'],
  argTypes: {
    status: { control: 'select', options: ['primary', 'danger', 'success', 'warning', 'info', 'neutral'] },
    subtle: { control: 'boolean' },
    pill: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: { label: 'New', status: 'primary', subtle: false, pill: false },
  render: trio<Args>({
    react: (a) => (
      <RBadge status={a.status} subtle={a.subtle} pill={a.pill}>
        {a.label}
      </RBadge>
    ),
    vue: (a) => () =>
      h(VBadge, { status: a.status, subtle: a.subtle, pill: a.pill }, { default: () => a.label }),
    wc: (a) => el('lily-badge', { status: a.status, subtle: a.subtle, pill: a.pill }, a.label),
  }),
};

export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};
export const Success: Story = { args: { status: 'success', subtle: true, label: 'Active' } };
export const Count: Story = { args: { status: 'danger', pill: true, label: '9' } };
