import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Alert } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useProgress } from '../UserContext';
import './Welcome.css';
import DockerLogo from '../../../assets/Docker.png';

export default function Welcome() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const userProgressRef = useRef<() => void | null>(null);
  const { setUserData } = useProgress();
  const [alertInfo, setAlertInfo] = useState({
    visible: false,
    type: '',
    message: '',
  });

  const handleUsernameSubmit = () => {
    if (username !== '') {
      window.electron.ipcRenderer.sendMessage('get-user-progress', [username]);
    } else {
      setAlertInfo({
        visible: true,
        type: 'error',
        message: 'Please provide username',
      });
    }
  };

  const validateUsernameSubmit = (event, data) => {
    if (event !== undefined) {
      setUserData(event[0], event[1]);
      navigate('/settings');
    } else {
      setAlertInfo({
        visible: true,
        type: 'error',
        message: 'Username does not exist',
      });
    }
  };

  useEffect(() => {
    userProgressRef.current = window.electron.ipcRenderer.on(
      'get-user-progress',
      validateUsernameSubmit,
    );
    return () => {
      if (userProgressRef.current) {
        userProgressRef.current();
      }
    };
  }, []);

  return (
    <div className="welcome-page">
      <div className="first-col-welcome">
        <h1 className="header-welcome">WELCOME</h1>
        <h2 className="header-h2">Learn Docker Networking</h2>
        <p className="welcome-font-p">
          Welcome to Learn Docker Networking app. This app will help you
          understand concepts of docker networking through explanation and
          providing tasks to practice and visually track your progress and
          results
        </p>
        <br />
        <br />
        <h3 className="header-h3">
          Please provide username under which your progress will be tracked
        </h3>
        <Input
          size="large"
          className="input-welcome"
          placeholder="Username"
          prefix={<UserOutlined />}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <br />
        <Button
          onClick={handleUsernameSubmit}
          className="button-welcome"
          type="primary"
        >
          Start
        </Button>
        <br />
        {alertInfo.visible && (
          <Alert
            message={alertInfo.message}
            type={alertInfo.type}
            showIcon
            closable
            onClose={() =>
              setAlertInfo({ visible: false, type: '', message: '' })
            }
          />
        )}
      </div>
      <div className="second-col-welcome">
        <img className="docker-logo" src={DockerLogo} alt="docker logo" />
      </div>
    </div>
  );
}
