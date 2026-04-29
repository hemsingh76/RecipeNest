import React, { useEffect, useState } from 'react';
import API from '../utils/api';

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setLoading(true);
    API.get(`/recipes?sort=${sort}`).then(r => { setRecipes(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, [sort]);

  return (
    <div className="container page-content">
      <div className="page-header">
        <h2>All Recipes</h2>
        <div className="sort-bar">
          <label>Sort:</label>
          <select value={sort} onChange={e => setSort(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="az">A–Z</option>
          </select>
        </div>
      </div>

      {loading && <div className="loading">Loading recipes...</div>}
      {!loading && recipes.length === 0 && <div className="empty-state">No recipes found.</div>}

      <div className="cards-grid">
        {recipes.map(r => (
          <div key={r._id} className="card" onClick={() => setSelected(r)}>
            {r.image
              ? <img src={r.image} alt={r.title} className="card-img" />
              : <div className="card-img-placeholder">[No Image]</div>
            }
            <div className="card-label">{r.title}</div>
            <div className="card-body">
              <div className="card-desc">
                {r.chef?.name && <span>By <strong>{r.chef.name}</strong> &nbsp;</span>}
                <span>{r.category}</span>
              </div>
              <button className="btn btn-sm btn-primary" onClick={(e) => { e.stopPropagation(); setSelected(r); }}>
                Read More
              </button>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" style={{ width: 520 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span>{selected.title}</span>
              <button className="modal-close" onClick={() => setSelected(null)}>×</button>
            </div>
            <div className="modal-body">
              {selected.image && <img src={selected.image} alt={selected.title} style={{ width:'100%', height:180, objectFit:'cover', marginBottom:12, border:'1px solid #999' }} />}
              <div className="form-group">
                <label>Ingredients</label>
                <div style={{ whiteSpace:'pre-wrap', fontSize:13, padding:'6px 8px', background:'#f8f8f8', border:'1px solid #ddd' }}>{selected.ingredients}</div>
              </div>
              <div className="form-group">
                <label>Cooking Instructions</label>
                <div style={{ whiteSpace:'pre-wrap', fontSize:13, padding:'6px 8px', background:'#f8f8f8', border:'1px solid #ddd' }}>{selected.instructions}</div>
              </div>
              <p className="text-muted">Category: {selected.category}{selected.chef?.name ? ` | By: ${selected.chef.name}` : ''}</p>
            </div>
            <div className="modal-footer">
              <button className="btn" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
