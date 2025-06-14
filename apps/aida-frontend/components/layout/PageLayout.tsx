'use client';

import { ReactNode } from 'react';
import { Container } from '@mantine/core';
import { Footer } from './Footer';

interface PageLayoutProps {
  children: ReactNode;
  containerSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  withPadding?: boolean;
}

export function PageLayout({
  children,
  containerSize = 'lg',
  withPadding = true,
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0D0D0D] text-gray-900 dark:text-white">
      <main>
        {withPadding ? (
          <Container size={containerSize} className="py-8">
            {children}
          </Container>
        ) : (
          children
        )}
      </main>
      <Footer />
    </div>
  );
} 