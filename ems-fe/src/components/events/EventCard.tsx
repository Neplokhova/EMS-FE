'use client';

import { Card, CardContent, Typography, Box, IconButton, Chip, Divider } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';
import type { Event } from '@/types/event';

export default function EventCard({
  event,
  onDelete,
  onEdit,
  onOpenDetails,
}: {
  event: Event;
  onDelete: (id: number) => void;
  onEdit: () => void;
  onOpenDetails: () => void;
}) {
  const dateLabel = dayjs(event.date).format('MMM D, YYYY');
  const timeLabel = dayjs(event.date).format('HH:mm');

  return (
    <Card
      onDoubleClick={onOpenDetails}
      sx={{
        position: 'relative',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        userSelect: 'none',
        transition: 'box-shadow 0.2s ease',
        '&:hover': { boxShadow: 4 },

        // ✅ щоб нічого не “різало”
        overflow: 'visible',
      }}
    >
      {/* Actions (НЕ впливають на layout) */}
      <Box
        className="event-actions"
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
          zIndex: 1,

          // desktop: показуємо по hover, mobile: завжди видно
          opacity: { xs: 1, sm: 0 },
          pointerEvents: { xs: 'auto', sm: 'none' },
          transform: { xs: 'none', sm: 'translateX(6px)' },
          transition: 'opacity 0.2s ease, transform 0.2s ease',

          '.MuiCard-root:hover &': {
            opacity: 1,
            transform: 'translateX(0)',
            pointerEvents: 'auto',
          },
        }}
      >
        <IconButton
          size="small"
          aria-label="edit"
          onDoubleClick={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>

        <IconButton
          size="small"
          aria-label="delete"
          onDoubleClick={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(event.id);
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>

      <CardContent
        sx={{
          px: { xs: 2, sm: 3 },
          py: { xs: 2, sm: 2.5 },

          // ✅ резерв під кнопки справа зверху, щоб текст не залазив під них
          pr: { xs: 7, sm: 7 },

          '&:last-child': { pb: { xs: 2, sm: 2.5 } },
        }}
      >
        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 0.75,
            wordBreak: 'break-word',
          }}
        >
          {event.title}
        </Typography>

        {/* Meta */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary">
            {dateLabel} • {timeLabel} • {event.location}
          </Typography>

          <Chip label={event.category} size="small" variant="outlined" color="secondary" />
        </Box>

        <Divider sx={{ my: 1.25, borderColor: 'grey.200' }} />

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: { xs: 3, sm: 2 },
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            wordBreak: 'break-word',
          }}
        >
          {event.description}
        </Typography>
      </CardContent>
    </Card>
  );
}






