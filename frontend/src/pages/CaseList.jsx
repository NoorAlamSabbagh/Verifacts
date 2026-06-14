import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Chip,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../hooks/useAuth';

const CaseList = () => {
  const [cases, setCases] = useState([]);
  const [agents, setAgents] = useState([]);
  const [filters, setFilters] = useState({ search: '', status: '', assignedTo: '' });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchCases = async () => {
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      };
      const res = await api.get('/cases', { params });
      setCases(res.data.data);
      setPagination({ ...pagination, total: res.data.pagination.total, pages: res.data.pagination.pages });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAgents = async () => {
    if (user.role === 'Manager') {
      try {
        const res = await api.get('/cases/agents');
        setAgents(res.data.data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchCases();
    fetchAgents();
  }, [filters, pagination.page]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPagination({ ...pagination, page: 1 });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New':
        return 'default';
      case 'Assigned':
        return 'primary';
      case 'In Progress':
        return 'info';
      case 'Submitted':
        return 'warning';
      case 'Cleared':
        return 'success';
      case 'Discrepant':
        return 'error';
      default:
        return 'default';
    }
  };

  const stats = {
    total: pagination.total,
    new: cases.filter((c) => c.status === 'New').length,
    inProgress: cases.filter((c) => c.status === 'In Progress').length,
    submitted: cases.filter((c) => c.status === 'Submitted').length,
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#f8fafc', mb: 1 }}>
            Cases Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: '#94a3b8' }}>
            View and manage all your team's cases
          </Typography>
        </Box>
        {user.role === 'Manager' && (
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => navigate('/cases/new')}
            className="gradient-btn"
            sx={{
              py: 1.5,
              px: 3,
            }}
          >
            New Case
          </Button>
        )}
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid rgba(148, 163, 184, 0.2)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#94a3b8', letterSpacing: 1, fontWeight: 600 }}>
                    TOTAL CASES
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700, mt: 1, color: '#f8fafc' }}>
                    {stats.total}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0.05) 100%)',
                    borderRadius: 2.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AddIcon sx={{ color: '#6366f1' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid rgba(148, 163, 184, 0.2)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#94a3b8', letterSpacing: 1, fontWeight: 600 }}>
                    NEW
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700, mt: 1, color: '#f8fafc' }}>
                    {stats.new}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.05) 100%)',
                    borderRadius: 2.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AddIcon sx={{ color: '#10b981' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid rgba(148, 163, 184, 0.2)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#94a3b8', letterSpacing: 1, fontWeight: 600 }}>
                    IN PROGRESS
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700, mt: 1, color: '#f8fafc' }}>
                    {stats.inProgress}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.05) 100%)',
                    borderRadius: 2.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AddIcon sx={{ color: '#3b82f6' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid rgba(148, 163, 184, 0.2)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#94a3b8', letterSpacing: 1, fontWeight: 600 }}>
                    SUBMITTED
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700, mt: 1, color: '#f8fafc' }}>
                    {stats.submitted}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.05) 100%)',
                    borderRadius: 2.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AddIcon sx={{ color: '#f59e0b' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <TextField
            label="Search cases..."
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            sx={{ flexGrow: 1, minWidth: 250 }}
            variant="outlined"
            size="medium"
          />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              name="status"
              onChange={handleFilterChange}
              size="medium"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="New">New</MenuItem>
              <MenuItem value="Assigned">Assigned</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Submitted">Submitted</MenuItem>
              <MenuItem value="Cleared">Cleared</MenuItem>
              <MenuItem value="Discrepant">Discrepant</MenuItem>
            </Select>
          </FormControl>
          {user.role === 'Manager' && (
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Agent</InputLabel>
              <Select
                value={filters.assignedTo}
                label="Agent"
                name="assignedTo"
                onChange={handleFilterChange}
                size="medium"
              >
                <MenuItem value="">All</MenuItem>
                {agents.map((agent) => (
                  <MenuItem key={agent._id} value={agent._id}>
                    {agent.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>
      </Paper>

      {/* Cases Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '1px solid rgba(148, 163, 184, 0.15)' }}>
                Client Name
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '1px solid rgba(148, 163, 184, 0.15)' }}>
                Subject
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '1px solid rgba(148, 163, 184, 0.15)' }}>
                Case Type
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '1px solid rgba(148, 163, 184, 0.15)' }}>
                Status
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '1px solid rgba(148, 163, 184, 0.15)' }}>
                Due Date
              </TableCell>
              {user.role === 'Manager' && (
                <TableCell sx={{ fontWeight: 700, color: '#94a3b8', borderBottom: '1px solid rgba(148, 163, 184, 0.15)' }}>
                  Assigned To
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {cases.map((caseItem) => (
              <TableRow
                key={caseItem._id}
                hover
                onClick={() => navigate(`/cases/${caseItem._id}`)}
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: 'rgba(30, 41, 59, 0.6)',
                  },
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                <TableCell sx={{ color: '#f8fafc', borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }}>
                  {caseItem.clientName}
                </TableCell>
                <TableCell sx={{ color: '#f8fafc', borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }}>
                  {caseItem.subject}
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }}>
                  <Chip
                    label={caseItem.caseType}
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: 'rgba(99, 102, 241, 0.5)',
                      color: '#818cf8',
                      fontWeight: 600,
                    }}
                  />
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }}>
                  <Chip
                    label={caseItem.status}
                    color={getStatusColor(caseItem.status)}
                    sx={{ fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell sx={{ color: '#f8fafc', borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }}>
                  {new Date(caseItem.dueDate).toLocaleDateString()}
                </TableCell>
                {user.role === 'Manager' && (
                  <TableCell sx={{ color: '#f8fafc', borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }}>
                    {caseItem.assignedTo?.name || <span style={{ color: '#64748b' }}>Unassigned</span>}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={pagination.pages}
            page={pagination.page}
            onChange={(e, page) => setPagination({ ...pagination, page })}
            size="large"
            sx={{
              '& .MuiPaginationItem-root': {
                borderRadius: 2,
                color: '#94a3b8',
                border: '1px solid rgba(148, 163, 184, 0.2)',
              },
              '& .Mui-selected': {
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                color: '#fff',
                border: 'none',
              },
            }}
          />
        </Box>
      )}
    </Container>
  );
};

export default CaseList;
