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
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../hooks/useAuth';

const CaseList = () => {
  const [cases, setCases] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', status: '', assignedTo: '' });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchCases = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };
      const res = await api.get('/cases', { params });
      setCases(res.data.data);
      setPagination({ ...pagination, total: res.data.pagination.total, pages: res.data.pagination.pages });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
      case 'New': return 'default';
      case 'Assigned': return 'primary';
      case 'In Progress': return 'info';
      case 'Submitted': return 'warning';
      case 'Cleared': return 'success';
      case 'Discrepant': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Cases</Typography>
        {user.role === 'Manager' && (
          <Button variant="contained" onClick={() => navigate('/cases/new')}>
            New Case
          </Button>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Search"
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          sx={{ flexGrow: 1 }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status}
            label="Status"
            name="status"
            onChange={handleFilterChange}
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Client Name</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Case Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Due Date</TableCell>
              {user.role === 'Manager' && <TableCell>Assigned To</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {cases.map((caseItem) => (
              <TableRow
                key={caseItem._id}
                hover
                onClick={() => navigate(`/cases/${caseItem._id}`)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{caseItem.clientName}</TableCell>
                <TableCell>{caseItem.subject}</TableCell>
                <TableCell>{caseItem.caseType}</TableCell>
                <TableCell>
                  <Chip label={caseItem.status} color={getStatusColor(caseItem.status)} />
                </TableCell>
                <TableCell>{new Date(caseItem.dueDate).toLocaleDateString()}</TableCell>
                {user.role === 'Manager' && (
                  <TableCell>{caseItem.assignedTo?.name || 'Unassigned'}</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {pagination.pages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={pagination.pages}
            page={pagination.page}
            onChange={(e, page) => setPagination({ ...pagination, page })}
          />
        </Box>
      )}
    </Container>
  );
};

export default CaseList;
