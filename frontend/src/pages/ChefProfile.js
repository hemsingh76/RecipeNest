import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function ChefProfile() {
  const { id } = useParams();
  const [chef, setChef] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      API.get(`/chefs/${id}`),
      API.get(`/recipes?chef=${id}&sort=${sort}`)
    ]).then(([c, r]) => {
      setChef(c.data);
      setRecipes(r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id, sort]);

  if (loading) return <div className="loading">Loading chef profile...</div>;
  if (!chef) return <div className="container page-content"><div className="alert alert-error">Chef not found.</div></div>;

  return (
    <div className="container page-content">
      <button className="btn mb-8" onClick={() => navigate(-1)}>← Back</button>

      {/* Chef Info */}
      <div className="chef-profile-header">
        {chef.photo
          ? <img src={chef.photo} alt={chef.name} className="chef-photo" />
          : <div className="chef-photo" style={{ display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, color:'#888', border:'1px solid #999' }}>[No Photo]</div>
        }
        <div className="chef-info">
          <h2>{chef.name}</h2>
          {chef.bio && <p style={{ marginBottom: 6 }}>{chef.bio}</p>}
          {chef.contact && <p className="text-muted">Contact: {chef.contact}</p>}
          {(chef.social?.facebook || chef.social?.instagram || chef.social?.twitter) && (
            <div className="flex-row mt-8" style={{ flexWrap:'wrap', gap:6 }}>
              {chef.social.facebook && <span className="status-badge status-draft">FB: {chef.social.facebook}</span>}
              {chef.social.instagram && <span className="status-badge status-draft">IG: {chef.social.instagram}</span>}
              {chef.social.twitter && <span className="status-badge status-draft">TW: {chef.social.twitter}</span>}
            </div>
          )}
        </div>
      </div>

      {/* Recipes */}
      <div className="page-header">
        <h2>Recipes by {chef.name}</h2>
        <div className="sort-bar">
          <label>Sort:</label>
          <select value={sort} onChange={e => setSort(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="az">A–Z</option>
          </select>
        </div>
      </div>

      {recipes.length === 0 && <div className="empty-state">No recipes posted yet.</div>}

      <div className="cards-grid">
        {recipes.map(r => (
          <div key={r._id} className="card" onClick={() => setSelectedRecipe(r)}>
            {r.image
              ? <img src={r.image} alt={r.title} className="card-img" />
              : <div className="card-img-placeholder">[No Image]</div>
            }
            <div className="card-label">{r.title}</div>
            <div className="card-body">
              <div className="card-desc">{r.category}</div>
              <button className="btn btn-sm btn-primary" onClick={(e) => { e.stopPropagation(); setSelectedRecipe(r); }}>
                Read More
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="modal-overlay" onClick={() => setSelectedRecipe(null)}>
          <div className="modal" style={{ width: 520 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span>{selectedRecipe.title}</span>
              <button className="modal-close" onClick={() => setSelectedRecipe(null)}>×</button>
            </div>
            <div className="modal-body">
              {selectedRecipe.image && <img src={selectedRecipe.image} alt={selectedRecipe.title} style={{ width:'100%', height:180, objectFit:'cover', marginBottom:12, border:'1px solid #999' }} />}
              <div className="form-group">
                <label>Ingredients</label>
                <div style={{ whiteSpace:'pre-wrap', fontSize:13, padding:'6px 8px', background:'#f8f8f8', border:'1px solid #ddd' }}>{selectedRecipe.ingredients}</div>
              </div>
              <div className="form-group">
                <label>Cooking Instructions</label>
                <div style={{ whiteSpace:'pre-wrap', fontSize:13, padding:'6px 8px', background:'#f8f8f8', border:'1px solid #ddd' }}>{selectedRecipe.instructions}</div>
              </div>
              <p className="text-muted">Category: {selectedRecipe.category} &nbsp;|&nbsp; By: {chef.name}</p>
            </div>
            <div className="modal-footer">
              <button className="btn" onClick={() => setSelectedRecipe(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
