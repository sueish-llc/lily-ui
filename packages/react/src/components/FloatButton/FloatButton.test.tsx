import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FloatButton, FloatButtonGroup } from './FloatButton';

describe('FloatButton', () => {
  it('renders a button element', () => {
    render(<FloatButton aria-label="Action">+</FloatButton>);
    expect(screen.getByRole('button', { name: 'Action' })).toBeTruthy();
  });

  it('applies base class', () => {
    render(<FloatButton aria-label="Action">+</FloatButton>);
    expect(screen.getByRole('button').className).toContain('lily-float-button');
  });

  it('applies position class', () => {
    render(<FloatButton position="bottom-left" aria-label="Action">+</FloatButton>);
    expect(screen.getByRole('button').className).toContain('lily-float-button--bottom-left');
  });

  it('applies shape class', () => {
    render(<FloatButton shape="square" aria-label="Action">+</FloatButton>);
    expect(screen.getByRole('button').className).toContain('lily-float-button--square');
  });

  it('applies size class', () => {
    render(<FloatButton size="lg" aria-label="Action">+</FloatButton>);
    expect(screen.getByRole('button').className).toContain('lily-float-button--lg');
  });

  it('sets data-status attribute', () => {
    render(<FloatButton status="danger" aria-label="Action">+</FloatButton>);
    expect(screen.getByRole('button').getAttribute('data-status')).toBe('danger');
  });

  it('defaults to type=button', () => {
    render(<FloatButton aria-label="Action">+</FloatButton>);
    expect(screen.getByRole('button').getAttribute('type')).toBe('button');
  });

  it('merges className', () => {
    render(<FloatButton aria-label="Action" className="custom">+</FloatButton>);
    expect(screen.getByRole('button').className).toContain('custom');
  });
});

describe('FloatButtonGroup', () => {
  it('renders the trigger button', () => {
    render(
      <FloatButtonGroup trigger="+" triggerProps={{ 'aria-label': 'Open' }}>
        <FloatButton aria-label="Share">⬆</FloatButton>
      </FloatButtonGroup>,
    );
    expect(screen.getByRole('button', { name: 'Open' })).toBeTruthy();
  });

  it('trigger is closed by default', () => {
    render(
      <FloatButtonGroup trigger="+" triggerProps={{ 'aria-label': 'Open' }}>
        <FloatButton aria-label="Share">⬆</FloatButton>
      </FloatButtonGroup>,
    );
    const trigger = screen.getByRole('button', { name: 'Open' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('opens on trigger click', () => {
    render(
      <FloatButtonGroup trigger="+" triggerProps={{ 'aria-label': 'Open' }}>
        <FloatButton aria-label="Share">⬆</FloatButton>
      </FloatButtonGroup>,
    );
    const trigger = screen.getByRole('button', { name: 'Open' });
    fireEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('closes on Escape key', () => {
    render(
      <FloatButtonGroup trigger="+" triggerProps={{ 'aria-label': 'Open' }}>
        <FloatButton aria-label="Share">⬆</FloatButton>
      </FloatButtonGroup>,
    );
    const trigger = screen.getByRole('button', { name: 'Open' });
    fireEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    fireEvent.keyDown(trigger.closest('.lily-float-button-group')!, { key: 'Escape' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('applies group position class', () => {
    const { container } = render(
      <FloatButtonGroup trigger="+" position="top-left" triggerProps={{ 'aria-label': 'Open' }}>
        <FloatButton aria-label="Share">⬆</FloatButton>
      </FloatButtonGroup>,
    );
    expect(container.querySelector('.lily-float-button-group--top-left')).toBeTruthy();
  });

  it('applies open modifier when open', () => {
    const { container } = render(
      <FloatButtonGroup trigger="+" triggerProps={{ 'aria-label': 'Open' }}>
        <FloatButton aria-label="Share">⬆</FloatButton>
      </FloatButtonGroup>,
    );
    const trigger = screen.getByRole('button', { name: 'Open' });
    fireEvent.click(trigger);
    expect(container.querySelector('.lily-float-button-group--open')).toBeTruthy();
  });
});
