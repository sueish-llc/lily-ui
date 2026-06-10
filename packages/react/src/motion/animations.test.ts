import { describe, it, expect } from 'vitest';
import {
  ANIMATION_NAMES,
  ATTENTION_ANIMATIONS,
  ENTRANCE_ANIMATIONS,
  EXIT_ANIMATIONS,
  animationClass,
} from './animations';

describe('animation catalog', () => {
  it('matches the CSS catalog size and has no duplicates', () => {
    expect(ANIMATION_NAMES.length).toBe(78);
    expect(new Set(ANIMATION_NAMES).size).toBe(ANIMATION_NAMES.length);
  });

  it('is partitioned cleanly into the three categories', () => {
    expect(
      ATTENTION_ANIMATIONS.length + ENTRANCE_ANIMATIONS.length + EXIT_ANIMATIONS.length,
    ).toBe(ANIMATION_NAMES.length);
  });

  it('builds a base + modifier class list', () => {
    expect(animationClass('fade-in-up')).toBe('lily-animate lily-animate--fade-in-up');
  });
});
