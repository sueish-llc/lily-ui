import type { Meta, StoryObj } from '@storybook/react';
import { h } from 'vue';
import { Alert as RAlert } from '@lily-ui/react';
import { Alert as VAlert } from '@lily-ui/vue';
import { trio, el } from '../src/multiframework';
import { makeT, type StoryLocale } from '../../../packages/react/src/storybook/i18n';

/** The same Alert across React, Vue, and `<lily-alert>`. */
interface Args {
  title: string;
  body: string;
  status: 'primary' | 'danger' | 'success' | 'warning' | 'info';
  dismissible: boolean;
}

const meta: Meta<Args> = {
  title: 'Cross-framework/Alert',
  tags: ['autodocs'],
  argTypes: {
    status: { control: 'select', options: ['primary', 'danger', 'success', 'warning', 'info'] },
    dismissible: { control: 'boolean' },
    title: { control: 'text' },
    body: { control: 'text' },
  },
  args: {
    title: '',
    body: '',
    status: 'success',
    dismissible: true,
  },
  render: (args, ctx) => {
    const t = makeT(ctx.globals.locale as StoryLocale);
    const danger = args.status === 'danger';
    return renderAlert(
      {
        ...args,
        title: args.title || (danger ? t('Error', 'エラー') : t('Saved', '保存しました')),
        body:
          args.body ||
          (danger
            ? t('Saving failed.', '保存に失敗しました。')
            : t('All your changes have been saved.', '変更内容はすべて保存されています。')),
      },
      ctx,
    );
  },
};

const renderAlert = trio<Args>({
    react: (a) => (
      <RAlert
        status={a.status}
        title={a.title}
        role={a.status === 'danger' ? 'alert' : 'status'}
        onClose={a.dismissible ? () => undefined : undefined}
      >
        {a.body}
      </RAlert>
    ),
    vue: (a) => () =>
      h(
        VAlert,
        {
          status: a.status,
          title: a.title,
          dismissible: a.dismissible,
          role: a.status === 'danger' ? 'alert' : 'status',
        },
        { default: () => a.body },
      ),
    wc: (a) =>
      el(
        'lily-alert',
        {
          status: a.status,
          title: a.title,
          dismissible: a.dismissible,
          role: a.status === 'danger' ? 'alert' : 'status',
        },
        a.body,
      ),
});

export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};
export const Danger: Story = {
  args: { status: 'danger', dismissible: true },
};
