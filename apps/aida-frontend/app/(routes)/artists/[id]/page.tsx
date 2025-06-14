'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Container, 
  Grid, 
  Title, 
  Text, 
  Image, 
  Badge, 
  Group, 
  Button, 
  Paper, 
  Divider, 
  Skeleton,
  Alert,
  Box,
  Tabs
} from '@mantine/core';
import { 
  IconArrowLeft, 
  IconPalette, 
  IconCalendar, 
  IconFlag, 
  IconInfoCircle,
  IconPhoto,
  IconHistory,
  IconMessageCircle
} from '@tabler/icons-react';
import { artistService } from '@/services/endpoints/artistService';
import { Artist } from '@/types/models';

export default function ArtistDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // 获取艺术家ID
  const artistId = Number(params.id);

  // 加载艺术家数据
  useEffect(() => {
    const loadArtist = async () => {
      if (!artistId || isNaN(artistId)) {
        setError('Invalid artist ID');
        setLoading(false);
        return;
      }

      try {
        const data = await artistService.getArtistById(artistId);
        setArtist(data);
      } catch (err) {
        console.error(`Error loading artist with ID ${artistId}:`, err);
        setError('Failed to load artist details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadArtist();
  }, [artistId]);

  // 与AI艺术家交互
  const interactWithAI = async () => {
    if (!artist) return;
    
    setAiLoading(true);
    try {
      const response = await artistService.interactWithAI(
        "Tell me about your artistic style and influences", 
        artist.id
      );
      setAiResponse(response.response);
    } catch (err) {
      console.error('Error interacting with AI:', err);
      setAiResponse('Sorry, I could not connect with the AI artist at this time.');
    } finally {
      setAiLoading(false);
    }
  };

  // 返回艺术家列表
  const handleBack = () => {
    router.push('/artists');
  };

  // 计算生卒年份显示
  const yearsText = artist?.birth_year 
    ? `${artist.birth_year} - ${artist.death_year || 'Present'}`
    : 'Unknown';

  // 默认图片
  const imageUrl = artist?.image_url || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80';

  if (loading) {
    return (
      <Container size="xl" className="py-10">
        <Button 
          variant="subtle" 
          onClick={handleBack}
          className="mb-6"
        >
          <IconArrowLeft size={16} className="mr-2" />
          Back to Artists
        </Button>
        
        <Grid>
          <Grid.Col span={4}>
            <Skeleton height={400} radius="md" />
          </Grid.Col>
          <Grid.Col span={8}>
            <Skeleton height={50} width="70%" radius="md" className="mb-4" />
            <Skeleton height={30} width="40%" radius="md" className="mb-4" />
            <Skeleton height={20} radius="md" className="mb-2" />
            <Skeleton height={20} radius="md" className="mb-2" />
            <Skeleton height={20} radius="md" className="mb-4" />
            <Skeleton height={100} radius="md" className="mb-4" />
          </Grid.Col>
        </Grid>
      </Container>
    );
  }

  if (error || !artist) {
    return (
      <Container size="xl" className="py-10">
        <Button 
          variant="subtle" 
          onClick={handleBack}
          className="mb-6"
        >
          <IconArrowLeft size={16} className="mr-2" />
          Back to Artists
        </Button>
        
        <Alert 
          icon={<IconInfoCircle size={16} />} 
          title="Error" 
          color="red"
        >
          {error || 'Artist not found'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="xl" className="py-10">
      <Button 
        variant="subtle" 
        onClick={handleBack}
        className="mb-6"
      >
        <IconArrowLeft size={16} className="mr-2" />
        Back to Artists
      </Button>
      
      <Grid gutter="xl">
        <Grid.Col span={4}>
          <Paper shadow="md" p="xs" radius="md" withBorder>
            <Image
              src={imageUrl}
              alt={artist.name}
              height={400}
              radius="md"
              className="object-cover"
            />
          </Paper>
          
          <Paper shadow="xs" p="md" withBorder className="mt-4">
            <Title order={4} className="mb-3">Details</Title>
            <Divider className="mb-3" />
            
            <Group className="mb-2">
              <IconCalendar size={18} />
              <Text size="sm">
                <strong>Years:</strong> {yearsText}
              </Text>
            </Group>
            
            {artist.nationality && (
              <Group className="mb-2">
                <IconFlag size={18} />
                <Text size="sm">
                  <strong>Nationality:</strong> {artist.nationality}
                </Text>
              </Group>
            )}
            
            {artist.art_movement && (
              <Group className="mb-2">
                <IconPalette size={18} />
                <Text size="sm">
                  <strong>Art Movement:</strong> {artist.art_movement}
                </Text>
              </Group>
            )}
          </Paper>
        </Grid.Col>
        
        <Grid.Col span={8}>
          <Title order={1} className="mb-2">{artist.name}</Title>
          
          <Group className="mb-4">
            {artist.nationality && (
              <Badge color="blue" size="lg">{artist.nationality}</Badge>
            )}
            
            {artist.art_movement && (
              <Badge color="violet" size="lg">{artist.art_movement}</Badge>
            )}
            
            <Badge color="gray" size="lg">{yearsText}</Badge>
          </Group>
          
          <Tabs defaultValue="bio">
            <Tabs.List>
              <Tabs.Tab value="bio">
                <IconInfoCircle size={16} className="mr-2" />
                Biography
              </Tabs.Tab>
              <Tabs.Tab value="works">
                <IconPhoto size={16} className="mr-2" />
                Notable Works
              </Tabs.Tab>
              <Tabs.Tab value="history">
                <IconHistory size={16} className="mr-2" />
                Historical Context
              </Tabs.Tab>
              <Tabs.Tab value="ai">
                <IconMessageCircle size={16} className="mr-2" />
                AI Interaction
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="bio" pt="xs">
              <Paper shadow="xs" p="md" withBorder className="mt-4">
                <Text className="leading-relaxed">
                  {artist.bio || 'No biography available for this artist.'}
                </Text>
              </Paper>
            </Tabs.Panel>

            <Tabs.Panel value="works" pt="xs">
              <Paper shadow="xs" p="md" withBorder className="mt-4">
                {artist.notable_works && artist.notable_works.length > 0 ? (
                  <ul className="pl-5">
                    {artist.notable_works.map((work, index) => (
                      <li key={index} className="mb-2">
                        <Text>{work}</Text>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Text>No notable works listed for this artist.</Text>
                )}
              </Paper>
            </Tabs.Panel>

            <Tabs.Panel value="history" pt="xs">
              <Paper shadow="xs" p="md" withBorder className="mt-4">
                <Text>
                  Historical context information is not available at this time.
                </Text>
              </Paper>
            </Tabs.Panel>

            <Tabs.Panel value="ai" pt="xs">
              <Paper shadow="xs" p="md" withBorder className="mt-4">
                {aiResponse ? (
                  <Box>
                    <Text className="italic mb-4">"{aiResponse}"</Text>
                    <Button 
                      onClick={interactWithAI} 
                      variant="light" 
                      color="indigo"
                      loading={aiLoading}
                    >
                      Ask Again
                    </Button>
                  </Box>
                ) : (
                  <Box>
                    <Text className="mb-4">
                      Interact with an AI version of {artist.name} trained on their life, 
                      works, and artistic philosophy.
                    </Text>
                    <Button 
                      onClick={interactWithAI} 
                      color="indigo"
                      loading={aiLoading}
                    >
                      Start Conversation
                    </Button>
                  </Box>
                )}
              </Paper>
            </Tabs.Panel>
          </Tabs>
        </Grid.Col>
      </Grid>
    </Container>
  );
} 