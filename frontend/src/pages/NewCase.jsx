import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  Grid,
} from '@mui/material';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const NewCase = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    subject: '',
    caseType: '',
    dueDate: '',
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
    <Container maxWidth="md">
      <Button
        startIcon={<ArrowBackIosNewOutlinedIcon />}
        onClick={() => navigate('/')}
        sx={{ mb: 3, fontWeight: 600, color: '#94a3b8' }}
      >
        Back to Cases
      </Button>

      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#f8fafc' }}>
          Create New Case
        </Typography>
        <Typography variant="body1" sx={{ color: '#94a3b8', mb: 4 }}>
          Fill in the details below to create a new case
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Client Name"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                variant="outlined"
                size="large"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Case Type"
                name="caseType"
                value={formData.caseType}
                onChange={handleChange}
                variant="outlined"
                size="large"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                variant="outlined"
                size="large"
              />
            </Grid>
            <Grid item xs={12}>
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
                variant="outlined"
                size="large"
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            className="gradient-btn"
            sx={{
              mt: 4,
              py: 1.8,
              fontWeight: 700,
              fontSize: '1rem',
            }}
          >
            Create Case
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default NewCase;
