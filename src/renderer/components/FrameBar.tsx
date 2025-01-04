import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
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

  useEffect(() => {
    console.log('FrameBar username:', username);
  }, [username]);

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
        <Button
          onClick={() => navigate('/settings')}
          className="collapseBtn no-drag"
          type="primary"
        >
          <SettingOutlined />
        </Button>
        <Button
          onClick={handleLogoutAction}
          className="collapseBtn no-drag"
          type="primary"
        >
          <LogoutOutlined />
        </Button>
      </div>
      <div className="framebar-username">{username}</div>

      <div className="appName">Learn Docker</div>
      <Button
        onClick={handleMinimizeClick}
        className="controlBtn no-drag"
        type="primary"
        shape="circle"
        style={{ backgroundColor: 'lightblue' }}
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
