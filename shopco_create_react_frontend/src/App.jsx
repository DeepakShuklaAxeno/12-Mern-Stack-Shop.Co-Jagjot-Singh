import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layouts/layout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Categories from "./pages/Categories";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProductForm from "./pages/AdminProductForm";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path = "/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:productId" element={<ProductDetails />} />
          <Route path="categories" element={<Categories />} />
          <Route path="cart" element={<Cart />} />
          <Route path="profile" element={<Profile />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:orderId" element={<OrderDetails />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/products/new" element={<AdminProductForm />} />
          <Route
            path="admin/products/:productId/edit"
            element={<AdminProductForm />}
          />
        </Route>

        <Route path="/login" element={<Login signup={false} />} />
        <Route path="/signup" element={<Login signup />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

