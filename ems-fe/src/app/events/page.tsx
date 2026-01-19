'use client';

import {
  Container,
  Typography,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useEffect, useState, useCallback } from 'react';
import dayjs from 'dayjs';

import EventsFilters, { FiltersState } from '@/components/events/EventsFilters';
import EventCard from '@/components/events/EventCard';
import EventFormDialog, { type EventFormValues } from '@/components/events/EventFormDialog';
import EventDetailsDialog from '@/components/events/EventDetailsDialog';
import DeleteConfirmDialog from '@/components/events/DeleteConfirmDialog';

import type { Event } from '@/types/event';
import {
  getEvents,
  deleteEvent,
  createEvent,
  updateEvent,
  getEventRecommendations,
  type EventsQuery,
  type UpsertEventDto,
} from '@/lib/api';
import { subscribeToEventModal } from '@/lib/events-ui';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // delete confirm
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState<{ id: number; title: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // create/edit modal
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [saving, setSaving] = useState(false);

  // details modal
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [recommendations, setRecommendations] = useState<Event[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  const [filters, setFilters] = useState<FiltersState>({
    category: '',
    startDate: null,
    endDate: null,
    sort: 'date',
    order: 'asc',
  });

  const categories = allCategories;

  const buildQueryFromFilters = useCallback((): EventsQuery => {
    const q: EventsQuery = {
      sort: filters.sort,
      order: filters.order,
    };

    if (filters.category) q.category = filters.category;
    if (filters.startDate) q.dateFrom = dayjs(filters.startDate).format('YYYY-MM-DD');
    if (filters.endDate) q.dateTo = dayjs(filters.endDate).format('YYYY-MM-DD');

    return q;
  }, [filters]);

  const load = useCallback(async (q: EventsQuery) => {
    try {
      setLoading(true);
      setError('');

      // 1) filtered list
      const data = await getEvents(q);
      setEvents(data);

      // 2) categories without category filter
      const qForCategories: EventsQuery = { ...q };
      delete qForCategories.category;

      const allData = await getEvents(qForCategories);
      const unique = new Set(allData.map((e) => e.category).filter(Boolean));
      setAllCategories(Array.from(unique).sort());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load events');
    } finally {
      setLoading(false);
    }
  }, []);

  // auto-fetch on filter change
  useEffect(() => {
    const q = buildQueryFromFilters();

    const t = setTimeout(() => {
      void load(q);
    }, 250);

    return () => clearTimeout(t);
  }, [buildQueryFromFilters, load]);

  // subscribe to header "Add Event"
  useEffect(() => {
    const unsub = subscribeToEventModal((detail) => {
      if (detail.type === 'create') {
        setFormMode('create');
        setEditingEvent(null);
        setFormOpen(true);
        return;
      }

      setFormMode('edit');
      setEditingEvent(detail.event);
      setFormOpen(true);
    });

    return unsub;
  }, []);

  const handleReset = () => {
    setFilters({
      category: '',
      startDate: null,
      endDate: null,
      sort: 'date',
      order: 'asc',
    });
  };

  // --------------------
  // Delete flow
  // --------------------
  const handleDelete = (id: number, title: string) => {
    setDeletingEvent({ id, title });
    setConfirmOpen(true);
  };

  const closeConfirm = () => {
    if (deleting) return;
    setConfirmOpen(false);
    setDeletingEvent(null);
  };

  const confirmDelete = async () => {
    if (!deletingEvent) return;

    try {
      setDeleting(true);
      await deleteEvent(deletingEvent.id);

      setEvents((prev) => prev.filter((e) => e.id !== deletingEvent.id));
      void load(buildQueryFromFilters());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete event');
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
      setDeletingEvent(null);
    }
  };

  // --------------------
  // Create/Edit modal flow
  // --------------------
  const closeForm = () => {
    if (saving) return;
    setFormOpen(false);
    setEditingEvent(null);
  };

  const handleConfirmForm = async (dto: UpsertEventDto) => {
    try {
      setSaving(true);

      if (formMode === 'create') {
        await createEvent(dto);
      } else {
        if (!editingEvent) return;
        await updateEvent(editingEvent.id, dto);
      }

      setFormOpen(false);
      setEditingEvent(null);

      await load(buildQueryFromFilters());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save event');
    } finally {
      setSaving(false);
    }
  };

  // --------------------
  // Details modal flow
  // --------------------
  const openDetails = useCallback(async (event: Event) => {
    setSelectedEvent(event);
    setDetailsOpen(true);

    try {
      setLoadingRecommendations(true);
      const data = await getEventRecommendations(event.id);
      setRecommendations(data);
    } catch {
      setRecommendations([]);
    } finally {
      setLoadingRecommendations(false);
    }
  }, []);

  const closeDetails = () => {
    setDetailsOpen(false);
    setSelectedEvent(null);
    setRecommendations([]);
  };

  const initialFormValues: Partial<EventFormValues> | undefined = editingEvent
    ? {
        title: editingEvent.title,
        category: editingEvent.category,
        location: editingEvent.location,
        date: dayjs(editingEvent.date),
        description: editingEvent.description,
      }
    : undefined;

  return (
    <Container maxWidth="lg" disableGutters>
      <Box
        sx={{
          px: { xs: 2, sm: 3 },

          // ✅ fix “extra vertical scroll” on narrow screens:
          // fill viewport minus sticky header height
          height: { xs: 'calc(100dvh - 56px)', sm: 'calc(100dvh - 64px)' },

          display: 'flex',
          flexDirection: 'column',
          py: 3,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          Event List
        </Typography>

        <EventsFilters
          value={filters}
          onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
          onReset={handleReset}
          categories={categories}
        />

        {/* ✅ List takes remaining space and is the only scroll container */}
        <Box
          sx={{
            mt: 3,
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',

            // keep card shadows visible
            py: 1,
            pr: 1,
            mx: -1,
            px: 1,

            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : (
            events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onDelete={(id) => handleDelete(id, event.title)}
                onEdit={() => {
                  setFormMode('edit');
                  setEditingEvent(event);
                  setFormOpen(true);
                }}
                onOpenDetails={() => void openDetails(event)}
              />
            ))
          )}
        </Box>

        <Snackbar
          open={Boolean(error)}
          autoHideDuration={5000}
          onClose={() => setError('')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        </Snackbar>

        {/* Delete confirm dialog (moved to separate component) */}
        <DeleteConfirmDialog
          open={confirmOpen}
          title={deletingEvent?.title}
          loading={deleting}
          onClose={closeConfirm}
          onConfirm={confirmDelete}
        />

        {/* Create/Edit modal */}
        <EventFormDialog
          open={formOpen}
          mode={formMode}
          initialValues={initialFormValues}
          categories={categories}
          submitting={saving}
          onClose={closeForm}
          onConfirm={handleConfirmForm}
        />

        {/* Details modal */}
        <EventDetailsDialog
          open={detailsOpen}
          event={selectedEvent}
          recommendations={recommendations}
          loadingRecommendations={loadingRecommendations}
          onClose={closeDetails}
          onSelectRecommendation={(e) => void openDetails(e)}
        />
      </Box>
    </Container>
  );
}
