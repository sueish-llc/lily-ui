// Hand-authored catalog metadata that complements components.generated.ts:
// natural-Japanese summaries, English summaries, and category labels. Both
// languages are user-facing — keep ja natural (see CLAUDE.md) and en free of
// AI "slop" (no em-dash openers, no adverbs, active voice, plain statements).
// ja opens with a 体言止め one-liner; later sentences stay ですます.

import type { Locale } from '../i18n/ui';

/** Display order of categories in the sidebar. */
export const CATEGORY_ORDER = [
  'Foundations',
  'Layout',
  'Typography',
  'Actions',
  'Data Display',
  'Media',
  'Forms',
  'Navigation',
  'Disclosure',
  'Feedback',
  'Overlay',
] as const;

export const CATEGORY_LABELS: Record<string, Record<Locale, string>> = {
  Foundations: { ja: '基礎', en: 'Foundations' },
  Layout: { ja: 'レイアウト', en: 'Layout' },
  Typography: { ja: 'タイポグラフィ', en: 'Typography' },
  Actions: { ja: 'アクション', en: 'Actions' },
  'Data Display': { ja: 'データ表示', en: 'Data Display' },
  Media: { ja: 'メディア', en: 'Media' },
  Forms: { ja: 'フォーム', en: 'Forms' },
  Navigation: { ja: 'ナビゲーション', en: 'Navigation' },
  Disclosure: { ja: '開閉', en: 'Disclosure' },
  Feedback: { ja: 'フィードバック', en: 'Feedback' },
  Overlay: { ja: 'オーバーレイ', en: 'Overlay' },
};

export interface ComponentOverride {
  /** Per-locale one-line summary. Both ja and en are authored here. */
  summary?: Partial<Record<Locale, string>>;
}

export const overrides: Record<string, ComponentOverride> = {
  Accordion: {
    summary: {
      ja: '見出しを押すと下の中身が開閉する、折りたたみ式のメニュー。キーボードだけで操作でき、開いているか閉じているかは読み上げソフトにも正しく伝わります。',
      en: 'A collapsible menu whose headers open and close the section below. It works from the keyboard, and screen readers announce whether each section is open.',
    },
  },
  Affix: {
    summary: {
      ja: 'ページを決まった位置までスクロールすると、中身を画面の上端や下端に貼り付けて追従させる部品。',
      en: 'Content that sticks to the top or bottom of the viewport once you scroll it into place.',
    },
  },
  Alert: {
    summary: {
      ja: '状況を伝えるメッセージ。成功・警告・エラーなどを色とアイコンで示します。',
      en: 'A status message. Color and an icon flag success, a warning, or an error.',
    },
  },
  Avatar: {
    summary: {
      ja: '利用者やモノを表す小さな丸い画像。写真がないときは頭文字で代用でき、オンライン中などを示す小さな点も付けられます。',
      en: 'A small round image for a person or thing. It falls back to initials, and a small dot can show presence such as online.',
    },
  },
  BackTop: {
    summary: {
      ja: 'ページをある程度スクロールすると現れ、押すと一番上まで戻れるボタン。画面の隅に浮かぶように表示されます。',
      en: 'A button that appears once you scroll down and takes you back to the top. It floats in a corner of the screen.',
    },
  },
  Badge: {
    summary: {
      ja: '件数や短いラベルを表す小さな印。「3」のような数や状態を、控えめに添えるのに使います。押して選べる小さなタグが欲しいときは Chip を使ってください。',
      en: 'A small static mark for a count or short label. Use it to add a number like "3" or a quiet status. For a tag you can click, use Chip instead.',
    },
  },
  Breadcrumb: {
    summary: {
      ja: '「ホーム > 製品 > 詳細」のように、今いるページがサイトのどの位置にあるかを示す道しるべ（パンくずリスト）。末尾が現在のページです。',
      en: 'A trail that shows where the current page sits in the site, like "Home > Products > Detail". The last item is the current page.',
    },
  },
  Button: {
    summary: {
      ja: 'クリックで操作を実行する、基本のボタン。variant（見た目の種類）と status（色で表す意味）を組み合わせて使い分けます。',
      en: 'The basic control for running an action. Pair variant (how it looks) with status (the color and meaning) to suit it.',
    },
  },
  ButtonGroup: {
    summary: {
      ja: '関連する複数のボタンを、ひとつのまとまりとして横に並べる部品。label でそのまとまりの目的を伝えられ、読み上げソフトにも一群として伝わります。',
      en: 'Related buttons joined into one horizontal set. A label states the purpose, and screen readers read it as a single group.',
    },
  },
  Calendar: {
    summary: {
      ja: 'ポップアップを出さず、月のカレンダーをそのまま置いて日付を選ぶ入力欄。日付はボタンになっていて、選んだ日を色で示します。',
      en: 'An inline month grid for picking a date, with no popup. Each day is a button, and the chosen day shows in color.',
    },
  },
  Card: {
    summary: {
      ja: '中身をひとまとめに囲む、汎用の枠。ヘッダー・本文・フッターなどの部品を組み合わせて作ります。',
      en: 'A general-purpose frame that wraps content. Build it from header, body, and footer parts.',
    },
  },
  Carousel: {
    summary: {
      ja: '複数の項目を切り替えて見せるスライドショー。自動送りは、カーソルを重ねている間やキーボードで操作している間は止まります。',
      en: 'A slideshow that cycles through items. Auto-advance pauses while you hover or use the keyboard.',
    },
  },
  Cascader: {
    summary: {
      ja: '都道府県→市区町村のような階層を、列を横に並べて選ぶ部品。選ぶと次の列に下の階層が現れ、いちばん下まで進むと値が決まります。',
      en: 'A picker that shows nested levels, such as prefecture then city, as side-by-side columns. Choosing an option opens its children in the next column, and the value is the path you land on.',
    },
  },
  Checkbox: {
    summary: {
      ja: 'オンとオフを切り替える、ラベル付きのチェックボックス。',
      en: 'A labeled checkbox that toggles on and off.',
    },
  },
  Chip: {
    summary: {
      ja: 'キーワードや絞り込み条件などを表す小さなタグ。clickable で押して選べるようにしたり、onRemove で削除ボタンを付けたりできます。',
      en: 'A compact tag for a keyword or filter. Make it selectable with clickable, or add a remove button with onRemove.',
    },
  },
  CloseButton: {
    summary: {
      ja: '×印の閉じるボタン。読み上げ用のラベルを持たせています。',
      en: 'A close button marked with ×. It carries a label for screen readers.',
    },
  },
  ColorPicker: {
    summary: {
      ja: '色見本を並べて色を選ぶ部品。見本を押して選べて、必要ならブラウザ標準の色選びの画面も添えられます。',
      en: 'A grid of swatches for choosing a color. Click a swatch to pick it, and add the browser’s native color input when you need it.',
    },
  },
  Combobox: {
    summary: {
      ja: '入力しながら候補を絞り込めるテキスト欄。上下キーで候補を選び、Enter で決定します。',
      en: 'A text field that filters a list as you type. Up and Down move through matches; Enter confirms.',
    },
  },
  CommandPalette: {
    summary: {
      ja: '⌘K で開く、検索付きのコマンド一覧。入力で絞り込み、上下キーで移動して、Enter で実行します。',
      en: 'A searchable command list that opens with ⌘K. Type to filter, move with Up and Down, and run with Enter.',
    },
  },
  Container: {
    summary: {
      ja: 'ページの中身を中央に寄せ、最大幅をそろえるレイアウト。',
      en: 'A layout that centers page content and caps its width.',
    },
  },
  CopyButton: {
    summary: {
      ja: '押すと value の文字列をクリップボードにコピーし、チェックマークで成功を知らせるボタン。アイコンだけでも、label を添えて文字付きでも使えます。コピーが済むと、読み上げソフトにも「コピーしました」と伝わります。',
      en: 'A button that copies value to the clipboard and confirms with a checkmark. Use it icon-only or with a label. Once it copies, screen readers hear "Copied".',
    },
  },
  DatePicker: {
    summary: {
      ja: 'カレンダーから日付を選ぶ入力欄。日付を直接打ち込めるテキスト欄と、キーボードで動かせるカレンダーを組み合わせています。',
      en: 'A field for picking a date from a calendar. It pairs a text field you can type into with a calendar you can move through by keyboard.',
    },
  },
  DateRangePicker: {
    summary: {
      ja: '開始日と終了日を、連動する 2 つの DatePicker で選ぶ部品。互いの選べる範囲を制限し合います。',
      en: 'Two linked DatePickers for a start and end date. Each one limits the other’s range.',
    },
  },
  Divider: {
    summary: {
      ja: '区切り線。横向きが既定で、縦線やラベル付きにもできます。',
      en: 'A separator line. It runs horizontal by default and can turn vertical or carry a label.',
    },
  },
  Drawer: {
    summary: {
      ja: '画面の端から現れるパネル。種類は 3 つ。temporary（既定）は背景を覆って前面に開き、開いている間はキーボードの操作対象をパネルの中だけに収めます（Modal と同じ作りです）。persistent はページの中身と一緒に並び、開閉に合わせて隣の中身を左右に押し広げます。permanent は常に開いたままで、デスクトップのサイドバーなどに向いています。広い画面では permanent、狭い画面では temporary に切り替える使い方がよくあります。',
      en: 'A panel against a screen edge, in three variants. temporary (the default) opens over a backdrop and traps keyboard focus inside, like a Modal. persistent sits beside the page and pushes content aside as it opens. permanent stays open, like a desktop sidebar. Many layouts use permanent on wide screens and temporary on narrow ones.',
    },
  },
  Dropdown: {
    summary: {
      ja: 'トリガーのボタンに紐づくメニュー。トリガーのいらない単体のメニューには Menu を使ってください。',
      en: 'A menu tied to a trigger button. For a standalone menu with no trigger, use Menu.',
    },
  },
  EmptyState: {
    summary: {
      ja: '一覧が空のとき、検索結果がないとき、エラーのときに置く案内。アイコン・見出し・説明・操作を中央にまとめて並べます。',
      en: 'A placeholder for an empty list, no search results, or an error. It centers an icon, heading, text, and an action.',
    },
  },
  FileUpload: {
    summary: {
      ja: 'ファイルをドラッグ＆ドロップで受け取り、選んだファイルの一覧も見せるアップロード欄。受け取り欄はキーボードからも開けます。',
      en: 'A drop zone that takes files by drag and drop, with a list of the ones you picked. You can open the zone from the keyboard too.',
    },
  },
  FloatingLabel: {
    summary: {
      ja: '入力欄を選んだり文字を打ち込んだりすると、ラベルがすっと上に移動する仕掛け。Input・Select・Textarea を 1 つ包んで使います。',
      en: 'A label that slides up when you focus or type in the field. Wrap one Input, Select, or Textarea with it.',
    },
  },
  Footer: {
    summary: {
      ja: 'ページ下部の領域（contentinfo ランドマーク）。Navbar と対になる footer 要素で、横並びの行を自由に組み立てられます。中身は中央にそろい、リンクや著作権表示、複数の列などを置けます。',
      en: 'The page’s contentinfo landmark. It pairs with Navbar as a centered row you compose from links, legal text, and columns.',
    },
  },
  FormField: {
    summary: {
      ja: 'ラベル・補助の説明文・エラー文を、入力欄とひとまとめにする部品。読み上げソフトがどの欄の説明かを正しく読み取れるよう、内部のひも付けも自動で行います。',
      en: 'A wrapper that ties a label, help text, and error to a field. It wires up the links so screen readers read the right description.',
    },
  },
  Grid: {
    summary: {
      ja: '行と列でレイアウトを組むグリッド。',
      en: 'A two-dimensional layout of rows and columns.',
    },
  },
  Icon: {
    summary: {
      ja: '手持ちのアイコン画像（SVG など）のサイズと色を整えて表示する入れ物。Lily 自体にアイコンは入っていません。',
      en: 'A wrapper that sizes and colors your own icon art, such as an SVG. Lily ships no icons of its own.',
    },
  },
  Image: {
    summary: {
      ja: '画像の表示をまとめて受け持つ部品。表示位置に来てから読み込む遅延読み込み、ふわっと現れるフェードイン、縦横比の固定、読み込みに失敗したときの代替表示に対応します。',
      en: 'A wrapper around an image. It handles lazy loading, a fade-in, a fixed aspect ratio, and a fallback when loading fails.',
    },
  },
  Input: {
    summary: {
      ja: '1 行のテキスト入力欄。FormField の中で使うと、ラベルや説明との結び付けを自動で受け取ります。',
      en: 'A single-line text field. Inside a FormField, it picks up the label and description links on its own.',
    },
  },
  InputGroup: {
    summary: {
      ja: '入力欄の前後に、単位や記号、ボタンなどを添えられる部品。',
      en: 'A field with units, symbols, or buttons attached before or after it.',
    },
  },
  Kbd: {
    summary: {
      ja: '文章の中でキーやショートカットを示す表記。',
      en: 'Markup for a key or shortcut shown inline in text.',
    },
  },
  Link: {
    summary: {
      ja: 'リンク。背景との差をしっかり取った文字色を使い、キーボードで選んだときの囲み枠もはっきり見えます。',
      en: 'A link. It uses a high-contrast text color and keeps a clear focus ring when you tab to it.',
    },
  },
  ListGroup: {
    summary: {
      ja: '項目を縦に並べる一覧。ListGroup.Item を組み合わせて作ります。',
      en: 'A vertical list of items. Build it from ListGroup.Item.',
    },
  },
  Menu: {
    summary: {
      ja: '操作の一覧を出すメニュー。開くボタンは持たず、単体で使います。矢印キーで項目を移動できます。',
      en: 'A standalone menu of actions, with no trigger button. Arrow keys move between items.',
    },
  },
  Meter: {
    summary: {
      ja: '決まった範囲の中で、今どのくらいの量かを表すメーター。使用率やスコアなどに使います。作業の進み具合を示す Progress とは用途が異なります。',
      en: 'A gauge for an amount within a fixed range, such as usage or a score. It serves a different purpose from Progress, which tracks how far a task has run.',
    },
  },
  Modal: {
    summary: {
      ja: '背景の上に重ねて開く小窓（ダイアログ）。開いている間はキーボードの操作対象が小窓の中だけに収まり、迷わず使えます。',
      en: 'A dialog that opens over a backdrop. While open, it keeps keyboard focus inside so you stay oriented.',
    },
  },
  Navbar: {
    summary: {
      ja: 'ページ上部のナビゲーションバー。狭い画面では開閉ボタンの中に畳まれます。読み上げソフトにもナビゲーションとして正しく伝わります。',
      en: 'The navigation bar at the top of the page. On narrow screens it folds into a toggle, and screen readers read it as navigation.',
    },
  },
  NumberInput: {
    summary: {
      ja: '数値を入力する欄に、増減ボタンを付けた部品。上下キーでの増減もそのまま使えます。',
      en: 'A number field with step buttons. Up and Down keys change the value too.',
    },
  },
  Offcanvas: {
    summary: {
      ja: '画面の端からスライドして出てくるパネル。キーボード操作や読み上げへの対応は Modal と同じ作りです。',
      en: 'A panel that slides in from a screen edge. Its keyboard and screen-reader handling matches Modal.',
    },
  },
  Pagination: {
    summary: {
      ja: 'ページ送り。現在のページがどこかを示し、最初や最後のページでは送りの矢印を押せなくします。読み上げソフトにも今のページが伝わります。',
      en: 'Page navigation. It marks the current page and disables the arrows on the first and last page. Screen readers announce the current page.',
    },
  },
  PinInput: {
    summary: {
      ja: 'コードやワンタイムパスワードを 1 文字ずつ入れる欄。入力すると自動で次の欄へ進みます。',
      en: 'A field for entering a code or one-time password, one character per box. Typing moves to the next box.',
    },
  },
  Popover: {
    summary: {
      ja: 'クリックで開く吹き出し型のパネル。タイトルと自由な中身を置けて、Escape キーや外側のクリックで閉じます。背景の操作はふさぎません。',
      en: 'A bubble panel that opens on click. It holds a title and any content, and closes on Escape or an outside click without blocking the page.',
    },
  },
  Presence: {
    summary: {
      ja: '中身を 1 つ、アニメーション付きで出し入れする仕組み。消えるときのアニメーションが終わるまで、中身を画面に残します。',
      en: 'A wrapper that animates one child in and out. It keeps the child on screen until the exit animation finishes.',
    },
  },
  Progress: {
    summary: {
      ja: '作業の進み具合を示す進捗バー。今どこまで進んだかが、読み上げソフトにも数値で正しく伝わります。',
      en: 'A progress bar for how far a task has run. Screen readers announce the value as it changes.',
    },
  },
  Radio: {
    summary: {
      ja: 'ラジオグループの選択肢の 1 つ。name を共有してグループにまとめます。',
      en: 'One option in a radio group. Options share a name to form the group.',
    },
  },
  Range: {
    summary: {
      ja: 'つまみを動かして値を選ぶスライダー。FormField の中で使うと、ラベルとの結び付けを自動で受け取ります。',
      en: 'A slider you drag to pick a value. Inside a FormField, it picks up the label link on its own.',
    },
  },
  RangeDual: {
    summary: {
      ja: '価格帯などの範囲を、下限と上限の 2 つのつまみで選ぶスライダー。',
      en: 'A slider with two thumbs for a range, such as a price band.',
    },
  },
  Rating: {
    summary: {
      ja: '星で評価を付ける部品。標準では操作でき、矢印キーで星の数を増減できます。readOnly にすると評価の表示だけになります。',
      en: 'A star rating. By default you set it with arrow keys; readOnly turns it into a display.',
    },
  },
  Ratio: {
    summary: {
      ja: 'iframe・動画・画像などの埋め込みの縦横比を保つ部品。',
      en: 'A box that holds the aspect ratio of an embed, such as an iframe, video, or image.',
    },
  },
  ScrollArea: {
    summary: {
      ja: '細いスクロールバーを備えたスクロール領域。ブラウザが違っても見た目をそろえます。',
      en: 'A scroll region with a slim scrollbar that looks the same across browsers.',
    },
  },
  SegmentedControl: {
    summary: {
      ja: '横に並んだ選択肢からひとつだけ選ぶ、トグル式の切り替え。矢印キーで選択肢を移動できます。',
      en: 'A toggle that picks one option from a row. Arrow keys move between options.',
    },
  },
  Select: {
    summary: {
      ja: 'ブラウザ標準のプルダウン選択。選択肢が決まっているときに向きます。入力で絞り込みたいときは Combobox を使ってください。',
      en: 'A native dropdown select. Use it when the options are fixed; for type-to-filter, use Combobox.',
    },
  },
  Skeleton: {
    summary: {
      ja: '読み込み中に、中身が入る場所をぼんやり示す仮表示。文字・丸・四角の形を、淡く光るアニメーションで描きます。',
      en: 'A placeholder that hints where content will load. It draws text, circle, and box shapes with a soft shimmer.',
    },
  },
  Spinner: {
    summary: {
      ja: '読み込み中を示す、くるくる回るスピナー。色は周りの文字色を引き継ぎます。読み込み中であることが読み上げソフトにも伝わります。',
      en: 'A spinner for a loading state. It takes the surrounding text color, and screen readers hear that loading is underway.',
    },
  },
  Splitter: {
    summary: {
      ja: 'ドラッグできる仕切りで区切った、大きさを変えられる 2 つの区画。仕切りはキーボードでも動かせます。',
      en: 'Two resizable panes split by a draggable handle. The handle moves by keyboard too.',
    },
  },
  Stack: {
    summary: {
      ja: '一定の間隔で要素を並べる 1 次元のレイアウト。',
      en: 'A one-dimensional layout that spaces items by a set gap.',
    },
  },
  Stat: {
    summary: {
      ja: 'ラベル・値・増減をまとめた指標のタイル。増減は矢印と状態色で示します。',
      en: 'A tile for a metric: its label, value, and change. An arrow and a status color show the change.',
    },
  },
  Stepper: {
    summary: {
      ja: '入力ウィザードや購入手続きなど、複数の手順の進み具合を示す部品。今どの手順にいるかが、読み上げソフトにも伝わります。',
      en: 'A tracker for steps in a flow, such as a form wizard or checkout. Screen readers hear which step you are on.',
    },
  },
  Switch: {
    summary: {
      ja: 'スライドしてオン・オフを切り替えるスイッチ。キーボードでも操作でき、状態は読み上げソフトにも正しく伝わります。',
      en: 'A switch you slide on and off. It works by keyboard, and screen readers announce its state.',
    },
  },
  Table: {
    summary: {
      ja: 'データを行と列で並べる表。見出し行や表のタイトルを正しく持たせ、読み上げソフトでもたどりやすく作っています。',
      en: 'A table of data in rows and columns. It carries proper header rows and a caption so screen readers can follow it.',
    },
  },
  Tabs: {
    summary: {
      ja: '表示を切り替えるタブ。矢印キーでタブ間を移動でき、Home / End キーで端のタブへ一気に飛べます。',
      en: 'Tabs that switch the view. Arrow keys move between tabs; Home and End jump to the ends.',
    },
  },
  TagInput: {
    summary: {
      ja: 'メールアドレスやキーワードを、タグとして複数まとめて入力できる欄。Enter か区切り文字で追加し、空欄で Backspace を押すと直前のタグを消します。',
      en: 'A field for entering several tags, such as emails or keywords. Enter or a separator adds one; Backspace in an empty field removes the last.',
    },
  },
  Textarea: {
    summary: {
      ja: '複数行のテキスト入力欄。FormField の中で使うと、ラベルや説明との結び付けを自動で受け取ります。',
      en: 'A multi-line text field. Inside a FormField, it picks up the label and description links on its own.',
    },
  },
  Timeline: {
    summary: {
      ja: '履歴や活動を縦に並べる一覧。各項目は状態ドット・タイトル・時刻・説明を持てます。',
      en: 'A vertical list of history or activity. Each item can hold a status dot, title, time, and description.',
    },
  },
  TimePicker: {
    summary: {
      ja: '時と分を選んで時刻を入れる入力欄。必要なら午前・午後の切り替えも加えられます。',
      en: 'A field for entering a time by hour and minute. Add an AM/PM toggle when you need one.',
    },
  },
  Toast: {
    summary: {
      ja: '画面の隅にさっと出る通知。既定では自動で消えません。',
      en: 'A brief notification in a corner of the screen. It stays until you dismiss it; nothing auto-dismisses by default.',
    },
  },
  Tooltip: {
    summary: {
      ja: 'カーソルを重ねたりキーボードで選んだりすると出る、小さな補足ラベル。どの要素の説明かは読み上げソフトにも伝わります。',
      en: 'A small label that appears on hover or focus. Screen readers tie it to the element it describes.',
    },
  },
  Transfer: {
    summary: {
      ja: '2 つのリストの間で項目を移す部品。各行はラベル付きのチェックボックスになっています。',
      en: 'Two lists you move items between. Each row is a labeled checkbox.',
    },
  },
  Tree: {
    summary: {
      ja: 'フォルダのように階層をたどれるツリー表示。枝の開閉や、矢印キーでの移動ができます。',
      en: 'A tree you expand like folders. Branches open and close, and arrow keys move through them.',
    },
  },
  Typography: {
    summary: {
      ja: '見出しや本文のテキストスタイル。',
      en: 'Heading and body text styles.',
    },
  },

  // --- Date & time, a11y, overlays, data display, utilities ---
  DateTimePicker: {
    summary: {
      ja: '月カレンダーと時・分の選択を組み合わせて Temporal.PlainDateTime を選ぶ日時ピッカー。キーボードだけで操作でき、矢印キーで日を移動し、Enter で確定、Escape で閉じます。',
      en: 'A date-and-time picker that pairs a month calendar with hour and minute steppers to choose a Temporal.PlainDateTime. It works from the keyboard and clamps the result to any min and max bounds.',
    },
  },
  MonthPicker: {
    summary: {
      ja: '12 か月のグリッドから Temporal.PlainYearMonth を選ぶ月ピッカー。前年・翌年に移動でき、矢印キーで月を動かし、Enter で確定、Escape で閉じます。',
      en: 'A month picker that chooses a Temporal.PlainYearMonth from a twelve-month grid. Arrow keys move the focus, Enter selects, and the prev and next buttons step the year.',
    },
  },
  TimeZoneSelect: {
    summary: {
      ja: 'IANA タイムゾーンを選ぶセレクト。候補は Intl.supportedValuesOf から作り、使えない環境では少数の固定リストに切り替えます。値は Temporal が扱う ID 文字列です。',
      en: 'A select for IANA time zones. The options come from Intl.supportedValuesOf with a small static fallback, and the value is the id string that Temporal consumes.',
    },
  },
  RelativeTime: {
    summary: {
      ja: '経過した時間や先の時刻を「3分前」「2時間後」のように表す time 要素。Intl.RelativeTimeFormat と Temporal で組み立て、live を指定するとタイマーで自動更新します。',
      en: 'A time element that states a value as relative text such as "3 minutes ago". It builds the text from Intl.RelativeTimeFormat and Temporal, and the live prop refreshes it on a timer.',
    },
  },
  Countdown: {
    summary: {
      ja: '指定した日時までの残り時間を日・時・分・秒で示すタイマー。毎秒更新してゼロで止まり、onComplete で到達を知らせます。各セグメントにラベルを付け、色だけに頼りません。',
      en: 'A timer that counts down to a target in day, hour, minute, and second segments. It ticks each second, stops at zero, and fires onComplete. Each segment carries a label so meaning never rests on color.',
    },
  },
  DurationInput: {
    summary: {
      ja: 'Temporal.Duration を値に持つ時間入力。時・分（必要なら秒）の数値フィールドとステッパーで構成し、フォームにそのまま組み込めます。',
      en: 'A duration input backed by Temporal.Duration. It uses number fields with steppers for hours and minutes, plus an optional seconds field, and drops into a form as is.',
    },
  },
  VisuallyHidden: {
    summary: {
      ja: '見た目には隠しつつ、スクリーンリーダーには読み上げさせる要素。focusable を指定するとキーボードフォーカス時に現れるので、スキップリンクに使えます。',
      en: 'An element that hides content visually while keeping it in the accessibility tree. The focusable variant appears on focus, which suits a skip link.',
    },
  },
  AlertDialog: {
    summary: {
      ja: '取り消せない操作を確認するためのダイアログ。role="alertdialog" を持ち、背景クリックでは閉じません。確認かキャンセルの操作が必要で、Escape で閉じます。',
      en: 'A confirmation dialog for actions you cannot undo. It carries role="alertdialog", keeps focus inside, and stays open on a backdrop click so the user picks confirm or cancel. Escape closes it.',
    },
  },
  Toolbar: {
    summary: {
      ja: 'ボタンや操作をひとまとめにするツールバー。role="toolbar" を持ち、Tab では1か所に止まり、矢印キーで項目間を移動します。横と縦の向きに対応します。',
      en: 'A toolbar that groups buttons into a single Tab stop. Arrow keys move between items, Home and End jump to the ends, and it supports a horizontal or vertical orientation.',
    },
  },
  Fieldset: {
    summary: {
      ja: '関連するフォーム部品をまとめるグループ。ネイティブの fieldset と legend を使うので、disabled を指定すれば中の部品をまとめて無効化できます。説明文も添えられます。',
      en: 'A group for related form controls built on a native fieldset and legend. The disabled prop turns off every control inside, and an optional description sits under the legend.',
    },
  },
  HoverCard: {
    summary: {
      ja: 'トリガーにカーソルを重ねるかフォーカスすると開くカード。補足情報を表示し、開くまで少し待ちます。フォーカスが外れるか Escape で閉じ、キーボードでも開けます。',
      en: 'A card that opens when its trigger is hovered or focused. It shows supplementary content after a short delay and closes on blur or Escape, so the keyboard reaches it too.',
    },
  },
  ContextMenu: {
    summary: {
      ja: '右クリックやキーボード（Shift+F10、メニューキー）でポインター位置に開くメニュー。矢印キーで項目を移動し、Enter で実行、Escape で閉じます。',
      en: 'A menu that opens at the pointer on right-click, and from the keyboard with Shift+F10 or the menu key. Arrow keys move between items, Enter activates, and Escape closes it.',
    },
  },
  Descriptions: {
    summary: {
      ja: 'キーと値を並べる定義リスト。dl をもとに横・縦のレイアウトと罫線付きの表示を選べます。Descriptions の中に DescriptionsItem を並べて使います。',
      en: 'A key-and-value definition list rendered as a dl. Compose Descriptions with DescriptionsItem children, and choose one to three columns, a horizontal or vertical layout, and a bordered grid.',
    },
  },
  Result: {
    summary: {
      ja: '処理の結果を伝えるブロック。成功・エラー・警告など7種の状態に対応し、アイコンと文言で意味を示すので色だけに頼りません。続けて操作ボタンも置けます。',
      en: 'A block that reports the outcome of an operation. It covers seven states such as success, error, and 404, each with an icon and text so meaning stays clear without color, and it holds follow-up actions.',
    },
  },
  FloatButton: {
    summary: {
      ja: '画面の四隅に固定するフローティングボタン。FloatButtonGroup はスピードダイアル形式で複数のボタンをまとめ、トリガーの操作や Escape で開閉できます。',
      en: 'A floating action button pinned to a corner of the screen. FloatButtonGroup stacks several buttons as a speed dial that the trigger opens and Escape closes, with full keyboard support.',
    },
  },
  CodeBlock: {
    summary: {
      ja: '複数行のコードを表示するブロック。言語ラベルとワンクリックのコピー、行番号の表示に対応します。インラインのコードには Code を使います。',
      en: 'A block for multi-line code. It shows a language label, a one-click copy button, and optional line numbers. For inline code, reach for the Code component.',
    },
  },
  Mark: {
    summary: {
      ja: 'テキストの一部をセマンティックカラーで強調する mark 要素。色は装飾で、意味は文言で伝えます。warning・success・info・danger・primary の5種から選べます。',
      en: 'A mark element that highlights a run of text with a semantic color. The tint stays decorative and the words carry the meaning. It offers warning, success, info, danger, and primary.',
    },
  },
  TreeSelect: {
    summary: {
      ja: 'ツリー構造からノードを選ぶセレクト。トリガーを押すとパネルが開き、矢印キーで移動し、Enter で選び、Escape で閉じます。',
      en: 'A select that opens a tree panel to pick a node from a hierarchy. Arrow keys move through the tree, Enter selects, and Escape closes the panel.',
    },
  },
  Watermark: {
    summary: {
      ja: '文字や画像を低い不透明度でタイル状に重ねる透かし。重ねた層は pointer-events なしで aria-hidden なので、下の中身の操作や読み上げを邪魔しません。',
      en: 'A watermark that tiles translucent text or an image across its children. The overlay sits behind pointer events and hides from assistive tech, so the content underneath stays usable.',
    },
  },
  ThemeProvider: {
    summary: {
      ja: 'ライト・ダーク・OS 連動の表示モードを管理する部品。選んだモードを <html> の data-theme 属性に反映し、localStorage に保存して次回の表示にも引き継ぎます。アプリ全体のテーマ色の上書きもここで指定します。React と Vue 向けで、Web Components では属性と CSS 変数を直接使います。',
      en: 'Manages the display mode: light, dark, or following the OS. The choice lands on the data-theme attribute of <html> and persists to localStorage. App-wide theme color overrides are also set here. For React and Vue; with Web Components you use the attribute and CSS variables directly.',
    },
  },
  MotionProvider: {
    summary: {
      ja: '画面の動きの量（フル・控えめ・なし・自動）を管理する部品。決まった段階を <html> の data-motion 属性に反映し、OS の「視差効果を減らす」設定にも自動で従います。',
      en: 'Manages how much motion plays: full, minimal, none, or auto. The resolved tier lands on the data-motion attribute of <html>, and OS reduced-motion settings are honored automatically.',
    },
  },
  ThemeOverride: {
    summary: {
      ja: '囲んだ範囲だけ、テーマの色を好みの色に置き換える部品。一部のトークンだけ、ダークモードだけ、という変え方もでき、文字と背景のコントラストが 7:1 を下回る組み合わせは開発中に警告されます。アプリ全体を変えるときは ThemeProvider に同じ指定をします。',
      en: 'Swaps theme colors for personal picks inside the wrapped subtree. Override only some tokens, or only one scheme such as dark mode. Pairs that fall below the 7:1 AAA contrast floor are flagged during development. To re-color the whole app, pass the same overrides to ThemeProvider.',
    },
  },
};
