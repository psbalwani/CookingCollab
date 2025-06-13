import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import CreateRecipe from './pages/CreateRecipe';
import EditRecipe from './pages/EditRecipe';
import Forum from './pages/Forum';
import ForumPost from './pages/ForumPost';
import CreatePost from './pages/CreatePost';
import Search from './pages/Search';
import './styles/global.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/recipes/:id" element={<RecipeDetail />} />
              <Route path="/recipes/create" element={<CreateRecipe />} />
              <Route path="/recipes/:id/edit" element={<EditRecipe />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/forum/:id" element={<ForumPost />} />
              <Route path="/forum/create" element={<CreatePost />} />
              <Route path="/search" element={<Search />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;