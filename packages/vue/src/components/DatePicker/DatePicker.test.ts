import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/vue';
import DatePicker from './DatePicker.vue';

describe('DatePicker', () => {
  it('ignores unparseable min/max bounds and still renders', () => {
    render(DatePicker, { props: { min: 'not-a-date', max: 'also-not-a-date' } });
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Choose date' })).toBeInTheDocument();
  });
});
