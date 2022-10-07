import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import CategoryAdmin from '../pages/Admin/Category';
import IngredientAdmin from '../pages/Admin/Ingredient';
import ProductAdmin from '../pages/Admin/Product';
import UnitAdmin from '../pages/Admin/Unit';

const AppRoutes = () => {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      <Route path='/' element={<AdminLayout />} >
        <Route index element={<Navigate to="product"/>}/>
        <Route path='/unit' element={<UnitAdmin />} />
        <Route path='/product' element={<ProductAdmin />} />
        <Route path='/ingredient' element={<IngredientAdmin />} />
        <Route path='/category' element={<CategoryAdmin />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;