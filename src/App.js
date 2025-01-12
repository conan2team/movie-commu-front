import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';  // Navbar가 아닌 Navigation
import Home from './pages/Home';
import TopMovies from './pages/TopMovies';
import MovieList from './pages/MovieList';
import CommunityBoard from './pages/CommunityBoard';
import MovieDetail from './pages/MovieDetail';
import CommunityDetail from './pages/CommunityDetail';
import CommunityWrite from './pages/CommunityWrite';  
import CommunityEdit from './pages/CommunityEdit';
import NowPlaying from './pages/NowPlaying';
import Booking from './pages/Booking';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import './styles/common.css';  // 전역 스타일
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserProfile from './pages/UserProfile';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/top-movies" element={<TopMovies />} />
            <Route path="/movies" element={<MovieList />} />
            <Route path="/now-playing" element={<NowPlaying />} />
            <Route path="/booking/:scheduleId" element={<Booking />} />
            <Route path="/community" element={<CommunityBoard />} />
            <Route path="/community/write" element={<CommunityWrite />} />
            <Route path="/community/edit/:id" element={<CommunityWrite />} />
            <Route path="/community/:id" element={<CommunityDetail />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/user/:username" element={<UserProfile />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;