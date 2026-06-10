import { describe, expect, it } from 'vitest';

import {
  addDays,
  diffInDays,
  formatDate,
  formatRelative,
  getDateTimeFormat,
  isToday,
  toPlainDate,
  today,
} from './datetime';

describe('datetime (Temporal)', () => {
  it('coerces ISO strings to a PlainDate and passes existing dates through', () => {
    const parsed = toPlainDate('2026-05-30');
    expect(parsed).toBeInstanceOf(Temporal.PlainDate);
    expect(parsed.toString()).toBe('2026-05-30');
    expect(toPlainDate(parsed)).toBe(parsed);
  });

  it('adds and subtracts whole days across month and year boundaries', () => {
    expect(addDays('2026-05-30', 5).toString()).toBe('2026-06-04');
    expect(addDays('2026-01-01', -1).toString()).toBe('2025-12-31');
  });

  it('computes signed day differences', () => {
    expect(diffInDays('2026-05-01', '2026-05-30')).toBe(29);
    expect(diffInDays('2026-05-30', '2026-05-01')).toBe(-29);
    expect(diffInDays('2026-05-30', '2026-05-30')).toBe(0);
  });

  it('recognizes today relative to the system zone', () => {
    expect(isToday(today())).toBe(true);
    expect(isToday(addDays(today(), 1))).toBe(false);
  });

  it('formats dates for a given locale', () => {
    // en-US numeric output is stable across Intl/Temporal implementations.
    expect(formatDate('2026-05-30', 'en-US')).toBe('5/30/2026');
    expect(
      formatDate('2026-05-30', 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    ).toBe('May 30, 2026');
    // Localized output is delegated to the host Temporal implementation and
    // varies between native (Node 26) and polyfilled runtimes, so assert the
    // delegation/structure rather than an implementation-specific string.
    expect(formatDate('2026-05-30', 'ja-JP')).toContain('2026');
  });
});

describe('getDateTimeFormat', () => {
  it('returns the same cached instance for the same locale + options', () => {
    const a = getDateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' });
    const b = getDateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' });
    expect(a).toBe(b);
  });

  it('keys Intl.Locale objects by their BCP-47 tag instead of colliding', () => {
    const opts: Intl.DateTimeFormatOptions = { month: 'long', timeZone: 'UTC' };
    const en = getDateTimeFormat(new Intl.Locale('en-US'), opts);
    const ja = getDateTimeFormat(new Intl.Locale('ja-JP'), opts);
    expect(en).not.toBe(ja);
    const may = new Date(Date.UTC(2026, 4, 1));
    expect(en.format(may)).toBe('May');
    expect(ja.format(may)).toBe('5月');
    // An Intl.Locale object and its string tag resolve to the same entry.
    expect(getDateTimeFormat('en-US', opts)).toBe(en);
  });

  it('distinguishes locale arrays per element', () => {
    const opts: Intl.DateTimeFormatOptions = { month: 'long', timeZone: 'UTC' };
    const a = getDateTimeFormat(['ja-JP', 'en-US'], opts);
    const b = getDateTimeFormat(['en-US', 'ja-JP'], opts);
    expect(a).not.toBe(b);
  });
});

describe('formatRelative (cached Intl.RelativeTimeFormat)', () => {
  it('formats with the largest fitting unit and reuses cached formatters', () => {
    const base = Temporal.Instant.from('2026-06-10T00:00:00Z');
    expect(formatRelative('2026-06-10T03:00:00Z', base, 'en-US', 'always')).toBe('in 3 hours');
    // Second call goes through the cache and stays correct.
    expect(formatRelative('2026-06-07T00:00:00Z', base, 'en-US', 'always')).toBe('3 days ago');
    // A different numeric mode is a different cache entry.
    expect(formatRelative('2026-06-09T00:00:00Z', base, 'en-US', 'auto')).toBe('yesterday');
  });
});
