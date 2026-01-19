'use client';

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Tabs,
  Tab,
  Container,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { usePathname, useRouter } from 'next/navigation';
import { openCreateEventModal } from '@/lib/events-ui';

export default function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const currentTab = pathname.startsWith('/events') ? 0 : false;

  return (
    <AppBar
      position="sticky"
      color="primary"
      sx={{
        top: 0,
        zIndex: (theme) => theme.zIndex.appBar,
      }}
    >
      {/* 👇 disableGutters — ключове */}
      <Container maxWidth="lg" disableGutters>
        {/* 👇 px тут, як у сторінках */}
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            px: { xs: 2, sm: 3 },
          }}
        >
          {/* LEFT: Title */}
          <Typography
  variant="h6"
  sx={{
    fontWeight: 600,
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap',
    mr: 3,
  }}
>
  {/* Desktop */}
  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
    EVENT MANAGEMENT SYSTEM
  </Box>

  {/* Mobile */}
  <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
    EMS
  </Box>
</Typography>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Tabs */}
          <Tabs
            value={currentTab}
            textColor="inherit"
            indicatorColor="secondary"
            sx={{
              mr: 3,
              '& .MuiTab-root': {
                fontWeight: 600,
                textTransform: 'none',
                minWidth: 120,
                fontSize: '1rem',
              },
            }}
          >
            <Tab label="Events" onClick={() => router.push('/events')} />
          </Tabs>

          {/* RIGHT: Add Event */}
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => openCreateEventModal()}
            sx={{
              bgcolor: '#FFFFFF',
              color: 'primary.main',
              '&:hover': { bgcolor: '#E0F2F1' },
            }}
          >
            Add Event
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
