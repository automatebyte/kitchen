import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext';

const validationSchema = Yup.object({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
});

function Login() {
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (values, { setSubmitting }) => {
    setError('');
    
    const result = await login(values.username, values.password);
    
    if (result.success) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.location.href = '/';
    } else {
      setError(result.error);
    }
    setSubmitting(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem' }}>
      <h2>Login</h2>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div style={{ marginBottom: '1rem' }}>
              <Field
                type="text"
                name="username"
                placeholder="Username"
                style={{ width: '100%', padding: '0.5rem' }}
              />
              <ErrorMessage name="username" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <Field
                type="password"
                name="password"
                placeholder="Password"
                style={{ width: '100%', padding: '0.5rem' }}
              />
              <ErrorMessage name="password" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              style={{ width: '100%', padding: '0.5rem' }}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </Form>
        )}
      </Formik>
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Don't have an account? <a href="/register">Register here</a>
      </p>

    </div>
  );
}

export default Login;