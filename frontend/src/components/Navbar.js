import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">RecipeNest</Link>
      <div className="navbar-menu">
        <Link to="/" className={isActive('/')}>Home</Link>
        <Link to="/recipes" className={isActive('/recipes')}>Recipes</Link>
        {!user ? (
          <>
            <Link to="/login" className={isActive('/login')}>Login</Link>
            <Link to="/register" className={isActive('/register')}>Register</Link>
          </>
        ) : (
          <>
            {user.role === 'chef' && (
              <Link to="/chef/dashboard" className={isActive('/chef/dashboard')}>Dashboard</Link>
            )}
            {user.role === 'user' && (
              <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
            )}
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
