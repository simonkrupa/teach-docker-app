import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import './Pages.css';
import { useProgress } from '../UserContext';

export default function Home() {
  const navigate = useNavigate();
  const { setUserData, progress, username } = useProgress();

  const handleProceedNavigation = () => {
    if (progress === '1') {
      window.electron.ipcRenderer.sendMessage('write-user-progress', [
        username,
      ]);
      setUserData(username, String(Number(progress) + 1));
    }
    navigate('/bridge/overview');
  };

  return (
    <div className="all-pages">
      <h1>Docker teaching app</h1>
      <p>This is the home page of the app.</p>
      <p>Here you will learn about Docker and Docker networking.</p>
      <p>Side bar on the left provides navigation between chapters.</p>
      <p>
        Bottom of the window provides terminal where you can complete all the
        tasks. You may also use external tools.
      </p>

      <Button
        onClick={handleProceedNavigation}
        className="generic-button"
        type="primary"
      >
        Start
      </Button>
    </div>
  );
}
