import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import About from './pages/About';
import Unauthorized from './pages/Unauthorized';
import KitchenDashboard from './pages/Dashboard/KitchenDashboard';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import KitchenDealsManagement from './pages/Kitchen/KitchenDealsManagement';
import KitchenMenuManagement from './pages/Kitchen/KitchenMenuManagement';
import KitchenOperations from './pages/Kitchen/KitchenOperations';
import KitchenBlogManagement from './components/kitchen/KitchenBlogManagement';

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [location.pathname, location.search]);

  return null;
}

function AppLayout() {
  const location = useLocation();
  const isKitchenRoute = location.pathname.startsWith('/kitchen');

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      {!isKitchenRoute && <Navbar />}
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/about" element={<About />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/track-order" element={<OrderTracking />} />
          <Route path="/track-order/:orderId" element={<OrderTracking />} />

          {/* Protected Kitchen Routes */}
          <Route path="/kitchen" element={
            <ProtectedRoute allowedRoles={['kitchen', 'admin']}>
              <KitchenDashboard />
            </ProtectedRoute>
          } />

          <Route path="/kitchen/orders" element={
            <ProtectedRoute allowedRoles={['kitchen', 'admin']}>
              <KitchenDashboard />
            </ProtectedRoute>
          } />

          <Route path="/kitchen/menu" element={
            <ProtectedRoute allowedRoles={['kitchen', 'admin']}>
              <KitchenMenuManagement />
            </ProtectedRoute>
          } />

          <Route path="/kitchen/deals" element={
            <ProtectedRoute allowedRoles={['kitchen', 'admin']}>
              <KitchenDealsManagement />
            </ProtectedRoute>
          } />

          <Route path="/kitchen/operations" element={
            <ProtectedRoute allowedRoles={['kitchen', 'admin']}>
              <KitchenOperations />
            </ProtectedRoute>
          } />

          <Route path="/kitchen/blog" element={
            <ProtectedRoute allowedRoles={['kitchen', 'admin']}>
              <KitchenBlogManagement />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      {!isKitchenRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppLayout />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#282623',
                color: '#FBF7ED',
              },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
