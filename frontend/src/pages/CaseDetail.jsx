import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  CircularProgress,
  Alert,
  IconButton,
  Grid,
} from '@mui/material';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../hooks/useAuth';

const CaseDetail = () => {
  const { id } = useParams();
  const [caseData, setCaseData] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [comments, setComments] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [newNote, setNewNote] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchCase = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/cases/${id}`);
      setCaseData(res.data.data.case);
      setDocuments(res.data.data.documents);
      setComments(res.data.data.comments);
      setAuditLogs(res.data.data.auditLogs);
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
    fetchCase();
    fetchAgents();
  }, [id]);

  const handleAssign = async (agentId) => {
    try {
      await api.put(`/cases/${id}/assign`, { assignedTo: agentId });
      fetchCase();
      setMessage({ type: 'success', text: 'Case assigned successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to assign case' });
    }
  };

  const handleStatusChange = async (status, note = '') => {
    try {
      await api.put(`/cases/${id}/status`, { status, note });
      fetchCase();
      setMessage({ type: 'success', text: 'Status updated successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update status' });
    }
  };

  const handleAddComment = async () => {
    if (!newComment) return;
    try {
      await api.post(`/cases/${id}/comments`, { content: newComment });
      setNewComment('');
      fetchCase();
      setMessage({ type: 'success', text: 'Comment added successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to add comment' });
    }
  };

  const handleAddNote = async () => {
    if (!newNote) return;
    try {
      await api.put(`/cases/${id}/note`, { note: newNote });
      setNewNote('');
      fetchCase();
      setMessage({ type: 'success', text: 'Note added successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to add note' });
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      await api.post(`/cases/${id}/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSelectedFile(null);
      fetchCase();
      setMessage({ type: 'success', text: 'Document uploaded successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to upload document' });
    }
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

  const getAvailableStatuses = () => {
    const validTransitions = {
      New: ['Assigned'],
      Assigned: ['In Progress'],
      'In Progress': ['Submitted'],
      Submitted: ['Cleared', 'Discrepant'],
      Cleared: [],
      Discrepant: ['In Progress'],
    };
    return validTransitions[caseData?.status] || [];
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <CircularProgress size={60} sx={{ color: '#6366f1' }} />
      </Container>
    );
  }

  if (!caseData) {
    return (
      <Container>
        <Typography>Case not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Button
        startIcon={<ArrowBackIosNewOutlinedIcon />}
        onClick={() => navigate('/')}
        sx={{ mb: 3, fontWeight: 600, color: '#94a3b8' }}
      >
        Back to Cases
      </Button>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3, borderRadius: 2 }}>
          {message.text}
        </Alert>
      )}

      {/* Case Header */}
      <Paper sx={{ p: 4, mb: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#f8fafc', mb: 1 }}>
              {caseData.subject}
            </Typography>
            <Chip
              label={caseData.status}
              color={getStatusColor(caseData.status)}
              sx={{ fontWeight: 600, fontSize: '0.9rem' }}
            />
          </Box>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2.5, backgroundColor: 'rgba(15, 23, 42, 0.6)', borderRadius: 2.5 }}>
              <PersonOutlineOutlinedIcon sx={{ color: '#6366f1', fontSize: 32 }} />
              <Box>
                <Typography variant="caption" sx={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>
                  Client
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#f8fafc' }}>
                  {caseData.clientName}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2.5, backgroundColor: 'rgba(15, 23, 42, 0.6)', borderRadius: 2.5 }}>
              <InsertDriveFileOutlinedIcon sx={{ color: '#a855f7', fontSize: 32 }} />
              <Box>
                <Typography variant="caption" sx={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>
                  Case Type
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#f8fafc' }}>
                  {caseData.caseType}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2.5, backgroundColor: 'rgba(15, 23, 42, 0.6)', borderRadius: 2.5 }}>
              <AccessTimeOutlinedIcon sx={{ color: '#ec4899', fontSize: 32 }} />
              <Box>
                <Typography variant="caption" sx={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>
                  Due Date
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#f8fafc' }}>
                  {new Date(caseData.dueDate).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#94a3b8' }}>
            Assigned To
          </Typography>
          {caseData.assignedTo ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2.5, backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 2.5 }}>
              <Avatar sx={{ bgcolor: '#10b981' }}>{caseData.assignedTo.name.charAt(0)}</Avatar>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#f8fafc' }}>
                  {caseData.assignedTo.name}
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                  {caseData.assignedTo.email}
                </Typography>
              </Box>
            </Box>
          ) : user.role === 'Manager' ? (
            <FormControl fullWidth>
              <InputLabel>Assign to Agent</InputLabel>
              <Select
                value=""
                label="Assign to Agent"
                onChange={(e) => handleAssign(e.target.value)}
                size="large"
              >
                {agents.map((agent) => (
                  <MenuItem key={agent._id} value={agent._id}>
                    {agent.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <Typography variant="body1" sx={{ color: '#64748b' }}>Unassigned</Typography>
          )}
        </Box>

        {/* Status Actions */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#94a3b8' }}>
            Status Actions
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {getAvailableStatuses().map((status) => {
              const isAllowed =
                (user.role === 'Agent' && ['In Progress', 'Submitted'].includes(status)) ||
                (user.role === 'Manager' && ['Cleared', 'Discrepant', 'Assigned'].includes(status));
              if (!isAllowed) return null;

              let buttonColor = 'primary';
              if (status === 'Cleared') buttonColor = 'success';
              if (status === 'Discrepant') buttonColor = 'error';
              if (status === 'In Progress') buttonColor = 'info';

              return (
                <Button
                  key={status}
                  variant="contained"
                  size="large"
                  color={buttonColor}
                  onClick={() => handleStatusChange(status)}
                  sx={{ py: 1.2, px: 3, fontWeight: 700 }}
                >
                  Mark as {status}
                </Button>
              );
            })}
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Notes & Documents */}
        <Grid item xs={12} lg={8}>
          {/* Notes */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#f8fafc' }}>
              Notes
            </Typography>
            {caseData.notes?.length > 0 ? (
              <List sx={{ p: 0 }}>
                {caseData.notes.map((note, index) => (
                  <ListItem key={index} sx={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', mb: 1.5, borderRadius: 2 }}>
                    <ListItemText primary={<Typography sx={{ color: '#f8fafc' }}>{note}</Typography>} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" sx={{ color: '#64748b', textAlign: 'center', py: 4 }}>
                No notes yet
              </Typography>
            )}

            {(user.role === 'Agent' && caseData.assignedTo?._id === user._id) && (
              <Box sx={{ mt: 3 }}>
                <TextField
                  label="Add a note"
                  fullWidth
                  multiline
                  rows={3}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  variant="outlined"
                />
                <Button
                  variant="contained"
                  onClick={handleAddNote}
                  className="gradient-btn"
                  sx={{ mt: 2, py: 1.2, px: 3, fontWeight: 700 }}
                >
                  Add Note
                </Button>
              </Box>
            )}
          </Paper>

          {/* Documents */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#f8fafc' }}>
              Documents
            </Typography>
            {documents.length > 0 ? (
              <List sx={{ p: 0 }}>
                {documents.map((doc) => (
                  <ListItem key={doc._id} sx={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', mb: 1.5, borderRadius: 2 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#3b82f6' }}>
                        <InsertDriveFileOutlinedIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography sx={{ color: '#f8fafc', fontWeight: 500 }}>{doc.fileName}</Typography>}
                      secondary={
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                          Uploaded by {doc.uploadedBy.name} on {new Date(doc.createdAt).toLocaleDateString()}
                        </Typography>
                      }
                    />
                    <IconButton
                      href={`http://localhost:5000/api/cases/documents/${doc._id}/download`}
                      sx={{ color: '#818cf8' }}
                    >
                      <DownloadOutlinedIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" sx={{ color: '#64748b', textAlign: 'center', py: 4 }}>
                No documents uploaded yet
              </Typography>
            )}

            {(user.role === 'Agent' && caseData.assignedTo?._id === user._id) && (
              <Box sx={{ mt: 3 }}>
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  style={{ display: 'block', marginBottom: '1rem', color: '#94a3b8' }}
                />
                <Button
                  variant="contained"
                  onClick={handleFileUpload}
                  disabled={!selectedFile}
                  className="gradient-btn"
                  sx={{ py: 1.2, px: 3, fontWeight: 700 }}
                >
                  Upload Document
                </Button>
              </Box>
            )}
          </Paper>

          {/* Comments */}
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#f8fafc' }}>
              Comments
            </Typography>
            {comments.length > 0 ? (
              <List sx={{ p: 0 }}>
                {comments.map((comment) => (
                  <ListItem key={comment._id} sx={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', mb: 1.5, borderRadius: 2, alignItems: 'flex-start' }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#ec4899' }}>{comment.createdBy.name.charAt(0)}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#f8fafc' }}>
                            {comment.createdBy.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748b' }}>
                            {new Date(comment.createdAt).toLocaleString()}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography variant="body1" sx={{ color: '#cbd5e1', mt: 0.5 }}>
                          {comment.content}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" sx={{ color: '#64748b', textAlign: 'center', py: 4 }}>
                No comments yet
              </Typography>
            )}

            <Box sx={{ mt: 3 }}>
              <TextField
                label="Add a comment"
                fullWidth
                multiline
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                variant="outlined"
              />
              <Button
                variant="contained"
                onClick={handleAddComment}
                className="gradient-btn"
                sx={{ mt: 2, py: 1.2, px: 3, fontWeight: 700 }}
              >
                Add Comment
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Audit Log */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#f8fafc' }}>
              Audit Log
            </Typography>
            {auditLogs.length > 0 ? (
              <List sx={{ p: 0 }}>
                {auditLogs.map((log, index) => (
                  <ListItem
                    key={log._id}
                    sx={{
                      backgroundColor: 'rgba(15, 23, 42, 0.6)',
                      mb: 1.5,
                      borderRadius: 2,
                      position: 'relative',
                      pl: 4,
                      '&:before': {
                        content: '""',
                        position: 'absolute',
                        left: 16,
                        top: index > 0 ? -24 : 24,
                        bottom: 0,
                        width: 2,
                        bgcolor: 'rgba(148, 163, 184, 0.3)',
                      },
                    }}
                  >
                    <Box sx={{ position: 'absolute', left: 12, top: 16, zIndex: 1 }}>
                      <Avatar sx={{ width: 28, height: 28, background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', fontSize: '0.8rem' }}>
                        {log.changedBy.name.charAt(0)}
                      </Avatar>
                    </Box>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center', mb: 0.5 }}>
                          <Chip label={log.previousStatus || 'None'} size="small" variant="outlined" sx={{ borderColor: 'rgba(148, 163, 184, 0.3)', color: '#94a3b8' }} />
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#94a3b8' }}>→</Typography>
                          <Chip label={log.newStatus} size="small" color={getStatusColor(log.newStatus)} />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: '#f8fafc' }}>
                            {log.changedBy.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748b' }}>
                            {new Date(log.createdAt).toLocaleString()}
                          </Typography>
                          {log.note && (
                            <Typography variant="body2" sx={{ mt: 1, color: '#cbd5e1' }}>
                              {log.note}
                            </Typography>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" sx={{ color: '#64748b', textAlign: 'center', py: 4 }}>
                No audit logs yet
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CaseDetail;
