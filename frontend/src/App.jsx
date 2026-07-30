import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/products" replace />} />
    </Routes>
  );
}
