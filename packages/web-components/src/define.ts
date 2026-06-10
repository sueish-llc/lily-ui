/**
 * Side-effecting entry: registers every Lily custom element on import.
 *
 * @example
 * ```ts
 * import '@lily-ui/css/styles';
 * import '@lily-ui/web-components/define';
 * // <lily-button>…</lily-button> now works anywhere in the document.
 * ```
 */
import { defineLilyElements } from './elements';

defineLilyElements();
