import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext';

const validationSchema = Yup.object({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .required('Username is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/, 'Password must contain at least one letter and one number')
    .required('Password is required')
});

function Register() {
  const [error, setError] = useState('');
  const { register } = useAuth();

  const handleSubmit = async (values, { setSubmitting }) => {
    setError('');
    
    const result = await register(values.username, values.email, values.password);
    
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
      <h2>Register</h2>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      <Formik
        initialValues={{ username: '', email: '', password: '' }}
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
                type="email"
                name="email"
                placeholder="Email"
                style={{ width: '100%', padding: '0.5rem' }}
              />
              <ErrorMessage name="email" component="div" style={{ color: 'red', fontSize: '0.8rem' }} />
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
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Register;