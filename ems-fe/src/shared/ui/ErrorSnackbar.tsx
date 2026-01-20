'use client';

import { Snackbar, Alert } from '@mui/material';

export default function ErrorSnackbar({
  message,
  onClose,
  autoHideDuration = 5000,
}: {
  message: string;
  onClose: () => void;
  autoHideDuration?: number;
}) {
  return (
    <Snackbar
      open={Boolean(message)}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert severity="error" onClose={onClose}>
        {message}
      </Alert>
    </Snackbar>
  );
}