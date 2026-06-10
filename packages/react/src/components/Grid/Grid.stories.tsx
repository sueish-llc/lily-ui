import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { Container } from '../Container';
import { Row } from './Row';
import { Col } from './Col';

const meta = {
  title: 'Layout/Grid',
  component: Row,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'A 12-column responsive flexbox grid: Container + Row + Col.' } },
  },
} satisfies Meta<typeof Row>;

export default meta;
type Story = StoryObj<typeof Row>;

const Box = ({ children }: { children: ReactNode }) => (
  <div className="lily-p-3 lily-bg-subtle lily-rounded-md" style={{ textAlign: 'center' }}>
    {children}
  </div>
);

export const Basic: Story = {
  render: () => (
    <Container>
      <Row gutter="3">
        <Col span={4}>
          <Box>span=4</Box>
        </Col>
        <Col span={4}>
          <Box>span=4</Box>
        </Col>
        <Col span={4}>
          <Box>span=4</Box>
        </Col>
      </Row>
    </Container>
  ),
};

export const Responsive: Story = {
  render: () => (
    <Container>
      <Row gutter="3">
        {[0, 1, 2, 3].map((i) => (
          <Col key={i} span={12} md={6} lg={3}>
            <Box>12 / 6 / 3</Box>
          </Col>
        ))}
      </Row>
    </Container>
  ),
};

export const EqualWidthAndAuto: Story = {
  render: () => (
    <Container>
      <Row gutter="3">
        <Col>
          <Box>equal</Box>
        </Col>
        <Col span="auto">
          <Box>auto</Box>
        </Col>
        <Col>
          <Box>equal</Box>
        </Col>
      </Row>
    </Container>
  ),
};
