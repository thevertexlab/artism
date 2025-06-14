'use client';

import { useState, useEffect } from 'react';
import { Container, Title, Text, Box, Button, Group, Alert } from '@mantine/core';
import { IconInfoCircle, IconDownload } from '@tabler/icons-react';
import { ArtworkTable } from '@/components/features/artworks/ArtworkTable';
import { Artwork } from '@/types/models';
import { buildApiUrl, API_ENDPOINTS } from '@/src/config/api';

export default function ArtworksPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);

  // 加载艺术品数据
  const loadArtworks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('开始加载艺术品数据...');
      
      // 使用新的 API 配置
      const apiUrl = buildApiUrl(API_ENDPOINTS.ARTWORKS);
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('艺术品数据加载成功:', data);
      
      setArtworks(data);
      setError(null);
    } catch (err) {
      console.error('Error loading artworks:', err);
      setError('Failed to load artworks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // 导入测试数据
  const importTestData = async () => {
    setLoading(true);
    setError(null);
    setImportSuccess(false);
    
    try {
      console.log('开始导入测试数据...');
      
      // 使用新的 API 配置
      const apiUrl = buildApiUrl(API_ENDPOINTS.IMPORT_TEST_DATA);
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Import result:', result);
      setImportSuccess(true);
      
      // 重新加载艺术品数据
      await loadArtworks();
    } catch (err) {
      console.error('Error importing test data:', err);
      setError('Failed to import test data. Please try again later.');
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadArtworks();
  }, []);

  return (
    <Container size="xl" className="py-8">
      <Box className="mb-8">
        <Group className="justify-between items-center">
          <Title order={1} className="text-3xl font-bold">Artworks</Title>
          <Button 
            onClick={importTestData}
            loading={loading}
            color="indigo"
          >
            <IconDownload size={16} className="mr-2" />
            Import Test Data
          </Button>
        </Group>
        <Text color="dimmed" className="mt-2">
          Browse and manage the artwork collection
        </Text>
      </Box>

      {error && (
        <Alert 
          icon={<IconInfoCircle size={16} />} 
          title="Error" 
          color="red" 
          className="mb-4"
        >
          {error}
        </Alert>
      )}

      {importSuccess && (
        <Alert 
          icon={<IconInfoCircle size={16} />} 
          title="Success" 
          color="green" 
          className="mb-4"
        >
          Test data imported successfully!
        </Alert>
      )}

      <ArtworkTable artworks={artworks} loading={loading} />
    </Container>
  );
} 