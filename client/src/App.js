import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Cookies from 'js-cookie';
import {Toaster} from 'react-hot-toast';
import AuthPage from './components/AuthPage';
import NavBar from './components/NavBar';
import './App.css';
import SideBar from './components/SideBar';
import NotesPage from './components/NotesPage';
import ArchivePage from './components/ArchivePage';
import TrashPage from './components/TrashPage';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Toaster />
      <div className="App">
        {Cookies.get('jwt_token') && <SideBar />}
        <Routes>
          <Route exact path="/" element={<AuthPage />} />
          <Route exact path="/notes" element={<NotesPage />} />
          <Route exact path="/archive" element={<ArchivePage />} />
          <Route exact path="/bin" element={<TrashPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
