import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

// ---- Sub-views ----

function MyRecipes({ chefProfile }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editRecipe, setEditRecipe] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const loadRecipes = () => {
    API.get('/recipes/my').then(r => { setRecipes(r.data); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(loadRecipes, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this recipe?')) return;
    try {
      await API.delete(`/recipes/${id}`);
      setMsg('Recipe deleted.');
      loadRecipes();
    } catch { setErr('Failed to delete.'); }
  };

  return (
    <div>
      <div className="page-header">
        <h2>My Recipes</h2>
        <button className="btn btn-primary btn-sm" onClick={() => { setEditRecipe(null); setShowForm(true); }}>+ Add New Recipe</button>
      </div>
      {msg && <div className="alert alert-success">{msg}</div>}
      {err && <div className="alert alert-error">{err}</div>}
      {loading && <div className="loading">Loading...</div>}
      {!loading && recipes.length === 0 && <div className="empty-state">No recipes yet. Add your first recipe!</div>}
      {!loading && recipes.length > 0 && (
        <table className="data-table">
          <thead>
            <tr>
              <th>Recipe Name</th>
              <th>Category</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recipes.map(r => (
              <tr key={r._id}>
                <td className="text-mono">{r.title}</td>
                <td>{r.category}</td>
                <td><span className={`status-badge status-${r.status}`}>{r.status}</span></td>
                <td>
                  <div className="flex-row">
                    <button className="btn btn-sm" onClick={() => { setEditRecipe(r); setShowForm(true); }}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(r._id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showForm && (
        <RecipeFormModal
          recipe={editRecipe}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); loadRecipes(); setMsg(editRecipe ? 'Recipe updated.' : 'Recipe added.'); }}
        />
      )}
    </div>
  );
}

function RecipeFormModal({ recipe, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: recipe?.title || '',
    ingredients: recipe?.ingredients || '',
    instructions: recipe?.instructions || '',
    category: recipe?.category || 'General',
    status: recipe?.status || 'published'
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setErr(''); setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);
      if (recipe) {
        await API.put(`/recipes/${recipe._id}`, fd);
      } else {
        await API.post('/recipes', fd);
      }
      onSaved();
    } catch (e) {
      setErr(e.response?.data?.message || 'Failed to save recipe.');
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ width: 500 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span>{recipe ? 'Edit Recipe' : 'Add New Recipe'}</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {err && <div className="alert alert-error">{err}</div>}
          <div className="form-group">
            <label>Recipe Title</label>
            <input name="title" value={form.title} onChange={handle} placeholder="Enter recipe title" />
          </div>
          <div className="form-group">
            <label>Recipe Image</label>
            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
          </div>
          <div className="form-group">
            <label>Ingredients</label>
            <textarea name="ingredients" value={form.ingredients} onChange={handle} rows={4} placeholder="List all ingredients here..." />
          </div>
          <div className="form-group">
            <label>Cooking Instructions</label>
            <textarea name="instructions" value={form.instructions} onChange={handle} rows={5} placeholder="Write step-by-step cooking instructions..." />
          </div>
          <div className="flex-row">
            <div className="form-group" style={{ flex:1 }}>
              <label>Category</label>
              <select name="category" value={form.category} onChange={handle}>
                <option>General</option><option>Breakfast</option><option>Lunch</option>
                <option>Dinner</option><option>Dessert</option><option>Snack</option><option>Beverage</option>
              </select>
            </div>
            <div className="form-group" style={{ flex:1 }}>
              <label>Status</label>
              <select name="status" value={form.status} onChange={handle}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit} disabled={loading}>
            {loading ? 'Saving...' : 'Submit Recipe'}
          </button>
        </div>
      </div>
    </div>
  );
}

function EditProfile() {
  const [form, setForm] = useState({ name:'', bio:'', contact:'', facebook:'', instagram:'', twitter:'' });
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    API.get('/chefs/me/profile').then(r => {
      const c = r.data;
      setForm({ name: c.name||'', bio: c.bio||'', contact: c.contact||'', facebook: c.social?.facebook||'', instagram: c.social?.instagram||'', twitter: c.social?.twitter||'' });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setMsg('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (photoFile) fd.append('photo', photoFile);
      await API.put('/chefs/me/profile', fd);
      setMsg('Profile updated successfully.');
    } catch (e) {
      setErr(e.response?.data?.message || 'Failed to update profile.');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  return (
    <div>
      <div className="page-header"><h2>Edit Profile</h2></div>
      {msg && <div className="alert alert-success">{msg}</div>}
      {err && <div className="alert alert-error">{err}</div>}
      <form onSubmit={submit} style={{ maxWidth: 480 }}>
        <div className="panel">
          <div className="panel-title">Profile Details</div>
          <div className="form-group"><label>Display Name</label><input name="name" value={form.name} onChange={handle} /></div>
          <div className="form-group"><label>Bio</label><textarea name="bio" value={form.bio} onChange={handle} rows={4} /></div>
          <div className="form-group"><label>Contact</label><input name="contact" value={form.contact} onChange={handle} placeholder="Email or phone" /></div>
          <div className="form-group"><label>Profile Photo</label><input type="file" accept="image/*" onChange={e => setPhotoFile(e.target.files[0])} /></div>
        </div>
        <div className="panel">
          <div className="panel-title">Social Links</div>
          <div className="form-group"><label>Facebook</label><input name="facebook" value={form.facebook} onChange={handle} placeholder="Facebook username" /></div>
          <div className="form-group"><label>Instagram</label><input name="instagram" value={form.instagram} onChange={handle} placeholder="Instagram handle" /></div>
          <div className="form-group"><label>Twitter</label><input name="twitter" value={form.twitter} onChange={handle} placeholder="Twitter handle" /></div>
        </div>
        <button type="submit" className="btn btn-primary">Save Profile</button>
      </form>
    </div>
  );
}

// ---- Main Chef Dashboard ----
export default function ChefDashboard() {
  const [view, setView] = useState('recipes');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div style={{ padding:'8px 14px 6px', fontFamily:'var(--font-mono)', fontSize:11, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.05em' }}>
          Chef Panel
        </div>
        <div style={{ padding:'4px 14px 10px', fontSize:13, fontWeight:600 }}>
          {user?.name}
        </div>
        <div className="sidebar-divider" />
        <button className={`sidebar-item ${view === 'recipes' ? 'active' : ''}`} onClick={() => setView('recipes')}>My Recipes</button>
        <button className={`sidebar-item ${view === 'profile' ? 'active' : ''}`} onClick={() => setView('profile')}>Edit Profile</button>
        <div className="sidebar-divider" />
        <button className="sidebar-item" onClick={() => navigate('/')}>← Home</button>
        <button className="sidebar-item danger" onClick={handleLogout}>Logout</button>
      </aside>
      <div className="sidebar-content">
        {view === 'recipes' && <MyRecipes />}
        {view === 'profile' && <EditProfile />}
      </div>
    </div>
  );
}
