import { Pagination, Group, Text, Select } from '@mantine/core';

interface ArtistPaginationProps {
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function ArtistPagination({
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange
}: ArtistPaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  
  // 计算显示范围
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(start + pageSize - 1, total);

  return (
    <Group position="apart" className="mt-8 mb-4">
      <Text size="sm" c="dimmed">
        Showing {total > 0 ? start : 0}-{end} of {total} artists
      </Text>
      
      <Group>
        <Select
          value={pageSize.toString()}
          onChange={(value) => onPageSizeChange(Number(value))}
          data={[
            { value: '5', label: '5 per page' },
            { value: '10', label: '10 per page' },
            { value: '20', label: '20 per page' },
            { value: '50', label: '50 per page' },
            { value: '100', label: '100 per page' },
          ]}
          size="xs"
          style={{ width: 130 }}
        />
        
        <Pagination
          total={totalPages}
          value={page}
          onChange={onPageChange}
          size="sm"
          withEdges
        />
      </Group>
    </Group>
  );
} 