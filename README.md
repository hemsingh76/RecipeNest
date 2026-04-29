# RecipeNest — Chef's Portal

A full-stack web application for chefs to share recipes and food lovers to discover them.

## Tech Stack
- **Frontend**: React (Create React App), React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)

---

## Prerequisites
- Node.js v18+ installed
- MongoDB running locally (`mongodb://localhost:27017`) OR a MongoDB Atlas URI

---

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/recipenest
JWT_SECRET=change_this_to_a_random_secret_string
NODE_ENV=development
```

Start the backend:
```bash
npm run dev       # development (nodemon)
# or
npm start         # production
```

Backend runs at: http://localhost:5000

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs at: http://localhost:3000

The frontend proxies API requests to `http://localhost:5000` via the `proxy` field in `package.json`.

---

## Usage

### User Roles
| Role | Access |
|------|--------|
| **User** | Browse chefs and recipes, view chef profiles |
| **Chef** | All user access + manage own profile, add/edit/delete recipes |

### Flows
1. Visit `http://localhost:3000` → see featured chefs on landing page
2. Click a chef card → prompted to login/register if not authenticated
3. Register as **Chef** → redirected to Chef Dashboard
4. Register as **User** → redirected to User Dashboard
5. Chef Dashboard: manage recipes (add/edit/delete), edit profile & photo

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Chefs
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/chefs` | No | List all chefs |
| GET | `/api/chefs/:id` | No | Get chef by ID |
| GET | `/api/chefs/me/profile` | Chef | Get own profile |
| PUT | `/api/chefs/me/profile` | Chef | Update own profile |

### Recipes
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/recipes` | No | All published recipes |
| GET | `/api/recipes/my` | Chef | Chef's own recipes |
| GET | `/api/recipes/:id` | No | Single recipe |
| POST | `/api/recipes` | Chef | Create recipe |
| PUT | `/api/recipes/:id` | Chef | Update recipe |
| DELETE | `/api/recipes/:id` | Chef | Delete recipe |

---

## Project Structure

```
recipenest/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Chef.js
│   │   └── Recipe.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── chefs.js
│   │   └── recipes.js
│   ├── middleware/
│   │   └── auth.js
│   ├── uploads/          ← auto-created, stores uploaded images
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   └── LoginModal.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── Home.js
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── UserDashboard.js
    │   │   ├── ChefDashboard.js
    │   │   ├── ChefProfile.js
    │   │   └── Recipes.js
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    └── package.json
```

---

## Notes
- Uploaded images are stored in `backend/uploads/` folder
- JWT tokens expire in 30 days
- Chefs auto-get a profile created upon registration
- The `uploads/` folder is served as static files at `/uploads`
