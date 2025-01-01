import { useNavigate } from 'react-router-dom';
import { Button, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './Welcome.css';
import DockerLogo from '../../../assets/Docker.png';

export default function Welcome() {
  const navigate = useNavigate();

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
        />

        <br />
        <Button
          onClick={() => navigate('/settings')}
          className="button-welcome"
          type="primary"
        >
          Start
        </Button>
      </div>
      <div className="second-col-welcome">
        <img className="docker-logo" src={DockerLogo} alt="docker logo" />
      </div>
    </div>
  );
}
