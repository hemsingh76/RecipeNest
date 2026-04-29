import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const user = await register(form.name, form.email, form.password, form.role);
      if (user.role === 'chef') navigate('/chef/dashboard');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="container page-content" style={{ maxWidth: 380, paddingTop: 40 }}>
      <div className="panel">
        <div className="panel-title">Register — RecipeNest</div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={submit}>
          <div className="form-group">
            <label>Full Name</label>
            <input name="name" value={form.name} onChange={handle} required placeholder="Your name" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handle} required placeholder="your@email.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={handle} required placeholder="Min 6 characters" />
          </div>
          <div className="form-group">
            <label>Register as</label>
            <select name="role" value={form.role} onChange={handle}>
              <option value="user">Food Lover (User)</option>
              <option value="chef">Chef</option>
            </select>
          </div>
          <div className="flex-row mt-8">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
            <Link to="/" className="btn">← Back</Link>
          </div>
        </form>
        <p className="text-muted mt-8">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
