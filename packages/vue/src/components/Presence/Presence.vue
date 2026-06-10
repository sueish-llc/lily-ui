<script lang="ts">
import { defineComponent, cloneVNode, toRef, type PropType, type VNode } from 'vue';
import { usePresence } from '../../composables/presence';
import type { AnimationName } from '../../composables/animations';

/**
 * Presence — animate a single slotted element in and out of the DOM using the
 * animation catalog. Keeps it mounted through the exit animation, then removes
 * it. Honors the motion tier. The Vue mirror of the React `<Presence>`.
 *
 * @example
 * ```vue
 * <Presence :present="open" enter="zoom-in" exit="zoom-out">
 *   <div class="card">…</div>
 * </Presence>
 * ```
 */
export default defineComponent({
  name: 'LilyPresence',
  props: {
    /** Whether the child should be shown. Exit plays when it goes false. */
    present: { type: Boolean, required: true },
    /** Entrance animation (catalog name). */
    enter: { type: String as PropType<AnimationName>, default: 'fade-in' },
    /** Exit animation (catalog name). */
    exit: { type: String as PropType<AnimationName>, default: 'fade-out' },
  },
  setup(props, { slots }) {
    const present = toRef(props, 'present');
    const { isPresent, state, node } = usePresence(present);

    return () => {
      if (!isPresent.value) return null;
      const children = slots.default?.();
      const vnode = children?.[0];
      if (!vnode) return null;
      // While leaving, present is already false → play the exit animation.
      const name = props.present ? props.enter : props.exit;
      return cloneVNode(vnode as VNode, {
        class: ['lily-animate', `lily-animate--${name}`],
        'data-state': state.value,
        ref: node,
      });
    };
  },
});
</script>
