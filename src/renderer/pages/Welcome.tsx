import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Alert } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useProgress } from '../UserContext';
import './Welcome.css';

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
        message: 'Prosím zadajte používateľské meno',
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
        message: 'Používateľské meno neexistuje',
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
        <h1 className="header-welcome">Úvod</h1>
        <h2 className="header-h2">Komunikácia kontajnerov</h2>
        <p className="welcome-font-p">
          Vitajte v aplikácie pre výučbu komunikácie docker kontajnerov. Táto
          aplikácia vám pomôže porozumieť konceptom docker sieti prostredníctvom
          teoretických častí a praktických úloh, ktoré budú vizualizovať váš
          aktuálny progres.
        </p>
        <br />
        <br />
        <h3 className="header-h3">Zadefinujte používateľské meno</h3>
        <Input
          size="large"
          className="input-welcome"
          placeholder="Používateľské meno"
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
          Štart
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
    </div>
  );
}
