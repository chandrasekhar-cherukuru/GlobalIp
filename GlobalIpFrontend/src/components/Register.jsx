import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, Mail, Lock, Eye, EyeOff, User, ArrowRight, ArrowLeft, CheckCircle, Shield, Search, Globe, BarChart3, Settings } from 'lucide-react';
import axios from '../api/axios';
import Toast from './Toast';
import { useTheme } from '../context/ThemeContext';
import DarkModeToggle from './DarkModeToggle';

const Register = () => {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [toast, setToast] = useState(null);
  const [strength, setStrength] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validation
    if (!username || !firstName || !lastName || !email || !password || !confirmPassword) {
      setToast({ message: 'All fields are required', type: 'error' });
      return;
    }

    if (password !== confirmPassword) {
      setToast({ message: 'Passwords do not match', type: 'error' });
      return;
    }

    if (password.length < 8) {
      setToast({ message: 'Password must be at least 8 characters', type: 'error' });
      return;
    }

    try {
      const response = await axios.post('/register', {
        username,
        email,
        password,
        role
      });

      if (response.data) {
        setToast({ message: 'Registration successful! Redirecting to login...', type: 'success' });
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setToast({ message: errorMessage, type: 'error' });
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorize/google';
  };

  const checkStrength = (pwd) => {
    let strengthLevel = 0;
    if (pwd.length >= 8) strengthLevel++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strengthLevel++;
    if (/\d/.test(pwd)) strengthLevel++;
    if (/[@$!%*?&#]/.test(pwd)) strengthLevel++;

    if (strengthLevel === 4) {
      setStrength('Strong');
    } else if (strengthLevel === 3) {
      setStrength('Medium');
    } else if (strengthLevel >= 1) {
      setStrength('Weak');
    } else {
      setStrength('');
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkStrength(newPassword);
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!firstName || !lastName || !email) {
        setToast({ message: 'Please fill all fields before continuing', type: 'error' });
        return;
      }
    } else if (currentStep === 2) {
      if (!username || !password || !confirmPassword) {
        setToast({ message: 'Please fill all fields before continuing', type: 'error' });
        return;
      }
      if (password !== confirmPassword) {
        setToast({ message: 'Passwords do not match', type: 'error' });
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => setCurrentStep(currentStep - 1);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 relative overflow-hidden transition-colors">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-300 dark:bg-primary-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-300 dark:bg-accent-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-4xl relative z-10">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="absolute top-8 right-8 z-50">
            <DarkModeToggle />
          </div>
          <div className="grid md:grid-cols-5">
            {/* Left Sidebar - Steps */}
            <div className="md:col-span-2 bg-gradient-to-br from-primary-500 to-accent-500 p-8 text-white">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center space-x-2 mb-8 group"
              >
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <span className="font-bold text-lg">GlobalIP</span>
              </button>

              <h2 className="text-3xl font-bold mb-2">Join Us</h2>
              <p className="text-primary-100 mb-12">Create your account in 3 simple steps</p>

              <div className="space-y-6">
                {[
                  { num: 1, title: 'Personal Info', desc: 'Tell us about yourself' },
                  { num: 2, title: 'Account Details', desc: 'Create your credentials' },
                  { num: 3, title: 'Choose Role', desc: 'Select your access level' }
                ].map((step) => (
                  <div key={step.num} className="flex items-start space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                      currentStep >= step.num
                        ? 'bg-white text-primary-600 shadow-lg scale-110'
                        : 'bg-primary-400/30 text-primary-200'
                    }`}>
                      {currentStep > step.num ? <CheckCircle className="w-5 h-5" /> : step.num}
                    </div>
                    <div className={`transition-opacity ${currentStep >= step.num ? 'opacity-100' : 'opacity-50'}`}>
                      <div className="font-semibold">{step.title}</div>
                      <div className="text-sm text-primary-100">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-4 bg-white/10 backdrop-blur-sm rounded-xl flex items-start space-x-2">
                <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-primary-100">
                  <span className="font-semibold">Secure Registration:</span> Your data is encrypted and protected.
                </p>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="md:col-span-3 p-8 sm:p-12">
              <form onSubmit={handleRegister} className="space-y-6">
                {/* Step 1: Personal Info */}
                {currentStep === 1 && (
                  <div className="space-y-6 animate-slide-in-right">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Personal Information</h3>
                      <p className="text-gray-600 dark:text-gray-400">Let's start with the basics</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/50 transition-all outline-none text-gray-900 dark:text-white"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/50 transition-all outline-none text-gray-900 dark:text-white"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/50 transition-all outline-none text-gray-900 dark:text-white"
                          placeholder="john.doe@example.com"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={nextStep}
                      className="w-full py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {/* Step 2: Account Details */}
                {currentStep === 2 && (
                  <div className="space-y-6 animate-slide-in-right">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Account Details</h3>
                      <p className="text-gray-600 dark:text-gray-400">Choose your username and password</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Username</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                        </div>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/50 transition-all outline-none text-gray-900 dark:text-white"
                          placeholder="johndoe123"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={handlePasswordChange}
                          className="w-full pl-12 pr-14 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/50 transition-all outline-none text-gray-900 dark:text-white"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {password && (
                        <div className="mt-2 flex items-center space-x-2">
                          <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                            <div className={`h-full transition-all ${
                              strength === 'Strong' ? 'bg-green-500 w-full' :
                              strength === 'Medium' ? 'bg-yellow-500 w-2/3' :
                              'bg-red-500 w-1/3'
                            }`}></div>
                          </div>
                          <span className={`text-sm font-semibold ${
                            strength === 'Strong' ? 'text-green-600 dark:text-green-400' :
                            strength === 'Medium' ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-red-600 dark:text-red-400'
                          }`}>
                            {strength}
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                        </div>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full pl-12 pr-14 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/50 transition-all outline-none text-gray-900 dark:text-white"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex-1 py-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all flex items-center justify-center space-x-2"
                      >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back</span>
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        className="flex-1 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2"
                      >
                        <span>Continue</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Role Selection */}
                {currentStep === 3 && (
                  <div className="space-y-6 animate-slide-in-right">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Choose Your Role</h3>
                      <p className="text-gray-600 dark:text-gray-400">Select the access level that fits your needs</p>
                    </div>

                    <div className="space-y-4">
                      {[
                        { value: 'USER', title: 'User', desc: 'Search patents and trademarks with basic access', icon: <User className="w-6 h-6" /> },
                        { value: 'ANALYST', title: 'Analyst', desc: 'Advanced analytics and subscription monitoring', icon: <BarChart3 className="w-6 h-6" /> }
                      ].map((roleOption) => (
                        <label
                          key={roleOption.value}
                          className={`flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all ${
                            role === roleOption.value
                              ? 'border-primary-500 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/20 shadow-md'
                              : 'border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                            role === roleOption.value
                              ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                          }`}>
                            {roleOption.icon}
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="font-bold text-gray-900 dark:text-white">{roleOption.title}</div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{roleOption.desc}</p>
                          </div>
                          <input
                            type="radio"
                            name="role"
                            value={roleOption.value}
                            checked={role === roleOption.value}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                          />
                        </label>
                      ))}
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2"
                    >
                      <span>Create Account</span>
                      <CheckCircle className="w-5 h-5" />
                    </button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or continue with</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleGoogleSignup}
                      className="w-full flex items-center justify-center space-x-3 py-3.5 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all font-semibold text-gray-700 dark:text-gray-300"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span>Continue with Google</span>
                    </button>

                    <button
                      type="button"
                      onClick={prevStep}
                      className="w-full py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium flex items-center justify-center space-x-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to previous step</span>
                    </button>
                  </div>
                )}

                <p className="text-center text-gray-600 dark:text-gray-400 text-sm pt-4">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-primary-600 dark:text-primary-400 font-bold hover:text-primary-700 dark:hover:text-primary-300 hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <Toast 
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Register;
