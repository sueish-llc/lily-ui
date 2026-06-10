import { forwardRef, type HTMLAttributes, type ElementType } from 'react';
import { cx } from '../../utils/cx';

const CLASS = 'lily-card';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Use a shadow instead of a border. @default false */
  elevated?: boolean;
}

/** Card — a flexible content container. Compose with the sub-components. */
const CardRoot = forwardRef<HTMLDivElement, CardProps>(function Card(
  { elevated, className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx(CLASS, elevated && `${CLASS}--elevated`, className)} {...rest}>
      {children}
    </div>
  );
});

function makePart<E extends HTMLElement>(suffix: string, defaultTag: ElementType) {
  return forwardRef<E, HTMLAttributes<E> & { as?: ElementType }>(function Part(
    { as, className, children, ...rest },
    ref,
  ) {
    const Tag = (as ?? defaultTag) as ElementType;
    return (
      <Tag ref={ref} className={cx(`${CLASS}__${suffix}`, className)} {...rest}>
        {children}
      </Tag>
    );
  });
}

const CardHeader = makePart<HTMLDivElement>('header', 'div');
const CardBody = makePart<HTMLDivElement>('body', 'div');
const CardFooter = makePart<HTMLDivElement>('footer', 'div');
const CardTitle = makePart<HTMLHeadingElement>('title', 'h3');

CardHeader.displayName = 'Card.Header';
CardBody.displayName = 'Card.Body';
CardFooter.displayName = 'Card.Footer';
CardTitle.displayName = 'Card.Title';

/**
 * Card — a flexible content container.
 *
 * @example
 * ```tsx
 * <Card>
 *   <Card.Header>Header</Card.Header>
 *   <Card.Body>
 *     <Card.Title>Title</Card.Title>
 *     Body text
 *   </Card.Body>
 *   <Card.Footer>Footer</Card.Footer>
 * </Card>
 * ```
 */
export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
  Title: CardTitle,
});
