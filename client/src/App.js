import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { RiMenuUnfold3Line } from "react-icons/ri";
import {Toaster} from 'react-hot-toast';
import AuthPage from './components/AuthPage';
import NavBar from './components/NavBar';
import SideBar from './components/SideBar';
import NotesPage from './components/NotesPage';
import ArchivePage from './components/ArchivePage';
import TrashPage from './components/TrashPage';
import ProtectedRoute from './components/ProtectedRoute';
import SearchPage from './components/SearchPage';
import LabelPage from './components/LabelPage';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSideBar, setShowSideBar] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  }

  const handleSideBar = () => {
    setShowSideBar(!showSideBar);
  }

  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    if (searchQuery.trim().length !== 0 && path !== '/search') {
      navigate("/search");
    } else if (searchQuery.trim().length === 0 && path === '/search') {
      navigate("/");
    }
  }, [searchQuery, navigate]);

  return (
    <>
      <NavBar searchQuery={searchQuery} handleSearch={handleSearch} />
      <Toaster />
      <div className="App">
        {Cookies.get('jwt_token') && <SideBar setSearchQuery={setSearchQuery} showSideBar={showSideBar} setShowSideBar={setShowSideBar} />}
        {Cookies.get('jwt_token') &&
          <button className="sidebar-toggle-btn" onClick={() => setShowSideBar(true)}>
            <RiMenuUnfold3Line className="sidebar-toggle-icon" />
          </button>
        }
        <Routes>
          <Route exact path="/" element={<AuthPage />} />
          <Route exact path="/notes" element={<ProtectedRoute  element={<NotesPage />} />} />
          <Route exact path="/archive" element={<ProtectedRoute element={<ArchivePage />} />} />
          <Route exact path="/bin" element={<ProtectedRoute element={<TrashPage />} />} />
          <Route exact path='/label/:label' element={<ProtectedRoute element={<LabelPage />} />} />
          <Route exact path="/search" element={<ProtectedRoute element={<SearchPage search={searchQuery} />} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
