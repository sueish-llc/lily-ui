import { LilyElement, h, type BuildResult } from '../base/LilyElement';

/**
 * `<lily-table>` — accessible data table.
 *
 * Compose with native `<thead>/<tbody>/<tr>/<th>/<td>`. Provide a `caption`
 * attribute (or `<th scope>` headers) so the table is understandable to screen
 * readers. When `responsive` is set, the root element is a scrollable
 * `div.lily-table-responsive` wrapper and the `<table>` is slotted inside it.
 *
 * Attributes: `striped`, `hover`, `bordered`, `size` (`sm` | `md`),
 * `responsive`, `caption`.
 *
 * @example
 * ```html
 * <lily-table striped hover caption="Users">
 *   <thead><tr><th scope="col">Name</th></tr></thead>
 *   <tbody><tr><td>Ada</td></tr></tbody>
 * </lily-table>
 * ```
 */
export class LilyTable extends LilyElement {
  static get observedAttributes(): string[] {
    return ['striped', 'hover', 'bordered', 'size', 'responsive', 'caption'];
  }

  protected build(): BuildResult {
    const size = this.attr('size', 'md');
    const caption = this.attr('caption');
    const responsive = this.boolAttr('responsive');

    const table = h('table', {
      class: [
        'lily-table',
        this.boolAttr('striped') && 'lily-table--striped',
        this.boolAttr('hover') && 'lily-table--hover',
        this.boolAttr('bordered') && 'lily-table--bordered',
        size === 'sm' && 'lily-table--sm',
      ],
    });

    if (caption) {
      table.appendChild(h('caption', { text: caption }));
    }

    if (responsive) {
      const wrapper = h('div', { class: 'lily-table-responsive' });
      wrapper.appendChild(table);
      return { root: wrapper, slot: table };
    }

    return { root: table };
  }
}
