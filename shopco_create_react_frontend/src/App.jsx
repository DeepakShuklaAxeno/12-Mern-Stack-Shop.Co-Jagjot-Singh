import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Products from './pages/Products'
import Header from './components/Header'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Profile from './pages/Profile'
import AdminDashboard from './pages/AdminDashboard'
import AdminProductForm from './pages/AdminProductForm'
import Categories from './pages/Categories'
import Orders from './pages/Orders'
import OrderDetails from './pages/OrderDetails'

export default function App() {
    return <BrowserRouter>
        <Header />
            <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/products" element={<Products />}/>
                <Route path="/categories" element={<Categories />}/>
                <Route path="/products/:productId" element={<ProductDetails />}/>
                <Route path="/cart" element={<Cart />}/>
                <Route path="/profile" element={<Profile />}/>
                <Route path="/orders" element={<Orders />}/>
                <Route path="/orders/:orderId" element={<OrderDetails />}/>
                <Route path="/admin" element={<AdminDashboard />}/>
                <Route path="/admin/products/new" element={<AdminProductForm />}/>
                <Route path="/admin/products/:productId/edit" element={<AdminProductForm />}/>
                <Route path="/login" element={<Login key="login" signup={false}/>}/>
                <Route path="/signup" key="signup" element={<Login signup={true}/>}/>
            </Routes>
        </BrowserRouter>

}

