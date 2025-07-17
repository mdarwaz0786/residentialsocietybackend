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
import CreateFlatOwner from './pages/FlatOwner/CreateFlatOwner';
import FlatOwner from './pages/FlatOwner/FlatOwner';
import UpdateFlatOwner from './pages/FlatOwner/UpdateFlatOwner';
import FlatOwnerDetail from './pages/FlatOwner/FlatOwnerDetail';
import SecurityGuard from './pages/SecurityGuard/SecurityGuard';
import CreateSecurityGuard from './pages/SecurityGuard/CreateSecurityGuard';
import UpdateSecurityGuard from './pages/SecurityGuard/UpdateSecurityGuard';
import SecurityGuardDetail from './pages/SecurityGuard/SecurityGuardDetail';
import MaintenanceStaff from './pages/MaintenanceStaff/MaintenanceStaff';
import CreateMaintenanceStaff from './pages/MaintenanceStaff/CreateMaintenanceStaff';
import UpdateMaintenanceStaff from './pages/MaintenanceStaff/UpdateMaintenaceStaff';
import MaintenanceStaffDetail from './pages/MaintenanceStaff/MaintenanceStaffDetail';
import Role from './pages/Role/Role';
import Maid from './pages/Maid/Maid';
import Tenant from './pages/Tenant/Tenant';
import Visitor from './pages/Visitor/Visitor';

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
            <Route path="flat-owner" element={<FlatOwner />} />
            <Route path="create-flat-owner" element={<CreateFlatOwner />} />
            <Route path="update-flat-owner/:id" element={<UpdateFlatOwner />} />
            <Route path="flat-owner-detail/:id" element={<FlatOwnerDetail />} />
            <Route path="security-guard" element={<SecurityGuard />} />
            <Route path="create-security-guard" element={<CreateSecurityGuard />} />
            <Route path="update-security-guard/:id" element={<UpdateSecurityGuard />} />
            <Route path="security-guard-detail/:id" element={<SecurityGuardDetail />} />
            <Route path="maintenance-staff" element={<MaintenanceStaff />} />
            <Route path="create-maintenance-staff" element={<CreateMaintenanceStaff />} />
            <Route path="update-maintenance-staff/:id" element={<UpdateMaintenanceStaff />} />
            <Route path="maintenance-staff-detail/:id" element={<MaintenanceStaffDetail />} />
            <Route path="role" element={<Role />} />
            <Route path="maid" element={<Maid />} />
            <Route path="tenant" element={<Tenant />} />
            <Route path="visitor" element={<Visitor />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </>
      )}
    </Routes>
  );
};

export default App;
