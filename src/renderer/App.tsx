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
import DefaultBridgeOverview from './pages/default-bridge/DefaultBridgeOverview';
import DefaultBridgeTask from './pages/default-bridge/DefaultBridgeTask';
import HostOverview from './pages/host/HostOverview';
import HostTask from './pages/host/HostTask';
import NoneOverview from './pages/none/NoneOverview';
import NoneTask from './pages/none/NoneTask';
import OverlayOverview from './pages/overlay/OverlayOverview';
import OverlayTask from './pages/overlay/OverlayTask';
import MacvlanOverview from './pages/macvlan/MacvlanOverview';
import MacvlanTask from './pages/macvlan/MacvlanTask';
import IpvlanOverview from './pages/ipvlan/IpvlanOverview';
import IpvlanTask from './pages/ipvlan/IpvlanTask';
import TerminalContainer from './components/terminals/TerminalContainer';

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
            <Route
              path="/default-bridge/overview"
              element={<DefaultBridgeOverview />}
            />
            <Route
              path="/default-bridge/task"
              element={<DefaultBridgeTask />}
            />
            {/* host */}
            <Route path="/host/third-diagram" element={<ThirdDiagram />} />
            <Route path="/host/overview" element={<HostOverview />} />
            <Route path="/host/task" element={<HostTask />} />
            {/* none */}
            <Route path="/none/fourth-diagram" element={<FourthDiagram />} />
            <Route path="/none/overview" element={<NoneOverview />} />
            <Route path="/none/task" element={<NoneTask />} />
            {/* overlay */}
            <Route path="/overlay/fifth-diagram" element={<FifthDiagram />} />
            <Route path="/overlay/overview" element={<OverlayOverview />} />
            <Route path="/overlay/task" element={<OverlayTask />} />
            {/* macvlan */}
            <Route path="/macvlan/sixth-diagram" element={<SixthDiagram />} />
            <Route path="/macvlan/overview" element={<MacvlanOverview />} />
            <Route path="/macvlan/task" element={<MacvlanTask />} />
            {/* ipvlan */}
            <Route
              path="/ipvlan/seventh-diagram"
              element={<SeventhDiagram />}
            />
            <Route path="/ipvlan/overview" element={<IpvlanOverview />} />
            <Route path="/ipvlan/task" element={<IpvlanTask />} />
          </Routes>
        </Layout>
        <TerminalContainer />
    </div>
    </section>
  );
}
