import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const NewCase = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    subject: '',
    caseType: '',
    dueDate: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/cases', formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create case');
    }
  };

  return (
    <Container>
      <Button onClick={() => navigate('/')} sx={{ mb: 2 }}>
        &larr; Back to Cases
      </Button>
      <Typography variant="h4" sx={{ mb: 3 }}>New Case</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          label="Client Name"
          name="clientName"
          value={formData.clientName}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Case Type"
          name="caseType"
          value={formData.caseType}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Due Date"
          name="dueDate"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.dueDate}
          onChange={handleChange}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3 }}
        >
          Create Case
        </Button>
      </Box>
    </Container>
  );
};

export default NewCase;
