'use client';

import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

export default function DeleteConfirmDialog({
  open,
  title,
  loading = false,
  onClose,
  onConfirm,
}: {
  open: boolean;
  title?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Delete event?</DialogTitle>

      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete <strong>{title ?? ''}</strong>?
          <br />
          This action cannot be undone.
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading} color="inherit">
          Cancel
        </Button>

        <Button onClick={onConfirm} disabled={loading} color="error" variant="contained">
          {loading ? 'Deleting…' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
