import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loginUser, registerUser, clearError } from '../../features/auth/authSlice';
import { toast } from 'react-toastify';
import './login.css';

const Login: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const loginFormik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values) => {
      try {
        await dispatch(loginUser(values)).unwrap();
        toast.success('Login successful!');
      } catch (err: any) {
        // Show error immediately
        const errorMessage = err || 'Login failed. Please check your credentials.';
        toast.error(errorMessage);
      }
    },
  });

  const registerFormik = useFormik({
    initialValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[\W_]/, 'Password must contain at least one special character')
        .required('Password is required'),
      firstName: Yup.string().required('First name is required'),
      lastName: Yup.string().required('Last name is required'),
    }),
    onSubmit: async (values) => {
      try {
        await dispatch(registerUser(values)).unwrap();
        toast.success('Registration successful!');
      } catch (err: any) {
        // Show error immediately
        const errorMessage = err || 'Registration failed. Please try again.';
        toast.error(errorMessage);
      }
    },
  });

  const handleToggleMode = () => {
    setIsSignUp(!isSignUp);
    loginFormik.resetForm();
    registerFormik.resetForm();
  };

  return (
    <div className="login-container">
      <div className="nav">
        <a href="/">
          <img src="/images/login-logo.svg" alt="LinkedIn Logo" />
        </a>

        <div className="login-join">
          <button type="button" className="join" onClick={handleToggleMode}>
            {isSignUp ? 'Sign In' : 'Join now'}
          </button>
          <button type="button" className="sign-in" onClick={handleToggleMode}>
            {isSignUp ? 'Already have an account?' : 'Sign in'}
          </button>
        </div>
      </div>

      <div className="login-section">
        <div className="login-hero">
          <div className="hero-text">
            <h1>Welcome to your professional community</h1>

            {!isSignUp ? (
              // Login Form
              <form onSubmit={loginFormik.handleSubmit} className="auth-form">
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={loginFormik.values.email}
                    onChange={loginFormik.handleChange}
                    onBlur={loginFormik.handleBlur}
                    className={loginFormik.touched.email && loginFormik.errors.email ? 'error' : ''}
                  />
                  {loginFormik.touched.email && loginFormik.errors.email && (
                    <span className="error-text">{loginFormik.errors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={loginFormik.values.password}
                    onChange={loginFormik.handleChange}
                    onBlur={loginFormik.handleBlur}
                    className={loginFormik.touched.password && loginFormik.errors.password ? 'error' : ''}
                  />
                  {loginFormik.touched.password && loginFormik.errors.password && (
                    <span className="error-text">{loginFormik.errors.password}</span>
                  )}
                </div>

                <button type="submit" className="submit-btn" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </form>
            ) : (
              // Register Form
              <form onSubmit={registerFormik.handleSubmit} className="auth-form">
                <div className="form-group">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={registerFormik.values.firstName}
                    onChange={registerFormik.handleChange}
                    onBlur={registerFormik.handleBlur}
                    className={registerFormik.touched.firstName && registerFormik.errors.firstName ? 'error' : ''}
                  />
                  {registerFormik.touched.firstName && registerFormik.errors.firstName && (
                    <span className="error-text">{registerFormik.errors.firstName}</span>
                  )}
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={registerFormik.values.lastName}
                    onChange={registerFormik.handleChange}
                    onBlur={registerFormik.handleBlur}
                    className={registerFormik.touched.lastName && registerFormik.errors.lastName ? 'error' : ''}
                  />
                  {registerFormik.touched.lastName && registerFormik.errors.lastName && (
                    <span className="error-text">{registerFormik.errors.lastName}</span>
                  )}
                </div>

                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={registerFormik.values.email}
                    onChange={registerFormik.handleChange}
                    onBlur={registerFormik.handleBlur}
                    className={registerFormik.touched.email && registerFormik.errors.email ? 'error' : ''}
                  />
                  {registerFormik.touched.email && registerFormik.errors.email && (
                    <span className="error-text">{registerFormik.errors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password (min 8 chars, 1 uppercase, 1 number, 1 special)"
                    value={registerFormik.values.password}
                    onChange={registerFormik.handleChange}
                    onBlur={registerFormik.handleBlur}
                    className={registerFormik.touched.password && registerFormik.errors.password ? 'error' : ''}
                  />
                  {registerFormik.touched.password && registerFormik.errors.password && (
                    <span className="error-text">{registerFormik.errors.password}</span>
                  )}
                </div>

                <button type="submit" className="submit-btn" disabled={isLoading}>
                  {isLoading ? 'Signing up...' : 'Agree & Join'}
                </button>
              </form>
            )}

            <div className="divider">
              <span>or</span>
            </div>

            <div className="google-form">
              <button type="button" className="google-btn" disabled>
                <img src="/images/google.svg" alt="Google" />
                Sign in with Google (Coming Soon)
              </button>
            </div>
          </div>
          <img src="/images/login-hero.svg" alt="LinkedIn Hero" />
        </div>
      </div>
    </div>
  );
};

export default Login;
