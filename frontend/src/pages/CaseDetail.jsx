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
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  CircularProgress,
  Alert
} from '@mui/material';
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
        headers: { 'Content-Type': 'multipart/form-data' }
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
      case 'New': return 'default';
      case 'Assigned': return 'primary';
      case 'In Progress': return 'info';
      case 'Submitted': return 'warning';
      case 'Cleared': return 'success';
      case 'Discrepant': return 'error';
      default: return 'default';
    }
  };

  const getAvailableStatuses = () => {
    const validTransitions = {
      'New': ['Assigned'],
      'Assigned': ['In Progress'],
      'In Progress': ['Submitted'],
      'Submitted': ['Cleared', 'Discrepant'],
      'Cleared': [],
      'Discrepant': ['In Progress']
    };
    return validTransitions[caseData?.status] || [];
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
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
    <Container>
      <Button onClick={() => navigate('/')} sx={{ mb: 2 }}>
        &larr; Back to Cases
      </Button>
      {message.text && (
        <Alert severity={message.type} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h4">{caseData.subject}</Typography>
            <Chip label={caseData.status} color={getStatusColor(caseData.status)} sx={{ mt: 1 }} />
          </Box>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mt: 2 }}>
          <Box>
            <Typography variant="subtitle2">Client Name</Typography>
            <Typography>{caseData.clientName}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2">Case Type</Typography>
            <Typography>{caseData.caseType}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2">Due Date</Typography>
            <Typography>{new Date(caseData.dueDate).toLocaleDateString()}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2">Assigned To</Typography>
            <Typography>{caseData.assignedTo?.name || 'Unassigned'}</Typography>
          </Box>
        </Box>

        {user.role === 'Manager' && !caseData.assignedTo && (
          <Box sx={{ mt: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Assign to Agent</InputLabel>
              <Select
                value=""
                label="Assign to Agent"
                onChange={(e) => handleAssign(e.target.value)}
              >
                {agents.map((agent) => (
                  <MenuItem key={agent._id} value={agent._id}>
                    {agent.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Change Status</Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
            {getAvailableStatuses().map((status) => {
              const isAllowed = (
                (user.role === 'Agent' && ['In Progress', 'Submitted'].includes(status)) ||
                (user.role === 'Manager' && ['Cleared', 'Discrepant'].includes(status)) ||
                (user.role === 'Manager' && status === 'Assigned')
              );
              if (!isAllowed) return null;
              return (
                <Button
                  key={status}
                  variant="contained"
                  onClick={() => handleStatusChange(status)}
                >
                  {status}
                </Button>
              );
            })}
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6">Notes</Typography>
        {caseData.notes?.map((note, index) => (
          <ListItem key={index}>
            <ListItemText primary={note} />
          </ListItem>
        ))}
        {(user.role === 'Agent' && caseData.assignedTo?._id === user._id) && (
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Add Note"
              fullWidth
              multiline
              rows={2}
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
            <Button variant="contained" onClick={handleAddNote} sx={{ mt: 1 }}>
              Add Note
            </Button>
          </Box>
        )}
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6">Documents</Typography>
        <List>
          {documents.map((doc) => (
            <ListItem key={doc._id}>
              <ListItemText
                primary={doc.fileName}
                secondary={`Uploaded by ${doc.uploadedBy.name} on ${new Date(doc.createdAt).toLocaleDateString()}`}
              />
              <Button
                href={`http://localhost:5000/api/cases/documents/${doc._id}/download`}
                variant="outlined"
                size="small"
              >
                Download
              </Button>
            </ListItem>
          ))}
        </List>
        {(user.role === 'Agent' && caseData.assignedTo?._id === user._id) && (
          <Box sx={{ mt: 2 }}>
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              style={{ marginBottom: '1rem' }}
            />
            <Button
              variant="contained"
              onClick={handleFileUpload}
              disabled={!selectedFile}
            >
              Upload Document
            </Button>
          </Box>
        )}
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6">Comments</Typography>
        <List>
          {comments.map((comment) => (
            <ListItem key={comment._id}>
              <ListItemAvatar>
                <Avatar>{comment.createdBy.name.charAt(0)}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={comment.createdBy.name}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      {comment.content}
                    </Typography>
                    <br />
                    {new Date(comment.createdAt).toLocaleString()}
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
        <Box sx={{ mt: 2 }}>
          <TextField
            label="Add Comment"
            fullWidth
            multiline
            rows={2}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button variant="contained" onClick={handleAddComment} sx={{ mt: 1 }}>
            Add Comment
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Audit Log</Typography>
        <List>
          {auditLogs.map((log) => (
            <ListItem key={log._id}>
              <ListItemText
                primary={`${log.previousStatus || 'None'} → ${log.newStatus}`}
                secondary={
                  <>
                    {log.changedBy.name} - {new Date(log.createdAt).toLocaleString()}
                    {log.note && <><br />{log.note}</>}
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default CaseDetail;
