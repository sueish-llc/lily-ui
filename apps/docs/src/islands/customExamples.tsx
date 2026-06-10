/* Hand-authored examples for components that need local state or a per-framework
 * API (overlays, toast, carousel). Each provides a React `render` plus matching
 * React / Vue / Web Components source, so preview and code still agree. */
import 'temporal-polyfill/global';
import * as React from 'react';
import {
  Affix,
  Button,
  Modal,
  Offcanvas,
  Drawer,
  CommandPalette,
  ToastProvider,
  useToast,
  Presence,
  BackTop,
  Carousel,
  Badge,
  Stack,
  Link,
  AlertDialog,
  HoverCard,
  ContextMenu,
  FloatButton,
  Countdown,
  RelativeTime,
  ThemeProvider,
  useTheme,
  MotionProvider,
  useMotionLevel,
  Alert,
  type ThemeColorOverrides,
} from '@lily-ui/react';

export interface CustomExample {
  render: () => React.ReactNode;
  react: string;
  vue: string;
  wc: string;
}

function ModalDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>開く</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="確認"
        footer={<Button onClick={() => setOpen(false)}>OK</Button>}
      >
        本当に削除しますか？
      </Modal>
    </>
  );
}

function OffcanvasDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>メニューを開く</Button>
      <Offcanvas open={open} onClose={() => setOpen(false)} placement="end" title="メニュー">
        サイドのパネルの中身です。
      </Offcanvas>
    </>
  );
}

function DrawerDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>ドロワーを開く</Button>
      <Drawer open={open} onClose={() => setOpen(false)} anchor="left" title="メニュー">
        ドロワーの中身です。
      </Drawer>
    </>
  );
}

function CommandPaletteDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>⌘K で開く</Button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        items={[
          { id: 'new', label: '新規作成' },
          { id: 'open', label: '開く' },
          { id: 'save', label: '保存' },
        ]}
        onSelect={() => setOpen(false)}
      />
    </>
  );
}

function ToastInner() {
  const { toast } = useToast();
  return (
    <Button onClick={() => toast({ message: '変更内容を保存しました。', status: 'success' })}>
      通知を出す
    </Button>
  );
}
function ToastDemo() {
  return (
    <ToastProvider>
      <ToastInner />
    </ToastProvider>
  );
}

function PresenceDemo() {
  const [show, setShow] = React.useState(true);
  return (
    <Stack gap="3">
      <Button onClick={() => setShow((s) => !s)}>{show ? '隠す' : '表示'}</Button>
      <div style={{ minBlockSize: '2rem' }}>
        <Presence present={show}>
          <Badge status="success">表示中</Badge>
        </Presence>
      </div>
    </Stack>
  );
}

function CarouselDemo() {
  return <Carousel label="お知らせ" slides={['1 枚目', '2 枚目', '3 枚目']} controls indicators />;
}

// Affix sticks relative to its scroll container, so demo it inside a scrollable
// box. That keeps the badge pinned to the box (not the page viewport, where it
// would slide over the site header) and lets you see it follow on scroll.
function AffixDemo() {
  return (
    <div
      style={{
        inlineSize: '100%',
        maxBlockSize: '12rem',
        overflow: 'auto',
        padding: 'var(--lily-space-4, 1rem)',
        border: '1px solid var(--lily-color-border-default)',
        borderRadius: 'var(--lily-radius-lg, 12px)',
        background: 'var(--lily-color-bg-surface)',
      }}
    >
      <Affix offset={8}>
        <Badge status="info">スクロールで上部に追従</Badge>
      </Affix>
      <p style={{ marginBlockStart: 'var(--lily-space-4, 1rem)' }}>
        この枠を下にスクロールすると、バッジが上部に貼り付きます。
      </p>
      <div style={{ blockSize: '14rem' }} aria-hidden="true" />
      <p>ここまでスクロールしました。</p>
    </div>
  );
}

function AlertDialogDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button status="danger" onClick={() => setOpen(true)}>
        削除する
      </Button>
      <AlertDialog
        open={open}
        onClose={() => setOpen(false)}
        title="本当に削除しますか？"
        status="danger"
        actions={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              キャンセル
            </Button>
            <Button status="danger" onClick={() => setOpen(false)}>
              削除する
            </Button>
          </>
        }
      >
        この操作は取り消せません。
      </AlertDialog>
    </>
  );
}

function HoverCardDemo() {
  return (
    <HoverCard
      content={
        <Stack gap="1">
          <strong>@lily</strong>
          <span>Lily UI の公式アカウント</span>
        </Stack>
      }
    >
      <Link href="#">@lily</Link>
    </HoverCard>
  );
}

function ContextMenuDemo() {
  return (
    <ContextMenu
      menu={
        <>
          <ContextMenu.Item onSelect={() => {}}>切り取り</ContextMenu.Item>
          <ContextMenu.Item onSelect={() => {}}>コピー</ContextMenu.Item>
          <ContextMenu.Divider />
          <ContextMenu.Item onSelect={() => {}}>削除</ContextMenu.Item>
        </>
      }
    >
      <div
        style={{
          padding: 'var(--lily-space-6, 1.5rem)',
          border: '1px dashed var(--lily-color-border-default)',
          borderRadius: 'var(--lily-radius-lg, 12px)',
          background: 'var(--lily-color-bg-surface)',
          textAlign: 'center',
        }}
      >
        この枠を右クリック
      </div>
    </ContextMenu>
  );
}

// FloatButton anchors to a viewport corner via `position: fixed`. Pin it inside a
// relative box for the demo so it stays within the preview instead of floating
// over the whole page.
function FloatButtonDemo() {
  return (
    <div
      style={{
        position: 'relative',
        inlineSize: '100%',
        minBlockSize: '9rem',
        border: '1px solid var(--lily-color-border-default)',
        borderRadius: 'var(--lily-radius-lg, 12px)',
        background: 'var(--lily-color-bg-surface)',
      }}
    >
      <FloatButton aria-label="ページ先頭へ戻る" style={{ position: 'absolute' }}>
        ↑
      </FloatButton>
    </div>
  );
}

function CountdownDemo() {
  // A fixed-from-now target so the demo always shows a live, ticking countdown.
  const target = React.useMemo(
    () => Temporal.Now.plainDateTimeISO().add({ days: 3, hours: 4, minutes: 30 }),
    [],
  );
  return <Countdown to={target} />;
}

function RelativeTimeDemo() {
  const value = React.useMemo(() => Temporal.Now.instant().subtract({ hours: 2 }), []);
  return <RelativeTime value={value} live />;
}

/* The providers use the same storage/attribute contract as the site's own
 * theme toggle (`lily-theme` / data-theme, `lily-motion` / data-motion), so
 * these live demos change the page for real and stay consistent with it. */
function ThemeModeStatus() {
  const { mode, resolvedTheme, toggle } = useTheme();
  return (
    <Stack gap="3">
      <span>
        モード: {mode}（表示: {resolvedTheme}）
      </span>
      <div>
        <Button onClick={toggle}>ライトとダークを切り替える</Button>
      </div>
    </Stack>
  );
}

// Demo values are AAA-checked (>= 7:1 against on-primary / the canvas) so the
// docs page itself stays compliant while the custom theme is applied.
const demoCustomColors: ThemeColorOverrides = {
  primary: '#115e59',
  'primary-hover': '#134e4a',
  'primary-active': '#042f2e',
  'on-primary': '#ffffff',
  'primary-text': '#115e59',
};

function ThemeProviderDemo() {
  const [customTheme, setCustomTheme] = React.useState(false);
  return (
    <ThemeProvider colors={customTheme ? demoCustomColors : undefined}>
      <Stack gap="3">
        <ThemeModeStatus />
        <div>
          <Button variant="outline" onClick={() => setCustomTheme((v) => !v)}>
            {customTheme ? '既定の色テーマに戻す' : 'カスタムの色テーマを適用'}
          </Button>
        </div>
        <Alert status="warning" title="色を独自に決めるときの注意">
          既定のテーマは WCAG 2.1 AAA（文字と背景のコントラスト
          7:1）を満たすよう調整してあります。色を独自に決めるとこの基準を外れることがあるため、適用する前に
          findContrastIssues で確認してください。
        </Alert>
      </Stack>
    </ThemeProvider>
  );
}

function MotionLevelStatus() {
  const { preference, level, setPreference } = useMotionLevel();
  return (
    <Stack gap="3">
      <span>
        設定: {preference}（適用中: {level}）
      </span>
      <Stack direction="horizontal" gap="2">
        {(['auto', 'full', 'minimal', 'none'] as const).map((p) => (
          <Button
            key={p}
            size="sm"
            variant={p === preference ? 'solid' : 'outline'}
            onClick={() => setPreference(p)}
          >
            {p}
          </Button>
        ))}
      </Stack>
    </Stack>
  );
}

function MotionProviderDemo() {
  return (
    <MotionProvider>
      <MotionLevelStatus />
    </MotionProvider>
  );
}

export const customExamples: Record<string, CustomExample> = {
  // ── Providers (app-wide context) ──────────────────────────────────────────
  ThemeProvider: {
    render: () => <ThemeProviderDemo />,
    react: `import { ThemeProvider, useTheme, findContrastIssues, Button } from '@lily-ui/react';

function ThemeButton() {
  const { resolvedTheme, toggle } = useTheme();
  return <Button onClick={toggle}>いまは {resolvedTheme} 表示</Button>;
}

// 注意: 既定のテーマは AAA（コントラスト 7:1）を満たすよう検証済みですが、
// 独自に決めた色はその保証の外です。適用前に findContrastIssues で確認を。
const customColors = { primary: '#115e59', 'on-primary': '#ffffff' };
console.assert(findContrastIssues({ colors: customColors }).length === 0);

export function App() {
  return (
    <ThemeProvider defaultMode="system" colors={customColors}>
      <ThemeButton />
    </ThemeProvider>
  );
}`,
    vue: `<!-- App.vue -->
<script setup lang="ts">
import { ThemeProvider, findContrastIssues } from '@lily-ui/vue';

// 注意: 既定のテーマは AAA（コントラスト 7:1）を満たすよう検証済みですが、
// 独自に決めた色はその保証の外です。適用前に findContrastIssues で確認を。
const customColors = { primary: '#115e59', 'on-primary': '#ffffff' };
console.assert(findContrastIssues({ colors: customColors }).length === 0);
</script>

<template>
  <ThemeProvider default-mode="system" :colors="customColors">
    <ThemeButton />
  </ThemeProvider>
</template>

<!-- ThemeButton.vue -->
<script setup lang="ts">
import { Button, useTheme } from '@lily-ui/vue';
const { resolvedTheme, toggle } = useTheme();
</script>

<template>
  <Button @click="toggle()">いまは {{ resolvedTheme }} 表示</Button>
</template>`,
    wc: `<!-- Provider はありません。<html> の data-theme 属性がその役割です -->
<html data-theme="dark">
  <body>
    <lily-button>ダーク表示のボタン</lily-button>
    <script type="module">
      import '@lily-ui/web-components/define';
      // 切り替えは属性を書き換えるだけ（属性を消すと OS 設定に従う）
      document.documentElement.setAttribute('data-theme', 'light');
    </script>
    <!-- 全体のテーマ色の上書きも同じ流儀で、CSS 変数を直接書く。
         注意: 既定のテーマは AAA（コントラスト 7:1）を検証済みだが、
         独自に決めた色はその保証の外。contrastRatio で確認を -->
    <style>
      :root[data-theme='light'] { --lily-color-primary: #115e59; }
      :root[data-theme='dark'] { --lily-color-primary: #5eead4; }
    </style>
  </body>
</html>`,
  },

  MotionProvider: {
    render: () => <MotionProviderDemo />,
    react: `import { MotionProvider, useMotionLevel, Button } from '@lily-ui/react';

function MotionPicker() {
  const { preference, level, setPreference } = useMotionLevel();
  return (
    <>
      <p>設定: {preference}（適用中: {level}）</p>
      <Button onClick={() => setPreference('minimal')}>動きを控えめにする</Button>
    </>
  );
}

export function App() {
  return (
    <MotionProvider defaultPreference="auto">
      <MotionPicker />
    </MotionProvider>
  );
}`,
    vue: `<!-- App.vue -->
<script setup lang="ts">
import { MotionProvider } from '@lily-ui/vue';
</script>

<template>
  <MotionProvider default-preference="auto">
    <MotionPicker />
  </MotionProvider>
</template>

<!-- MotionPicker.vue -->
<script setup lang="ts">
import { Button, useMotionLevel } from '@lily-ui/vue';
const { level, setPreference } = useMotionLevel();
</script>

<template>
  <Button @click="setPreference('minimal')">動きを控えめにする（適用中: {{ level }}）</Button>
</template>`,
    wc: `<script type="module">
  import { autoMotion } from '@lily-ui/web-components';
  // 端末・OS の設定から動きの段階を決めて <html data-motion> に反映
  autoMotion();
  // 手動で固定するなら属性を直接書く:
  // document.documentElement.setAttribute('data-motion', 'minimal');
</script>`,
  },

  Modal: {
    render: () => <ModalDemo />,
    react: `import { useState } from 'react';
import { Button, Modal } from '@lily-ui/react';

function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>開く</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="確認"
        footer={<Button onClick={() => setOpen(false)}>OK</Button>}
      >
        本当に削除しますか？
      </Modal>
    </>
  );
}`,
    vue: `<script setup lang="ts">
import { ref } from 'vue';
import { Button, Modal } from '@lily-ui/vue';
const open = ref(false);
</script>

<template>
  <Button @click="open = true">開く</Button>
  <Modal :open="open" title="確認" @close="open = false">
    本当に削除しますか？
    <template #footer><Button @click="open = false">OK</Button></template>
  </Modal>
</template>`,
    wc: `<lily-button id="open">開く</lily-button>
<lily-modal id="m" title="確認">本当に削除しますか？</lily-modal>
<script type="module">
  import '@lily-ui/web-components';
  const m = document.getElementById('m');
  document.getElementById('open').onclick = () => m.setAttribute('open', '');
  m.addEventListener('close', () => m.removeAttribute('open'));
</script>`,
  },

  Offcanvas: {
    render: () => <OffcanvasDemo />,
    react: `import { useState } from 'react';
import { Button, Offcanvas } from '@lily-ui/react';

function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>メニューを開く</Button>
      <Offcanvas open={open} onClose={() => setOpen(false)} placement="end" title="メニュー">
        サイドのパネルの中身です。
      </Offcanvas>
    </>
  );
}`,
    vue: `<script setup lang="ts">
import { ref } from 'vue';
import { Button, Offcanvas } from '@lily-ui/vue';
const open = ref(false);
</script>

<template>
  <Button @click="open = true">メニューを開く</Button>
  <Offcanvas :open="open" placement="end" title="メニュー" @close="open = false">
    サイドのパネルの中身です。
  </Offcanvas>
</template>`,
    wc: `<lily-button id="open">メニューを開く</lily-button>
<lily-offcanvas id="oc" placement="end" title="メニュー">サイドのパネルの中身です。</lily-offcanvas>
<script type="module">
  import '@lily-ui/web-components';
  const oc = document.getElementById('oc');
  document.getElementById('open').onclick = () => oc.setAttribute('open', '');
  oc.addEventListener('close', () => oc.removeAttribute('open'));
</script>`,
  },

  Drawer: {
    render: () => <DrawerDemo />,
    react: `import { useState } from 'react';
import { Button, Drawer } from '@lily-ui/react';

function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>ドロワーを開く</Button>
      <Drawer open={open} onClose={() => setOpen(false)} anchor="left" title="メニュー">
        ドロワーの中身です。
      </Drawer>
    </>
  );
}`,
    vue: `<script setup lang="ts">
import { ref } from 'vue';
import { Button, Drawer } from '@lily-ui/vue';
const open = ref(false);
</script>

<template>
  <Button @click="open = true">ドロワーを開く</Button>
  <Drawer :open="open" anchor="left" title="メニュー" @close="open = false">
    ドロワーの中身です。
  </Drawer>
</template>`,
    wc: `<lily-button id="open">ドロワーを開く</lily-button>
<lily-drawer id="dr" anchor="left" title="メニュー">ドロワーの中身です。</lily-drawer>
<script type="module">
  import '@lily-ui/web-components';
  const dr = document.getElementById('dr');
  document.getElementById('open').onclick = () => dr.setAttribute('open', '');
  dr.addEventListener('close', () => dr.removeAttribute('open'));
</script>`,
  },

  CommandPalette: {
    render: () => <CommandPaletteDemo />,
    react: `import { useState } from 'react';
import { Button, CommandPalette } from '@lily-ui/react';

function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>⌘K で開く</Button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        items={[
          { id: 'new', label: '新規作成' },
          { id: 'open', label: '開く' },
          { id: 'save', label: '保存' },
        ]}
        onSelect={(id) => setOpen(false)}
      />
    </>
  );
}`,
    vue: `<script setup lang="ts">
import { ref } from 'vue';
import { Button, CommandPalette } from '@lily-ui/vue';
const open = ref(false);
const items = [
  { id: 'new', label: '新規作成' },
  { id: 'open', label: '開く' },
  { id: 'save', label: '保存' },
];
</script>

<template>
  <Button @click="open = true">⌘K で開く</Button>
  <CommandPalette
    :open="open"
    :items="items"
    @open-change="open = $event"
    @select="open = false"
  />
</template>`,
    wc: `<lily-button id="open">⌘K で開く</lily-button>
<lily-command-palette id="cp"
  items='[{"id":"new","label":"新規作成"},{"id":"open","label":"開く"},{"id":"save","label":"保存"}]'>
</lily-command-palette>
<script type="module">
  import '@lily-ui/web-components';
  const cp = document.getElementById('cp');
  document.getElementById('open').onclick = () => cp.setAttribute('open', '');
  cp.addEventListener('select', () => cp.removeAttribute('open'));
</script>`,
  },

  Toast: {
    render: () => <ToastDemo />,
    react: `import { ToastProvider, useToast, Button } from '@lily-ui/react';

function ShowButton() {
  const { toast } = useToast();
  return (
    <Button onClick={() => toast({ message: '変更内容を保存しました。', status: 'success' })}>
      通知を出す
    </Button>
  );
}

function Example() {
  return (
    <ToastProvider>
      <ShowButton />
    </ToastProvider>
  );
}`,
    vue: `<script setup lang="ts">
import { ToastProvider, useToast, Button } from '@lily-ui/vue';
const { toast } = useToast();
const show = () =>
  toast({ message: '変更内容を保存しました。', status: 'success' });
</script>

<template>
  <ToastProvider>
    <Button @click="show">通知を出す</Button>
  </ToastProvider>
</template>`,
    wc: `<lily-toast-region id="toasts"></lily-toast-region>
<lily-button id="show">通知を出す</lily-button>
<script type="module">
  import '@lily-ui/web-components';
  const region = document.getElementById('toasts');
  document.getElementById('show').onclick = () =>
    region.toast({ message: '変更内容を保存しました。', status: 'success' });
</script>`,
  },

  Presence: {
    render: () => <PresenceDemo />,
    react: `import { useState } from 'react';
import { Button, Presence, Badge, Stack } from '@lily-ui/react';

function Example() {
  const [show, setShow] = useState(true);
  return (
    <Stack gap="3">
      <Button onClick={() => setShow((s) => !s)}>{show ? '隠す' : '表示'}</Button>
      <Presence present={show}>
        <Badge status="success">表示中</Badge>
      </Presence>
    </Stack>
  );
}`,
    vue: `<script setup lang="ts">
import { ref } from 'vue';
import { Button, Presence, Badge, Stack } from '@lily-ui/vue';
const show = ref(true);
</script>

<template>
  <Stack gap="3">
    <Button @click="show = !show">{{ show ? '隠す' : '表示' }}</Button>
    <Presence :present="show">
      <Badge status="success">表示中</Badge>
    </Presence>
  </Stack>
</template>`,
    wc: `<lily-stack gap="3">
  <lily-button id="toggle">隠す</lily-button>
  <lily-presence present>
    <lily-badge status="success">表示中</lily-badge>
  </lily-presence>
</lily-stack>
<script type="module">
  import '@lily-ui/web-components';
  const p = document.querySelector('lily-presence');
  document.getElementById('toggle').onclick = () =>
    p.toggleAttribute('present');
</script>`,
  },

  Carousel: {
    render: () => <CarouselDemo />,
    react: `import { Carousel } from '@lily-ui/react';

<Carousel label="お知らせ" controls indicators slides={['1 枚目', '2 枚目', '3 枚目']} />`,
    vue: `<script setup lang="ts">
import { Carousel } from '@lily-ui/vue';
const slides = ['1 枚目', '2 枚目', '3 枚目'];
</script>

<template>
  <Carousel label="お知らせ" controls indicators :slides="slides" />
</template>`,
    wc: `<!-- once per app: import '@lily-ui/web-components'; -->
<lily-carousel label="お知らせ" controls indicators slides='["1 枚目","2 枚目","3 枚目"]'></lily-carousel>`,
  },

  BackTop: {
    render: () => (
      <BackTop visibilityHeight={-1} label="トップへ戻る" style={{ position: 'static' }} />
    ),
    react: `import { BackTop } from '@lily-ui/react';

// Floats in once the page is scrolled past \`visibilityHeight\`.
<BackTop label="トップへ戻る" />`,
    vue: `<script setup lang="ts">
import { BackTop } from '@lily-ui/vue';
</script>

<template>
  <BackTop label="トップへ戻る" />
</template>`,
    wc: `<!-- once per app: import '@lily-ui/web-components'; -->
<lily-back-top label="トップへ戻る"></lily-back-top>`,
  },

  Affix: {
    render: () => <AffixDemo />,
    react: `import { Affix, Badge } from '@lily-ui/react';

// Place Affix inside a scrolling region; it sticks once scrolled to the offset.
<div style={{ maxBlockSize: '12rem', overflow: 'auto' }}>
  <Affix offset={8}>
    <Badge status="info">スクロールで上部に追従</Badge>
  </Affix>
  {/* …長いコンテンツ… */}
</div>`,
    vue: `<script setup lang="ts">
import { Affix, Badge } from '@lily-ui/vue';
</script>

<template>
  <div style="max-block-size: 12rem; overflow: auto">
    <Affix :offset="8">
      <Badge status="info">スクロールで上部に追従</Badge>
    </Affix>
    <!-- …長いコンテンツ… -->
  </div>
</template>`,
    wc: `<!-- once per app: import '@lily-ui/web-components'; -->
<div style="max-block-size: 12rem; overflow: auto">
  <lily-affix offset="8">
    <lily-badge status="info">スクロールで上部に追従</lily-badge>
  </lily-affix>
  <!-- …長いコンテンツ… -->
</div>`,
  },

  AlertDialog: {
    render: () => <AlertDialogDemo />,
    react: `import { useState } from 'react';
import { Button, AlertDialog } from '@lily-ui/react';

function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button status="danger" onClick={() => setOpen(true)}>削除する</Button>
      <AlertDialog
        open={open}
        onClose={() => setOpen(false)}
        title="本当に削除しますか？"
        status="danger"
        actions={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>キャンセル</Button>
            <Button status="danger" onClick={() => setOpen(false)}>削除する</Button>
          </>
        }
      >
        この操作は取り消せません。
      </AlertDialog>
    </>
  );
}`,
    vue: `<script setup lang="ts">
import { ref } from 'vue';
import { Button, AlertDialog } from '@lily-ui/vue';
const open = ref(false);
</script>

<template>
  <Button status="danger" @click="open = true">削除する</Button>
  <AlertDialog :open="open" title="本当に削除しますか？" status="danger" @close="open = false">
    この操作は取り消せません。
    <template #actions>
      <Button variant="ghost" @click="open = false">キャンセル</Button>
      <Button status="danger" @click="open = false">削除する</Button>
    </template>
  </AlertDialog>
</template>`,
    wc: `<lily-button id="open" status="danger">削除する</lily-button>
<lily-alert-dialog id="ad" title="本当に削除しますか？" status="danger">
  この操作は取り消せません。
</lily-alert-dialog>
<script type="module">
  import '@lily-ui/web-components';
  const ad = document.getElementById('ad');
  document.getElementById('open').onclick = () => ad.setAttribute('open', '');
  ad.addEventListener('close', () => ad.removeAttribute('open'));
</script>`,
  },

  HoverCard: {
    render: () => <HoverCardDemo />,
    react: `import { HoverCard, Link, Stack } from '@lily-ui/react';

<HoverCard
  content={
    <Stack gap="1">
      <strong>@lily</strong>
      <span>Lily UI の公式アカウント</span>
    </Stack>
  }
>
  <Link href="#">@lily</Link>
</HoverCard>`,
    vue: `<script setup lang="ts">
import { HoverCard, Link, Stack } from '@lily-ui/vue';
</script>

<template>
  <HoverCard>
    <Link href="#">@lily</Link>
    <template #content>
      <Stack gap="1">
        <strong>@lily</strong>
        <span>Lily UI の公式アカウント</span>
      </Stack>
    </template>
  </HoverCard>
</template>`,
    wc: `<!-- once per app: import '@lily-ui/web-components'; -->
<lily-hover-card content="Lily UI の公式アカウント">
  <a href="#">@lily</a>
</lily-hover-card>`,
  },

  ContextMenu: {
    render: () => <ContextMenuDemo />,
    react: `import { ContextMenu } from '@lily-ui/react';

<ContextMenu
  menu={
    <>
      <ContextMenu.Item onSelect={cut}>切り取り</ContextMenu.Item>
      <ContextMenu.Item onSelect={copy}>コピー</ContextMenu.Item>
      <ContextMenu.Divider />
      <ContextMenu.Item onSelect={remove}>削除</ContextMenu.Item>
    </>
  }
>
  <div>この枠を右クリック</div>
</ContextMenu>`,
    vue: `<script setup lang="ts">
import { ContextMenu, ContextMenuItem, ContextMenuDivider } from '@lily-ui/vue';
</script>

<template>
  <ContextMenu>
    <div>この枠を右クリック</div>
    <template #menu>
      <ContextMenuItem @select="cut">切り取り</ContextMenuItem>
      <ContextMenuItem @select="copy">コピー</ContextMenuItem>
      <ContextMenuDivider />
      <ContextMenuItem @select="remove">削除</ContextMenuItem>
    </template>
  </ContextMenu>
</template>`,
    wc: `<!-- once per app: import '@lily-ui/web-components'; -->
<lily-context-menu>
  <div>この枠を右クリック</div>
  <lily-context-menu-item slot="menu">切り取り</lily-context-menu-item>
  <lily-context-menu-item slot="menu">コピー</lily-context-menu-item>
  <lily-context-menu-divider slot="menu"></lily-context-menu-divider>
  <lily-context-menu-item slot="menu">削除</lily-context-menu-item>
</lily-context-menu>`,
  },

  FloatButton: {
    render: () => <FloatButtonDemo />,
    react: `import { FloatButton } from '@lily-ui/react';

// 画面の隅に固定で浮かぶ。アイコンのみのときは aria-label を必ず付ける。
<FloatButton position="bottom-right" aria-label="ページ先頭へ戻る">↑</FloatButton>`,
    vue: `<script setup lang="ts">
import { FloatButton } from '@lily-ui/vue';
</script>

<template>
  <FloatButton position="bottom-right" aria-label="ページ先頭へ戻る">↑</FloatButton>
</template>`,
    wc: `<!-- once per app: import '@lily-ui/web-components'; -->
<lily-float-button position="bottom-right" aria-label="ページ先頭へ戻る">↑</lily-float-button>`,
  },

  Countdown: {
    render: () => <CountdownDemo />,
    react: `import { Countdown } from '@lily-ui/react';

// 「今」から3日4時間30分後を目標にした例（文字列の日時も受け付ける）。
<Countdown to={Temporal.Now.plainDateTimeISO().add({ days: 3, hours: 4, minutes: 30 })} />`,
    vue: `<script setup lang="ts">
import { Countdown } from '@lily-ui/vue';
const target = Temporal.Now.plainDateTimeISO().add({ days: 3, hours: 4, minutes: 30 });
</script>

<template>
  <Countdown :to="target" />
</template>`,
    wc: `<lily-countdown id="cd"></lily-countdown>
<script type="module">
  import '@lily-ui/web-components';
  const target = Temporal.Now.plainDateTimeISO().add({ days: 3, hours: 4, minutes: 30 });
  document.getElementById('cd').setAttribute('to', target.toString());
</script>`,
  },

  RelativeTime: {
    render: () => <RelativeTimeDemo />,
    react: `import { RelativeTime } from '@lily-ui/react';

// 値は Temporal の時刻で渡す。live を付けると表示が一定間隔で更新される。
<RelativeTime value={Temporal.Now.instant().subtract({ hours: 2 })} live />`,
    vue: `<script setup lang="ts">
import { RelativeTime } from '@lily-ui/vue';
const value = Temporal.Now.instant().subtract({ hours: 2 });
</script>

<template>
  <RelativeTime :value="value" live />
</template>`,
    wc: `<lily-relative-time id="rt" live></lily-relative-time>
<script type="module">
  import '@lily-ui/web-components';
  const value = Temporal.Now.instant().subtract({ hours: 2 });
  document.getElementById('rt').setAttribute('value', value.toString());
</script>`,
  },
};
