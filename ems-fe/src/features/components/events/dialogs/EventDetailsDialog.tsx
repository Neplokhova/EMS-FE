'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Stack,
  Chip,
  Divider,
  Box,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import type { Event } from '@/features/types/events.';

export default function EventDetailsDialog({
  open,
  event,
  recommendations,
  loadingRecommendations = false,
  onClose,
  onSelectRecommendation,
}: {
  open: boolean;
  event: Event | null;
  recommendations: Event[];
  loadingRecommendations?: boolean;
  onClose: () => void;
  onSelectRecommendation: (event: Event) => void;
}) {
  if (!event) return null;

  const dateTimeLabel = dayjs(event.date).format('MMMM D, YYYY • HH:mm');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      {/* TITLE ROW */}
   <DialogTitle
  sx={{
    pr: 6,
  }}
>
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      flexWrap: 'wrap',
    }}
  >
    <Typography
      variant="h6"
      component="span"
      sx={{
        fontWeight: 600,
        lineHeight: 1.2,
      }}
    >
      {event.title}
    </Typography>

    <Chip
      label={event.category}
      size="small"
      variant="outlined"
      color="secondary"
    />
  </Box>

  <IconButton
    aria-label="close"
    onClick={onClose}
    sx={{ position: 'absolute', right: 12, top: 12 }}
  >
    <CloseIcon />
  </IconButton>
</DialogTitle>

      <DialogContent dividers>
        {/* META UNDER DIVIDER */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexWrap: 'wrap',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {dateTimeLabel}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              • {event.location}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Description */}
        <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mb: 4 }}>
          {event.description}
        </Typography>

        {/* Recommendations */}
        <Divider sx={{ mb: 2 }} />

        <Typography variant="h6" sx={{ mb: 2 }}>
          Similar events
        </Typography>

        {loadingRecommendations ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : recommendations.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No similar events found.
          </Typography>
        ) : (
          <Stack spacing={1.5}>
            {recommendations.map((e) => (
              <Box
                key={e.id}
                onDoubleClick={() => onSelectRecommendation(e)}
                role="button"
                tabIndex={0}
                onKeyDown={(ev) => {
                  if (ev.key === 'Enter' || ev.key === ' ') onSelectRecommendation(e);
                }}
                sx={{
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                  '&:hover': {
                    boxShadow: 2,
                    transform: 'translateY(-1px)',
                  },
                  '&:focus-visible': {
                    outline: '2px solid',
                    outlineColor: 'primary.main',
                    outlineOffset: 2,
                  },
                }}
              >
                <Typography variant="subtitle1" fontWeight={600}>
                  {e.title}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {dayjs(e.date).format('MMM D, YYYY')} • {e.location}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}