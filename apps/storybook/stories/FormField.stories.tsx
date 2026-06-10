import type { Meta, StoryObj } from '@storybook/react';
import { h } from 'vue';
import { FormField as RFormField, Input as RInput } from '@lily-ui/react';
import { FormField as VFormField, Input as VInput } from '@lily-ui/vue';
import { trio, el } from '../src/multiframework';
import { makeT, type StoryLocale } from '../../../packages/react/src/storybook/i18n';

/**
 * A FormField wrapping an Input — showing the label / help / error wiring
 * (`id` + `aria-describedby` + `aria-invalid` + `required`) in React, Vue, and
 * Web Components.
 */
interface Args {
  label: string;
  help: string;
  error: string;
  required: boolean;
  placeholder: string;
  /** Show the error state with a localized message. */
  invalid: boolean;
}

const meta: Meta<Args> = {
  title: 'Cross-framework/FormField',
  tags: ['autodocs'],
  argTypes: {
    required: { control: 'boolean' },
    invalid: { control: 'boolean' },
    label: { control: 'text' },
    help: { control: 'text' },
    placeholder: { control: 'text' },
  },
  args: {
    label: '',
    help: '',
    error: '',
    required: true,
    placeholder: 'you@example.com',
    invalid: false,
  },
  render: (args, ctx) => {
    const t = makeT(ctx.globals.locale as StoryLocale);
    const error = args.invalid
      ? t('Enter a valid email address.', '正しいメールアドレスを入力してください。')
      : '';
    const help = error
      ? ''
      : args.help || t('Used as the destination for notifications.', '通知の送信先に使います。');
    return renderFormField(
      { ...args, label: args.label || t('Email address', 'メールアドレス'), help, error },
      ctx,
    );
  },
};

const renderFormField = trio<Args>({
    react: (a) => (
      <div style={{ maxWidth: 360 }}>
        <RFormField label={a.label} help={a.help || undefined} error={a.error || undefined} required={a.required}>
          <RInput type="email" placeholder={a.placeholder} />
        </RFormField>
      </div>
    ),
    vue: (a) => () =>
      h('div', { style: 'max-width:360px' }, [
        h(
          VFormField,
          {
            label: a.label,
            help: a.help || undefined,
            error: a.error || undefined,
            required: a.required,
          },
          { default: () => h(VInput, { type: 'email', placeholder: a.placeholder }) },
        ),
      ]),
    wc: (a) => {
      const wrap = el('div', { style: 'max-width:360px' });
      wrap.append(
        el(
          'lily-form-field',
          { label: a.label, help: a.help || null, error: a.error || null, required: a.required },
          el('lily-input', { type: 'email', placeholder: a.placeholder }),
        ),
      );
      return wrap;
    },
});

export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};
export const WithError: Story = {
  args: { invalid: true },
};
