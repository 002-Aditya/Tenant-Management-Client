import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route /* , Navigate */ } from 'react-router-dom';
import './App.css';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import { Toaster } from './components/ui/sonner';
import OwnerDetails from "@/components/OwnerDetails";
import Tenants from "@/components/Tenants";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //   const token = localStorage.getItem('auth_token');
    //   if (token) {
    //     setIsAuthenticated(true);
    //   }
    //   setLoading(false);
    // }, []);

    // const handleLogin = (token) => {
    //   localStorage.setItem('auth_token', token);
    //   setIsAuthenticated(true);
    // };

    const handleLogout = () => {
      localStorage.removeItem('auth_token');
      setIsAuthenticated(false);
    };

    // if (loading) {
    //   return (
    //     <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-50 flex items-center justify-center">
    //       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    //     </div>
    //   );
    // }

    return (
        <>
        <div className="App min-h-screen">
            <Router>
                <Routes>
                    <Route path="/" element={<LoginPage /* onLogin={handleLogin} */ />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/dashboard" element={<Dashboard onLogout={handleLogout} />} />
                    <Route path="/owner-info" element={<OwnerDetails onLogout={handleLogout} />} />
                    <Route path="/tenant-details" element={<Tenants onLogout={handleLogout} />} />
                    {/* Additional routes will be added later */}
                </Routes>
            </Router>
            <Toaster position="top-right" richColors />
        </div>
        </>
    );
}

export default App;