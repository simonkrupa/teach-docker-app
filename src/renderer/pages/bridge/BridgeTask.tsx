import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../Pages.css';
import mybridgeImage from 'assets/imgs/mybridge.jpg';
import { useTranslation } from 'react-i18next';
import DropdownWithHint from '../../components/Hint';

export default function BridgeTask() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleProceedNavigation = () => {
    navigate('/bridge/first-diagram');
  };
  return (
    <div className="all-pages">
      <h1>{t('bridge_task_title')}</h1>
      <p>{t('bridge_task_intro')}</p>
      <ol>
        <li>{t('bridge_task_step_1')}</li>
        <li>{t('bridge_task_step_2')}</li>
        <li>{t('bridge_task_step_3')}</li>
      </ol>
      <p>{t('bridge_task_validation')}</p>
      <img
        src={mybridgeImage}
        alt=""
        style={{
          width: '500px',
          height: '500px',
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
