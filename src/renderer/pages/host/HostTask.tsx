import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';
import hostImage from 'assets/imgs/hosttask.jpg';
import { useTranslation } from 'react-i18next';
import DropdownWithHint from '../../components/Hint';

export default function HostTask() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleProceedNavigation = () => {
    navigate('/host/third-diagram');
  };
  return (
    <div className="all-pages">
      <h1>{t('host_task_title')}</h1>
      <ol>
        <li>{t('host_task_step_1')}</li>
        <li>{t('host_task_step_2')}</li>
      </ol>
      <p>{t('host_task_description')}</p>
      <img
        src={hostImage}
        alt=""
        style={{
          width: '500px',
          height: '504px',
          display: 'block',
          margin: '0 auto',
        }}
      />
      <Button
        onClick={handleProceedNavigation}
        className="generic-button"
        type="primary"
      >
        {t('next')}
      </Button>
      <DropdownWithHint />
    </div>
  );
}
