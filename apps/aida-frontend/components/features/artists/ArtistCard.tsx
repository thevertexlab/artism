import { Card, Image, Text, Badge, Button, Group, Tooltip } from '@mantine/core';
import { IconPalette, IconCalendar, IconFlag } from '@tabler/icons-react';
import Link from 'next/link';
import { Artist } from '@/types/models';

interface ArtistCardProps {
  artist: Artist;
}

export function ArtistCard({ artist }: ArtistCardProps) {
  // Use default image if artist has no image
  const imageUrl = artist.image_url || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80';

  // Calculate birth and death year display
  const yearsText = artist.birth_year 
    ? `${artist.birth_year} - ${artist.death_year || 'Present'}`
    : 'Unknown';
  
  return (
    <Card 
      shadow="sm" 
      padding="lg" 
      radius="md" 
      withBorder
      className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col"
    >
      <Card.Section>
        <div className="relative overflow-hidden h-48">
          <Image
            src={imageUrl}
            height={200}
            alt={artist.name}
            className="object-cover transition-transform duration-500 hover:scale-110"
          />
          {artist.art_movement && (
            <Badge 
              className="absolute top-2 right-2 bg-opacity-80 backdrop-blur-sm" 
              color="indigo"
            >
              {artist.art_movement}
            </Badge>
          )}
        </div>
      </Card.Section>

      <div className="flex-grow mt-4">
        <Text fw={700} size="xl" className="mb-2 line-clamp-1">{artist.name}</Text>
        
        <Group className="mb-3">
          {artist.nationality && (
            <Tooltip label="Nationality">
                          <Badge color="blue" variant="light">
              {artist.nationality}
            </Badge>
            </Tooltip>
          )}
          
          <Tooltip label="Years">
            <Badge color="gray" variant="light">
              {yearsText}
            </Badge>
          </Tooltip>
          
          {artist.art_movement && (
            <Tooltip label="Art Movement">
              <Badge color="violet" variant="light">
                {artist.art_movement}
              </Badge>
            </Tooltip>
          )}
        </Group>
        
        {artist.bio && (
          <Text size="sm" c="dimmed" className="line-clamp-3 mb-4">
            {artist.bio}
          </Text>
        )}
      </div>

      <Link href={`/artists/${artist.id}`} passHref>
        <Button 
          variant="light" 
          color="indigo" 
          fullWidth 
          mt="auto"
          className="mt-4"
        >
          View Details
        </Button>
      </Link>
    </Card>
  );
} 