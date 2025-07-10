import { useState } from 'react';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layout/Layout';
import Dashboard from './pages/Dashboard';
import User from './pages/User/User';
import { useAuth } from './context/auth.context';
import Login from './pages/Auth/Login';
import UserDetail from './pages/User/UserDetail';
import CreateUser from './pages/user/createUser';
import NotFound from './pages/NotFound/NotFound';
import UpdateUser from './pages/User/UpdateUser';
import CreateVehicle from './pages/Vehicle/CreateVehicle';
import Vehicle from './pages/Vehicle/Vehicle';
import UpdateVehicle from './pages/Vehicle/UpdateVehicle';
import VehicleDetail from './pages/Vehicle/VehicleDetail';
import CreateFlat from './pages/Flat/CreateFlat';
import Flat from './pages/Flat/Flat';
import UpdateFlat from './pages/Flat/UpdateFlat';
import FlatDetail from './pages/Flat/FlatDetail';

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
            <Route path="update-user/:id" element={<UpdateUser />} />
            <Route path="user-detail/:id" element={<UserDetail />} />
            <Route path="vehicle" element={<Vehicle />} />
            <Route path="create-vehicle" element={<CreateVehicle />} />
            <Route path="update-vehicle/:id" element={<UpdateVehicle />} />
            <Route path="vehicle-detail/:id" element={<VehicleDetail />} />
            <Route path="flat" element={<Flat />} />
            <Route path="create-flat" element={<CreateFlat />} />
            <Route path="update-flat/:id" element={<UpdateFlat />} />
            <Route path="flat-detail/:id" element={<FlatDetail />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </>
      )}
    </Routes>
  );
};

export default App;
