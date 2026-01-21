'use client';

import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Stack,
  TextField,
  MenuItem,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useIsClient } from '@/features/hooks/useIsClient';

export type EventFormValues = {
  title: string;
  category: string;
  location: string;
  date: Dayjs | null;
  description: string;
};

export default function EventFormDialog({
  open,
  mode, // 'create' | 'edit'
  initialValues,
  categories,
  onClose,
  onConfirm,
  submitting = false,
}: {
  open: boolean;
  mode: 'create' | 'edit';
  initialValues?: Partial<EventFormValues>;
  categories: string[];
  submitting?: boolean;
  onClose: () => void;
  onConfirm: (values: {
    title: string;
    category: string;
    location: string;
    date: string; // ISO
    description: string;
  }) => void;
}) {
  const isClient = useIsClient();

  const [values, setValues] = React.useState<EventFormValues>({
    title: '',
    category: '',
    location: '',
    date: null,
    description: '',
  });

  const [errors, setErrors] = React.useState<
    Partial<Record<keyof EventFormValues, string>>
  >({});

  React.useEffect(() => {
    if (!open) return;

    setErrors({});
    setValues({
      title: initialValues?.title ?? '',
      category: initialValues?.category ?? '',
      location: initialValues?.location ?? '',
      date: initialValues?.date ?? dayjs(),
      description: initialValues?.description ?? '',
    });
  }, [open, initialValues]);

  const setField = <K extends keyof EventFormValues>(key: K, val: EventFormValues[K]) => {
    setValues((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const validate = () => {
    const next: Partial<Record<keyof EventFormValues, string>> = {};

    const title = values.title.trim();
    const category = values.category.trim();
    const location = values.location.trim();
    const description = values.description.trim();

    if (!title) next.title = 'Title is required';
    if (title.length > 120) next.title = 'Max 120 characters';

    if (!category) next.category = 'Category is required';
    if (!location) next.location = 'Location is required';

    if (!values.date || !values.date.isValid()) next.date = 'Valid date & time is required';

    if (!description) next.description = 'Description is required';
    if (description.length > 500) next.description = 'Max 500 characters';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleConfirm = () => {
    if (!validate()) return;

    onConfirm({
      title: values.title.trim(),
      category: values.category.trim(),
      location: values.location.trim(),
      date: values.date!.toISOString(),
      description: values.description.trim(),
    });
  };

  const dialogTitle = mode === 'create' ? 'Create event' : 'Edit event';
    
  if (!isClient) return null;

  return (
    <Dialog open={open} onClose={submitting ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pr: 6 }}>
        {dialogTitle}
        <IconButton
          aria-label="close"
          onClick={onClose}
          disabled={submitting}
          sx={{ position: 'absolute', right: 12, top: 12 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Fill in the fields below.
        </Typography>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={2}>
            <TextField
              label="Title"
              value={values.title}
              onChange={(e) => setField('title', e.target.value)}
              error={Boolean(errors.title)}
              helperText={errors.title}
              fullWidth
              autoFocus
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                select
                label="Category"
                value={values.category}
                onChange={(e) => setField('category', e.target.value)}
                error={Boolean(errors.category)}
                helperText={errors.category}
                fullWidth
              >
                {categories.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Location"
                value={values.location}
                onChange={(e) => setField('location', e.target.value)}
                error={Boolean(errors.location)}
                helperText={errors.location}
                fullWidth
              />
            </Stack>

            <DateTimePicker
              label="Date & time"
              value={values.date}
              onChange={(d) => setField('date', d)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: Boolean(errors.date),
                  helperText: errors.date,
                },
              }}
            />

            <TextField
              label="Description"
              value={values.description}
              onChange={(e) => setField('description', e.target.value)}
              error={Boolean(errors.description)}
              helperText={errors.description ?? ' '}
              multiline
              minRows={3}
              fullWidth
            />
          </Stack>
        </LocalizationProvider>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={submitting} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleConfirm} disabled={submitting} variant="contained">
          {submitting ? 'Saving…' : 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
