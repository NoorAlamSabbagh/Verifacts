import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import CaseList from './pages/CaseList';
import CaseDetail from './pages/CaseDetail';
import NewCase from './pages/NewCase';
import { useAuth } from './hooks/useAuth';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

const AppContent = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <CaseList />
            </ProtectedRoute>
          } />
          <Route path="/cases/:id" element={
            <ProtectedRoute>
              <CaseDetail />
            </ProtectedRoute>
          } />
          <Route path="/cases/new" element={
            <ProtectedRoute>
              <NewCase />
            </ProtectedRoute>
          } />
        </Routes>
      </Layout>
    </Router>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
