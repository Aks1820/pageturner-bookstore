import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password);
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in" style={styles.page}>
      <div className="container" style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <BookOpen size={40} color="var(--accent)" />
            <h1 style={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
            <p style={styles.subtitle}>
              {isLogin ? 'Sign in to continue to PageTurner' : 'Join PageTurner to start reading'}
            </p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            {!isLogin && (
              <div style={styles.inputGroup}>
                <User size={18} color="var(--text-secondary)" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                  style={styles.input}
                />
              </div>
            )}

            <div style={styles.inputGroup}>
              <Mail size={18} color="var(--text-secondary)" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <Lock size={18} color="var(--text-secondary)" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            {error && <p style={styles.error}>{error}</p>}

            <button type="submit" className="btn btn-primary" style={styles.btn} disabled={loading}>
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p style={styles.toggle}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => { setIsLogin(!isLogin); setError(''); }} style={styles.toggleBtn}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>

          <p style={styles.demo}>
            Demo: Use any email and password to sign in
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    padding: '80px 0',
    minHeight: 'calc(100vh - 80px)',
    display: 'flex',
    alignItems: 'center',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
  },
  card: {
    background: 'var(--surface)',
    borderRadius: '16px',
    border: '1px solid var(--border)',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '2rem',
    marginTop: '16px',
    marginBottom: '8px',
  },
  subtitle: {
    color: 'var(--text-secondary)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'var(--primary)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '0 16px',
  },
  input: {
    flex: 1,
    border: 'none',
    background: 'transparent',
    padding: '14px 0',
    outline: 'none',
  },
  error: {
    color: 'var(--accent)',
    textAlign: 'center',
    fontSize: '0.9rem',
  },
  btn: {
    marginTop: '8px',
    padding: '14px',
    fontSize: '1rem',
  },
  toggle: {
    textAlign: 'center',
    marginTop: '24px',
    color: 'var(--text-secondary)',
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--accent)',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
  },
  demo: {
    textAlign: 'center',
    marginTop: '16px',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
  },
};

export default Auth;