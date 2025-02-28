import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import './MessageBox.css';
import {
  AiFillCheckCircle,
  AiOutlineArrowRight,
  AiFillCloseCircle,
} from 'react-icons/ai';
import { navigationMap, progressMap } from '../util/utilMaps';
import { useProgress } from '../UserContext';

export default function MessageBox({ type, message }) {
  const navigate = useNavigate();
  const location = useLocation();
  const nextLocation = navigationMap.get(location.pathname.split('/')[1]);
  const nextLocationPath = `${nextLocation}/overview`;
  const { setUserData, progress, username } = useProgress();

  const handleNextLocation = () => {
    if (nextLocation === progressMap.get(progress)) {
      window.electron.ipcRenderer.sendMessage('write-user-progress', [
        username,
      ]);
      setUserData(username, String(Number(progress) + 1));
      navigate(nextLocationPath);
    }
  };

  return (
    <div className={`message-box ${type}`}>
      <div className="text-container">
        {type === 'success' ? (
          <AiFillCheckCircle
            style={{ width: '50px', height: '50px', marginLeft: '5px' }}
          />
        ) : (
          <AiFillCloseCircle
            style={{ width: '50px', height: '50px', marginLeft: '5px' }}
          />
        )}
        <div className="message-container">
          <h4 className="message-header">Summary</h4>
          <p className="message-text">{message}</p>
        </div>
        {type === 'success' && (
          <Button
            type="default"
            shape="circle"
            onClick={handleNextLocation}
            style={{
              zIndex: 100,
              paddingTop: '6px',
              width: '38px',
              height: '38px',
              marginTop: '6px',
              marginRight: '5px',
              minWidth: '38px',
            }}
            className="ant-buttons"
          >
            <AiOutlineArrowRight />
          </Button>
        )}
      </div>
    </div>
  );
}
