import { useState } from 'react';
import { 
  TextInput, 
  Button, 
  Group, 
  Box, 
  Paper, 
  Select, 
  RangeSlider, 
  Text,
  ActionIcon,
  Collapse
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch, IconFilter, IconX } from '@tabler/icons-react';
import { ArtistFilter as ArtistFilterType } from '@/types/models';

interface ArtistFilterProps {
  onFilter: (filters: ArtistFilterType) => void;
  loading?: boolean;
}

// 艺术流派选项
const ART_MOVEMENTS = [
  { value: 'impressionism', label: 'Impressionism' },
  { value: 'cubism', label: 'Cubism' },
  { value: 'surrealism', label: 'Surrealism' },
  { value: 'abstract', label: 'Abstract' },
  { value: 'renaissance', label: 'Renaissance' },
  { value: 'baroque', label: 'Baroque' },
  { value: 'pop-art', label: 'Pop Art' },
  { value: 'expressionism', label: 'Expressionism' },
];

// 国籍选项
const NATIONALITIES = [
  { value: 'french', label: 'French' },
  { value: 'italian', label: 'Italian' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'dutch', label: 'Dutch' },
  { value: 'american', label: 'American' },
  { value: 'british', label: 'British' },
  { value: 'german', label: 'German' },
  { value: 'russian', label: 'Russian' },
];

export function ArtistFilter({ onFilter, loading = false }: ArtistFilterProps) {
  const [opened, { toggle }] = useDisclosure(false);
  const [filters, setFilters] = useState<ArtistFilterType>({
    name: '',
    nationality: '',
    style: '',
    min_year: 1400,
    max_year: 2023
  });

  const handleChange = (field: keyof ArtistFilterType, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters({
      name: '',
      nationality: '',
      style: '',
      min_year: 1400,
      max_year: 2023
    });
    onFilter({});
  };

  return (
    <Paper shadow="xs" p="md" withBorder className="mb-8">
      <form onSubmit={handleSubmit}>
        <Group position="apart" mb="xs">
          <TextInput
            placeholder="Search artists..."
            value={filters.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="flex-1 mr-4"
            disabled={loading}
          />
          <Button 
            onClick={toggle}
            variant="subtle"
            leftIcon={<IconFilter size={16} />}
            disabled={loading}
          >
            {opened ? 'Hide Filters' : 'More Filters'}
          </Button>
        </Group>

        <Collapse in={opened}>
          <Box className="pt-4 pb-2">
            <Group position="apart" mb="md">
              <Text fw={500}>Advanced Filters</Text>
              <ActionIcon onClick={handleReset} disabled={loading}>
                <IconX size={16} />
              </ActionIcon>
            </Group>

            <Group grow mb="md">
              <Select
                label="Art Movement"
                placeholder="Select art movement"
                data={ART_MOVEMENTS}
                value={filters.style}
                onChange={(value) => handleChange('style', value)}
                clearable
                disabled={loading}
              />
              <Select
                label="Nationality"
                placeholder="Select nationality"
                data={NATIONALITIES}
                value={filters.nationality}
                onChange={(value) => handleChange('nationality', value)}
                clearable
                disabled={loading}
              />
            </Group>

            <Box mb="md">
              <Text size="sm" fw={500} mb="xs">
                Time Period ({filters.min_year} - {filters.max_year})
              </Text>
              <RangeSlider
                min={1400}
                max={2023}
                step={10}
                minRange={50}
                value={[filters.min_year || 1400, filters.max_year || 2023]}
                onChange={([min, max]) => {
                  handleChange('min_year', min);
                  handleChange('max_year', max);
                }}
                marks={[
                  { value: 1400, label: '1400' },
                  { value: 1600, label: '1600' },
                  { value: 1800, label: '1800' },
                  { value: 2000, label: '2000' },
                ]}
                disabled={loading}
              />
            </Box>
          </Box>
        </Collapse>

        <Group position="right" mt="md">
          <Button 
            type="submit" 
            color="indigo" 
            loading={loading}
          >
            Apply Filters
          </Button>
        </Group>
      </form>
    </Paper>
  );
} 