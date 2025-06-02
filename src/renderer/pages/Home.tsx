import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import './Pages.css';
import dockerArch from 'assets/imgs/dockerarchtransparent.png';
import dockerImg from 'assets/imgs/docker-arch-transp.png';
import { useTranslation } from 'react-i18next';
import { useProgress } from '../UserContext';

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setUserData, progress, username } = useProgress();

  const handleProceedNavigation = () => {
    if (progress === '1') {
      window.electron.ipcRenderer.sendMessage('write-user-progress', [
        username,
      ]);
      setUserData(username, String(Number(progress) + 1));
    }
    navigate('/default-bridge/overview');
  };

  return (
    <div className="all-pages">
      <h1>{t('name')}</h1>
      <p>{t('home_this_is')}</p>
      <p>{t('home_p_1')}</p>

      <p>{t('home_p_2')}</p>
      <h2>Docker</h2>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          // alignItems: 'center',
        }}
      >
        <p style={{ maxWidth: '60%' }}>{t('home_p_3')}</p>
        <img
          src={dockerImg}
          alt=""
          className="images"
          style={{ height: '301px', width: '271px' }}
        />
      </div>
      <h3>{t('docker_arch')}</h3>
      <p>{t('home_p_4')}</p>
      <img
        src={dockerArch}
        alt=""
        className="images"
        style={{ height: '291px', width: '589px' }}
      />
      <h3>{t('docker_visual')}</h3>
      <p>{t('home_p_5')}</p>

      <Button
        onClick={handleProceedNavigation}
        className="generic-button"
        type="primary"
      >
        {t('start')}
      </Button>
    </div>
  );
}
