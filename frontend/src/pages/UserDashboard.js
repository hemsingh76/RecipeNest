import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function UserDashboard() {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/chefs').then(r => { setChefs(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="container page-content">
      <div className="panel" style={{ marginBottom: 12 }}>
        <div className="panel-title">User Dashboard</div>
        <p>Welcome, <strong>{user?.name}</strong>. Browse chefs and their recipes below.</p>
      </div>

      <div className="page-header">
        <h2>All Chefs</h2>
        <span className="text-muted">{chefs.length} chef{chefs.length !== 1 ? 's' : ''}</span>
      </div>

      {loading && <div className="loading">Loading...</div>}

      {!loading && chefs.length === 0 && (
        <div className="empty-state">No chefs have joined yet.</div>
      )}

      {!loading && (
        <div className="cards-grid">
          {chefs.map(chef => (
            <div key={chef._id} className="card" onClick={() => navigate(`/chefs/${chef._id}`)}>
              {chef.photo
                ? <img src={chef.photo} alt={chef.name} className="card-img" />
                : <div className="card-img-placeholder">[No Photo]</div>
              }
              <div className="card-label">{chef.name}</div>
              <div className="card-body">
                <div className="card-desc">
                  {chef.bio ? chef.bio.slice(0, 100) + (chef.bio.length > 100 ? '...' : '') : 'No bio provided.'}
                </div>
                <div className="card-actions">
                  <button className="btn btn-sm btn-primary" onClick={(e) => { e.stopPropagation(); navigate(`/chefs/${chef._id}`); }}>
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
