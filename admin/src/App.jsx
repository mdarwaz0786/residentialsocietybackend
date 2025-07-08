import React, { useState } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import AddProduct from './pages/Product/AddProduct';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/Product/ProductList';
import UserList from './pages/User/UserList.jsx';

const App = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggleSidebar = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <Routes>
      <Route path="/" element={<Layout mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} handleToggleSidebar={handleToggleSidebar} />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<ProductList />} />
        <Route path="add-product" element={<AddProduct />} />
        <Route path="all-user" element={<UserList />} />
      </Route>
    </Routes>
  );
};

export default App;
