import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Container } from '../Container';
import { Row } from './Row';
import { Col } from './Col';

describe('Grid a11y', () => {
  it('has no violations for a grid layout', async () => {
    const { container } = render(
      <Container>
        <Row gutter="4">
          <Col span={6}>
            <p>Left</p>
          </Col>
          <Col span={6}>
            <p>Right</p>
          </Col>
        </Row>
      </Container>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
