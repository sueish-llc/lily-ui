import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/vue';
import Button from './Button.vue';

describe('Button', () => {
  it('renders the documented class scheme for the defaults (solid / primary / md)', () => {
    render(Button, { slots: { default: 'Save' } });
    const btn = screen.getByRole('button', { name: 'Save' });
    // Markup must match the React source of truth: `variant` and `size` are
    // class modifiers; `status` is conveyed via the `data-status` attribute
    // (which the @lily-ui/css layer styles).
    expect(btn.className).toBe('lily-button lily-button--solid lily-button--md');
    expect(btn).toHaveAttribute('data-status', 'primary');
    expect(btn).toHaveAttribute('type', 'button');
  });
});
