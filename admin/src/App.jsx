import React, { useState } from 'react';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout/Layout';
import AddProduct from './pages/Product/AddProduct';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/Product/ProductList';
// import UserList from './pages/User/UserList';
import { useAuth } from './context/auth.context';
import Loader from './components/Loader/Loader';
import Login from './pages/Auth/Login';

const App = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isLoggedIn, isLoading } = useAuth();

  const handleToggleSidebar = () => {
    setMobileOpen((prev) => !prev);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Routes>
      {/* Not logged in: only allow /login */}
      {!isLoggedIn ? (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        // Logged in: protected routes
        <Route
          path="/"
          element={
            <Layout
              mobileOpen={mobileOpen}
              setMobileOpen={setMobileOpen}
              handleToggleSidebar={handleToggleSidebar}
            />
          }
        >
          <Route index element={<Dashboard />} />
          {/* <Route path="all-user" element={<UserList />} /> */}
          <Route path="products" element={<ProductList />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      )}
    </Routes>
  );
};

export default App;
