import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Tooltip } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import './FrameBar.css';
import { useProgress } from '../UserContext';

export default function FrameBar({ isCollapsed, toggleNavbar }) {
  const navigate = useNavigate();
  const { setUserData, username } = useProgress();
  const location = useLocation();
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    if (location.pathname === '/welcome' || location.pathname === '/') {
      setShowLogout(false);
    } else {
      setShowLogout(true);
    }
  }, [location]);

  const handleExitClick = () => {
    window.electron.ipcRenderer.sendMessage('app-exit', ['ping']);
  };

  const handleMinimizeClick = () => {
    window.electron.ipcRenderer.sendMessage('app-minimize', ['ping']);
  };

  const handleLogoutAction = () => {
    setUserData('', '');
    navigate('/welcome');
  };

  return (
    <div className="frameBar drag">
      <div className="button-group">
        <Button
          className="collapseBtn no-drag"
          type="primary"
          onClick={toggleNavbar}
        >
          {isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
        <Tooltip placement="top" title="Nastavenia">
          <Button
            onClick={() => navigate('/settings')}
            className="collapseBtn no-drag"
            type="primary"
          >
            <SettingOutlined />
          </Button>
        </Tooltip>
        {showLogout && (
          <Tooltip placement="top" title="Odhlásenie">
            <Button
              onClick={handleLogoutAction}
              className="collapseBtn no-drag"
              type="primary"
            >
              <LogoutOutlined />
            </Button>
          </Tooltip>
        )}
      </div>
      <div className="framebar-username">{username}</div>

      <div className="appName">Komunikácia docker kontajnerov</div>
      <Button
        onClick={handleMinimizeClick}
        className="controlBtn no-drag"
        type="primary"
        shape="circle"
        style={{ backgroundColor: 'lightblue', color: 'black' }}
      />
      <Button
        onClick={handleExitClick}
        danger
        className="controlBtn no-drag"
        type="primary"
        shape="circle"
      />
    </div>
  );
}
