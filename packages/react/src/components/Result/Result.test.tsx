import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Result } from './Result';

describe('Result', () => {
  it('renders the title', () => {
    render(<Result status="success" title="Done" />);
    expect(screen.getByText('Done')).toBeTruthy();
  });

  it('renders the description when provided', () => {
    render(<Result status="info" title="Info" description="More details here." />);
    expect(screen.getByText('More details here.')).toBeTruthy();
  });

  it('omits description when not provided', () => {
    const { container } = render(<Result status="success" title="Done" />);
    expect(container.querySelector('.lily-result__description')).toBeNull();
  });

  it('renders children as actions', () => {
    render(
      <Result status="success" title="Done">
        <button>Go home</button>
      </Result>,
    );
    expect(screen.getByText('Go home')).toBeTruthy();
  });

  it('omits actions when no children', () => {
    const { container } = render(<Result status="success" title="Done" />);
    expect(container.querySelector('.lily-result__actions')).toBeNull();
  });

  it('applies base and status class', () => {
    const { container } = render(<Result status="error" title="Oops" />);
    expect(container.querySelector('.lily-result.lily-result--error')).toBeTruthy();
  });

  it('applies status class for 404', () => {
    const { container } = render(<Result status="404" title="Not found" />);
    expect(container.querySelector('.lily-result--404')).toBeTruthy();
  });

  it('applies status class for 403', () => {
    const { container } = render(<Result status="403" title="Forbidden" />);
    expect(container.querySelector('.lily-result--403')).toBeTruthy();
  });

  it('applies status class for 500', () => {
    const { container } = render(<Result status="500" title="Error" />);
    expect(container.querySelector('.lily-result--500')).toBeTruthy();
  });

  it('renders custom icon', () => {
    render(<Result status="success" title="Done" icon={<span>★</span>} />);
    expect(screen.getByText('★')).toBeTruthy();
  });

  it('merges custom className', () => {
    const { container } = render(<Result status="success" title="Done" className="custom" />);
    expect(container.querySelector('.lily-result.custom')).toBeTruthy();
  });

  it('forwards extra props', () => {
    const { container } = render(<Result status="info" title="Info" data-testid="result" />);
    expect(container.querySelector('[data-testid="result"]')).toBeTruthy();
  });
});
