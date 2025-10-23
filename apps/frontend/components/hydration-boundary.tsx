'use client';

import { dehydrate, Hydrate } from '@tanstack/react-query';
import { type ReactNode } from 'react';

interface HydrationBoundaryProps {
  children: ReactNode;
  state: ReturnType<typeof dehydrate>;
}

export function HydrationBoundary({ children, state }: HydrationBoundaryProps) {
  return <Hydrate state={state}>{children}</Hydrate>;
}
