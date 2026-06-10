import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import { fireEvent, render, screen } from '@testing-library/vue';
import ToastProvider from './ToastProvider.vue';
import ToastItem from './ToastItem.vue';
import { useToast } from '../../composables/toast';

describe('Toast auto-dismiss', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('emits dismiss exactly once, after `duration` has elapsed', () => {
    const { emitted } = render(ToastItem, {
      props: { entry: { id: 1, message: 'Saved', status: 'primary', duration: 1000 } },
    });

    vi.advanceTimersByTime(999);
    expect(emitted('dismiss') ?? []).toHaveLength(0);

    vi.advanceTimersByTime(1);
    expect(emitted('dismiss')).toHaveLength(1);

    // The timer must not re-fire.
    vi.advanceTimersByTime(10_000);
    expect(emitted('dismiss')).toHaveLength(1);
  });

  it('removes the toast from the live region after `duration`', async () => {
    const Trigger = defineComponent({
      setup() {
        const { toast } = useToast();
        return () =>
          h(
            'button',
            { type: 'button', onClick: () => toast({ message: '保存しました', duration: 500 }) },
            'show',
          );
      },
    });

    render(ToastProvider, { slots: { default: () => h(Trigger) } });
    await fireEvent.click(screen.getByRole('button', { name: 'show' }));
    expect(screen.getByText('保存しました')).toBeInTheDocument();

    vi.advanceTimersByTime(500);
    await nextTick();
    expect(screen.queryByText('保存しました')).toBeNull();
  });
});
