// App.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../Pages/Home';
import ProductDetail from '../Pages/ProductDetail';
import Login from '../Pages/Login';
import Dashboard from '../Pages/Dashboard';
import AddCategory from '../Pages/AddCategory';
// import './index.css'


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/addcategory" element={<AddCategory/>} />
    </Routes>
  );
};

export default App;
