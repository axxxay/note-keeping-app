import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Cookies from 'js-cookie';
import {Toaster} from 'react-hot-toast';
import AuthPage from './components/AuthPage';
import NavBar from './components/NavBar';
import SideBar from './components/SideBar';
import NotesPage from './components/NotesPage';
import ArchivePage from './components/ArchivePage';
import TrashPage from './components/TrashPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Toaster />
      <div className="App">
        {Cookies.get('jwt_token') && <SideBar />}
        <Routes>
          <Route exact path="/" element={<AuthPage />} />
          <Route exact path="/notes" element={<ProtectedRoute  element={<NotesPage />} />} />
          <Route exact path="/archive" element={<ProtectedRoute element={<ArchivePage />} />} />
          <Route exact path="/bin" element={<ProtectedRoute element={<TrashPage />} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
