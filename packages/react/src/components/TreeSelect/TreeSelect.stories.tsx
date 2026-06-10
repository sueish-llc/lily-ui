import type { Meta, StoryObj } from '@storybook/react';
import { TreeSelect } from './TreeSelect';
import { makeT, type StoryLocale } from '../../storybook/i18n';
import type { TreeNode } from '../Tree/Tree';

const meta = {
  title: 'Forms/Tree Select',
  component: TreeSelect,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    multiple: { control: 'boolean' },
  },
} satisfies Meta<typeof TreeSelect>;

export default meta;
type Story = StoryObj<typeof TreeSelect>;

const categoryNodes: TreeNode[] = [
  {
    id: 'electronics',
    label: 'Electronics',
    children: [
      { id: 'phones', label: 'Phones' },
      {
        id: 'computers',
        label: 'Computers',
        children: [
          { id: 'laptops', label: 'Laptops' },
          { id: 'desktops', label: 'Desktops' },
        ],
      },
    ],
  },
  {
    id: 'apparel',
    label: 'Apparel',
    children: [
      { id: 'mens', label: "Men's" },
      { id: 'womens', label: "Women's" },
    ],
  },
  { id: 'books', label: 'Books' },
];

const categoryNodesJa: TreeNode[] = [
  {
    id: 'electronics',
    label: '電子機器',
    children: [
      { id: 'phones', label: 'スマートフォン' },
      {
        id: 'computers',
        label: 'コンピューター',
        children: [
          { id: 'laptops', label: 'ノートPC' },
          { id: 'desktops', label: 'デスクトップ' },
        ],
      },
    ],
  },
  {
    id: 'apparel',
    label: '衣料品',
    children: [
      { id: 'mens', label: 'メンズ' },
      { id: 'womens', label: 'レディース' },
    ],
  },
  { id: 'books', label: '書籍' },
];

/** Default: click to open the tree panel and select a node. */
export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    const nodes = globals.locale === 'ja' ? categoryNodesJa : categoryNodes;
    return (
      <TreeSelect
        nodes={nodes}
        placeholder={t('Select a category', 'カテゴリを選択')}
        aria-label={t('Category', 'カテゴリ')}
      />
    );
  },
};

/** With a pre-selected value. */
export const WithValue: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    const nodes = globals.locale === 'ja' ? categoryNodesJa : categoryNodes;
    return (
      <TreeSelect
        nodes={nodes}
        defaultValue="laptops"
        placeholder={t('Select a category', 'カテゴリを選択')}
        aria-label={t('Category', 'カテゴリ')}
      />
    );
  },
};

/** Disabled state. */
export const Disabled: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    const nodes = globals.locale === 'ja' ? categoryNodesJa : categoryNodes;
    return (
      <TreeSelect
        nodes={nodes}
        disabled
        placeholder={t('Select a category', 'カテゴリを選択')}
        aria-label={t('Category', 'カテゴリ')}
      />
    );
  },
};

/** Size variants. */
export const Sizes: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    const nodes = globals.locale === 'ja' ? categoryNodesJa : categoryNodes;
    const placeholder = t('Select a category', 'カテゴリを選択');
    const label = t('Category', 'カテゴリ');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {(['sm', 'md', 'lg'] as const).map((size) => (
          <TreeSelect key={size} nodes={nodes} size={size} placeholder={placeholder} aria-label={`${label} (${size})`} />
        ))}
      </div>
    );
  },
};
