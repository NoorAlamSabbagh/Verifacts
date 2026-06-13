import { AppBar, Toolbar, Typography, Button, Box, Avatar, IconButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import TrackChangesOutlinedIcon from '@mui/icons-material/TrackChangesOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If on login page, don't show the app bar
  if (location.pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar
        position="static"
        sx={{
          background: 'transparent',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(148, 163, 184, 0.15)',
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }} onClick={() => navigate('/')}>
            <Box
              sx={{
                width: 48,
                height: 48,
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TrackChangesOutlinedIcon sx={{ color: '#fff', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Mini Case Tracker
              </Typography>
            </Box>
          </Box>

          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  }}
                >
                  {user.name.charAt(0)}
                </Avatar>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {user.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500 }}>
                    {user.role}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  startIcon={<AssignmentOutlinedIcon />}
                  onClick={() => navigate('/')}
                  sx={{
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 600,
                    color: location.pathname === '/' ? '#818cf8' : '#94a3b8',
                    backgroundColor: location.pathname === '/' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(99, 102, 241, 0.15)',
                    },
                  }}
                >
                  Cases
                </Button>
                <IconButton
                  onClick={logout}
                  sx={{
                    backgroundColor: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: 3,
                    '&:hover': {
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      borderColor: 'rgba(239, 68, 68, 0.3)',
                    },
                  }}
                >
                  <LogoutOutlinedIcon sx={{ color: '#94a3b8' }} />
                </IconButton>
              </Box>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
