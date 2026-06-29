// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Zap,
  ArrowRight,
  AlertCircle,
  Check,
  X,
  Briefcase,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

// Validation schema
const registerSchema = yup.object({
  username: yup.string().min(3, 'Username must be at least 3 characters').required('Username is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Must contain at least one number')
    .required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  displayName: yup.string().required('Display name is required'),
  careerPath: yup.string(),
  termsAccepted: yup.boolean()
    .oneOf([true], 'You must accept the terms and conditions'),
}).required();

const Register = () => {
  const { register: registerUser, loading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '', color: '' });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      displayName: '',
      careerPath: 'general',
      termsAccepted: false,
    },
  });

  const watchPassword = watch('password');

  const checkPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const levels = [
      { score: 0, label: 'Very Weak', color: 'text-red-400' },
      { score: 1, label: 'Weak', color: 'text-red-400' },
      { score: 2, label: 'Fair', color: 'text-yellow-400' },
      { score: 3, label: 'Good', color: 'text-green-400' },
      { score: 4, label: 'Strong', color: 'text-green-400' },
      { score: 5, label: 'Very Strong', color: 'text-green-400' },
    ];

    return levels[score];
  };

  // Update password strength when password changes
  React.useEffect(() => {
    setPasswordStrength(checkPasswordStrength(watchPassword));
  }, [watchPassword]);

  const onSubmit = async (data) => {
    setError(null);
    const { confirmPassword, termsAccepted, ...userData } = data;
    
    const result = await registerUser(userData);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold gradient-text">Life RPG</h1>
          </div>
          <p className="text-gray-400">Start your journey to level up your life</p>
        </div>

        {/* Register Card */}
        <div className="glass-effect rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            Create Account
          </h2>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Username"
              type="text"
              placeholder="Choose a unique username"
              icon={User}
              error={errors.username?.message}
              {...register('username')}
            />

            <Input
              label="Display Name"
              type="text"
              placeholder="What should we call you?"
              icon={User}
              error={errors.displayName?.message}
              {...register('displayName')}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              error={errors.email?.message}
              {...register('email')}
            />

            <div>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                icon={Lock}
                error={errors.password?.message}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-white transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                {...register('password')}
              />
              {watchPassword && (
                <div className="mt-1">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          passwordStrength.color?.replace('text-', 'bg-')
                        }`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      />
                    </div>
                    <span className={`text-xs ${passwordStrength.color}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <ul className="mt-1 space-y-0.5">
                    {[
                      { test: /.{8,}/, label: 'At least 8 characters' },
                      { test: /[A-Z]/, label: 'At least one uppercase letter' },
                      { test: /[a-z]/, label: 'At least one lowercase letter' },
                      { test: /[0-9]/, label: 'At least one number' },
                    ].map((req) => {
                      const passed = req.test.test(watchPassword);
                      return (
                        <li key={req.label} className="flex items-center gap-1.5 text-xs">
                          {passed ? (
                            <Check className="w-3 h-3 text-green-400" />
                          ) : (
                            <X className="w-3 h-3 text-gray-400" />
                          )}
                          <span className={passed ? 'text-green-400' : 'text-gray-400'}>
                            {req.label}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            <Input
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              icon={Lock}
              error={errors.confirmPassword?.message}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-400 hover:text-white transition"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              {...register('confirmPassword')}
            />

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Career Path
              </label>
              <select
                {...register('careerPath')}
                className="w-full bg-white/5 rounded-lg px-4 py-2.5 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="general">General</option>
                <option value="developer">Developer</option>
                <option value="designer">Designer</option>
                <option value="business">Business</option>
                <option value="student">Student</option>
                <option value="fitness">Fitness</option>
                <option value="creator">Creator</option>
              </select>
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                {...register('termsAccepted')}
                className="w-4 h-4 mt-1 bg-white/5 border border-white/20 rounded focus:ring-primary-500"
              />
              <div>
                <label className="text-sm text-gray-300">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary-400 hover:text-primary-300">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-primary-400 hover:text-primary-300">
                    Privacy Policy
                  </Link>
                </label>
                {errors.termsAccepted && (
                  <p className="text-sm text-red-400 mt-1">{errors.termsAccepted.message}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="large"
              className="w-full"
              loading={loading}
              icon={ArrowRight}
              iconPosition="right"
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary-400 hover:text-primary-300 transition font-medium"
              >
                Sign in now
              </Link>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-primary-400 mb-1">
              <span className="text-xs font-medium">Free to Start</span>
            </div>
            <p className="text-xs text-gray-500">No credit card needed</p>
          </div>
          <div>
            <div className="text-primary-400 mb-1">
              <span className="text-xs font-medium">AI Powered</span>
            </div>
            <p className="text-xs text-gray-500">Personal coach</p>
          </div>
          <div>
            <div className="text-primary-400 mb-1">
              <span className="text-xs font-medium">Track Progress</span>
            </div>
            <p className="text-xs text-gray-500">Level up your life</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;