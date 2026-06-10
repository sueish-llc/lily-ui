import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Modal } from './Modal';

describe('Modal a11y', () => {
  it('has no violations (open)', async () => {
    const { baseElement } = render(
      <Modal open onClose={() => {}} title="Title" footer={<button>OK</button>}>
        Body
      </Modal>,
    );
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations();
  });
});
