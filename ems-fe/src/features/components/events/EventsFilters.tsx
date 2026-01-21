'use client';

import { Box, Button, MenuItem, Paper, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ReplayIcon from '@mui/icons-material/Replay';
import type { FiltersState } from '@/features/types';

export default function EventsFilters({
  value,
  onChange,
  onReset,
  categories,
}: {
  value: FiltersState;
  onChange: (patch: Partial<FiltersState>) => void;
  onReset: () => void;
  categories: string[];
}) {
  const sortValue = `${value.sort}:${value.order}`;

  const handleSortChange = (v: string) => {
    const [sort, order] = v.split(':') as [FiltersState['sort'], FiltersState['order']];
    onChange({ sort, order });
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Category */}
          <TextField
            select
            label="Category"
            value={value.category}
            onChange={(e) => onChange({ category: e.target.value })}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All</MenuItem>
            {categories.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>

          {/* Start date */}
          <DatePicker
            label="Start date"
            value={value.startDate}
            onChange={(d) => onChange({ startDate: d })}
            slotProps={{ textField: { sx: { minWidth: 180 } } }}
          />

          {/* End date */}
          <DatePicker
            label="End date"
            value={value.endDate}
            onChange={(d) => onChange({ endDate: d })}
            slotProps={{ textField: { sx: { minWidth: 180 } } }}
          />

          {/* Reset */}
          <Button
            variant="text"
            color="secondary"
            startIcon={<ReplayIcon />}
            onClick={onReset}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Reset filters
          </Button>

          <Box sx={{ flexGrow: 1 }} />

            
          <TextField
            select
            label="Sort by"
            value={sortValue}
            onChange={(e) => handleSortChange(e.target.value)}
            sx={{ minWidth: 220 }}
          >
            <MenuItem value="date:asc">Date ↑</MenuItem>
            <MenuItem value="date:desc">Date ↓</MenuItem>
            <MenuItem value="title:asc">Title ↑</MenuItem>
            <MenuItem value="title:desc">Title ↓</MenuItem>
          </TextField>
        </Box>
      </LocalizationProvider>
    </Paper>
  );
}
