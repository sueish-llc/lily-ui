import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Result } from './Result';

describe('Result a11y', () => {
  it('has no violations for success status', async () => {
    const { container } = render(
      <Result
        status="success"
        title="Submitted successfully"
        description="Your request has been received."
      />,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('has no violations for error status with actions', async () => {
    const { container } = render(
      <Result status="error" title="Submission failed" description="Please try again.">
        <button type="button">Try again</button>
      </Result>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('has no violations for 404 status', async () => {
    const { container } = render(
      <Result status="404" title="Page not found" description="The page does not exist." />,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('has no violations for warning status', async () => {
    const { container } = render(
      <Result status="warning" title="Attention required" />,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('has no violations for custom icon', async () => {
    const { container } = render(
      <Result
        status="info"
        title="Info"
        icon={<span role="img" aria-label="information">ℹ</span>}
      />,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
