import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

//login form
export default function LoginModal({ onClose, redirectAfter }) {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setError('');
    setLoading(true);
    try {
      let user;
      if (tab === 'login') {
        user = await login(form.email, form.password);
      } else {
        if (!form.name) { setError('Name is required'); setLoading(false); return; }
        user = await register(form.name, form.email, form.password, form.role);
      }
      onClose();
      if (redirectAfter) { navigate(redirectAfter); return; }
      if (user.role === 'chef') navigate('/chef/dashboard');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span>{tab === 'login' ? 'Login' : 'Register'} — RecipeNest</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="flex-row mb-8">
            <button className={`btn btn-sm ${tab === 'login' ? 'btn-primary' : ''}`} onClick={() => setTab('login')}>Login</button>
            <button className={`btn btn-sm ${tab === 'register' ? 'btn-primary' : ''}`} onClick={() => setTab('register')}>Register</button>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          {tab === 'register' && (
            <div className="form-group">
              <label>Full Name</label>
              <input name="name" value={form.name} onChange={handle} placeholder="Your name" />
            </div>
          )}
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handle} placeholder="your@email.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={handle} placeholder="••••••••" />
          </div>
          {tab === 'register' && (
            <div className="form-group">
              <label>Register as</label>
              <select name="role" value={form.role} onChange={handle}>
                <option value="user">Food Lover (User)</option>
                <option value="chef">Chef</option>
              </select>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit} disabled={loading}>
            {loading ? 'Please wait...' : tab === 'login' ? 'Login' : 'Register'}
          </button>
        </div>
      </div>
    </div>
  );
}
