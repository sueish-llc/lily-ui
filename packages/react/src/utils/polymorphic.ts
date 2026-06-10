/**
 * Helper types for polymorphic components (the `as` prop pattern).
 *
 * Lets a component render as different elements while keeping correct, fully
 * typed props — e.g. `<Button as="a" href="..." />`.
 */
import type { ElementType, ComponentPropsWithoutRef, PropsWithChildren } from 'react';

export type AsProp<C extends ElementType> = { as?: C };

type PropsToOmit<C extends ElementType, P> = keyof (AsProp<C> & P);

export type PolymorphicProps<C extends ElementType, Props = object> = PropsWithChildren<
  Props & AsProp<C>
> &
  Omit<ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;
