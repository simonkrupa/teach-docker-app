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
import Welcome from './pages/Welcome';

export default function App() {
  const [isNavbarCollapsed, setNavbarCollapsed] = useState(false);
  const location = useLocation();
  const isWelcomeOrSettingsPage =
    location.pathname === '/welcome' ||
    location.pathname === '/' ||
    location.pathname === '/settings';

  const toggleNavbar = () => {
    setNavbarCollapsed(!isNavbarCollapsed);
  };

  return (
    <section className="main-app">
      <div className="full-window">
        <FrameBar isCollapsed={isNavbarCollapsed} toggleNavbar={toggleNavbar} />
        <Layout>
          {!isWelcomeOrSettingsPage && (
            <NavBar
              isCollapsed={isNavbarCollapsed}
              toggleNavbar={toggleNavbar}
            />
          )}
          <Routes>
            {/* base pages */}
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/home" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/" element={<Welcome />} />
            {/* bridge */}
            <Route path="/bridge/first-diagram" element={<FirstDiagram />} />
            <Route path="/bridge/overview" element={<BridgeOverview />} />
            <Route path="/bridge/task" element={<BridgeTask />} />
            {/* default bridge */}
            <Route
              path="/default-bridge/second-diagram"
              element={<SecondDiagram />}
            />
            <Route path="/default-bridge/overview" element={<div />} />
            <Route path="/default-bridge/task" element={<div />} />
            {/* host */}
            <Route path="/host/third-diagram" element={<ThirdDiagram />} />
            <Route path="/host/overview" element={<div />} />
            <Route path="/host/task" element={<div />} />
            {/* none */}
            <Route path="/none/fourth-diagram" element={<FourthDiagram />} />
            <Route path="/none/overview" element={<div />} />
            <Route path="/none/task" element={<div />} />
            {/* overlay */}
            <Route path="/overlay/fifth-diagram" element={<FifthDiagram />} />
            <Route path="/overlay/overview" element={<div />} />
            <Route path="/overlay/task" element={<div />} />
            {/* macvlan */}
            <Route path="/macvlan/sixth-diagram" element={<SixthDiagram />} />
            <Route path="/macvlan/overview" element={<div />} />
            <Route path="/macvlan/task" element={<div />} />
            {/* ipvlan */}
            <Route
              path="/ipvlan/seventh-diagram"
              element={<SeventhDiagram />}
            />
            <Route path="/ipvlan/overview" element={<div />} />
            <Route path="/ipvlan/task" element={<div />} />
          </Routes>
        </Layout>
      </div>
    </section>
  );
}
