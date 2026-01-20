'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';

import type { Event, EventsQuery, UpsertEventDto, FiltersState } from '@/features/types';

import {
  getEvents,
  deleteEvent,
  createEvent,
  updateEvent,
  getEventRecommendations,
} from '@/features/api/events.api';

import { subscribeToEventModal } from '@/features/components/events/events-ui';
import { buildQueryFromFilters } from '@/features/utils/buildQueryFromFilters';
import { isApiError } from '@/shared/api/api-error';

export type DeletingEvent = { id: number; title: string };

function toErrorMessage(e: unknown): string {
  if (isApiError(e)) return e.message;
  if (e instanceof Error) return e.message;
  return 'Something went wrong';
}

export function useEventsController() {
  // --------------------
  // Data
  // --------------------
  const [events, setEvents] = useState<Event[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // --------------------
  // Filters
  // --------------------
  const [filters, setFilters] = useState<FiltersState>({
    category: '',
    startDate: null,
    endDate: null,
    sort: 'date',
    order: 'asc',
  });

  const categories = allCategories;

  // --------------------
  // Concurrency guard (avoid race conditions)
  // --------------------
  const requestSeq = useRef(0);

  // --------------------
  // Load
  // --------------------
  const load = useCallback(async (q: EventsQuery) => {
    const seq = ++requestSeq.current;

    setLoading(true);
    setError('');

    try {
      // 1) events (filtered)
      const data = await getEvents(q);
      if (requestSeq.current !== seq) return;
      setEvents(data);

      // 2) categories (same query but without category filter)
      const qForCategories: EventsQuery = { ...q };
      delete qForCategories.category;

      const allData = await getEvents(qForCategories);
      if (requestSeq.current !== seq) return;

      const unique = new Set(allData.map((e) => e.category).filter(Boolean));
      setAllCategories(Array.from(unique).sort());
    } catch (e) {
      if (requestSeq.current !== seq) return;
      setError(toErrorMessage(e));
    } finally {
      if (requestSeq.current === seq) setLoading(false);
    }
  }, []);

  // auto-fetch on filter change (debounce)
  useEffect(() => {
    const q = buildQueryFromFilters(filters);

    const t = setTimeout(() => {
      void load(q);
    }, 250);

    return () => clearTimeout(t);
  }, [filters, load]);

  const handleReset = useCallback(() => {
    setFilters({
      category: '',
      startDate: null,
      endDate: null,
      sort: 'date',
      order: 'asc',
    });
  }, []);

  // --------------------
  // Delete flow
  // --------------------
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState<DeletingEvent | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openDeleteConfirm = useCallback((id: number, title: string) => {
    setDeletingEvent({ id, title });
    setConfirmOpen(true);
  }, []);

  const closeDeleteConfirm = useCallback(() => {
    if (deleting) return;
    setConfirmOpen(false);
    setDeletingEvent(null);
  }, [deleting]);

  const confirmDelete = useCallback(async () => {
    if (!deletingEvent) return;

    try {
      setDeleting(true);
      setError('');

      await deleteEvent(deletingEvent.id);

      // optimistic remove + refresh
      setEvents((prev) => prev.filter((e) => e.id !== deletingEvent.id));
      await load(buildQueryFromFilters(filters));
    } catch (e) {
      setError(toErrorMessage(e));
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
      setDeletingEvent(null);
    }
  }, [deletingEvent, filters, load]);

  // --------------------
  // Create/Edit form modal
  // --------------------
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [saving, setSaving] = useState(false);

  const openCreate = useCallback(() => {
    setFormMode('create');
    setEditingEvent(null);
    setFormOpen(true);
  }, []);

  const openEdit = useCallback((event: Event) => {
    setFormMode('edit');
    setEditingEvent(event);
    setFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    if (saving) return;
    setFormOpen(false);
    setEditingEvent(null);
  }, [saving]);

  const initialFormValues = useMemo(() => {
    if (!editingEvent) return undefined;
    return {
      title: editingEvent.title,
      category: editingEvent.category,
      location: editingEvent.location,
      date: dayjs(editingEvent.date),
      description: editingEvent.description,
    };
  }, [editingEvent]);

  const confirmForm = useCallback(
    async (dto: UpsertEventDto) => {
      try {
        setSaving(true);
        setError('');

        if (formMode === 'create') {
          await createEvent(dto);
        } else {
          if (!editingEvent) return;
          await updateEvent(editingEvent.id, dto);
        }

        setFormOpen(false);
        setEditingEvent(null);

        await load(buildQueryFromFilters(filters));
      } catch (e) {
        setError(toErrorMessage(e));
      } finally {
        setSaving(false);
      }
    },
    [formMode, editingEvent, filters, load],
  );

  // Subscribe to header menu actions (create/edit)
  useEffect(() => {
    const unsub = subscribeToEventModal((detail) => {
      if (detail.type === 'create') {
        openCreate();
        return;
      }
      openEdit(detail.event);
    });

    return unsub;
  }, [openCreate, openEdit]);

  // --------------------
  // Details modal + recommendations
  // --------------------
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const [recommendations, setRecommendations] = useState<Event[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  const openDetails = useCallback(async (event: Event) => {
    setSelectedEvent(event);
    setDetailsOpen(true);

    try {
      setLoadingRecommendations(true);
      setError('');

      const data = await getEventRecommendations(event.id);
      setRecommendations(data);
    } catch (e) {
      setError(toErrorMessage(e));
    } finally {
      setLoadingRecommendations(false);
    }
  }, []);

  const closeDetails = useCallback(() => {
    setDetailsOpen(false);
    setSelectedEvent(null);
    setRecommendations([]);
  }, []);

  return {
    // data
    events,
    categories,
    loading,
    error,
    setError,

    // filters
    filters,
    setFilters,
    handleReset,

    // delete
    confirmOpen,
    deletingEvent,
    deleting,
    openDeleteConfirm,
    closeDeleteConfirm,
    confirmDelete,

    // form
    formOpen,
    formMode,
    initialFormValues,
    saving,
    openCreate,
    openEdit,
    closeForm,
    confirmForm,

    // details
    detailsOpen,
    selectedEvent,
    recommendations,
    loadingRecommendations,
    openDetails,
    closeDetails,
  };
}