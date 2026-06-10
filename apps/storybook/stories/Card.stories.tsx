import type { Meta, StoryObj } from '@storybook/react';
import { h } from 'vue';
import { Card as RCard } from '@lily-ui/react';
import {
  Card as VCard,
  CardHeader as VCardHeader,
  CardBody as VCardBody,
  CardTitle as VCardTitle,
  CardFooter as VCardFooter,
} from '@lily-ui/vue';
import { trio, el } from '../src/multiframework';
import { makeT, type StoryLocale } from '../../../packages/react/src/storybook/i18n';

/** A composed Card (header / body / title / footer) across all three runtimes. */
interface Args {
  title: string;
  body: string;
  footer: string;
  elevated: boolean;
}

const meta: Meta<Args> = {
  title: 'Cross-framework/Card',
  tags: ['autodocs'],
  argTypes: {
    elevated: { control: 'boolean' },
    title: { control: 'text' },
    body: { control: 'text' },
    footer: { control: 'text' },
  },
  args: {
    title: '',
    body: '',
    footer: '',
    elevated: false,
  },
  render: (args, ctx) => {
    const t = makeT(ctx.globals.locale as StoryLocale);
    return renderCard(
      {
        ...args,
        title: args.title || t('Sasayuri lily', '笹百合 (sasayuri)'),
        body:
          args.body ||
          t(
            'A Lily UI card freely combines header, body, and footer.',
            'Lily UI のカードは、ヘッダー・本文・フッターを自由に組み合わせられます。',
          ),
        footer: args.footer || t('Updated 2026-05-31', '更新: 2026-05-31'),
      },
      ctx,
    );
  },
};

const renderCard = trio<Args>({
    react: (a) => (
      <div style={{ maxWidth: 360 }}>
        <RCard elevated={a.elevated}>
          <RCard.Header>Card</RCard.Header>
          <RCard.Body>
            <RCard.Title>{a.title}</RCard.Title>
            {a.body}
          </RCard.Body>
          <RCard.Footer>{a.footer}</RCard.Footer>
        </RCard>
      </div>
    ),
    vue: (a) => () =>
      h('div', { style: 'max-width:360px' }, [
        h(VCard, { elevated: a.elevated }, () => [
          h(VCardHeader, null, () => 'Card'),
          h(VCardBody, null, () => [h(VCardTitle, null, () => a.title), a.body]),
          h(VCardFooter, null, () => a.footer),
        ]),
      ]),
    wc: (a) => {
      const wrap = el('div', { style: 'max-width:360px' });
      wrap.append(
        el('lily-card', { elevated: a.elevated }, [
          el('lily-card-header', {}, 'Card'),
          el('lily-card-body', {}, [el('lily-card-title', {}, a.title), a.body]),
          el('lily-card-footer', {}, a.footer),
        ]),
      );
      return wrap;
    },
});

export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};
export const Elevated: Story = { args: { elevated: true } };
