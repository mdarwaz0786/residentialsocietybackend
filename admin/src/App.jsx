import { useState } from 'react';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout/Layout';
import Dashboard from './pages/Dashboard';
import User from './pages/User/User';
import { useAuth } from './context/auth.context';
import Login from './pages/Auth/Login';
import UserDetail from './pages/User/UserDetail';
import CreateUser from './pages/user/createUser';
import NotFound from './pages/NotFound/NotFound';

const App = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isLoggedIn } = useAuth();

  const handleToggleSidebar = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <Routes>
      {!isLoggedIn ? (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <>
          <Route path="/" element={<Layout mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} handleToggleSidebar={handleToggleSidebar} />}>
            <Route index element={<Dashboard />} />
            <Route path="user" element={<User />} />
            <Route path="create-user" element={<CreateUser />} />
            <Route path="user-detail/:id" element={<UserDetail />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </>
      )}
    </Routes>
  );
};

export default App;
