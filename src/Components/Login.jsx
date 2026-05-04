import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ShoppingCart, Store } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      console.log('🚀 Starting login request...');
      
      const response = await fetch('https://agromart-4tnl.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
      
      // Try to parse response even if not ok
      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
        console.log('📦 Response data:', data);
      } else {
        const text = await response.text();
        console.log('📦 Response text:', text);
        throw new Error('Server returned non-JSON response');
      }
      
      // Check for successful login (status 200-299 OR data contains token)
      if (response.ok || data.token) {
        console.log('✅ Login successful!');
        console.log('✅ Token:', data.token ? 'Present' : 'Missing');
        
        // Extract user role
        const userRole = data.userType || data.role || data.user?.userType || data.user?.role;
        console.log('👤 User role from backend:', userRole);
        
        if (!userRole) {
          console.error('❌ No user role found in response');
          setErrors({ general: 'Unable to determine account type. Please contact support.' });
          setIsLoading(false);
          return;
        }

        const normalizedRole = userRole.toLowerCase() === 'seller' ? 'seller' : 'buyer';
        console.log('✨ Normalized role:', normalizedRole);
        
        // Store token
        if (data.token) {
          localStorage.setItem('token', data.token);
          console.log('💾 Token saved to localStorage');
        } else {
          console.warn('⚠️ No token in response!');
        }
        
        // Store user data
        const userData = {
          fullName: data.fullName || data.name || data.user?.fullName || data.user?.name || '',
          email: data.email || data.user?.email || formData.email,
          _id: data._id || data.id || data.user?._id || data.user?.id || '',
          userType: normalizedRole,
          phone: data.phone || data.user?.phone || '',
          address: data.address || data.user?.address || '',
          role: normalizedRole,
          verified: data.verified || data.user?.verified || false
        };
        
        console.log('💾 Storing user data:', userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Verify storage
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        console.log('✅ Verification - User stored:', storedUser ? 'Yes' : 'No');
        console.log('✅ Verification - Token stored:', storedToken ? 'Yes' : 'No');
        
        // Navigate
        const dashboardRoute = normalizedRole === 'buyer' ? '/buyerdashboard' : '/sellerdashboard';
        console.log(`🚀 Navigating to: ${dashboardRoute}`);
        
        // Force navigation with multiple methods
        setTimeout(() => {
          console.log('🔄 Executing navigate...');
          navigate(dashboardRoute, { replace: true });
          
          // Fallback: force page navigation if React Router fails
          setTimeout(() => {
            if (window.location.pathname !== dashboardRoute) {
              console.log('⚠️ React Router navigation failed, using window.location');
              window.location.href = dashboardRoute;
            }
          }, 500);
        }, 200);
        
      } else {
        // Handle API errors
        console.error('❌ Login failed with status:', response.status);
        console.error('❌ Error data:', data);
        
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ 
            general: data.message || data.error || `Login failed with status ${response.status}. Please try again.` 
          });
        }
      }
    } catch (error) {
      console.error('💥 Login error:', error);
      console.error('💥 Error stack:', error.stack);
      setErrors({ 
        general: `Network error: ${error.message}. Please check your connection and try again.` 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-500 via-green-600 to-indigo-700">
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-3xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <ShoppingCart className="text-green-600" size={32} />
              <Store className="text-green-600" size={32} />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-2">
              AgroMart
            </h1>
            <p className="text-gray-600 text-lg">Welcome Back!</p>
            <p className="text-gray-500 text-sm mt-2">Sign in to your account</p>
          </div>

          {/* General Error Message */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-center">
              ⚠️ {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="flex items-center gap-2 text-gray-700 font-semibold">
                  <Mail size={16} />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className={`w-full px-4 py-4 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 transition-all duration-300 ${
                      errors.email ? 'border-red-500' : 'border-gray-200 focus:border-green-500'
                    }`}
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    ⚠️ {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="flex items-center gap-2 text-gray-700 font-semibold">
                  <Lock size={16} />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className={`w-full px-4 py-4 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 transition-all duration-300 ${
                      errors.password ? 'border-red-500' : 'border-gray-200 focus:border-green-500'
                    }`}
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isLoading}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    ⚠️ {errors.password}
                  </p>
                )}
              </div>

              {/* Form Options */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                    disabled={isLoading}
                  />
                  <span className="text-gray-600 text-sm">Remember me</span>
                </label>
                <a href="#" className="text-green-600 hover:text-green-700 font-semibold text-sm transition-colors">
                  Forgot Password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed relative overflow-hidden"
              >
                <span className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                  Sign In
                </span>
                {isLoading && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  </span>
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;