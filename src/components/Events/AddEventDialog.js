import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';
import { useApiMutation } from '../../hooks/useApi';
import { createEvent } from '../../api/services';

const AddEventDialog = ({ open, onClose, onEventAdded }) => {
  const { mutate: createNewEvent, loading, error } = useApiMutation();
  
  const [eventForm, setEventForm] = useState({
    title: '',
      description: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: ''
  });



  const handleFormChange = (field) => (event) => {
    setEventForm(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleClose = () => {
    // Reset form when closing
    setEventForm({
      title: '',
      description: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: ''
    });
    onClose();
  };

  const handleSaveEvent = async () => {
    try {
      const eventData = {
        ...eventForm,
        startDate: eventForm.startDate ? `${eventForm.startDate}T${eventForm.startTime || '00:00'}:00` : new Date().toISOString(),
        endDate: eventForm.endDate ? `${eventForm.endDate}T${eventForm.endTime || '00:00'}:00` : new Date().toISOString()
      };

      await createNewEvent(createEvent, eventData);
      handleClose();
      onEventAdded(); // Notify parent component
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const isFormValid = eventForm.title.trim() !== '' && eventForm.date !== '';

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Event</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <TextField
            label="Event Title"
            fullWidth
            value={eventForm.title}
            onChange={handleFormChange('title')}
            required
            error={!eventForm.title.trim() && eventForm.title !== ''}
            helperText={!eventForm.title.trim() && eventForm.title !== '' ? 'Title is required' : ''}
          />
          
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={eventForm.description}
            onChange={handleFormChange('description')}
            placeholder="Enter event description..."
          />
          
          <Box display="flex" gap={2}>
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              value={eventForm.startDate}
              onChange={handleFormChange('startDate')}
              InputLabelProps={{ shrink: true }}
              required
              error={!eventForm.startDate}
              helperText={!eventForm.startDate ? 'Date is required' : ''}
            />
            
            <TextField
              label="Start Time"
              type="time"
              fullWidth
              value={eventForm.startTime}
              onChange={handleFormChange('startTime')}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          <Box display="flex" gap={2}>
            <TextField
              label="EndDate"
              type="date"
              fullWidth
              value={eventForm.endDate}
              onChange={handleFormChange('endDate')}
              InputLabelProps={{ shrink: true }}
              required
              error={!eventForm.endDate}
              helperText={!eventForm.endDate ? 'Date is required' : ''}
            />           

            <TextField
              label="End Time"
              type="time"
              fullWidth
              value={eventForm.endTime}
              onChange={handleFormChange('endTime')}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSaveEvent} 
          variant="contained"
          disabled={loading || !isFormValid}
        >
          {loading ? 'Creating...' : 'Create Event'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEventDialog;