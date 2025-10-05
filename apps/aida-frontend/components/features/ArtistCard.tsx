'use client';

import { useState } from 'react';
import { Card, Text, Image, Badge, Group } from '@mantine/core';
import Link from 'next/link';
import type { Artist } from '@/types/models';

// Utility function: truncate text
const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

interface ArtistCardProps {
  artist: Artist;
  onSelect?: (artist: Artist) => void;
}

export function ArtistCard({ artist, onSelect }: ArtistCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = () => {
    if (onSelect) {
      onSelect(artist);
    }
  };
  
  const lifespan = artist.birth_year 
    ? `${artist.birth_year} - ${artist.death_year || 'Present'}`
    : '';
  
  // If there's an onSelect callback, render as plain div, otherwise render as link
  if (onSelect) {
    return (
      <Card 
        className={`transition-all duration-200 h-full ${isHovered ? 'shadow-lg transform -translate-y-1' : 'shadow-md'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        withBorder
        padding="lg"
      >
        {renderCardContent()}
      </Card>
    );
  }
  
  // Render as link
  return (
    <Link href={`/artists/${artist.id}`} className="block h-full">
      <Card 
        className={`transition-all duration-200 h-full ${isHovered ? 'shadow-lg transform -translate-y-1' : 'shadow-md'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        withBorder
        padding="lg"
      >
        {renderCardContent()}
      </Card>
    </Link>
  );
  
  // Card content rendering function
  function renderCardContent() {
    return (
      <>
        {artist.image_url && (
          <Card.Section>
            <Image
              src={artist.image_url}
              height={200}
              alt={artist.name}
              className="object-cover"
            />
          </Card.Section>
        )}
        
        <Group position="apart" mt="md" mb="xs">
          <Text className="font-bold text-lg">{artist.name}</Text>
          {artist.nationality && (
            <Badge color="blue" variant="light">
              {artist.nationality}
            </Badge>
          )}
        </Group>
        
        {lifespan && (
          <Text size="sm" c="dimmed" mb="xs">
            {lifespan}
          </Text>
        )}
        
        {artist.art_movement && (
          <Badge color="grape" variant="light" mb="md">
            {artist.art_movement}
          </Badge>
        )}
        
        {artist.bio && (
          <Text size="sm" lineClamp={3}>
            {truncateText(artist.bio, 150)}
          </Text>
        )}
      </>
    );
  }
} 