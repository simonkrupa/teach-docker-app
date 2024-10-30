import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import {
  LeftOutlined,
  RightOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import './FrameBar.css';

export default function FrameBar({ isCollapsed, toggleNavbar }) {
  const navigate = useNavigate();

  const handleExitClick = () => {
    window.electron.ipcRenderer.sendMessage('app-exit', ['ping']);
  };

  const handleMinimizeClick = () => {
    window.electron.ipcRenderer.sendMessage('app-minimize', ['ping']);
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
        <Button className="collapseBtn no-drag" type="primary">
          <LeftOutlined />
        </Button>
        <Button className="collapseBtn no-drag" type="primary">
          <RightOutlined />
        </Button>
        <Button
          onClick={() => navigate('/settings')}
          className="collapseBtn no-drag"
          type="primary"
        >
          <SettingOutlined />
        </Button>
      </div>
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
