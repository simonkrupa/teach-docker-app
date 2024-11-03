import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import Home from './pages/Home';
import './App.css';
import NavBar from './components/Navbar';
import FrameBar from './components/FrameBar';
import FirstDiagram from './diagrams/FirstDiagram';
import SecondDiagram from './diagrams/SecondDiagram';
import ThirdDiagram from './diagrams/ThirdDiagram';
import FourthDiagram from './diagrams/FourthDiagram';
import FifthDiagram from './diagrams/FifthDiagram';
import SixthDiagram from './diagrams/SixthDiagram';
import SeventhDiagram from './diagrams/SeventhDiagram';
import Settings from './pages/Settings';
import BridgeOverview from './pages/bridge/BridgeOverview';
import BridgeTask from './pages/bridge/BridgeTask';

export default function App() {
  const [isNavbarCollapsed, setNavbarCollapsed] = useState(false);
  const location = useLocation();
  const isSettingsPage =
    location.pathname === '/settings' || location.pathname === '/';

  const toggleNavbar = () => {
    setNavbarCollapsed(!isNavbarCollapsed);
  };

  return (
    <div className="full-window">
      <FrameBar isCollapsed={isNavbarCollapsed} toggleNavbar={toggleNavbar} />
      <Layout>
        {!isSettingsPage && (
          <NavBar isCollapsed={isNavbarCollapsed} toggleNavbar={toggleNavbar} />
        )}
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/bridge/first-diagram" element={<FirstDiagram />} />
          <Route path="/bridge/overview" element={<BridgeOverview />} />
          <Route path="/bridge/task" element={<BridgeTask />} />
          <Route path="/second-diagram" element={<SecondDiagram />} />
          <Route path="/third-diagram" element={<ThirdDiagram />} />
          <Route path="/fourth-diagram" element={<FourthDiagram />} />
          <Route path="/fifth-diagram" element={<FifthDiagram />} />
          <Route path="/sixth-diagram" element={<SixthDiagram />} />
          <Route path="/seventh-diagram" element={<SeventhDiagram />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/" element={<Settings />} />
        </Routes>
      </Layout>
    </div>
  );
}
