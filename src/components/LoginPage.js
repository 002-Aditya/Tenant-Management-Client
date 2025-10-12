import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LoginPage = ({ onLogin }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const carouselData = [
    {
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwxfHxwcm9wZXJ0eSUyMG1hbmFnZW1lbnR8ZW58MHx8fHwxNzU5ODE5MTI1fDA&ixlib=rb-4.1.0&q=85",
      title: "Manage Properties Effortlessly",
      description: "Keep track of all your rental properties from one centralized dashboard with complete control over every aspect of property management."
    },
    {
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHxkYXNoYm9hcmR8ZW58MHx8fHwxNzU5ODUwNDQwfDA&ixlib=rb-4.1.0&q=85",
      title: "Real-time Analytics & Reports",
      description: "Monitor your rental income, track payments, and generate comprehensive reports to make informed business decisions."
    },
    {
      image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwyfHxyZW50YWwlMjBwcm9wZXJ0eXxlbnwwfHx8fDE3NTk4NTA0MzB8MA&ixlib=rb-4.1.0&q=85",
      title: "Quality Tenant Management",
      description: "Screen tenants, manage agreements, track rent payments, and maintain detailed records of all tenant interactions."
    },
    {
      image: "https://images.unsplash.com/photo-1626178793926-22b28830aa30?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwyfHxwcm9wZXJ0eSUyMG1hbmFnZW1lbnR8ZW58MHx8fHwxNzU5ODE5MTI1fDA&ixlib=rb-4.1.0&q=85",
      title: "Grow Your Portfolio",
      description: "Scale your property business with tools designed to help landlords manage multiple properties and maximize rental income."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/auth/send-otp`, {
        phone: phoneNumber
      });
      
      toast.success('OTP sent successfully!');
      setShowOtpInput(true);
      // Show OTP in toast for demo purposes
      if (response.data.otp) {
        toast.info(`Demo OTP: ${response.data.otp}`);
      }
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setOtpLoading(true);
    try {
      const response = await axios.post(`${API}/auth/verify-otp`, {
        phone: phoneNumber,
        otp: otp
      });
      
      toast.success('Login successful!');
      onLogin(response.data.token);
    } catch (error) {
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Carousel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 to-cyan-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Carousel Images */}
        <div className="relative w-full h-full">
          {carouselData.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            </div>
          ))}
        </div>

        {/* Carousel Content */}
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <div className="max-w-lg animate-fade-in">
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              {carouselData[currentSlide].title}
            </h1>
            <p className="text-xl mb-8 text-gray-200 leading-relaxed">
              {carouselData[currentSlide].description}
            </p>
            
            {/* Carousel Indicators */}
            <div className="flex space-x-3">
              {carouselData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-white scale-110' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  data-testid={`carousel-indicator-${index}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-gray-100">
        <Card className="w-full max-w-md glass-card animate-scale-in">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-5 4h5" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to manage your properties</p>
            </div>

            {!showOtpInput ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="input-focus transition-all duration-200"
                    data-testid="phone-input"
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full btn-hover-lift transition-all duration-200 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700"
                  disabled={loading}
                  data-testid="send-otp-btn"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Sending OTP...
                    </div>
                  ) : (
                    'Send OTP'
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Enter OTP
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="input-focus transition-all duration-200 text-center text-2xl tracking-widest"
                    data-testid="otp-input"
                  />
                  <p className="text-xs text-gray-500 text-center">
                    OTP sent to {phoneNumber}
                  </p>
                </div>
                
                <Button
                  type="submit"
                  className="w-full btn-hover-lift transition-all duration-200 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700"
                  disabled={otpLoading}
                  data-testid="verify-otp-btn"
                >
                  {otpLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Verifying...
                    </div>
                  ) : (
                    'Verify & Login'
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setShowOtpInput(false);
                    setOtp('');
                  }}
                  data-testid="back-btn"
                >
                  Back to Phone Number
                </Button>
              </form>
            )}

            <div className="mt-8 text-center text-sm text-gray-500">
              Secure login with OTP verification
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;