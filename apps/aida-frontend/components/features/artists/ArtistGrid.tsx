import { SimpleGrid, Container, Text, Center, Loader } from '@mantine/core';
import { ArtistCard } from './ArtistCard';
import { Artist } from '@/types/models';

interface ArtistGridProps {
  artists: Artist[];
  loading?: boolean;
}

export function ArtistGrid({ artists, loading = false }: ArtistGridProps) {
  if (loading) {
    return (
      <Center className="py-20">
        <Loader size="xl" color="indigo" />
      </Center>
    );
  }

  if (!artists || artists.length === 0) {
    return (
      <Center className="py-20">
        <Text size="xl" c="dimmed">No artists found</Text>
      </Center>
    );
  }

  return (
    <Container size="xl" className="py-8">
      <SimpleGrid
        cols={4}
        spacing="lg"
        verticalSpacing="lg"
        breakpoints={[
          { maxWidth: 'lg', cols: 3 },
          { maxWidth: 'md', cols: 2 },
          { maxWidth: 'sm', cols: 1 },
        ]}
      >
        {artists.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </SimpleGrid>
    </Container>
  );
} 