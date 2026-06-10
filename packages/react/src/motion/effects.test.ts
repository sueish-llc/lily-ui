import { describe, it, expect } from 'vitest';
import {
  AMBIENT_EFFECTS,
  BACKGROUND_EFFECTS,
  EFFECT_NAMES,
  HOVER_EFFECTS,
  TEXT_EFFECTS,
  effectClass,
} from './effects';

describe('effect catalog', () => {
  it('has no duplicates', () => {
    expect(new Set(EFFECT_NAMES).size).toBe(EFFECT_NAMES.length);
  });

  it('is partitioned cleanly into the four groups', () => {
    expect(
      TEXT_EFFECTS.length +
        HOVER_EFFECTS.length +
        AMBIENT_EFFECTS.length +
        BACKGROUND_EFFECTS.length,
    ).toBe(EFFECT_NAMES.length);
  });

  it('builds a base + modifier class list, composing several', () => {
    expect(effectClass('gradient-text')).toBe('lily-fx lily-fx--gradient-text');
    expect(effectClass('lift', 'glow')).toBe('lily-fx lily-fx--lift lily-fx--glow');
  });
});
