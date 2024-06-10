import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import {
  AddNewProduct,
  Customers,
  Dashboard,
  OrderDetails,
  Orders,
  Products,
  Login,
} from "./pages";
import RootLayout from "./layouts/RootLayout";


function App() {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  

  return (
    <BrowserRouter>
      <Routes>
        {/* 
              Redirect root path to /login.
              This ensures that if a user navigates to the root URL, they are redirected to the login page.
              This setup avoids conflicts with Django URLs by considering all dashboard-related routes under /dashboard.
              It provides the flexibility to serve the dashboard via Django URLs and views or as an independent host/port.
            */}
        

        {/* 
              Dashboard routes that require RootLayout.
              These routes are nested under /dashboard to avoid conflicts with Django and to ensure a consistent layout.
            */}
        {accessToken && refreshToken ? (
          <Route path="/dashboard" element={<RootLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetails />} />
            <Route path="products" element={<Products />} />
            <Route
              path="products/add-new-product"
              element={<AddNewProduct />}
            />
            <Route path="customers" element={<Customers />} />
            
          </Route>
        ) : (
          <>
          <Route path="/" element={<Navigate to="dashboard/login" replace />} />
          <Route path="*" element={<Navigate to="/dashboard/login" />} />
          </>
        )}

        {/* 
              Login route.
              This route is outside the RootLayout to provide a distinct layout for the login page.
            */}
        <Route path="dashboard/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
