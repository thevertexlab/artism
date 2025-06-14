'use client';

import { useState, useEffect } from 'react';
import { 
  Container, 
  Title, 
  Box, 
  Paper, 
  Table,
  Loader,
  Alert,
  Button,
  Text,
  Code,
  Group,
  Stack
} from '@mantine/core';
import axios from 'axios';
import { buildApiUrl, API_ENDPOINTS } from '@/src/config/api';

// 定义艺术家数据类型
interface Artist {
  id: number;
  name: string;
  birth_year?: number;
  death_year?: number;
  nationality?: string;
  bio?: string;
  art_movement?: string;
  primary_style?: string;
  famous_works?: string;
}

export default function TablePage() {
  // 状态
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [artists, setArtists] = useState<Artist[]>([]);
  
  // 加载数据
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 使用新的 API 配置
      const apiUrl = buildApiUrl(API_ENDPOINTS.ARTISTS);
      const response = await axios.get(apiUrl);
      setArtists(response.data);
    } catch (err) {
      setError('获取数据时发生错误');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // 组件加载时获取数据
  useEffect(() => {
    fetchData();
  }, []);
  
  return (
    <Container size="lg" py="xl">
      <Stack className="gap-4">
        <Title order={1}>艺术家数据表格</Title>
        
        <Group className="justify-end mb-4">
          <Button 
            onClick={fetchData}
            disabled={loading}
            variant="filled"
          >
            刷新数据
          </Button>
        </Group>
        
        {loading && (
          <Box style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <Loader size="lg" />
          </Box>
        )}
        
        {error && (
          <Alert color="red" title="错误" variant="filled">
            {error}
          </Alert>
        )}
        
        {artists.length > 0 ? (
          <Paper shadow="xs" p="md" withBorder>
            <Table striped highlightOnHover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>姓名</th>
                  <th>出生年份</th>
                  <th>逝世年份</th>
                  <th>国籍</th>
                  <th>艺术流派</th>
                  <th>代表作品</th>
                </tr>
              </thead>
              <tbody>
                {artists.map((artist) => (
                  <tr key={artist.id}>
                    <td>{artist.id}</td>
                    <td>{artist.name}</td>
                    <td>{artist.birth_year}</td>
                    <td>{artist.death_year}</td>
                    <td>{artist.nationality}</td>
                    <td>{artist.art_movement || artist.primary_style}</td>
                    <td>{artist.famous_works}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Paper>
        ) : !loading && (
          <Paper shadow="xs" p="md" withBorder>
            <Text ta="center" c="dimmed">暂无数据</Text>
          </Paper>
        )}
        
        <Title order={3} mt="lg">API 响应详情</Title>
        
        {artists.length > 0 && (
          <Paper shadow="xs" p="md" withBorder>
            <Code block style={{ maxHeight: '400px', overflow: 'auto' }}>
              {JSON.stringify(artists, null, 2)}
            </Code>
          </Paper>
        )}
      </Stack>
    </Container>
  );
} 