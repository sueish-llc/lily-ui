<script setup lang="ts">
import { computed } from 'vue';
import { cx } from '../../utils/cx';
import CopyButton from '../CopyButton/CopyButton.vue';

/**
 * CodeBlock — a multi-line, block-level code display with optional language
 * label and one-click copy. Renders `<pre><code>` with monospace tokens.
 *
 * For inline code, use the existing `Code` component.
 *
 * @example
 * ```vue
 * <CodeBlock language="tsx" show-line-numbers>{{ source }}</CodeBlock>
 * ```
 */
const props = withDefaults(
  defineProps<{
    /** The code string to display. */
    code?: string;
    /** Language label shown in the header (e.g. `'tsx'`, `'bash'`). */
    language?: string;
    /** Prepend 1-based line numbers. */
    showLineNumbers?: boolean;
    /** Show a copy button in the header. */
    copyable?: boolean;
    /** Accessible label for the copy button. */
    copyLabel?: string;
    /** Label shown after a successful copy. */
    copiedLabel?: string;
  }>(),
  { showLineNumbers: false, copyable: true, copyLabel: 'Copy', copiedLabel: 'Copied' },
);

const CLASS = 'lily-code-block';

const hasHeader = computed(() => !!(props.language || props.copyable));
const lines = computed(() => (props.code ?? '').split('\n'));
</script>

<template>
  <div :class="cx(CLASS)">
    <div v-if="hasHeader" :class="`${CLASS}__header`">
      <span v-if="language" :class="`${CLASS}__language`" aria-hidden="true">{{ language }}</span>
      <CopyButton
        v-if="copyable"
        :value="code ?? ''"
        size="sm"
        :copy-label="copyLabel"
        :copied-label="copiedLabel"
        :class="`${CLASS}__copy`"
      />
    </div>
    <!-- eslint-disable-next-line vue/html-indent -->
    <pre :class="cx(`${CLASS}__pre`, showLineNumbers && `${CLASS}__pre--numbered`)" tabindex="0"><code :class="`${CLASS}__code`"><template v-if="showLineNumbers"><span v-for="(line, i) in lines" :key="i" :class="`${CLASS}__line`"><span :class="`${CLASS}__line-number`" aria-hidden="true">{{ i + 1 }}</span><span :class="`${CLASS}__line-content`">{{ line }}</span></span></template><template v-else>{{ code }}</template></code></pre>
  </div>
</template>
