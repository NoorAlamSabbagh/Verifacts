import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  Avatar,
  IconButton,
  InputAdornment,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import TrackChangesOutlinedIcon from '@mui/icons-material/TrackChangesOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, md: 4 },
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr' },
          gap: { xs: 2, md: 4 },
          maxWidth: '1200px',
          width: '100%',
        }}
      >
        {/* Left Section */}
        <Paper
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.15) 100%)',
              zIndex: -1,
            },
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 3,
              }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  borderRadius: 3,
                }}
              >
                <TrackChangesOutlinedIcon sx={{ fontSize: 48, color: '#fff' }} />
              </Avatar>
              <Box>
                <Typography variant="caption" sx={{ letterSpacing: 2, color: '#94a3b8', fontWeight: 600 }}>
                  MINI CASE TRACKER
                </Typography>
              </Box>
            </Box>
          </Box>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Smart Case
            <br />
            Management Hub
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: '#94a3b8',
              mb: 4,
              lineHeight: 1.8,
            }}
          >
            Track, manage, and resolve cases efficiently.
            Keep your team organized and clients satisfied.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 1,
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                borderRadius: 5,
                border: '1px solid rgba(148, 163, 184, 0.2)',
              }}
            >
              <ShieldOutlinedIcon sx={{ fontSize: 16, color: '#6366f1' }} />
              <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                Role-based access
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 1,
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                borderRadius: 5,
                border: '1px solid rgba(148, 163, 184, 0.2)',
              }}
            >
              <TrackChangesOutlinedIcon sx={{ fontSize: 16, color: '#a855f7' }} />
              <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                Status tracking
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 1,
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                borderRadius: 5,
                border: '1px solid rgba(148, 163, 184, 0.2)',
              }}
            >
              <DescriptionOutlinedIcon sx={{ fontSize: 16, color: '#10b981' }} />
              <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                Documents & notes
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2,
                p: 2,
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                borderRadius: 3,
                border: '1px solid rgba(148, 163, 184, 0.2)',
              }}
            >
              <ShieldOutlinedIcon sx={{ color: '#6366f1', mt: 0.5 }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#f8fafc' }}>
                  Role-based security
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                  Protected access by user type (Manager/Agent).
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2,
                p: 2,
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                borderRadius: 3,
                border: '1px solid rgba(148, 163, 184, 0.2)',
              }}
            >
              <TrackChangesOutlinedIcon sx={{ color: '#a855f7', mt: 0.5 }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#f8fafc' }}>
                  Status flow tracking
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                  Complete audit log of all changes.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Right Section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton
              sx={{
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                '&:hover': { backgroundColor: 'rgba(30, 41, 59, 0.7)' },
              }}
            >
              <HelpOutlineOutlinedIcon sx={{ color: '#94a3b8' }} />
            </IconButton>
          </Box>

          <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              Case Tracker Portal
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 4 }}>
              Manage your team's cases with precision and speed.
            </Typography>

            <Box
              sx={{
                display: 'flex',
                gap: 1,
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                borderRadius: 3,
                p: 0.5,
                mb: 3,
              }}
            >
              <Button
                variant="contained"
                disableElevation
                sx={{
                  flex: 1,
                  borderRadius: 2.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(99, 102, 241, 0.1) 100%)',
                  color: '#818cf8',
                  border: '1px solid rgba(99, 102, 241, 0.5)',
                }}
              >
                Manager
              </Button>
              <Button
                variant="text"
                sx={{
                  flex: 1,
                  borderRadius: 2.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  color: '#94a3b8',
                }}
              >
                Agent
              </Button>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Username"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineOutlinedIcon sx={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                }}
                placeholder="e.g. manager@example.com"
                sx={{ mb: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? (
                          <VisibilityOffOutlinedIcon sx={{ color: '#94a3b8' }} />
                        ) : (
                          <VisibilityOutlinedIcon sx={{ color: '#94a3b8' }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                placeholder="Enter your password"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                className="gradient-btn"
                sx={{
                  mt: 3,
                  py: 1.8,
                }}
              >
                Sign In To Case Tracker
              </Button>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 2 }}>
                © {new Date().getFullYear()} Mini Case Tracker. All rights reserved.
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#94a3b8',
                    cursor: 'pointer',
                    '&:hover': { color: '#f8fafc' },
                  }}
                >
                  Terms
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#94a3b8',
                    cursor: 'pointer',
                    '&:hover': { color: '#f8fafc' },
                  }}
                >
                  Privacy
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
