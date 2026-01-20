'use client';

import { Container, Typography, Box, CircularProgress } from '@mui/material';

import {
  EventCard,
  EventsFilters,
  EventFormDialog,
  EventDetailsDialog,
  ConfirmDeleteDialog,
} from '@/features/components/events';

import { useEventsController } from '@/features/hooks/useEventsController';
import { ErrorSnackbar } from '@/shared/ui';

export default function EventsPage() {
  const c = useEventsController();

  return (
    <Container maxWidth="lg" disableGutters sx={{ py: 4 }}>
      <Box sx={{ px: { xs: 2, sm: 3 } }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          Event List
        </Typography>

        <EventsFilters
          value={c.filters}
          onChange={(patch) => c.setFilters((prev) => ({ ...prev, ...patch }))}
          onReset={c.handleReset}
          categories={c.categories}
        />

        <Box
          sx={{
            mt: 3,
            height: '65vh',
            overflowY: 'auto',
            py: 1,
            pr: 1,
            mx: -1,
            px: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {c.loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : (
            c.events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onDelete={(id) => c.openDeleteConfirm(id, event.title)}
                onEdit={() => c.openEdit(event)}
                onOpenDetails={() => c.openDetails(event)}
              />
            ))
          )}
        </Box>

        {/* ✅ shared error snackbar */}
        <ErrorSnackbar message={c.error} onClose={() => c.setError('')} />

        <ConfirmDeleteDialog
          open={c.confirmOpen}
          title={c.deletingEvent?.title}
          loading={c.deleting}
          onClose={c.closeDeleteConfirm}
          onConfirm={() => {
            void c.confirmDelete();
          }}
        />

        <EventFormDialog
          open={c.formOpen}
          mode={c.formMode}
          initialValues={c.initialFormValues}
          categories={c.categories}
          submitting={c.saving}
          onClose={c.closeForm}
          onConfirm={c.confirmForm}
        />

        <EventDetailsDialog
          open={c.detailsOpen}
          event={c.selectedEvent}
          recommendations={c.recommendations}
          loadingRecommendations={c.loadingRecommendations}
          onClose={c.closeDetails}
          onSelectRecommendation={(e) => void c.openDetails(e)}
        />
      </Box>
    </Container>
  );
}
