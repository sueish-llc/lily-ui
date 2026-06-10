import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Descriptions } from './Descriptions';
import { DescriptionsItem } from './Descriptions';

describe('Descriptions', () => {
  it('renders a dl element', () => {
    const { container } = render(
      <Descriptions>
        <DescriptionsItem term="Name">Lily</DescriptionsItem>
      </Descriptions>,
    );
    expect(container.querySelector('dl')).toBeTruthy();
  });

  it('applies base class', () => {
    const { container } = render(
      <Descriptions>
        <DescriptionsItem term="Name">Lily</DescriptionsItem>
      </Descriptions>,
    );
    expect(container.querySelector('.lily-descriptions')).toBeTruthy();
  });

  it('applies horizontal layout class by default', () => {
    const { container } = render(
      <Descriptions>
        <DescriptionsItem term="Name">Lily</DescriptionsItem>
      </Descriptions>,
    );
    expect(container.querySelector('.lily-descriptions--horizontal')).toBeTruthy();
  });

  it('applies vertical layout class', () => {
    const { container } = render(
      <Descriptions layout="vertical">
        <DescriptionsItem term="Name">Lily</DescriptionsItem>
      </Descriptions>,
    );
    expect(container.querySelector('.lily-descriptions--vertical')).toBeTruthy();
  });

  it('applies columns class', () => {
    const { container } = render(
      <Descriptions columns={2}>
        <DescriptionsItem term="Name">Lily</DescriptionsItem>
      </Descriptions>,
    );
    expect(container.querySelector('.lily-descriptions--cols-2')).toBeTruthy();
  });

  it('applies bordered class', () => {
    const { container } = render(
      <Descriptions bordered>
        <DescriptionsItem term="Name">Lily</DescriptionsItem>
      </Descriptions>,
    );
    expect(container.querySelector('.lily-descriptions--bordered')).toBeTruthy();
  });

  it('renders term and detail', () => {
    render(
      <Descriptions>
        <DescriptionsItem term="Version">1.0.0</DescriptionsItem>
      </Descriptions>,
    );
    expect(screen.getByText('Version')).toBeTruthy();
    expect(screen.getByText('1.0.0')).toBeTruthy();
  });

  it('renders dt and dd elements', () => {
    const { container } = render(
      <Descriptions>
        <DescriptionsItem term="Version">1.0.0</DescriptionsItem>
      </Descriptions>,
    );
    expect(container.querySelector('dt.lily-descriptions__term')).toBeTruthy();
    expect(container.querySelector('dd.lily-descriptions__detail')).toBeTruthy();
  });

  it('forwards extra props', () => {
    const { container } = render(
      <Descriptions data-testid="desc">
        <DescriptionsItem term="Name">Lily</DescriptionsItem>
      </Descriptions>,
    );
    expect(container.querySelector('[data-testid="desc"]')).toBeTruthy();
  });

  it('merges custom className', () => {
    const { container } = render(
      <Descriptions className="custom">
        <DescriptionsItem term="Name">Lily</DescriptionsItem>
      </Descriptions>,
    );
    expect(container.querySelector('.lily-descriptions.custom')).toBeTruthy();
  });
});
