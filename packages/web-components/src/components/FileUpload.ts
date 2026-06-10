import { LilyElement, h, type BuildResult } from '../base/LilyElement';

/** Human-readable byte size. */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

/**
 * `<lily-file-upload>` — a drag-and-drop dropzone with a selected-file list.
 * Dispatches a `change` event whose `detail` is the current `File[]`.
 *
 * Attributes: `accept`, `multiple`, `disabled`, `label`, `hint`, `input-label`,
 * `id`, `name`, `remove-label`.
 */
export class LilyFileUpload extends LilyElement {
  private files: File[] = [];

  static get observedAttributes(): string[] {
    return ['accept', 'multiple', 'disabled', 'label', 'hint', 'input-label', 'id', 'name', 'remove-label'];
  }

  private update_(incoming: File[]): void {
    const multiple = this.boolAttr('multiple');
    this.files = multiple ? [...this.files, ...incoming] : incoming.slice(0, 1);
    this.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: [...this.files] }));
    this.rerender();
  }

  protected build(): BuildResult {
    const disabled = this.boolAttr('disabled');
    const hint = this.attr('hint');
    const id = this.attr('id');
    const hintId = hint && id ? `${id}-hint` : null;
    const removeLabel = (n: string) => `${this.attr('remove-label', 'Remove')!} ${n}`;

    const root = h('div', { class: 'lily-file-upload' });

    const dropzone = h('button', {
      class: 'lily-file-upload__dropzone',
      attrs: { type: 'button', disabled: disabled ? '' : null, 'aria-describedby': hintId },
    });
    dropzone.appendChild(h('span', { text: this.attr('label', 'ファイルをドラッグ、またはクリックして選択')! }));
    if (hint) dropzone.appendChild(h('span', { class: 'lily-file-upload__hint', attrs: { id: hintId }, text: hint }));

    const input = h('input', {
      class: 'lily-file-upload__input',
      attrs: {
        type: 'file',
        id: id ?? null,
        name: this.attr('name') ?? null,
        accept: this.attr('accept') ?? null,
        multiple: this.boolAttr('multiple') ? '' : null,
        disabled: disabled ? '' : null,
        tabindex: -1,
        'aria-label': this.attr('input-label', 'ファイルを選択')!,
      },
    }) as HTMLInputElement;

    dropzone.addEventListener('click', () => input.click());
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (!disabled) dropzone.classList.add('lily-file-upload__dropzone--dragging');
    });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('lily-file-upload__dropzone--dragging'));
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('lily-file-upload__dropzone--dragging');
      if (!disabled) this.update_(Array.from((e as DragEvent).dataTransfer?.files ?? []));
    });
    input.addEventListener('change', () => this.update_(Array.from(input.files ?? [])));

    root.append(dropzone, input);

    if (this.files.length > 0) {
      const list = h('ul', { class: 'lily-file-upload__list' });
      this.files.forEach((file, i) => {
        const item = h('li', { class: 'lily-file-upload__item' });
        item.appendChild(h('span', { text: file.name }));
        item.appendChild(h('span', { class: 'lily-file-upload__size', text: formatBytes(file.size) }));
        const rm = h('button', {
          class: 'lily-chip__remove',
          attrs: { type: 'button', 'aria-label': removeLabel(file.name) },
        });
        rm.appendChild(h('span', { attrs: { 'aria-hidden': 'true' }, text: '×' }));
        rm.addEventListener('click', () => {
          this.files = this.files.filter((_, idx) => idx !== i);
          this.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: [...this.files] }));
          this.rerender();
        });
        item.appendChild(rm);
        list.appendChild(item);
      });
      root.appendChild(list);
    }

    return { root, slot: null };
  }
}
