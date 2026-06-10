import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Avatar, AvatarGroup } from './Avatar';

describe('Avatar', () => {
  it('derives initials from the name and labels the avatar', () => {
    render(<Avatar name="Ada Lovelace" />);
    const el = screen.getByRole('img', { name: 'Ada Lovelace' });
    expect(el).toHaveClass('lily-avatar');
    expect(el).toHaveTextContent('AL');
  });

  it('combines name and status into the accessible label (not color-only)', () => {
    render(<Avatar name="Grace" status="success" statusLabel="online" />);
    expect(screen.getByRole('img', { name: 'Grace, online' })).toBeInTheDocument();
  });

  it('renders an image with the photo hidden behind the labeled container', () => {
    const { container } = render(<Avatar name="Ada" src="/ada.jpg" size="lg" square />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass('lily-avatar', 'lily-avatar--lg', 'lily-avatar--square');
    expect(root.querySelector('img')).toHaveAttribute('src', '/ada.jpg');
  });
});

describe('AvatarGroup', () => {
  it('wraps overlapping avatars', () => {
    const { container } = render(
      <AvatarGroup>
        <Avatar name="A B" />
        <Avatar name="C D" />
        <Avatar name="+2">+2</Avatar>
      </AvatarGroup>,
    );
    expect(container.firstElementChild).toHaveClass('lily-avatar-group');
    expect(screen.getByText('+2')).toBeInTheDocument();
  });
});
