import React from 'react';
import { Table, Loader, Text, Group, Badge, Image, Center } from '@mantine/core';
import { Artwork } from '@/types/models';

interface ArtworkTableProps {
  artworks: Artwork[];
  loading?: boolean;
}

export function ArtworkTable({ artworks, loading = false }: ArtworkTableProps) {
  if (loading) {
    return (
      <Center className="py-20">
        <Loader size="xl" color="indigo" />
      </Center>
    );
  }

  if (!artworks || artworks.length === 0) {
    return (
      <Center className="py-10">
        <Text size="lg" color="dimmed">No artworks found</Text>
      </Center>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Artist ID</th>
            <th>Year</th>
            <th>Medium</th>
            <th>Dimensions</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {artworks.map((artwork) => (
            <tr key={artwork.id}>
              <td>{artwork.id}</td>
              <td>
                <Group>
                  {artwork.image_url && (
                    <Image
                      src={artwork.image_url}
                      alt={artwork.title}
                      width={40}
                      height={40}
                      radius="sm"
                    />
                  )}
                  <Text fw={500}>{artwork.title}</Text>
                </Group>
              </td>
              <td>{artwork.artist_id}</td>
              <td>{artwork.year || 'Unknown'}</td>
              <td>{artwork.medium || 'Unknown'}</td>
              <td>{artwork.dimensions || 'Unknown'}</td>
              <td>{artwork.location || 'Unknown'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
} 