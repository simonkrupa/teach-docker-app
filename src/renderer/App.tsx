import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Home from './pages/Home';
import './App.css';
import NavBar from './components/Navbar';
import FirstPage from './pages/FirstPage';
import FrameBar from './components/FrameBar';
import FirstDiagram from './diagrams/FirstDiagram';

export default function App() {
  const [isNavbarCollapsed, setNavbarCollapsed] = useState(false);

  const toggleNavbar = () => {
    setNavbarCollapsed(!isNavbarCollapsed);
  };

  return (
    <div className="full-window">
      <FrameBar isCollapsed={isNavbarCollapsed} toggleNavbar={toggleNavbar} />
      <Layout>
        <NavBar isCollapsed={isNavbarCollapsed} toggleNavbar={toggleNavbar} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/first" element={<FirstPage />} />
          <Route path="/first-diagram" element={<FirstDiagram />} />
        </Routes>
      </Layout>
    </div>
  );
}
