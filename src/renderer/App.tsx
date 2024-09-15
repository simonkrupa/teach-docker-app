import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Home from './pages/Home';
import './App.css';
import NavBar from './components/Navbar';
import FrameBar from './components/FrameBar';
import FirstDiagram from './diagrams/FirstDiagram';
import SecondDiagram from './diagrams/SecondDiagram';
import ThirdDiagram from './diagrams/ThirdDiagram';
import FourthDiagram from './diagrams/FourthDiagram';

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
          <Route path="/first-diagram" element={<FirstDiagram />} />
          <Route path="/second-diagram" element={<SecondDiagram />} />
          <Route path="/third-diagram" element={<ThirdDiagram />} />
          <Route path="/fourth-diagram" element={<FourthDiagram />} />
        </Routes>
      </Layout>
    </div>
  );
}
