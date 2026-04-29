import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';

export default function Home() {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [pendingChefId, setPendingChefId] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/chefs').then(r => { setChefs(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleChefClick = (chefId) => {
    if (user) {
      navigate(`/chefs/${chefId}`);
    } else {
      setPendingChefId(chefId);
      setShowLogin(true);
    }
  };

  const handleLoginClose = () => {
    setShowLogin(false);
    if (pendingChefId && user) {
      navigate(`/chefs/${pendingChefId}`);
    }
    setPendingChefId(null);
  };

  return (
    <>
      <div className="landing-hero">
        <h1>RecipeNest</h1>
        <p>Discover recipes from chefs around the world.</p>
      </div>

      <div className="container page-content">
        <div className="page-header">
          <h2>Featured Chefs</h2>
          <span className="text-muted">{chefs.length} chef{chefs.length !== 1 ? 's' : ''} registered</span>
        </div>

        {loading && <div className="loading">Loading chefs...</div>}

        {!loading && chefs.length === 0 && (
          <div className="empty-state">
            No chefs have joined yet. Be the first — register as a chef!
          </div>
        )}

        {!loading && chefs.length > 0 && (
          <div className="cards-grid">
            {chefs.map(chef => (
              <div key={chef._id} className="card" onClick={() => handleChefClick(chef._id)}>
                {chef.photo
                  ? <img src={chef.photo} alt={chef.name} className="card-img" />
                  : <div className="card-img-placeholder">[No Photo]</div>
                }
                <div className="card-label">{chef.name}</div>
                <div className="card-body">
                  <div className="card-desc">
                    {chef.bio ? chef.bio.slice(0, 100) + (chef.bio.length > 100 ? '...' : '') : 'No bio provided.'}
                  </div>
                  <button className="btn btn-sm btn-primary" onClick={(e) => { e.stopPropagation(); handleChefClick(chef._id); }}>
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!user && (
          <div className="panel mt-8" style={{ marginTop: 20 }}>
            <p className="text-muted" style={{ fontSize: 13 }}>
              <strong>Note:</strong> Click any chef to view their profile and recipes. You must be logged in to view details.{' '}
              <button className="btn btn-sm btn-primary" onClick={() => setShowLogin(true)}>Login / Register</button>
            </p>
          </div>
        )}
      </div>

      {showLogin && (
        <LoginModal
          onClose={handleLoginClose}
          redirectAfter={pendingChefId ? `/chefs/${pendingChefId}` : null}
        />
      )}
    </>
  );
}
