'use client';

import { MantineProvider } from '@mantine/core';
import { ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <MantineProvider
      theme={{
        colorScheme: 'dark',
        primaryColor: 'blue',
      }}
      withNormalizeCSS
      withGlobalStyles
    >
      {children}
    </MantineProvider>
  );
} 