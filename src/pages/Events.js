import React, { useState, useCallback } from 'react';
import { 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  CircularProgress, 
  Alert,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Stack
} from '@mui/material';
import { 
  Add as AddIcon,
  Event as EventIcon,
  Schedule as ScheduleIcon,
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { useApi } from '../hooks/useApi';
import { fetchEventsWithPagination } from '../api/services';
import AddEventDialog from '../components/Events/AddEventDialog';

const Events = () => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 6,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState({
    search: '',   
    orderBy: 'startDate desc'
  });

  // Memoized fetch function with current filters and pagination
  const fetchEventsCallback = useCallback(() => {
    const skip = (pagination.page - 1) * pagination.pageSize;
    return fetchEventsWithPagination({
      $top: pagination.pageSize,
      $skip: skip,
      $filter: buildFilterString(filters),
      $orderBy: filters.orderBy
    });
  }, [pagination.page, pagination.pageSize, filters]);

  const { data: response, loading, error, refetch } = useApi(fetchEventsCallback, [pagination.page, pagination.pageSize, filters]);

  // Extract events and pagination info from response
  const events = response?.data || [];
  const totalCount = response?.totalCount || 0;

  // Update pagination info when response changes
  React.useEffect(() => {
    if (response) {
      setPagination(prev => ({
        ...prev,
        total: totalCount,
        totalPages: Math.ceil(totalCount / prev.pageSize)
      }));
    }
  }, [response, totalCount]);

  const buildFilterString = (filters) => {
    const filterParts = [];
    
    if (filters.search) {
      filterParts.push(`contains(tolower(title), '${filters.search.toLowerCase()}') or contains(tolower(description), '${filters.search.toLowerCase()}')`);
    }
    
    if (filters.category) {
      filterParts.push(`category eq '${filters.category}'`);
    }
    
    if (filters.priority) {
      filterParts.push(`priority eq '${filters.priority}'`);
    }
    
    return filterParts.join(' and ');
  };

  const handlePageChange = (event, newPage) => {
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const handlePageSizeChange = (event) => {
    setPagination(prev => ({
      ...prev,
      pageSize: event.target.value,
      page: 1 // Reset to first page when changing page size
    }));
  };

  const handleFilterChange = (filterType) => (event) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: event.target.value
    }));
    setPagination(prev => ({
      ...prev,
      page: 1 // Reset to first page when filtering
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      priority: '',
      orderBy: 'startDate desc'
    });
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'No time';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleEventAdded = () => {
    refetch(); // Refresh events list after adding new event
    setOpenAddDialog(false);
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value && value !== 'startDate desc').length;
  };

  if (loading && pagination.page === 1) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>Events</Typography>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Events ({totalCount})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddDialog(true)}
        >
          Add Event
        </Button>
      </Box>

      {/* Filters */}
      <Box mb={3}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              placeholder="Search events..."
              value={filters.search}
              onChange={handleFilterChange('search')}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl sx={{ width: 150 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={filters.orderBy}
                onChange={handleFilterChange('orderBy')}
                label="Sort By"
              >
                <MenuItem value="startDate desc">Newest First</MenuItem>
                <MenuItem value="startDate asc">Oldest First</MenuItem>
                <MenuItem value="title asc">Title A-Z</MenuItem>
                <MenuItem value="title desc">Title Z-A</MenuItem>                
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={1}>
            <FormControl sx={{ width: 150 }}>
              <InputLabel>Per Page</InputLabel>
              <Select
                value={pagination.pageSize}
                onChange={handlePageSizeChange}
                label="Per Page"
              >
                <MenuItem value={6}>6</MenuItem>
                <MenuItem value={12}>12</MenuItem>
                <MenuItem value={24}>24</MenuItem>
                <MenuItem value={48}>48</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <Stack direction="row" spacing={1} alignItems="center">
              {getActiveFiltersCount() > 0 && (
                <Chip 
                  label={`${getActiveFiltersCount()} filter${getActiveFiltersCount() > 1 ? 's' : ''}`}
                  size="small"
                  variant="outlined"
                />
              )}
              <Button
                startIcon={<ClearIcon />}
                onClick={handleClearFilters}
                disabled={getActiveFiltersCount() === 0}
                size="small"
              >
                Clear
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {/* Loading overlay for pagination */}
      <Box position="relative">
        {loading && (
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bgcolor="rgba(255, 255, 255, 0.7)"
            display="flex"
            justifyContent="center"
            alignItems="center"
            zIndex={1}
          >
            <CircularProgress />
          </Box>
        )}

        {/* Events Grid */}
        {events.length === 0 ? (
          <Box textAlign="center" py={4}>
            <EventIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No events found
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              {getActiveFiltersCount() > 0 
                ? 'Try adjusting your filters or create a new event'
                : 'Create your first event to get started'
              }
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenAddDialog(true)}
            >
              Create Event
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {events.map((event, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={event.id || index}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    '&:hover': {
                      boxShadow: 4,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s ease-in-out'
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                      <Typography variant="h6" component="h2" noWrap>
                        {event.title || 'Untitled Event'}
                      </Typography>                    
                    </Box>
                    {event.description && (
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {event.description}
                      </Typography>
                    )}
                    
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <ScheduleIcon fontSize="small" color="primary" />
                      <Typography variant="body2">
                        {formatDate(event.startDate)} {formatTime(event.startDate)}<br/>
                        {formatDate(event.endDate)} {formatTime(event.endDate)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.page}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      <AddEventDialog 
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onEventAdded={handleEventAdded}
      />
    </Box>
  );
};

export default Events;