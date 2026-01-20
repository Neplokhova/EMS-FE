'use client';

import { Box, Button, Typography } from '@mui/material';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Box sx={{ py: 6 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
        Something went wrong
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {error.message}
      </Typography>

      <Button variant="contained" onClick={reset}>
        Try again
      </Button>
    </Box>
  );
}