import type { Meta, StoryObj } from '@storybook/react';
import { Descriptions } from './Descriptions';
import { DescriptionsItem } from './Descriptions';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Data Display/Descriptions',
  component: Descriptions,
  tags: ['autodocs'],
} satisfies Meta<typeof Descriptions>;

export default meta;
type Story = StoryObj<typeof Descriptions>;

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <Descriptions>
        <DescriptionsItem term={t('Name', '名前')}>Lily UI</DescriptionsItem>
        <DescriptionsItem term={t('Version', 'バージョン')}>1.0.0</DescriptionsItem>
        <DescriptionsItem term={t('Status', 'ステータス')}>{t('Active', '有効')}</DescriptionsItem>
      </Descriptions>
    );
  },
};

export const TwoColumns: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <Descriptions columns={2}>
        <DescriptionsItem term={t('Name', '名前')}>Lily UI</DescriptionsItem>
        <DescriptionsItem term={t('Author', '作者')}>{t('Lily Team', 'Lily チーム')}</DescriptionsItem>
        <DescriptionsItem term={t('Version', 'バージョン')}>1.0.0</DescriptionsItem>
        <DescriptionsItem term={t('License', 'ライセンス')}>MIT</DescriptionsItem>
      </Descriptions>
    );
  },
};

export const Bordered: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <Descriptions columns={2} bordered>
        <DescriptionsItem term={t('Name', '名前')}>Lily UI</DescriptionsItem>
        <DescriptionsItem term={t('Author', '作者')}>{t('Lily Team', 'Lily チーム')}</DescriptionsItem>
        <DescriptionsItem term={t('Version', 'バージョン')}>1.0.0</DescriptionsItem>
        <DescriptionsItem term={t('License', 'ライセンス')}>MIT</DescriptionsItem>
      </Descriptions>
    );
  },
};

export const Vertical: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <Descriptions columns={3} layout="vertical">
        <DescriptionsItem term={t('Name', '名前')}>Lily UI</DescriptionsItem>
        <DescriptionsItem term={t('Version', 'バージョン')}>1.0.0</DescriptionsItem>
        <DescriptionsItem term={t('License', 'ライセンス')}>MIT</DescriptionsItem>
      </Descriptions>
    );
  },
};

export const VerticalBordered: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <Descriptions columns={3} layout="vertical" bordered>
        <DescriptionsItem term={t('Name', '名前')}>Lily UI</DescriptionsItem>
        <DescriptionsItem term={t('Version', 'バージョン')}>1.0.0</DescriptionsItem>
        <DescriptionsItem term={t('License', 'ライセンス')}>MIT</DescriptionsItem>
      </Descriptions>
    );
  },
};
