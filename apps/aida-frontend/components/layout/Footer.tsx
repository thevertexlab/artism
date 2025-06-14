'use client';

import { Container, Text, Group, Anchor } from '@mantine/core';
import Link from 'next/link';

export function Footer() {
  const links = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
  ];

  const items = links.map((link) => (
    <Link
      key={link.label}
      href={link.href}
      className="text-gray-600 dark:text-[#8899A6] hover:text-blue-600 dark:hover:text-[#0066FF] transition-colors"
    >
      {link.label}
    </Link>
  ));

  return (
    <footer className="py-6 mt-auto border-t border-gray-100 dark:border-[#1A1A1A] bg-gray-50 dark:bg-[#0D0D0D]">
      <Container size="lg">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <Text className="text-gray-600 dark:text-[#8899A6] mb-4 md:mb-0">
            © {new Date().getFullYear()} AIDA - AI Artist Database. All rights reserved.
          </Text>
          <div className="flex flex-wrap justify-center gap-4">
            {items}
          </div>
        </div>
      </Container>
    </footer>
  );
} 