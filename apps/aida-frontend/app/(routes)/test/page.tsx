'use client';

import { useState } from 'react';
import { useAtom } from 'jotai';
import { 
  Container, 
  Title, 
  Box, 
  Paper, 
  TextInput, 
  Button, 
  Grid, 
  Card, 
  Text,
  Divider,
  Loader,
  Alert,
  Tabs,
  NumberInput,
  Code,
  Group,
  Stack
} from '@mantine/core';
import { artistFilterAtom, ArtistFilter } from '../../store/atoms';
import { artistService } from '../../services/api';

export default function TestPage() {
  // Jotai state
  const [filter, setFilter] = useAtom(artistFilterAtom);
  
  // Local state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string | null>('get');
  
  // Form state
  const [formData, setFormData] = useState<ArtistFilter>({
    name: '',
    nationality: '',
    style: '',
    min_year: undefined,
    max_year: undefined
  });
  
  // Handle form input changes
  const handleChange = (name: string, value: any) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Update the global filter state
      setFilter(formData);
      
      // Call the appropriate API based on the selected tab
      let response;
      if (activeTab === 'get') {
        // GET request
        response = await artistService.testGetApi(formData);
      } else {
        // POST request
        response = await artistService.testPostApi(formData);
      }
      
      setResult(response);
    } catch (err) {
      setError('An error occurred while making the API request.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container size="lg" py="xl">
      <Title order={1} mb="lg">
        API Test Page
      </Title>
      
      <Paper shadow="sm" p="lg" mb="xl" withBorder>
        <Title order={3} mb="md">
          Test Backend API Endpoints
        </Title>
        
        <Tabs value={activeTab} onTabChange={setActiveTab} className="mb-6">
          <Tabs.List>
            <Tabs.Tab value="get">GET Request</Tabs.Tab>
            <Tabs.Tab value="post">POST Request</Tabs.Tab>
          </Tabs.List>
        </Tabs>
        
        <form onSubmit={handleSubmit}>
          <Grid mb="md">
            <Grid.Col span={6}>
              <TextInput
                label="Artist Name"
                name="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Nationality"
                name="nationality"
                value={formData.nationality}
                onChange={(e) => handleChange('nationality', e.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput
                label="Art Style"
                name="style"
                value={formData.style}
                onChange={(e) => handleChange('style', e.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <NumberInput
                label="Min Birth Year"
                name="min_year"
                value={formData.min_year}
                onChange={(value) => handleChange('min_year', value)}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <NumberInput
                label="Max Birth Year"
                name="max_year"
                value={formData.max_year}
                onChange={(value) => handleChange('max_year', value)}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Button
                type="submit"
                disabled={loading}
                mt="md"
              >
                {loading ? <Loader size="sm" /> : 'Send Request'}
              </Button>
            </Grid.Col>
          </Grid>
        </form>
      </Paper>
      
      {error && (
        <Alert color="red" title="Error" mb="lg">
          {error}
        </Alert>
      )}
      
      {result && (
        <Card shadow="sm" padding="lg" radius="md" withBorder className="fade-in">
          <Title order={4} mb="md">
            Response from {activeTab === 'get' ? 'GET' : 'POST'} API
          </Title>
          <Divider mb="md" />
          <Text mb="md">
            Message: {result.message}
          </Text>
          <Text size="sm" c="dimmed" mb="xs">
            Filters Applied:
          </Text>
          <Box mb="md">
            <Code block>
              {JSON.stringify(result.filters_applied, null, 2)}
            </Code>
          </Box>
          <Text mt="md">
            Result: {result.result}
          </Text>
          
          <Group mt="lg">
            <Button variant="subtle" onClick={() => setResult(null)}>
              Clear Result
            </Button>
          </Group>
        </Card>
      )}
    </Container>
  );
} 